// WebSocket bridge (Web Pro).
//
// Tenant event streams use authenticated HTTP SSE. The historical WebSocket
// upgrade path cannot run Express requireAuth + withOrg, so it is deliberately
// fail-closed until an authenticated upgrade handshake and ownership checks are
// implemented.
import { createServer, type Server } from 'node:http';
import { WebSocketServer } from 'ws';

export const WS_PATH = '/ws';

export function attachWsServer(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    if (pathname !== WS_PATH) {
      socket.destroy();
      return;
    }

    socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
    socket.destroy();
  });

  return wss;
}

/** Convenience: create an HTTP server hosting the express app + WS bridge. */
export function createHttpServer(app: Parameters<typeof createServer>[1]): Server {
  const server = createServer(app);
  attachWsServer(server);
  return server;
}
