import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

export async function audit(args: string[]): Promise<void> {
  const graphId = args[0];
  const auditFile = path.join(DATA_DIR, 'audit.jsonl');

  if (!fs.existsSync(auditFile)) {
    console.log('No audit records found.');
    return;
  }

  const content = fs.readFileSync(auditFile, 'utf-8');
  const records: Array<{
    graphId?: string;
    event: string;
    actor: string;
    detail: string;
    timestamp: string;
  }> = content
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const filtered = graphId ? records.filter((r) => r.graphId === graphId) : records;

  if (filtered.length === 0) {
    console.log(graphId ? `No audit records for graph ${graphId}.` : 'No audit records found.');
    return;
  }

  console.log(`Audit Trail${graphId ? ` — Graph ${graphId}` : ''}`);
  console.log('================================');

  for (const r of filtered) {
    const ts = new Date(r.timestamp).toLocaleString();
    console.log(`[${ts}] ${r.event} | actor: ${r.actor} | ${r.detail}`);
  }

  console.log(`\nTotal: ${filtered.length} events`);
}
