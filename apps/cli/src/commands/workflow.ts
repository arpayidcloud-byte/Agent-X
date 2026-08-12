/**
 * workflow — AgentX CLI workflow commands (§6.1).
 *  agentx workflow list
 *  agentx workflow create <file.json>
 *  agentx workflow delete <id>
 *  agentx workflow export <id>
 */
import * as fs from 'fs';
import { cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

export async function workflowCmd(args: string[]): Promise<void> {
  if (!isCloudAuthed()) throw new Error('Not authenticated. Run: agentx login');

  const sub = args[0];
  if (!sub) {
    console.error('Usage: agentx workflow <list|create|delete|export>');
    process.exit(1);
  }

  switch (sub) {
    case 'list': {
      const data = await cloudFetch<{
        workflows: Array<{ id: string; name: string; status: string; updatedAt: string }>;
      }>('/v1/workflows');
      if (data.workflows.length === 0) {
        console.log('No workflows found.');
        return;
      }
      console.table(data.workflows);
      break;
    }
    case 'create': {
      const filePath = args[1];
      if (!filePath) throw new Error('Usage: agentx workflow create <file.json>');
      if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const def = JSON.parse(raw);
      const result = await cloudFetch<{ id: string; name: string }>('/v1/workflows', {
        method: 'POST',
        body: def,
      });
      console.log(`Workflow created: ${result.id} (${result.name})`);
      break;
    }
    case 'delete': {
      const id = args[1];
      if (!id) throw new Error('Usage: agentx workflow delete <id>');
      await cloudFetch(`/v1/workflows/${id}`, { method: 'DELETE' });
      console.log(`Workflow ${id} deleted.`);
      break;
    }
    case 'export': {
      const id = args[1];
      if (!id) throw new Error('Usage: agentx workflow export <id>');
      const data = await cloudFetch<Record<string, unknown>>(`/v1/workflows/${id}`);
      console.log(JSON.stringify(data, null, 2));
      break;
    }
    default:
      console.error(`Unknown workflow subcommand: ${sub}`);
      console.error('Usage: agentx workflow <list|create|delete|export>');
      process.exit(1);
  }
}
