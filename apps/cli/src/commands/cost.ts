/**
 * cost — AgentX CLI cost analysis (§6.2 refactor).
 * Fetches from cloud API, falls back to local file only if not cloud-authed.
 */
import * as fs from 'fs';
import * as path from 'path';
import { configHome, cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

const LOCAL_COST_FILE = path.join(configHome, 'costs.json');

interface CloudCostSummary {
  totalCostUsd: number;
  byProvider: Array<{ provider: string; costUsd: number; calls: number }>;
  byModel: Array<{ model: string; costUsd: number; calls: number }>;
  period: string;
}

interface CloudCostEntry {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  createdAt: string;
}

export async function cost(args: string[]): Promise<void> {
  const filter = args[0];

  if (isCloudAuthed()) {
    try {
      if (filter === 'entries') {
        const data = await cloudFetch<{ entries: CloudCostEntry[] }>('/v1/cost/entries');
        if (data.entries.length === 0) {
          console.log('No cost entries.');
          return;
        }
        console.table(data.entries);
      } else {
        const data = await cloudFetch<CloudCostSummary>('/v1/cost/summary');
        console.log(`Cost analysis (${data.period}):`);
        console.log(`  Total: $${data.totalCostUsd.toFixed(4)}`);
        if (data.byProvider.length > 0) {
          console.log('\nBy provider:');
          console.table(data.byProvider);
        }
        if (data.byModel.length > 0) {
          console.log('By model:');
          console.table(data.byModel);
        }
      }
      return;
    } catch (e) {
      console.warn(
        `Cloud cost fetch failed (${e instanceof Error ? e.message : e}), falling back to local cache`,
      );
    }
  }

  // Fallback to local cache
  if (!fs.existsSync(LOCAL_COST_FILE)) {
    console.log('No cost records found (cloud or local).');
    return;
  }
  const records = JSON.parse(fs.readFileSync(LOCAL_COST_FILE, 'utf-8')) as Array<{
    graphId?: string;
    providerId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    timestamp: string;
  }>;
  const filtered =
    filter && filter !== 'entries' ? records.filter((r) => r.graphId === filter) : records;
  if (filtered.length === 0) {
    console.log(filter ? `No cost records for ${filter}.` : 'No cost records found.');
    return;
  }
  console.table(filtered);
}
