// Command Deck aggregate endpoint (Web Pro / CLI TUI).
//
// GET /v1/agentx/deck returns everything the CLI Command Deck (3-panel
// AGENTS | TASK | LOGS view) needs in a single poll:
//   system — real host cpu/mem from node:os
//   agents — real agents from active/recent multi-agent runs
//   task   — most recent task with stage progress + real token usage
//   logs   — merged recent task + multi-agent lifecycle events
//   stats  — metric totals from the Prometheus-style registry
//
// No new state is introduced here: everything is derived from stores the
// engine already maintains (taskStore, event buses, runs, metrics).

import os from 'node:os';
import type { Express } from 'express';
import { llmMetrics } from '@agent-xai/observability';
import { listProviders } from './llm-provider-store.js';
import { taskStore } from './agentx-server.js';
import { getTaskEventHistory, type TaskStreamEvent } from './task-stream.js';
import { getMultiAgentEventHistory, type MultiAgentStreamEvent } from './multi-agent-stream.js';
import { getActiveRuns, getRecentRuns } from './multi-agent-runner.js';

export interface DeckAgent {
  id: string;
  name: string;
  role: string;
  status: 'run' | 'idle' | 'wait';
  model?: string;
  startedAt?: string;
}

export interface DeckLogEntry {
  at: string;
  level: 'info' | 'warn' | 'error';
  agent: string;
  type: string;
  message: string;
}

const SPECIALIST_ROLES = ['architect', 'coder', 'reviewer', 'tester'] as const;

function cpuPct(): number {
  const cpus = os.cpus();
  if (cpus.length === 0) return 0;
  const load = os.loadavg()[0] ?? 0;
  // loadavg is a 1/5/15-minute average; approximate current cpu% from the
  // 1-minute average relative to core count (rough but real).
  return Math.min(100, Math.max(0, Math.round((load / cpus.length) * 100)));
}

function memInfo(): { usedGb: number; totalGb: number; pct: number } {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    usedGb: Number((used / 1024 ** 3).toFixed(1)),
    totalGb: Number((total / 1024 ** 3).toFixed(1)),
    pct: Math.round((used / total) * 100),
  };
}

function taskLogEntries(): DeckLogEntry[] {
  const entries: DeckLogEntry[] = [];
  for (const taskId of taskStore.keys()) {
    for (const ev of getTaskEventHistory(taskId)) {
      entries.push(taskEventToLog(taskId, ev));
    }
  }
  return entries;
}

function taskEventToLog(taskId: string, ev: TaskStreamEvent): DeckLogEntry {
  const base = { at: ev.at, agent: 'task', type: ev.type };
  switch (ev.type) {
    case 'accepted':
      return { ...base, level: 'info', message: `task ${taskId} accepted` };
    case 'generating':
      return { ...base, level: 'info', message: `task ${taskId} generating…` };
    case 'complete':
      return {
        ...base,
        level: ev.status === 'success' ? 'info' : 'error',
        message:
          ev.status === 'success'
            ? `task ${taskId} complete · ${ev.provider ?? '?'}/${ev.model ?? '?'}`
            : `task ${taskId} failed · ${ev.error ?? 'unknown error'}`,
      };
  }
}

function multiAgentLogEntries(): DeckLogEntry[] {
  const entries: DeckLogEntry[] = [];
  for (const run of getRecentRuns(5)) {
    for (const ev of getMultiAgentEventHistory(run.runId)) {
      entries.push(multiAgentEventToLog(ev));
    }
  }
  return entries;
}

function multiAgentEventToLog(ev: MultiAgentStreamEvent): DeckLogEntry {
  const base = { at: ev.at, agent: 'orchestrator', type: ev.type };
  switch (ev.type) {
    case 'run-accepted':
      return {
        ...base,
        level: 'info',
        message: `run accepted · ${ev.goalIds.length} goals, concurrency ${ev.concurrency}`,
      };
    case 'goal-start':
      return { ...base, level: 'info', message: `goal ${ev.goalId} start (${ev.index + 1})` };
    case 'goal-complete':
      return {
        ...base,
        level: ev.approved ? 'info' : 'warn',
        message: `goal ${ev.goalId} ${ev.approved ? 'approved' : 'rejected'} · ${ev.iterations} iterations${ev.error ? ` · ${ev.error}` : ''}`,
      };
    case 'run-complete':
      return {
        ...base,
        level: 'info',
        message: `run complete · ${ev.approvedCount}/${ev.totalGoals} approved · ${Math.round(ev.wallTimeMs)}ms`,
      };
  }
}

function agentsFromRuns(): DeckAgent[] {
  const active = getActiveRuns();
  const recent = getRecentRuns(3);
  // Show active runs first (status from real run state), then the most recent
  // finished run as idle so the panel isn't empty between runs.
  const seen = new Set<string>();
  const agents: DeckAgent[] = [];
  for (const run of [...active, ...recent]) {
    if (seen.has(run.runId)) continue;
    seen.add(run.runId);
    const running = run.status === 'running';
    agents.push({
      id: `${run.runId}:orchestrator`,
      name: 'orchestrator',
      role: 'orchestrator',
      status: running ? 'run' : 'idle',
      startedAt: run.startedAt,
    });
    for (const role of SPECIALIST_ROLES) {
      agents.push({
        id: `${run.runId}:${role}`,
        name: `${role}-${run.runId.slice(-4)}`,
        role,
        status: running ? 'wait' : 'idle',
        startedAt: run.startedAt,
      });
    }
  }
  return agents.slice(0, 12);
}

export function registerDeckRoutes(app: Express): void {
  // Public provider list (no admin required) — active providers + model ids.
  // The CLI TUI / ModelPicker / RouterView need this; /v1/admin/llm-providers
  // stays admin-only (full config incl. baseUrl/masked keys).
  app.get('/v1/agentx/providers', async (_req, res) => {
    try {
      const rows = await listProviders();
      res.json({
        providers: rows.map((r) => ({
          id: r.name,
          name: r.name,
          isActive: r.enabled,
          healthy: r.enabled,
          models: (r.models ?? []).map((m) => m.id),
        })),
      });
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  app.get('/v1/agentx/deck', async (_req, res) => {
    try {
      // Most recent task (any status) — the TASK panel focus.
      const tasks = [...taskStore.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      const latest = tasks[0];

      // Metric totals (same aggregation as /v1/agentx/stats).
      const registry = llmMetrics.getRegistry();
      const json = await registry.getMetricsAsJSON();
      const totals: Record<string, number> = {};
      for (const metric of json) {
        totals[metric.name] = metric.values.reduce((acc, v) => acc + (Number(v.value) || 0), 0);
      }

      const mem = memInfo();
      const logs = [...taskLogEntries(), ...multiAgentLogEntries()]
        .sort((a, b) => (a.at < b.at ? 1 : -1))
        .slice(0, 30);

      res.json({
        generatedAt: new Date().toISOString(),
        system: {
          cpu: cpuPct(),
          memUsedGb: mem.usedGb,
          memTotalGb: mem.totalGb,
          memPct: mem.pct,
        },
        agents: agentsFromRuns(),
        task: latest
          ? {
              id: latest.id,
              description: latest.description,
              status: latest.status,
              progress: latest.progress ?? (latest.status === 'success' ? 100 : 0),
              elapsedMs: Date.now() - new Date(latest.createdAt).getTime(),
              tokensIn: latest.tokensIn ?? 0,
              tokensOut: latest.tokensOut ?? 0,
              files: latest.files ?? { modified: 0, created: 0 },
              provider: latest.provider,
              model: latest.model,
            }
          : null,
        logs,
        stats: {
          totalTasks: taskStore.size,
          totalCostUsd: Number((totals.llm_cost_usd_total ?? 0).toFixed(4)),
          totalTokens: totals.llm_tokens_total ?? 0,
        },
      });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });
}
