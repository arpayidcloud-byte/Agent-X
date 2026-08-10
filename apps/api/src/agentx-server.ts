import express from 'express';
import { llmMetrics, alertManager, healthChecker, Logger } from '@agent-xai/observability';
import { LLMRouter, OpenAIMock, DeepSeekMock, AnthropicMock } from '@agent-xai/llm-router';
import { executeRoute } from './combo-router.js';
import { createRequestLogger } from './request-logger.js';
import { computeAnalyticsSummary } from './analytics.js';
import { agentConfigStore, AGENT_MODEL_OPTIONS } from './agent-config.js';
import { notifySlack } from './slack.js';
import { getBetaBackend } from './beta-store.js';
import { getQualityBackend } from './quality-store.js';
import { getFeedbackBackend } from './feedback-store.js';
import {
  QualityScorer,
  type QualityDimension,
  type QualityGrade,
} from '@agent-xai/quality-scoring';
import { generateFeedback, buildRevisionPrompt } from '@agent-xai/agent-feedback';
import {
  maybeRequireAdmin,
  requireAuth,
  listUsers,
  register,
  deleteUser,
  updateUserRoles,
  type AuthenticatedRequest,
} from './auth.js';
import { createHttpServer } from './ws-bridge.js';
import { PromptTemplateRepository, getPrisma } from '@agent-xai/persistence';
import { mountSwagger } from './swagger.js';
import { registerAuditExportRoutes } from './audit-export.js';
import { registerWorkflowRoutes } from './workflow-routes.js';
import { registerEvalRoutes } from './eval-routes.js';
import { startParallelRun, getMultiAgentRun } from './multi-agent-runner.js';
import {
  subscribeMultiAgent,
  getMultiAgentEventHistory,
  type MultiAgentStreamEvent,
} from './multi-agent-stream.js';
import type { WaitlistEntry, FeedbackEntry } from './beta-store.js';
import { registerAuthRoutes } from './auth-routes.js';
import { registerOAuthRoutes } from './oauth-routes.js';
import { registerAdminLlmRoutes } from './admin-llm-routes.js';
import { registerCliRoutes } from './cli-routes.js';
import { registerProviderGroupRoutes } from './provider-group-routes.js';
import { registerDeckRoutes } from './deck.js';
import { syncProvidersFromDb } from './llm-providers.js';
import {
  publishEvent,
  subscribeTask,
  getTaskEventHistory,
  STAGE_DELAY_MS,
  delay,
  type TaskStreamEvent,
} from './task-stream.js';
import {
  publishChatEvent,
  subscribeChat,
  getChatEventHistory,
  chunkText,
  buildChatPrompt,
  parseChatMessages,
  CHAT_CHUNK_DELAY_MS,
  type ChatStreamEvent,
} from './chat-stream.js';
import { CostEntryRepository, AgentTemplateRepository } from '@agent-xai/persistence';
import { verifyTurnstile } from './turnstile.js';

const costRepo = new CostEntryRepository();
const templateRepo = new AgentTemplateRepository();

export { waitlistStore, feedbackStore, resetBetaStores } from './beta-store.js';
export { qualityStore, resetQualityStore } from './quality-store.js';
export { agentFeedbackStore, resetAgentFeedbackStore } from './feedback-store.js';

const logger = new Logger('agentx-api');

const app: express.Express = express();
app.use(express.json());
app.use(createRequestLogger());

// ─── Minimal CORS (demo environment: web UI on :30500 talks to API on :30400).
// Allow-all is fine for the public demo; restrict origins in production.
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

registerAuthRoutes(app);
registerOAuthRoutes(app);

// ─── Swagger / OpenAPI docs ────
mountSwagger(app);

// ─── Audit log export ────
registerAuditExportRoutes(app);

// ─── Workflow builder API ────
registerWorkflowRoutes(app);
registerEvalRoutes(app);

const PORT = process.env.PORT || 4000;

// ─── In-memory task store (dashboard API) ────
export interface TaskRecord {
  id: string;
  prompt: string;
  description: string;
  status: 'pending' | 'success' | 'error';
  provider?: string;
  model?: string;
  response?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
  /** Command Deck: stage-based progress 0-100 (accepted=10, generating=50, complete=100). */
  progress?: number;
  /** Command Deck: real token usage from the router response. */
  tokensIn?: number;
  tokensOut?: number;
  /** Command Deck: files touched by the run (0 until the engine reports changes). */
  files?: { modified: number; created: number };
}

export const taskStore = new Map<string, TaskRecord>();

function recordTask(task: TaskRecord): void {
  taskStore.set(task.id, task);
  // Cap the store to the latest 200 tasks (memory-friendly)
  if (taskStore.size > 200) {
    const oldest = [...taskStore.keys()].shift();
    if (oldest) taskStore.delete(oldest);
  }
}

// ─── Router instance (singleton) ────
export const router = new LLMRouter();

// ─── Admin LLM provider management + boot-time sync from DB ────
registerAdminLlmRoutes(app, router);
registerCliRoutes(app);
registerProviderGroupRoutes(app);
registerDeckRoutes(app);
void syncProvidersFromDb(router).then((n) => {
  if (n > 0) logger.info(`Registered ${n} admin-managed LLM provider(s) from DB`);
});

// ─── Dev/demo providers (no API keys required) ────
// Set ENABLE_MOCK_PROVIDER=true to register mock providers so the API is
// fully usable locally for development, testing and monitoring demos.
if (process.env.ENABLE_MOCK_PROVIDER === 'true') {
  router.registerProvider(OpenAIMock);
  router.registerProvider(DeepSeekMock);
  router.registerProvider(AnthropicMock);
  logger.info('Mock providers registered (ENABLE_MOCK_PROVIDER=true)', {
    providers: ['openai', 'deepseek', 'anthropic'],
  });
}

// ─── Metrics endpoint (Prometheus scrape) ────
app.get('/metrics', async (_req, res) => {
  try {
    const metricsData = await llmMetrics.getMetrics();
    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(metricsData);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Health endpoint (live provider status) ────
app.get('/health', async (_req, res) => {
  try {
    const health = healthChecker.getHealthReport();
    res.json(health);
  } catch (e) {
    res.status(500).json({ status: 'unhealthy', error: String(e) });
  }
});

// ─── LLM run endpoint (wired to router) ────
app.post('/v1/agentx/run', async (req, res): Promise<void> => {
  try {
    const { prompt, taskId, description, complexity, type, budget, provider } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing required field: prompt (string)' });
      return;
    }

    const request = {
      taskId: taskId ?? `api-${Date.now()}`,
      description: description ?? prompt.slice(0, 120),
      complexity: complexity ?? 'medium',
      type: type ?? 'reasoning',
      budget: budget ?? 'medium',
      provider: typeof provider === 'string' ? provider : undefined,
    };

    const startedAt = new Date().toISOString();
    recordTask({
      id: request.taskId,
      prompt,
      description: request.description,
      status: 'pending',
      createdAt: startedAt,
    });

    try {
      const response = await executeRoute(router, request, prompt);
      const completed = taskStore.get(request.taskId);
      if (completed) {
        completed.status = 'success';
        completed.completedAt = new Date().toISOString();
        completed.provider = response.provider;
        completed.model = response.model;
        completed.response = response.message;
      }

      // Record cost entry for persistent tracking
      try {
        await costRepo.create({
          taskId: request.taskId,
          userId: (req as AuthenticatedRequest).auth?.sub ?? undefined,
          provider: response.provider ?? 'unknown',
          model: response.model ?? 'unknown',
          inputTokens: response.usage?.inputTokens ?? 0,
          outputTokens: response.usage?.outputTokens ?? 0,
          totalTokens: response.usage?.totalTokens ?? 0,
          costUsd: response.cost ?? 0,
          latencyMs: response.latencyMs ?? 0,
          cached: response.cached ?? false,
          source: 'api',
        });
      } catch {
        /* cost recording is best-effort */
      }

      res.json(response);
    } catch (runErr) {
      const err = runErr instanceof Error ? runErr.message : String(runErr);
      const failed = taskStore.get(request.taskId);
      if (failed) {
        failed.status = 'error';
        failed.completedAt = new Date().toISOString();
        failed.error = err;
      }
      res.status(500).json({ error: err });
    }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Async stream run (Web Pro: SSE real-time task execution) ────
// POST returns 202 + taskId immediately; the task runs in the background and
// emits lifecycle events consumed via GET /v1/agentx/tasks/:id/events.
app.post('/v1/agentx/run/stream', async (req, res): Promise<void> => {
  try {
    const { prompt, taskId, description, complexity, type, budget, provider } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing required field: prompt (string)' });
      return;
    }

    const request = {
      taskId: taskId ?? `stream-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      description: description ?? prompt.slice(0, 120),
      complexity: complexity ?? 'medium',
      type: type ?? 'reasoning',
      budget: budget ?? 'medium',
      provider: typeof provider === 'string' ? provider : undefined,
    };

    const startedAt = new Date().toISOString();
    recordTask({
      id: request.taskId,
      prompt,
      description: request.description,
      status: 'pending',
      createdAt: startedAt,
      progress: 10,
    });

    publishEvent({ type: 'accepted', taskId: request.taskId, at: startedAt });
    res.status(202).json({ taskId: request.taskId, status: 'accepted' });

    // Background worker: stage transitions -> execute -> complete/error.
    void (async () => {
      try {
        await delay(STAGE_DELAY_MS);
        const genAt = new Date().toISOString();
        publishEvent({
          type: 'generating',
          taskId: request.taskId,
          at: genAt,
        });
        const store = taskStore.get(request.taskId);
        if (store) store.progress = 50;
        const response = await executeRoute(router, request, prompt);
        const task = taskStore.get(request.taskId);
        if (task) {
          task.status = 'success';
          task.completedAt = new Date().toISOString();
          task.provider = response.provider;
          task.model = response.model;
          task.response = response.message;
          task.progress = 100;
          task.tokensIn = response.usage?.inputTokens ?? 0;
          task.tokensOut = response.usage?.outputTokens ?? 0;
          task.files = { modified: 0, created: 0 };
        }
        // Auto-score successful task outputs (quality scoring — Phase 2).
        void (async () => {
          try {
            const scored = await new QualityScorer().score({
              prompt,
              response: response.message,
              provider: response.provider,
              model: response.model,
              taskId: request.taskId,
            });
            const backend = await getQualityBackend();
            await backend.create({
              id: scored.id,
              prompt: scored.prompt,
              response: scored.response,
              provider: scored.provider,
              model: scored.model,
              taskId: scored.taskId,
              dimensions: { dimensions: scored.dimensions, overall: scored.overall },
              overall: scored.overall,
              grade: scored.grade,
              evaluator: scored.evaluator,
              createdAt: scored.createdAt,
            });
            logger.info('Quality score recorded', {
              taskId: request.taskId,
              overall: scored.overall,
            });
            // Agent feedback loop: low-scoring outputs get actionable feedback
            // (weak dimensions + revision prompt) so the next run can improve.
            // Gate threshold configurable via QUALITY_GATE_THRESHOLD (#117).
            const gateThreshold = Number(process.env.QUALITY_GATE_THRESHOLD ?? 70);
            if (scored.overall < gateThreshold) {
              const feedback = generateFeedback(scored);
              const fbBackend = await getFeedbackBackend();
              await fbBackend.create({
                id: feedback.id,
                scoreId: feedback.scoreId,
                taskId: feedback.taskId,
                prompt: feedback.prompt,
                response: feedback.response,
                overall: feedback.overall,
                grade: feedback.grade,
                weakDimensions: feedback.weakDimensions,
                priorityAdvice: feedback.priorityAdvice,
                improvementPrompt: feedback.improvementPrompt,
                createdAt: feedback.createdAt,
              });
              logger.info('Agent feedback generated', {
                taskId: request.taskId,
                feedbackId: feedback.id,
                overall: feedback.overall,
              });
            }
          } catch (scoreErr) {
            logger.warn('Quality auto-score failed', {
              taskId: request.taskId,
              error: scoreErr instanceof Error ? scoreErr.message : String(scoreErr),
            });
          }
        })();
        publishEvent({
          type: 'complete',
          taskId: request.taskId,
          status: 'success',
          provider: response.provider,
          model: response.model,
          response: response.message,
          at: new Date().toISOString(),
        });

        // Record cost entry for persistent tracking
        try {
          await costRepo.create({
            taskId: request.taskId,
            userId: (req as AuthenticatedRequest).auth?.sub ?? undefined,
            provider: response.provider ?? 'unknown',
            model: response.model ?? 'unknown',
            inputTokens: response.usage?.inputTokens ?? 0,
            outputTokens: response.usage?.outputTokens ?? 0,
            totalTokens: response.usage?.totalTokens ?? 0,
            costUsd: response.cost ?? 0,
            latencyMs: response.latencyMs ?? 0,
            cached: response.cached ?? false,
            source: 'api',
          });
        } catch {
          /* cost recording is best-effort */
        }
      } catch (runErr) {
        const err = runErr instanceof Error ? runErr.message : String(runErr);
        const task = taskStore.get(request.taskId);
        if (task) {
          task.status = 'error';
          task.completedAt = new Date().toISOString();
          task.error = err;
        }
        publishEvent({
          type: 'complete',
          taskId: request.taskId,
          status: 'error',
          error: err,
          at: new Date().toISOString(),
        });
      }
    })();
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── SSE event stream for a task (Web Pro) ────
// Replays buffered history first, then streams live events until the client
// disconnects. Heartbeat comments keep proxies from killing idle connections.
app.get('/v1/agentx/tasks/:id/events', (req, res) => {
  const { id } = req.params;
  const taskId = typeof id === 'string' ? id : '';

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');

  for (const ev of getTaskEventHistory(taskId)) {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  }

  const onEvent = (ev: TaskStreamEvent): void => {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  };
  const unsubscribe = subscribeTask(taskId, onEvent);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// ─── Chat (Web Pro): single-turn with transcript context ────
// Builds a bounded transcript prompt from the conversation, then routes it
// through the LLM router like any other task.
app.post('/v1/agentx/chat', async (req, res): Promise<void> => {
  try {
    const { messages, taskId, complexity, type, budget, provider } = req.body ?? {};
    const parsed = parseChatMessages(messages);
    if (!parsed) {
      res.status(400).json({
        error:
          'Missing or invalid field: messages (non-empty array of {role: user|assistant, content: string})',
      });
      return;
    }
    const last = parsed[parsed.length - 1]!;
    const request = {
      taskId: taskId ?? `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      description: last.content.slice(0, 120),
      complexity: complexity ?? 'medium',
      type: type ?? 'reasoning',
      budget: budget ?? 'medium',
      provider: typeof provider === 'string' ? provider : undefined,
    };
    const response = await executeRoute(router, request, buildChatPrompt(parsed));

    // Record cost entry for persistent tracking
    try {
      await costRepo.create({
        taskId: request.taskId,
        userId: (req as AuthenticatedRequest).auth?.sub ?? undefined,
        provider: response.provider ?? 'unknown',
        model: response.model ?? 'unknown',
        inputTokens: response.usage?.inputTokens ?? 0,
        outputTokens: response.usage?.outputTokens ?? 0,
        totalTokens: response.usage?.totalTokens ?? 0,
        costUsd: response.cost ?? 0,
        latencyMs: response.latencyMs ?? 0,
        cached: response.cached ?? false,
        source: 'web',
      });
    } catch {
      /* cost recording is best-effort */
    }

    res.json({ ...response, taskId: request.taskId });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Chat streaming (Web Pro): SSE token stream ────
// POST returns 202 + chatId; events (start -> chunk* -> complete/error) are
// consumed via GET /v1/agentx/chat/:id/events.
app.post('/v1/agentx/chat/stream', async (req, res): Promise<void> => {
  try {
    const { messages, taskId, complexity, type, budget, provider } = req.body ?? {};
    const parsed = parseChatMessages(messages);
    if (!parsed) {
      res.status(400).json({
        error:
          'Missing or invalid field: messages (non-empty array of {role: user|assistant, content: string})',
      });
      return;
    }
    const last = parsed[parsed.length - 1]!;
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const request = {
      taskId: taskId ?? chatId,
      description: last.content.slice(0, 120),
      complexity: complexity ?? 'medium',
      type: type ?? 'reasoning',
      budget: budget ?? 'medium',
      provider: typeof provider === 'string' ? provider : undefined,
    };

    res.status(202).json({ chatId, status: 'accepted' });

    void (async () => {
      try {
        const response = await executeRoute(router, request, buildChatPrompt(parsed));
        const startedAt = new Date().toISOString();
        publishChatEvent({
          type: 'start',
          chatId,
          provider: response.provider,
          model: response.model,
          at: startedAt,
        });
        for (const chunk of chunkText(response.message)) {
          await delay(CHAT_CHUNK_DELAY_MS);
          publishChatEvent({
            type: 'chunk',
            chatId,
            text: chunk,
            at: new Date().toISOString(),
          });
        }
        publishChatEvent({
          type: 'complete',
          chatId,
          usage: response.usage,
          cost: response.cost,
          latencyMs: response.latencyMs,
          at: new Date().toISOString(),
        });
      } catch (runErr) {
        const err = runErr instanceof Error ? runErr.message : String(runErr);
        publishChatEvent({
          type: 'error',
          chatId,
          error: err,
          at: new Date().toISOString(),
        });
      }
    })();
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Chat SSE event stream (Web Pro) ────
app.get('/v1/agentx/chat/:id/events', (req, res) => {
  const { id } = req.params;
  const chatId = typeof id === 'string' ? id : '';

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');

  for (const ev of getChatEventHistory(chatId)) {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  }

  const onEvent = (ev: ChatStreamEvent): void => {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  };
  const unsubscribe = subscribeChat(chatId, onEvent);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// ─── Team management (Web Pro, basic) ────
// List registered users; admin-only when AUTH_ENABLED (password hashes never
// leave the server).
app.get('/v1/team', maybeRequireAdmin, async (_req, res) => {
  try {
    const users = await listUsers();
    res.json({ users });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Admin user management ────
// Create a new user account (admin invite)
app.post('/v1/admin/users', maybeRequireAdmin, async (req, res) => {
  try {
    const { email, password, roles } = req.body ?? {};
    const result = await register(email, password);
    if (roles && Array.isArray(roles)) {
      await updateUserRoles(result.user.id, roles);
    }
    res.json({ user: result.user });
  } catch (e) {
    const status = (e as { status?: number }).status ?? 400;
    res.status(status).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// Delete a user account
app.delete('/v1/admin/users/:id', maybeRequireAdmin, async (req, res) => {
  try {
    const userId = req.params.id as string;
    const deleted = await deleteUser(userId);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// Update user roles
app.patch('/v1/admin/users/:id', maybeRequireAdmin, async (req, res) => {
  try {
    const { roles } = req.body ?? {};
    if (!roles || !Array.isArray(roles)) {
      res.status(400).json({ error: 'roles must be an array' });
      return;
    }
    const userId = req.params.id as string;
    const user = await updateUserRoles(userId, roles);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// ─── Prompt Template Library ────
app.get('/v1/prompt-templates', maybeRequireAdmin, async (_req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      res.status(503).json({ error: 'Database not ready' });
      return;
    }
    const repo = new PromptTemplateRepository(prisma);
    const templates = await repo.findAll();
    res.json({ templates });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.post('/v1/prompt-templates', maybeRequireAdmin, async (req, res) => {
  try {
    const { name, description, content, tags } = req.body ?? {};
    if (!name || !content) {
      res.status(400).json({ error: 'name and content are required' });
      return;
    }
    const prisma = getPrisma();
    if (!prisma) {
      res.status(503).json({ error: 'Database not ready' });
      return;
    }
    const repo = new PromptTemplateRepository(prisma);
    const template = await repo.create({ name, description, content, tags: tags ?? [] });
    res.status(201).json({ template });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.put('/v1/prompt-templates/:id', maybeRequireAdmin, async (req, res) => {
  try {
    const { name, description, content, tags } = req.body ?? {};
    const prisma = getPrisma();
    if (!prisma) {
      res.status(503).json({ error: 'Database not ready' });
      return;
    }
    const repo = new PromptTemplateRepository(prisma);
    const template = await repo.update(req.params.id as string, {
      name,
      description,
      content,
      tags,
    });
    res.json({ template });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.delete('/v1/prompt-templates/:id', maybeRequireAdmin, async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      res.status(503).json({ error: 'Database not ready' });
      return;
    }
    const repo = new PromptTemplateRepository(prisma);
    const deleted = await repo.delete(req.params.id as string);
    if (!deleted) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// ─── Parallel multi-agent runs (Web Pro) ────
// POST accepts multiple goals (one per element) and runs them through the
// specialist team concurrently (bounded pool). Returns 202 + runId; progress
// streams over GET /v1/agentx/multi-agent/:runId/events (SSE/WS).
app.post('/v1/agentx/multi-agent/run', async (req, res): Promise<void> => {
  try {
    const { goals, concurrency } = req.body ?? {};
    if (!Array.isArray(goals) || goals.length === 0 || goals.length > 10) {
      res.status(400).json({
        error: 'Missing or invalid field: goals (non-empty array of 1-10 strings)',
      });
      return;
    }
    for (const g of goals) {
      if (typeof g !== 'string' || g.trim().length === 0) {
        res.status(400).json({ error: 'Invalid field: goals must be non-empty strings' });
        return;
      }
    }
    const parsedConcurrency = Number.isFinite(concurrency)
      ? Math.min(4, Math.max(1, Math.round(concurrency)))
      : 2;
    const run = startParallelRun({
      goals: goals.map((g: string) => g.trim()),
      concurrency: parsedConcurrency,
    });
    res.status(202).json({ runId: run.runId, status: run.status, concurrency: run.concurrency });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// SSE stream for a parallel run: replay history, then live events.
app.get('/v1/agentx/multi-agent/:runId/events', (req, res) => {
  const { runId } = req.params;
  const id = typeof runId === 'string' ? runId : '';

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write('retry: 3000\n\n');

  for (const ev of getMultiAgentEventHistory(id)) {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  }

  const onEvent = (ev: MultiAgentStreamEvent): void => {
    res.write(`data: ${JSON.stringify(ev)}\n\n`);
  };
  const unsubscribe = subscribeMultiAgent(id, onEvent);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 15_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// Run status + result (JSON, for polling clients).
app.get('/v1/agentx/multi-agent/:runId', (req, res) => {
  const { runId } = req.params;
  const id = typeof runId === 'string' ? runId : '';
  const run = getMultiAgentRun(id);
  if (!run) {
    res.status(404).json({ error: `Run not found: ${id}` });
    return;
  }
  res.json({ run });
});

// ─── Quality scoring (Web Pro) ────
// Scores a prompt+response pair with the deterministic heuristic engine and
// persists the result. GET lists recent scores; GET stats aggregates them.
// Task completions are also auto-scored server-side (see /v1/agentx/run).
app.post('/v1/quality/score', async (req, res): Promise<void> => {
  try {
    const { prompt, response, provider, model, taskId } = req.body ?? {};
    if (typeof prompt !== 'string' || typeof response !== 'string') {
      res.status(400).json({ error: 'Missing or invalid field: prompt, response (strings)' });
      return;
    }
    const scorer = new QualityScorer();
    const scored = await scorer.score({
      prompt,
      response,
      provider: typeof provider === 'string' ? provider : undefined,
      model: typeof model === 'string' ? model : undefined,
      taskId: typeof taskId === 'string' ? taskId : undefined,
    });
    const backend = await getQualityBackend();
    const result = await backend.create({
      id: scored.id,
      prompt: scored.prompt,
      response: scored.response,
      provider: scored.provider,
      model: scored.model,
      taskId: scored.taskId,
      dimensions: {
        dimensions: scored.dimensions,
        overall: scored.overall,
      },
      overall: scored.overall,
      grade: scored.grade,
      evaluator: scored.evaluator,
      createdAt: scored.createdAt,
    });
    res.status(201).json({ score: result });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

app.get('/v1/quality/scores', async (_req, res): Promise<void> => {
  try {
    const backend = await getQualityBackend();
    const limitRaw = Number(_req.query.limit ?? 50);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 200) : 50;
    const scores = await backend.findAll(limit);
    res.json({ scores, total: scores.length });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

app.get('/v1/quality/stats', async (_req, res): Promise<void> => {
  try {
    const backend = await getQualityBackend();
    const stats = await backend.stats();
    res.json({ stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Agent feedback loop (Web Pro) ────
// Generates actionable feedback from a quality score (weak dimensions +
// revision prompt), lists feedback history, and builds revision prompts for
// follow-up runs. Low-scoring task outputs are auto-feedbacked server-side.
app.post('/v1/feedback/generate', async (req, res): Promise<void> => {
  try {
    const { scoreId } = req.body ?? {};
    if (typeof scoreId !== 'string' || scoreId.length === 0) {
      res.status(400).json({ error: 'Missing or invalid field: scoreId (string)' });
      return;
    }
    const qBackend = await getQualityBackend();
    const scores = await qBackend.findAll(200);
    const score = scores.find((s) => s.id === scoreId);
    if (!score) {
      res.status(404).json({ error: `Score not found: ${scoreId}` });
      return;
    }
    const fbBackend = await getFeedbackBackend();
    const existing = await fbBackend.findByScoreId(scoreId);
    if (existing) {
      res.json({ feedback: existing, reused: true });
      return;
    }
    const feedback = generateFeedback({
      id: score.id,
      taskId: score.taskId,
      prompt: score.prompt,
      response: score.response,
      provider: score.provider,
      model: score.model,
      dimensions: (score.dimensions as { dimensions: QualityDimension[] }).dimensions,
      overall: score.overall,
      grade: score.grade as QualityGrade,
      evaluator: score.evaluator as 'heuristic' | 'llm',
      createdAt: score.createdAt,
    });
    const created = await fbBackend.create({
      id: feedback.id,
      scoreId: feedback.scoreId,
      taskId: feedback.taskId,
      prompt: feedback.prompt,
      response: feedback.response,
      overall: feedback.overall,
      grade: feedback.grade,
      weakDimensions: feedback.weakDimensions,
      priorityAdvice: feedback.priorityAdvice,
      improvementPrompt: feedback.improvementPrompt,
      createdAt: feedback.createdAt,
    });
    res.status(201).json({ feedback: created });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

app.get('/v1/feedback', async (req, res): Promise<void> => {
  try {
    const backend = await getFeedbackBackend();
    const limitRaw = Number(req.query.limit ?? 20);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 200) : 20;
    const feedback = await backend.findAll(limit);
    res.json({ feedback, total: feedback.length });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

app.get('/v1/feedback/stats', async (_req, res): Promise<void> => {
  try {
    const backend = await getFeedbackBackend();
    const stats = await backend.stats();
    res.json({ stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

app.post('/v1/feedback/:id/revision', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { prompt } = req.body ?? {};
    if (typeof prompt !== 'string' || prompt.length === 0) {
      res.status(400).json({ error: 'Missing or invalid field: prompt (string)' });
      return;
    }
    const backend = await getFeedbackBackend();
    const all = await backend.findAll(200);
    const feedback = all.find((f) => f.id === id);
    if (!feedback) {
      res.status(404).json({ error: `Feedback not found: ${id}` });
      return;
    }
    const revisionPrompt = buildRevisionPrompt(prompt, {
      priorityAdvice: feedback.priorityAdvice,
      weakDimensions: feedback.weakDimensions,
    });
    res.json({ revisionPrompt });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: err });
  }
});

// ─── Cost tracking: summary ────
// Persistent cost data from CostEntry table (historical).
// Wrapped in { overview, byProvider, byModel } to match admin panel format.
app.get('/v1/cost/summary', maybeRequireAdmin, async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const s = await costRepo.getSummary(days);
    const totalCostUsd = s.totalCostUsd;
    const totalTokens = s.totalTokens;
    const totalRequests = s.totalRequests;
    const inputTokens = s.inputTokens;
    const outputTokens = s.outputTokens;
    const avgLatencyMs = s.avgLatencyMs;
    res.json({
      overview: {
        totalCostUsd,
        totalTokens,
        totalRequests,
        activeProviders: s.byProvider.length,
        avgLatencyMs,
        inputTokens,
        outputTokens,
        successRate: 100,
        cacheHitRate: 0,
        totalFallbacks: 0,
      },
      byProvider: s.byProvider,
      byModel: s.byModel,
      byDay: s.byDay,
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Cost tracking: entries list ────
app.get('/v1/cost/entries', maybeRequireAdmin, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const entries = await costRepo.list(limit, offset);
    res.json({ entries, total: entries.length });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Analytics summary (Web Pro) ────
// Aggregates the LLM metrics registry into a dashboard-friendly summary.
app.get('/v1/analytics/summary', requireAuth, async (_req, res) => {
  try {
    const snapshot = await llmMetrics.getSnapshot();
    res.json(computeAnalyticsSummary(snapshot));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Agent configuration (Web Pro) ────
// GET is public (read-only view); PATCH requires admin (config is a
// management action).
app.get('/v1/agents', (_req, res) => {
  res.json({ agents: agentConfigStore.list(), modelOptions: AGENT_MODEL_OPTIONS });
});

app.patch('/v1/agents/:id', maybeRequireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const agentId = typeof id === 'string' ? id : '';
    const { enabled, model, complexity } = req.body ?? {};
    const updated = agentConfigStore.update(agentId, { enabled, model, complexity });
    if (!updated) {
      res.status(404).json({ error: `Agent not found: ${agentId}` });
      return;
    }
    logger.info('Agent config updated', { id, enabled: updated.enabled, model: updated.model });
    res.json({ agent: updated });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    res.status(400).json({ error: err });
  }
});

// ─── Task list endpoint (dashboard) ────
app.get('/v1/agentx/tasks', async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 50);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 200) : 50;
    const tasks = [...taskStore.values()]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, limit);
    res.json({ tasks, total: taskStore.size });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Compact stats endpoint (dashboard) ────
app.get('/v1/agentx/stats', async (_req, res) => {
  try {
    const registry = llmMetrics.getRegistry();
    const json = await registry.getMetricsAsJSON();
    const stats: Record<string, number> = {};
    for (const metric of json) {
      const total = metric.values.reduce((acc, v) => acc + (Number(v.value) || 0), 0);
      stats[metric.name] = total;
    }
    res.json({ stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist & feedback (Phase 3 Week 19-20: beta recruitment) ────
// Storage backend: Prisma/PostgreSQL when DATABASE_URL is reachable,
// otherwise in-memory Maps (see beta-store.ts). Tests stay DB-less.

// ─── Beta waitlist: signup ────
app.post('/v1/beta/waitlist', async (req, res): Promise<void> => {
  try {
    const { email, name, source } = req.body ?? {};
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Missing or invalid field: email (valid string required)' });
      return;
    }
    const normalized = email.trim().toLowerCase();
    const backend = await getBetaBackend();
    const existing = await backend.waitlistFindByEmail(normalized);
    if (existing) {
      res.status(409).json({ error: 'Email already on waitlist', entry: existing });
      return;
    }
    const entry: WaitlistEntry = {
      id: `wl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: normalized,
      name: typeof name === 'string' ? name.slice(0, 120) : undefined,
      source: typeof source === 'string' ? source.slice(0, 60) : undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await backend.waitlistCreate(entry);
    const { total } = await backend.waitlistStats();
    logger.info('Beta waitlist signup', { id: entry.id, email: normalized });
    void notifySlack(`:tada: New beta waitlist signup: ${normalized}`, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New waitlist signup*\nEmail: ${normalized}\nSource: ${entry.source ?? 'direct'}`,
        },
      },
    ]);
    res.status(201).json({ entry, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: admin list ────
app.get('/v1/beta/waitlist', maybeRequireAdmin, async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 100);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 1000) : 100;
    const backend = await getBetaBackend();
    const [entries, { total }] = await Promise.all([
      backend.waitlistFindAll(limit),
      backend.waitlistStats(),
    ]);
    res.json({ entries, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: admin invite (update status) ────
app.patch('/v1/beta/waitlist/:id/status', maybeRequireAdmin, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = typeof id === 'string' ? id : '';
    const { status } = req.body ?? {};
    const validStatuses = ['invited', 'active'];
    if (!validStatuses.includes(status)) {
      res
        .status(400)
        .json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }
    const backend = await getBetaBackend();
    const entry = await backend.waitlistUpdateStatus(idStr, status);
    if (!entry) {
      res.status(404).json({ error: 'Waitlist entry not found' });
      return;
    }
    logger.info('Beta waitlist status updated', { id, email: entry.email, status });
    void notifySlack(`:envelope: Waitlist update: ${entry.email} -> *${status}*`, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Waitlist update*\nEmail: ${entry.email}\nStatus: ${status}`,
        },
      },
    ]);
    res.json({ entry });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta waitlist: stats (dashboard) ────
app.get('/v1/beta/waitlist/stats', async (_req, res) => {
  try {
    const backend = await getBetaBackend();
    const stats = await backend.waitlistStats();
    res.json({ ...stats, generatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta feedback: submit ────
app.post('/v1/beta/feedback', async (req, res): Promise<void> => {
  try {
    const { email, category, message, rating } = req.body ?? {};
    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      res.status(400).json({ error: 'Missing or invalid field: message (min 3 chars)' });
      return;
    }
    const validCategories = ['bug', 'feature', 'performance', 'ux', 'other'];
    const cat = typeof category === 'string' ? category.toLowerCase() : 'other';
    if (!validCategories.includes(cat)) {
      res
        .status(400)
        .json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
      return;
    }
    const ratingNum = rating === undefined ? undefined : Number(rating);
    if (
      ratingNum !== undefined &&
      (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5)
    ) {
      res.status(400).json({ error: 'Invalid rating. Must be integer 1-5' });
      return;
    }
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: typeof email === 'string' ? email.trim().toLowerCase().slice(0, 200) : undefined,
      category: cat,
      message: message.trim().slice(0, 2000),
      rating: ratingNum === undefined ? undefined : Math.round(ratingNum),
      createdAt: new Date().toISOString(),
    };
    const backend = await getBetaBackend();
    await backend.feedbackCreate(entry);
    const total = await backend.feedbackCount();
    logger.info('Beta feedback submitted', { id: entry.id, category: cat });
    void notifySlack(
      `:speech_balloon: New beta feedback [${cat}]: ${entry.message.slice(0, 120)}`,
      [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New beta feedback*\nCategory: ${cat}\nRating: ${entry.rating ?? '-'}/5\n\n${entry.message.slice(0, 500)}`,
          },
        },
      ],
    );
    res.status(201).json({ entry, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Beta feedback: list ────
app.get('/v1/beta/feedback', maybeRequireAdmin, async (_req, res) => {
  try {
    const limitRaw = Number(_req.query.limit ?? 100);
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 1000) : 100;
    const backend = await getBetaBackend();
    const [entries, total] = await Promise.all([
      backend.feedbackFindAll(limit),
      backend.feedbackCount(),
    ]);
    res.json({ entries, total });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ─── Blocker 2: Dynamic health monitor (setInterval) ────
const HEALTH_MONITOR_INTERVAL_MS = Number(process.env.HEALTH_MONITOR_INTERVAL_MS ?? 30_000);

setInterval(() => {
  void (async () => {
    try {
      const health = healthChecker.getHealthReport();
      const unhealthy = health.providers.filter((p) => p.status === 'unhealthy');
      const degraded = health.providers.filter((p) => p.status === 'degraded');

      if (unhealthy.length > 0) {
        await alertManager.sendAlert(
          'critical',
          `[HealthMonitor] ${unhealthy.length} provider(s) UNHEALTHY: ${unhealthy.map((p) => p.name).join(', ')}`,
          { health },
        );
      } else if (degraded.length > 0) {
        await alertManager.sendAlert(
          'warning',
          `[HealthMonitor] ${degraded.length} provider(s) DEGRADED: ${degraded.map((p) => p.name).join(', ')}`,
          { health },
        );
      }
    } catch (e) {
      logger.error('[HealthMonitor] error:', e instanceof Error ? e : new Error(String(e)));
    }
  })();
}, HEALTH_MONITOR_INTERVAL_MS);

// ─── Blocker 3: Threshold rules + periodic check ────
alertManager.addThreshold({
  metric: 'llm_request_latency_seconds',
  max: 5,
  min: 0,
  level: 'critical',
});
alertManager.addThreshold({ metric: 'llm_errors_total', max: 10, min: 0, level: 'warning' });
alertManager.addThreshold({ metric: 'llm_fallbacks_total', max: 5, min: 0, level: 'warning' });

const THRESHOLD_CHECK_INTERVAL_MS = Number(process.env.THRESHOLD_CHECK_INTERVAL_MS ?? 30_000);

setInterval(() => {
  void (async () => {
    try {
      const metricsText = await llmMetrics.getMetrics();
      const parsed: Record<string, number> = {};

      // Parse Prometheus text format: "name value"
      for (const line of metricsText.split('\n')) {
        if (!line || line.startsWith('#')) continue;
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const metricName = parts[0]?.split('{')[0];
          const value = Number(parts[parts.length - 1]);
          if (metricName && !Number.isNaN(value)) {
            // Sum multi-label series into single number
            parsed[metricName] = (parsed[metricName] ?? 0) + value;
          }
        }
      }

      await alertManager.checkThresholds(parsed);
    } catch (e) {
      logger.error('[ThresholdMonitor] error:', e instanceof Error ? e : new Error(String(e)));
    }
  })();
}, THRESHOLD_CHECK_INTERVAL_MS);

// ─── Start server ────
export { app };

if (process.env.NODE_ENV !== 'test') {
  // HTTP + WebSocket fallback on the same port (SSE primary, WS fallback).
  const server = createHttpServer(app);
  // ─── Agent Marketplace ────

  // Browse published templates
  app.get('/v1/marketplace/templates', async (req, res) => {
    try {
      const { category, search, sort, limit, offset } = req.query;
      const templates = await templateRepo.listPublished({
        category: typeof category === 'string' ? category : undefined,
        search: typeof search === 'string' ? search : undefined,
        sortBy: (typeof sort === 'string' ? sort : 'popular') as
          'popular' | 'rating' | 'newest' | 'price',
        limit: Number(limit) || 50,
        offset: Number(offset) || 0,
      });
      res.json({ templates, total: templates.length });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Get featured templates
  app.get('/v1/marketplace/featured', async (_req, res) => {
    try {
      const templates = await templateRepo.getFeatured();
      res.json({ templates });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Get categories
  app.get('/v1/marketplace/categories', async (_req, res) => {
    try {
      const categories = await templateRepo.getCategories();
      res.json({ categories });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Get single template
  app.get('/v1/marketplace/templates/:id', async (req, res) => {
    try {
      const template = await templateRepo.getById(req.params.id);
      if (!template) {
        res.status(404).json({ error: 'Template not found' });
        return;
      }
      res.json(template);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Install template (increment count)
  app.post('/v1/marketplace/templates/:id/install', async (req, res) => {
    try {
      const { turnstileToken } = req.body ?? {};
      if (!(await verifyTurnstile(turnstileToken))) {
        res.status(403).json({ error: 'Human verification failed' });
        return;
      }
      await templateRepo.incrementInstall(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Rate template
  app.post('/v1/marketplace/templates/:id/rate', async (req, res) => {
    try {
      const { rating, turnstileToken } = req.body ?? {};
      if (!(await verifyTurnstile(turnstileToken))) {
        res.status(403).json({ error: 'Human verification failed' });
        return;
      }
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be 1-5' });
        return;
      }
      await templateRepo.rate(req.params.id, rating);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // ─── Admin: Create/Edit/Delete templates ────
  app.post('/v1/admin/templates', maybeRequireAdmin, async (req, res) => {
    try {
      const {
        name,
        description,
        authorId,
        authorName,
        systemPrompt,
        tags,
        category,
        priceUsd,
        isPublished,
      } = req.body ?? {};
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Missing name' });
        return;
      }
      if (!authorId || typeof authorId !== 'string') {
        res.status(400).json({ error: 'Missing authorId' });
        return;
      }
      const template = await templateRepo.create({
        name,
        description,
        authorId,
        authorName: authorName ?? 'Admin',
        systemPrompt,
        tags,
        category,
        priceUsd,
        isPublished,
      });
      res.status(201).json(template);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.put('/v1/admin/templates/:id', maybeRequireAdmin, async (req, res) => {
    try {
      const id = String(req.params.id);
      const updated = await templateRepo.update(id, req.body ?? {});
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.delete('/v1/admin/templates/:id', maybeRequireAdmin, async (req, res) => {
    try {
      await templateRepo.delete(String(req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  server.listen(PORT, () => {
    logger.info(`Agent-X server running at http://localhost:${PORT}`, { port: PORT });
    logger.info('Endpoints:', {
      endpoints: ['/metrics', '/health', '/v1/agentx/run', '/v1/agentx/tasks', '/v1/agentx/stats'],
    });
    logger.info(`Health monitor: every ${HEALTH_MONITOR_INTERVAL_MS}ms`, {
      intervalMs: HEALTH_MONITOR_INTERVAL_MS,
    });
    logger.info(`Threshold check: every ${THRESHOLD_CHECK_INTERVAL_MS}ms`, {
      intervalMs: THRESHOLD_CHECK_INTERVAL_MS,
    });
  });
}
