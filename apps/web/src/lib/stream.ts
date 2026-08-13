// Authenticated real-time stream client for Web Pro.
// Browser EventSource cannot send Authorization headers, so tenant SSE streams
// use fetch() with a bearer token and an AbortController instead.
import { API_URL, getToken } from '@/lib/api';

export interface StreamHandle {
  close: () => void;
}

const SSE_ROUTES: Record<string, string> = {
  'task:': 'tasks',
  'chat:': 'chat',
  'ma:': 'multi-agent',
};

/** Open an authenticated SSE stream and deliver parsed JSON events. */
export function openEventStream(channel: string, onEvent: (ev: unknown) => void): StreamHandle {
  const controller = new AbortController();
  const prefix = Object.keys(SSE_ROUTES).find((p) => channel.startsWith(p));
  const route = prefix ? SSE_ROUTES[prefix] : undefined;
  const id = prefix ? channel.slice(prefix.length) : '';
  const token = getToken();

  if (!route || !token) {
    queueMicrotask(() => onEvent({ type: 'error', error: 'Authentication required for stream' }));
    return { close: () => controller.abort() };
  }

  void (async () => {
    try {
      const response = await fetch(`${API_URL}/v1/agentx/${route}/${id}/events`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok || !response.body) {
        onEvent({ type: 'error', error: `Stream failed: ${response.status}` });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (!controller.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';
        for (const frame of frames) {
          const data = frame
            .split('\n')
            .filter((line) => line.startsWith('data: '))
            .map((line) => line.slice(6))
            .join('\n');
          if (!data) continue;
          try {
            onEvent(JSON.parse(data));
          } catch {
            // Ignore malformed frames and heartbeat comments.
          }
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        onEvent({ type: 'error', error: error instanceof Error ? error.message : String(error) });
      }
    }
  })();

  return { close: () => controller.abort() };
}
