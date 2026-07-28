// V9 CLI - Human Interface
import { Command } from 'commander';
import { createRequire } from 'module';
import { submit } from './commands/submit.js';
import { approve, reject } from './commands/approve.js';
import { status } from './commands/status.js';
import { demo } from './commands/demo.js';
import { config } from './commands/config.js';
import { cost } from './commands/cost.js';
import { audit } from './commands/audit.js';
import { plugin } from './commands/plugin.js';
import { watch } from './commands/watch.js';
import { dlq } from './commands/dlq.js';
import { shutdown } from './commands/shutdown.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program.name('agentx').description('AgentX CLI').version(pkg.version);

program
  .command('submit <goal>')
  .description('Submit a new task')
  .option('--role <role>', 'Agent role (default: coder)')
  .action(async (goal: string, options: { role?: string }) => {
    try {
      const args = options.role ? [goal, '--role', options.role] : [goal];
      await submit(args);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('approve <task-id>')
  .description('Approve a pending task')
  .action(async (taskId: string) => {
    try {
      await approve([taskId]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('reject <task-id>')
  .description('Reject a pending task')
  .action(async (taskId: string) => {
    try {
      await reject([taskId]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('status [task-id]')
  .description('Check task status')
  .action(async (taskId?: string) => {
    try {
      await status(taskId ? [taskId] : []);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('demo [goal...]')
  .description('Run E2E demo (CLI → Runtime → Agent → LLM → Response)')
  .action(async (goal: string[]) => {
    try {
      await demo(goal);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Manage configuration')
  .action(async () => {
    try {
      await config([]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('cost')
  .description('Show cost analysis')
  .action(async () => {
    try {
      await cost([]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('audit')
  .description('Run security audit')
  .action(async () => {
    try {
      await audit([]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('plugin')
  .description('Manage plugins')
  .action(async () => {
    try {
      await plugin([]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('watch')
  .description('Watch for changes')
  .action(async () => {
    try {
      await watch([]);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('dlq [action]')
  .description('Manage Dead Letter Queue (list|clear|size)')
  .action(async (action?: string) => {
    try {
      await dlq(action ? [action] : []);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('shutdown [reason...]')
  .description('Trigger graceful shutdown')
  .action(async (reason: string[]) => {
    try {
      await shutdown(reason);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Execute CLI
program.parse(process.argv);

export { program };
