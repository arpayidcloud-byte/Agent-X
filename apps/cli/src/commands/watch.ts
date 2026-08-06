/**
 * agentx watch — Stream task events in real time.
 *
 * Cloud-first: when authenticated, connects to SSE endpoint on the cloud API.
 * Falls back to local file polling when no cloud token is set.
 */
import * as fs from 'fs';
import * as path from 'path';
import { isCloudAuthed, getApiUrl, loadCloudConfig } from '../lib/cloud-api.js';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

export async function watch(args: string[]): Promise<void> {
  const taskId = args[0];

  console.log('AgentX Watch — Event Stream');
  console.log('===========================');
  console.log('');

  // ── Cloud mode: SSE from API ──
  if (isCloudAuthed()) {
    const target = taskId ?? 'all';
    const ssePath = taskId ? `/v1/agentx/tasks/${taskId}/events` : '/v1/agentx/tasks';

    console.log(`Connecting to cloud: ${getApiUrl()}${ssePath}`);
    console.log(`Target: ${target}`);
    console.log('Streaming events… (press Ctrl+C to stop)');
    console.log('');

    const apiBase = getApiUrl();
    const cfg = loadCloudConfig();
    const url = `${apiBase}${ssePath}`;
    const headers: Record<string, string> = {};
    if (cfg.apiToken) headers.Authorization = `Bearer ${cfg.apiToken}`;

    const controller = new AbortController();

    try {
      const res = await fetch(url, { headers, signal: controller.signal });
      if (!res.ok || !res.body) {
        console.error(`SSE connection failed: HTTP ${res.status}`);
        process.exit(1);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Read SSE stream
      const readLoop = async (): Promise<void> => {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const event = JSON.parse(data) as Record<string, unknown>;
                const ts = new Date().toLocaleTimeString();
                const type = String(event.type ?? event.topic ?? 'event');
                const detail = JSON.stringify(event).slice(0, 120);
                console.log(`[${ts}] ${type} → ${detail}`);
              } catch {
                console.log(`[data] ${data.slice(0, 120)}`);
              }
            } else if (line.startsWith(':')) {
              // SSE comment (heartbeat) — ignore silently
            }
          }
        }
        console.log('\nStream ended.');
      };

      await readLoop();
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        console.log('\nStopped watching.');
      } else {
        console.error(`\nSSE error: ${(err as Error).message}`);
      }
    }

    controller.abort();
    process.exit(0);
  }

  // ── Local fallback: file polling ──
  console.log('No cloud token — watching local events.');
  console.log('(Run "agentx login" to stream from the cloud.)');
  console.log('');
  if (taskId) {
    console.log(`Filtering by graph: ${taskId}`);
  }
  console.log('Waiting for events… (press Ctrl+C to stop)');
  console.log('');

  const eventsFile = path.join(DATA_DIR, 'events.jsonl');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let lastPos = 0;
  if (fs.existsSync(eventsFile)) {
    lastPos = fs.statSync(eventsFile).size;
  }

  const poll = (): void => {
    if (!fs.existsSync(eventsFile)) {
      setTimeout(poll, 1000);
      return;
    }

    const stat = fs.statSync(eventsFile);
    if (stat.size > lastPos) {
      const fd = fs.openSync(eventsFile, 'r');
      const buf = Buffer.alloc(stat.size - lastPos);
      fs.readSync(fd, buf, 0, buf.length, lastPos);
      fs.closeSync(fd);
      lastPos = stat.size;

      const lines = buf.toString().trim().split('\n');
      for (const line of lines) {
        if (!line) continue;
        try {
          const event = JSON.parse(line) as {
            graphId?: string;
            timestamp: string;
            topic: string;
            payload: unknown;
          };
          if (taskId && event.graphId !== taskId) continue;
          const ts = new Date(event.timestamp).toLocaleTimeString();
          console.log(`[${ts}] ${event.topic} → ${JSON.stringify(event.payload).slice(0, 80)}`);
        } catch {
          // skip malformed lines
        }
      }
    }
    setTimeout(poll, 500);
  };

  poll();

  process.on('SIGINT', () => {
    console.log('\nStopped watching.');
    process.exit(0);
  });
}
