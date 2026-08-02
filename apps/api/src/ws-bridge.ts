// WebSocket fallback bridge (Web Pro).
//
// SSE is the primary real-time transport (works over plain HTTP/1.1 and has
// automatic reconnection semantics in browsers); WebSocket is the fallback
// when EventSource fails (e.g. proxies that buffer SSE, or clients that block
// it). Both transports share the same in-memory event buses, so a client can
// subscribe to the same channel over either.
//
// Channel protocol: ws://host/ws?channel=task:<id>  → task lifecycle events
//                   ws://host/ws?channel=chat:<id>  → chat token-chunk events
// The server replays buffered history first, then forwards live events as
// JSON text frames. A ping/pong heartbeat (30s) keeps idle connections alive.
import { createServer, type Server, type IncomingMessage } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { subscribeTask, getTaskEventHistory, type TaskStreamEvent } from './task-stream.js';
import { subscribeChat, getChatEventHistory, type ChatStreamEvent } from './chat-stream.js';

export const WS_PATH = '/ws';
const HEARTBEAT_MS = 30_000;

type StreamEvent = TaskStreamEvent | ChatStreamEvent;

export function attachWsServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const { pathname, searchParams } = new URL(req.url ?? '/', 'http://localhost');
    if (pathname !== WS_PATH) {
      socket.destroy();
      return;
    }
    const channel = searchParams.get('channel');
    if (!channel || (!channel.startsWith('task:') && !channel.startsWith('chat:'))) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req, channel);
    });
  });

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage, channel: string) => {
    let unsubscribe: (() => void) | undefined;
    const send = (ev: StreamEvent) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(ev));
    };

    // Replay history first (late subscriber), then subscribe live.
    if (channel.startsWith('task:')) {
      const taskId = channel.slice(5);
      for (const ev of getTaskEventHistory(taskId)) send(ev);
      unsubscribe = subscribeTask(taskId, send);
    } else {
      const chatId = channel.slice(5);
      for (const ev of getChatEventHistory(chatId)) send(ev);
      unsubscribe = subscribeChat(chatId, send);
    }

    // Heartbeat: ping the client; drop dead connections.
    let alive = true;
    const heartbeat = setInterval(() => {
      if (!alive) {
        ws.terminate();
        return;
      }
      alive = false;
      ws.ping();
    }, HEARTBEAT_MS);
    ws.on('pong', () => {
      alive = true;
    });

    ws.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe?.();
    });
    ws.on('error', () => {
      clearInterval(heartbeat);
      unsubscribe?.();
    });
  });

  return wss;
}

/** Convenience: create an HTTP server hosting the express app + WS bridge. */
export function createHttpServer(app: Parameters<typeof createServer>[1]): Server {
  const server = createServer(app);
  attachWsServer(server);
  return server;
}
