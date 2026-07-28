import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

export async function cost(args: string[]): Promise<void> {
  const graphId = args[0];
  const costFile = path.join(DATA_DIR, 'costs.json');

  if (!fs.existsSync(costFile)) {
    console.log('No cost records found.');
    return;
  }

  const records = JSON.parse(fs.readFileSync(costFile, 'utf-8')) as Array<{
    graphId?: string;
    providerId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    timestamp: string;
  }>;

  const filtered = graphId ? records.filter((r) => r.graphId === graphId) : records;

  if (filtered.length === 0) {
    console.log(graphId ? `No cost records for graph ${graphId}.` : 'No cost records found.');
    return;
  }

  const totalCost = filtered.reduce((sum, r) => sum + r.costUsd, 0);
  const totalInput = filtered.reduce((sum, r) => sum + r.inputTokens, 0);
  const totalOutput = filtered.reduce((sum, r) => sum + r.outputTokens, 0);

  console.log(`Cost Report${graphId ? ` — Graph ${graphId}` : ''}`);
  console.log('================================');
  console.log(`Total Cost: $${totalCost.toFixed(4)}`);
  console.log(`Total Tokens: ${totalInput} in / ${totalOutput} out`);
  console.log(`Records: ${filtered.length}`);
  console.log('');

  const byProvider = new Map<string, { count: number; cost: number }>();
  for (const r of filtered) {
    const existing = byProvider.get(r.providerId) ?? { count: 0, cost: 0 };
    existing.count++;
    existing.cost += r.costUsd;
    byProvider.set(r.providerId, existing);
  }

  console.log('By Provider:');
  for (const [provider, data] of byProvider) {
    console.log(`  ${provider}: $${data.cost.toFixed(4)} (${data.count} calls)`);
  }
}
