/**
 * eval — AgentX CLI eval/leaderboard commands (§6.1).
 *  agentx eval leaderboard
 *  agentx eval benchmark --provider <n> --cases <file>
 */
import { cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

export async function evalCmd(args: string[]): Promise<void> {
  if (!isCloudAuthed()) throw new Error('Not authenticated. Run: agentx login');

  const sub = args[0];
  if (!sub) {
    console.error('Usage: agentx eval <leaderboard|benchmark>');
    process.exit(1);
  }

  if (sub === 'leaderboard') {
    const data = await cloudFetch<{ leaderboard: Array<Record<string, unknown>> }>(
      '/v1/eval/leaderboard',
    );
    if (data.leaderboard.length === 0) {
      console.log('No entries in leaderboard.');
      return;
    }
    console.table(data.leaderboard);
  } else if (sub === 'benchmark') {
    const providerIdx = args.indexOf('--provider');
    const casesIdx = args.indexOf('--cases');
    const body: Record<string, unknown> = {};
    if (providerIdx >= 0 && providerIdx + 1 < args.length) body.provider = args[providerIdx + 1];
    if (casesIdx >= 0 && casesIdx + 1 < args.length) body.cases = args[casesIdx + 1];
    const result = await cloudFetch<{ runId: string; status: string }>('/v1/eval/benchmark', {
      method: 'POST',
      body,
    });
    console.log(`Benchmark started: ${result.runId} (${result.status})`);
  } else if (sub === 'experiments') {
    const data = await cloudFetch<{ experiments: Array<Record<string, unknown>> }>(
      '/v1/eval/experiments',
    );
    if (data.experiments.length === 0) {
      console.log('No experiments found.');
      return;
    }
    console.table(data.experiments);
  } else {
    console.error(`Unknown eval subcommand: ${sub}`);
    console.error('Usage: agentx eval <leaderboard|benchmark|experiments>');
    process.exit(1);
  }
}
