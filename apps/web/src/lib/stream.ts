// Real-time stream client with automatic WebSocket fallback (Web Pro).
//
// SSE (EventSource) is tried first: it is the primary transport with native
// auto-reconnect. If it errors out (proxies that buffer SSE, blocked
// EventSource, etc.) the client transparently reconnects over WebSocket to
import { API_URL } from '@/lib/api';

export interface StreamHandle {
  close: () => void;
}

// Channel prefix → SSE route segment (the server routes differ per channel).
const SSE_ROUTES: Record<string, string> = {
  'task:': 'tasks',
  'chat:': 'chat',
  'ma:': 'multi-agent',
};

function wsUrlFor(channel: string): string {
  const base = API_URL.replace(/^http/, 'ws');
  return `${base}/ws?channel=${encodeURIComponent(channel)}`;
}

/**
 * Open a stream for `channel` (e.g. `task:<id>`, `chat:<id>` or `ma:<id>`),
 * delivering parsed JSON events to `onEvent`. Returns a handle; call close()
 * to stop.
 */
export function openEventStream(channel: string, onEvent: (ev: unknown) => void): StreamHandle {
  let closed = false;
  let source: EventSource | null = null;
  let ws: WebSocket | null = null;
  let useWs = false;

  function onData(data: unknown) {
    if (closed) return;
    try {
      onEvent(JSON.parse(String(data)));
    } catch {
      // Ignore malformed frames (heartbeats etc.)
    }
  }

  function connectWs() {
    if (closed) return;
    useWs = true;
    ws = new WebSocket(wsUrlFor(channel));
    ws.onmessage = (msg) => onData(msg.data);
    ws.onerror = () => {
      // No retry loop here: the page-level UI surfaces failures; a page
      // refresh re-establishes the stream.
      ws?.close();
    };
    ws.onclose = () => {
      if (!closed) onClose();
    };
  }

  function onClose() {
    if (!closed && !useWs) {
      // SSE failed — fall back to WebSocket once.
      connectWs();
    }
  }

  const prefix = Object.keys(SSE_ROUTES).find((p) => channel.startsWith(p));
  const route = prefix ? SSE_ROUTES[prefix] : undefined;
  const id = prefix ? channel.slice(prefix.length) : '';

  try {
    if (route) {
      source = new EventSource(`${API_URL}/v1/agentx/${route}/${id}/events`);
      source.onmessage = (msg) => onData(msg.data);
      source.onerror = () => {
        source?.close();
        onClose();
      };
    } else {
      // Unknown channel — no SSE route; go straight to WS.
      connectWs();
    }
  } catch {
    // EventSource unavailable (very old browsers) — straight to WS.
    connectWs();
  }

  return {
    close: () => {
      closed = true;
      source?.close();
      ws?.close();
    },
  };
}
