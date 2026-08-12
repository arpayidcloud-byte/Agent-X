/**
 * marketplace — AgentX CLI marketplace/template commands (§6.1).
 *  agentx marketplace list
 *  agentx marketplace templates
 */
import { cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

export async function marketplaceCmd(args: string[]): Promise<void> {
  if (!isCloudAuthed()) throw new Error('Not authenticated. Run: agentx login');

  const sub = args[0] || 'list';

  if (sub === 'list') {
    const data = await cloudFetch<{
      items: Array<{ id: string; name: string; author: string; downloads: number; rating: number }>;
    }>('/v1/marketplace');
    if (data.items.length === 0) {
      console.log('No marketplace items found.');
      return;
    }
    console.table(data.items);
  } else if (sub === 'templates') {
    const data = await cloudFetch<{
      templates: Array<{ id: string; name: string; category: string; version: string }>;
    }>('/v1/prompt-templates');
    if (data.templates.length === 0) {
      console.log('No prompt templates found.');
      return;
    }
    console.table(data.templates);
  } else {
    console.error(`Unknown marketplace subcommand: ${sub}`);
    console.error('Usage: agentx marketplace <list|templates>');
    process.exit(1);
  }
}
