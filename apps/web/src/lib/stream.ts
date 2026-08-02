// Real-time stream client with automatic WebSocket fallback (Web Pro).
//
// SSE (EventSource) is tried first: it is the primary transport with native
// auto-reconnect. If it errors out (proxies that buffer SSE, blocked
// EventSource, etc.) the client transparently reconnects over WebSocket to
// the same logical channel (`ws(s)://<api-host>/ws?channel=<channel>`).
// Both transports deliver the same JSON event objects.

import { API_URL } from '@/lib/api';

export interface StreamHandle {
  close: () => void;
}

function wsUrlFor(channel: string): string {
  const base = API_URL.replace(/^http/, 'ws');
  return `${base}/ws?channel=${encodeURIComponent(channel)}`;
}

/**
 * Open a stream for `channel` (e.g. `task:<id>` or `chat:<id>`), delivering
 * parsed JSON events to `onEvent`. Returns a handle; call close() to stop.
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

  try {
    source = new EventSource(`${API_URL}/v1/agentx/${channel.replace(':', '/')}/events`);
    source.onmessage = (msg) => onData(msg.data);
    source.onerror = () => {
      source?.close();
      onClose();
    };
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
