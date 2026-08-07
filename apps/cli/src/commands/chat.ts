/**
 * agentx chat — Interactive streaming chat with AgentX cloud.
 *
 * Usage:
 *   agentx chat                      → interactive mode
 *   agentx chat "prompt"             → one-shot
 *   agentx chat --provider deepseek  → force provider
 *   agentx chat --model deepseek-v3  → force model
 *
 * Streaming logic lives in lib/chat-engine.ts (shared with the TUI).
 */
import * as readline from 'node:readline';
import { isCloudAuthed, cloudFetch } from '../lib/cloud-api.js';
import {
  streamChat,
  saveChatSession,
  type ChatMessage,
  type ChatMeta,
} from '../lib/chat-engine.js';

// ─── Streaming render ────
async function runStream(
  messages: ChatMessage[],
  options: { provider?: string; model?: string },
): Promise<ChatMeta> {
  return streamChat(messages, options, {
    onStart: (provider, model) => {
      process.stderr.write(`\x1b[2m[${provider}/${model}]\x1b[0m `);
    },
    onChunk: (text) => {
      process.stdout.write(text);
    },
    onComplete: (meta) => {
      const tokens = meta.usage ? ` ${meta.usage.totalTokens} tokens` : '';
      const cost = meta.cost != null ? ` $${meta.cost.toFixed(4)}` : '';
      const ms = meta.latencyMs != null ? ` ${meta.latencyMs}ms` : '';
      process.stderr.write(`\n\x1b[2m${tokens}${cost}${ms}\x1b[0m\n`);
    },
  });
}

// ─── Commands ────
export async function chat(args: string[]): Promise<void> {
  if (!isCloudAuthed()) {
    throw new Error('Not authenticated. Run: agentx login --email <email> --password <password>');
  }

  // Parse flags
  let provider: string | undefined;
  let model: string | undefined;
  const promptParts: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--provider' && args[i + 1]) {
      provider = args[++i];
    } else if (arg === '--model' && args[i + 1]) {
      model = args[++i];
    } else if (!arg.startsWith('--')) {
      promptParts.push(arg);
    }
  }

  const initialPrompt = promptParts.join(' ').replace(/^["']|["']$/g, '');

  if (initialPrompt) {
    // One-shot mode
    const messages: ChatMessage[] = [{ role: 'user', content: initialPrompt }];
    try {
      await runStream(messages, { provider, model });
      saveChatSession(messages);
    } catch (err) {
      throw new Error(`Chat failed: ${(err as Error).message}`);
    }
    return;
  }

  // Interactive mode
  const messages: ChatMessage[] = [];
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
    prompt: '\x1b[36myou>\x1b[0m ',
  });

  process.stderr.write('\x1b[1mAgentX Chat\x1b[0m');
  if (provider) process.stderr.write(` \x1b[2m(provider: ${provider})\x1b[0m`);
  process.stderr.write('\n');
  process.stderr.write('\x1b[2mType your message. /quit to exit. /clear to reset.\x1b[0m\n\n');
  rl.prompt();

  rl.on('line', (line: string) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input === '/quit' || input === '/exit' || input === '/q') {
      if (messages.length > 0) saveChatSession(messages);
      process.stderr.write('\x1b[2mSession saved.\x1b[0m\n');
      rl.close();
      return;
    }

    if (input === '/clear') {
      messages.length = 0;
      process.stderr.write('\x1b[2mConversation cleared.\x1b[0m\n');
      rl.prompt();
      return;
    }

    if (input === '/history') {
      process.stderr.write(`\x1b[2mMessages: ${messages.length}\x1b[0m\n`);
      rl.prompt();
      return;
    }

    messages.push({ role: 'user', content: input });

    void (async () => {
      try {
        process.stderr.write('\n');
        await runStream(messages, { provider, model });
        process.stderr.write('\n');
      } catch (err) {
        process.stderr.write(`\n\x1b[31mError: ${(err as Error).message}\x1b[0m\n`);
        // Remove the failed user message
        messages.pop();
      }
      rl.prompt();
    })();
  });

  rl.on('close', () => {
    if (messages.length > 0) saveChatSession(messages);
    process.exit(0);
  });
}

export async function authWhoami(): Promise<void> {
  if (!isCloudAuthed()) {
    throw new Error('Not authenticated. Run: agentx login --email <email> --password <password>');
  }

  try {
    await cloudFetch('/v1/agentx/stats');
    process.stderr.write('Authenticated ✓ (token valid)\n');
  } catch {
    process.stderr.write('Authenticated ✓ (token saved)\n');
  }
}

export async function providersList(): Promise<void> {
  if (!isCloudAuthed()) {
    throw new Error('Not authenticated. Run: agentx login --email <email> --password <password>');
  }

  try {
    const res = await cloudFetch<{
      providers: Array<{ id: string; name: string; healthy: boolean; models?: string[] }>;
    }>('/v1/admin/llm-providers');

    if (res.providers.length === 0) {
      console.log('No providers configured.');
      return;
    }

    console.log(`Providers (${res.providers.length}):`);
    console.log('');
    for (const p of res.providers) {
      const icon = p.healthy ? '\x1b[32m●\x1b[0m' : '\x1b[31m●\x1b[0m';
      console.log(`  ${icon} ${p.name}`);
      if (p.models && p.models.length > 0) {
        console.log(`    Models: ${p.models.join(', ')}`);
      }
    }
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 403) {
      throw new Error('Admin access required to list providers.');
    }
    throw new Error(`Failed to list providers: ${(err as Error).message}`);
  }
}
