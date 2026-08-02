import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import WebSocket from 'ws';
import { attachWsServer } from '../ws-bridge.js';
import { publishEvent, getTaskEventHistory } from '../task-stream.js';
import { publishChatEvent } from '../chat-stream.js';
import { publishMultiAgentEvent } from '../multi-agent-stream.js';
import { createServer } from 'node:http';

describe('WebSocket fallback bridge (Web Pro)', () => {
  let server: Server;
  let wss: ReturnType<typeof attachWsServer>;
  let baseWs: string;

  beforeAll(async () => {
    server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{}');
    });
    wss = attachWsServer(server);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseWs = `ws://127.0.0.1:${address.port}/ws`;
  });

  afterAll(async () => {
    wss.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('rejects connections without a valid channel (400 handshake)', async () => {
    await expect(
      new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(`${baseWs}`);
        ws.on('open', () => {
          ws.close();
          reject(new Error('should not open'));
        });
        ws.on('unexpected-response', (_req, res) => {
          expect(res.statusCode).toBe(400);
          resolve();
        });
        ws.on('error', () => {
          // error may fire after unexpected-response; ignore
        });
      }),
    ).resolves.toBeUndefined();
  });

  it('replays task history then forwards live events', async () => {
    const taskId = `ws-task-${Date.now()}`;
    // History before connecting
    publishEvent({ type: 'accepted', taskId, at: new Date().toISOString() });
    publishEvent({ type: 'generating', taskId, at: new Date().toISOString() });

    const received: unknown[] = [];
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`${baseWs}?channel=task:${taskId}`);
      const timer = setTimeout(() => reject(new Error('timeout')), 5000);
      ws.on('message', (data) => {
        received.push(JSON.parse(data.toString()));
        // After history (2 events), publish a live event and finish on receipt
        if (received.length === 2) {
          publishEvent({
            type: 'complete',
            taskId,
            status: 'success',
            at: new Date().toISOString(),
          });
        }
        if (received.length === 3) {
          clearTimeout(timer);
          ws.close();
          resolve();
        }
      });
      ws.on('error', (e) => {
        clearTimeout(timer);
        reject(e);
      });
    });

    expect(received).toHaveLength(3);
    expect((received[0] as { type: string }).type).toBe('accepted');
    expect((received[1] as { type: string }).type).toBe('generating');
    expect((received[2] as { type: string }).type).toBe('complete');
    expect(getTaskEventHistory(taskId)).toHaveLength(3);
  });

  it('forwards multi-agent run events over the ma channel', async () => {
    const runId = `ws-ma-${Date.now()}`;
    const received: unknown[] = [];
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`${baseWs}?channel=ma:${runId}`);
      const timer = setTimeout(() => reject(new Error('timeout')), 5000);
      ws.on('message', (data) => {
        received.push(JSON.parse(data.toString()));
        if (received.length === 1) {
          clearTimeout(timer);
          ws.close();
          resolve();
        }
      });
      ws.on('error', (e) => {
        clearTimeout(timer);
        reject(e);
      });
      setTimeout(() => {
        publishMultiAgentEvent({
          type: 'goal-start',
          runId,
          goalId: 'goal-1',
          index: 0,
          at: new Date().toISOString(),
        });
      }, 150);
    });
    expect(received).toHaveLength(1);
    expect((received[0] as { type: string }).type).toBe('goal-start');
  });

  it('forwards chat events over the chat channel', async () => {
    const chatId = `ws-chat-${Date.now()}`;
    const received: unknown[] = [];
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(`${baseWs}?channel=chat:${chatId}`);
      const timer = setTimeout(() => reject(new Error('timeout')), 5000);
      ws.on('message', (data) => {
        received.push(JSON.parse(data.toString()));
        if (received.length === 1) {
          clearTimeout(timer);
          ws.close();
          resolve();
        }
      });
      ws.on('error', (e) => {
        clearTimeout(timer);
        reject(e);
      });
      setTimeout(() => {
        publishChatEvent({
          type: 'start',
          chatId,
          provider: 'deepseek',
          model: 'deepseek-v3',
          at: new Date().toISOString(),
        });
      }, 150);
    });
    expect(received).toHaveLength(1);
    expect((received[0] as { type: string }).type).toBe('start');
  });
});
