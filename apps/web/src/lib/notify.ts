// Web Pro: browser push notifications (Notification API). Client-side only —
// the server already pushes completion events over SSE; this surfaces them as
// OS notifications when the tab is in the background. Gracefully no-ops when
// the API is unavailable or permission was denied.

export function requestNotifyPermission(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    void Notification.requestPermission();
  }
}

export function notifyTaskComplete(success: boolean, taskId: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(success ? '✅ Task complete' : '❌ Task failed', {
      body: success
        ? `Task ${taskId} finished successfully.`
        : `Task ${taskId} failed — check the dashboard.`,
      tag: `task-${taskId}`,
    });
  } catch {
    // Some environments (iOS Safari) require a service worker; ignore.
  }
}

export function notifyChatComplete(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification('💬 Reply ready', {
      body: 'The agent finished streaming its reply.',
      tag: 'chat-reply',
    });
  } catch {
    // ignore
  }
}
