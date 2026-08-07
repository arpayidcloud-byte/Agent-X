/**
 * AgentX CLI — Cloud-first AI agent platform command line interface.
 *
 * Commands: submit, status, config, cost, audit, watch, tui, login, completions
 */
import { Command } from 'commander';
import { createRequire } from 'module';
import { submit } from './commands/submit.js';
import { status } from './commands/status.js';
import { config } from './commands/config.js';
import { cost } from './commands/cost.js';
import { audit } from './commands/audit.js';
import { watch } from './commands/watch.js';
import { tui as tuiCommand } from './commands/tui.js';
import { login } from './commands/login.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();
program.name('agentx').description('AgentX CLI').version(pkg.version);

program
  .command('submit <goal>')
  .description('Submit a task to the cloud')
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
  .command('config [args...]')
  .description('Manage configuration (get|set|pull)')
  .option('--token <token>', 'CLI sync token (for pull)')
  .option('--api <url>', 'API base URL (default: https://api.id-tech.cloud)')
  .action(async (args: string[], options: { token?: string; api?: string }) => {
    try {
      if (options.token) args.push('--token', options.token);
      if (options.api) args.push('--api', options.api);
      await config(args);
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
  .command('tui')
  .description('Launch interactive Terminal UI')
  .action(async () => {
    try {
      await tuiCommand();
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('login')
  .description('Authenticate with the AgentX cloud API')
  .option('--email <email>', 'Account email')
  .option('--password <password>', 'Account password')
  .option('--api <url>', 'API base URL (default: https://api.id-tech.cloud)')
  .action(async (options: { email?: string; password?: string; api?: string }) => {
    try {
      const args: string[] = [];
      if (options.email) args.push('--email', options.email);
      if (options.password) args.push('--password', options.password);
      if (options.api) args.push('--api', options.api);
      await login(args);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// ─── Shell Completions ────
program
  .command('completions')
  .description('Install shell completions (bash/zsh/fish)')
  .argument('[shell]', 'Shell type: bash, zsh, or fish')
  .action((shell?: string) => {
    const commands = 'submit status config cost audit watch tui login completions help';

    if (shell && (shell === 'bash' || shell === 'zsh' || shell === 'fish')) {
      if (shell === 'bash') {
        console.log(`_agentx_completions() {
  local cur prev commands
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  commands="${commands}"

  if [[ \${cur} == -* ]]; then
    COMPREPLY=( $(compgen -W "--help --version --email --password --api" -- \${cur}) )
  elif [[ \${prev} == @(submit|config) ]]; then
    COMPREPLY=( $(compgen -f -- \${cur}) )
  else
    COMPREPLY=( $(compgen -W "\${commands}" -- \${cur}) )
  fi
}
complete -F _agentx_completions agentx`);
      } else if (shell === 'zsh') {
        console.log(`#compdef agentx

_agentx() {
  _arguments \\
    '1:command:(${commands})' \\
    '*::arg:{ _files }'
}

_agentx "$@"`);
      } else if (shell === 'fish') {
        console.log(`complete -c agentx -f
complete -c agentx -n '__fish_use_subcommand' -a 'submit' -d 'Submit a task'
complete -c agentx -n '__fish_use_subcommand' -a 'status' -d 'Check task status'
complete -c agentx -n '__fish_use_subcommand' -a 'config' -d 'Manage configuration'
complete -c agentx -n '__fish_use_subcommand' -a 'cost' -d 'Show cost analysis'
complete -c agentx -n '__fish_use_subcommand' -a 'audit' -d 'Run security audit'
complete -c agentx -n '__fish_use_subcommand' -a 'watch' -d 'Watch for changes'
complete -c agentx -n '__fish_use_subcommand' -a 'tui' -d 'Launch interactive Terminal UI'
complete -c agentx -n '__fish_use_subcommand' -a 'login' -d 'Authenticate with AgentX cloud'
complete -c agentx -n '__fish_use_subcommand' -a 'completions' -d 'Install shell completions'
complete -c agentx -n '__fish_use_subcommand' -a 'help' -d 'Display help'`);
      }
    } else {
      console.log('Usage: agentx completions [bash|zsh|fish]');
      console.log('');
      console.log('Install bash completions:');
      console.log('  eval "$(agentx completions bash)"');
      console.log('');
      console.log('Install zsh completions:');
      console.log('  eval "$(agentx completions zsh)"');
      console.log('');
      console.log('Install fish completions:');
      console.log('  agentx completions fish > ~/.config/fish/completions/agentx.fish');
    }
  });

// ─── Auto-update check ────
async function checkForUpdates(): Promise<void> {
  try {
    const currentVersion = pkg.version;
    const res = await fetch('https://registry.npmjs.org/@agent-xai/cli/latest', {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = (await res.json()) as { version?: string };
      if (data.version && data.version !== currentVersion) {
        console.log(`\x1b[33m⚠ Update available: ${currentVersion} → ${data.version}\x1b[0m`);
        console.log(`  Run: npm install -g @agent-xai/cli@latest\n`);
      }
    }
  } catch {
    // Silently ignore — offline or timeout
  }
}

// Check for updates on non-completions commands
const cmd = process.argv[2];
if (cmd && cmd !== 'completions' && cmd !== '--help' && cmd !== '-h') {
  void checkForUpdates();
}

// Execute CLI
program.parse(process.argv);

export { program };
