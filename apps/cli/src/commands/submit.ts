/**
 * agentx submit — Submit a task to run.
 *
 * Cloud-only: requires authentication. Login first with: agentx login
 */
import { isCloudAuthed, cloudFetch } from '../lib/cloud-api.js';

export async function submit(args: string[]): Promise<void> {
  // Parse --role flag
  const roleIndex = args.findIndex((a) => a === '--role');
  const assignedRole = roleIndex >= 0 ? args[roleIndex + 1] : 'coder';
  const goal = args
    .filter((a) => !a.startsWith('--') && a !== assignedRole)
    .join(' ')
    .replace(/^"(.*)"$/, '$1')
    .replace(/^'(.*)'$/, '$1');

  if (!goal) {
    throw new Error('Usage: agentx submit "<goal>" [--role <agent-role>]');
  }

  // ── Auth guard ──
  if (!isCloudAuthed()) {
    throw new Error('Not authenticated. Run: agentx login --email <email> --password <password>');
  }

  // ── Submit to cloud ──
  console.log('Submitting to cloud …');
  try {
    const taskId = `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const res = await cloudFetch<{
      message?: string;
      provider?: string;
      model?: string;
    }>('/v1/agentx/run', {
      method: 'POST',
      body: {
        prompt: goal,
        taskId,
        description: goal.slice(0, 120),
        complexity: 'medium',
        type: 'reasoning',
        budget: 'medium',
      },
    });

    console.log(`Task submitted: ${taskId}`);
    console.log(`  Goal: ${goal}`);
    if (res.provider) console.log(`  Provider: ${res.provider}`);
    if (res.model) console.log(`  Model: ${res.model}`);
    if (res.message) {
      console.log(`  Response: ${res.message.slice(0, 200)}`);
    }
    console.log(`Run "agentx status ${taskId}" to check progress.`);
    console.log(`Run "agentx watch ${taskId}" to stream events.`);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401 || status === 403) {
      throw new Error('Session expired. Run: agentx login --email <email> --password <password>');
    }
    throw new Error(`Cloud submit failed: ${(err as Error).message}`);
  }
}
