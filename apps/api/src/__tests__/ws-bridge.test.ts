import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { Server } from 'node:http';
import WebSocket from 'ws';
import { attachWsServer } from '../ws-bridge.js';
import { createServer } from 'node:http';

describe('WebSocket bridge security', () => {
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

  it('rejects all websocket upgrades because tenant auth is not available in the upgrade path', async () => {
    await expect(
      new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(`${baseWs}?channel=task:secret-task-id`);
        ws.on('open', () => {
          ws.close();
          reject(new Error('unauthenticated websocket must not open'));
        });
        ws.on('unexpected-response', (_req, res) => {
          expect(res.statusCode).toBe(401);
          resolve();
        });
        ws.on('error', () => {
          // error may fire after unexpected-response; ignore
        });
      }),
    ).resolves.toBeUndefined();
  });
});
