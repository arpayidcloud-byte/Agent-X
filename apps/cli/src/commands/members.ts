/**
 * members — AgentX CLI team member commands (§6.1).
 *  agentx members list
 *  agentx members add <email> [--role <role>]
 *  agentx members remove <email>
 */
import { cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

export async function membersCmd(args: string[]): Promise<void> {
  if (!isCloudAuthed()) throw new Error('Not authenticated. Run: agentx login');

  const sub = args[0];
  if (!sub) {
    console.error('Usage: agentx members <list|add|remove>');
    process.exit(1);
  }

  switch (sub) {
    case 'list': {
      const data = await cloudFetch<{
        members: Array<{ email: string; roles: string[]; joinedAt: string }>;
      }>('/v1/team');
      if (data.members.length === 0) {
        console.log('No team members.');
        return;
      }
      console.table(data.members);
      break;
    }
    case 'add': {
      const email = args[1];
      if (!email) throw new Error('Usage: agentx members add <email> [--role <role>]');
      const roleIdx = args.indexOf('--role');
      const role = roleIdx >= 0 ? args[roleIdx + 1] : 'member';
      const result = await cloudFetch<{ email: string; roles: string[] }>('/v1/admin/users', {
        method: 'POST',
        body: { email, roles: [role] },
      });
      console.log(`Member added: ${result.email} (${result.roles.join(', ')})`);
      break;
    }
    case 'remove': {
      const email = args[1];
      if (!email) throw new Error('Usage: agentx members remove <email>');
      await cloudFetch('/v1/admin/users/remove', {
        method: 'POST',
        body: { email },
      });
      console.log(`Member removed: ${email}`);
      break;
    }
    default:
      console.error(`Unknown members subcommand: ${sub}`);
      console.error('Usage: agentx members <list|add|remove>');
      process.exit(1);
  }
}
