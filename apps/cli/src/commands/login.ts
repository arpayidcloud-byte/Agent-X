/**
 * agentx login — Authenticate with the AgentX cloud API.
 *
 * Usage:
 *   agentx login --email <email> --password <password> [--api <url>]
 *
 * Stores JWT token in ~/.agentx/config.json for subsequent cloud commands.
 */
import { saveCloudConfig, getApiUrl, configHome, cloudFetch } from '../lib/cloud-api.js';

interface LoginOptions {
  email?: string;
  password?: string;
  api?: string;
}

export async function login(args: string[]): Promise<void> {
  const options: LoginOptions = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) options.email = args[++i];
    if (args[i] === '--password' && args[i + 1]) options.password = args[++i];
    if (args[i] === '--api' && args[i + 1]) options.api = args[++i];
  }

  // Interactive prompts if not provided
  if (!options.email) {
    options.email = await prompt('Email: ');
  }
  if (!options.password) {
    options.password = await promptPassword('Password: ');
  }

  if (!options.email || !options.password) {
    throw new Error(
      'Email and password are required. Usage: agentx login --email <email> --password <password>',
    );
  }

  // Set custom API URL if provided
  if (options.api) {
    saveCloudConfig({ apiUrl: options.api });
  }

  const api = getApiUrl();
  console.log(`Logging in to ${api} …`);

  try {
    const res = await cloudFetch<{
      tokens: { accessToken: string; refreshToken?: string };
      user: { id: string; email: string; roles: string[] };
    }>('/v1/auth/cli-login', {
      method: 'POST',
      body: {
        email: options.email,
        password: options.password,
      },
    });

    saveCloudConfig({ apiToken: res.tokens.accessToken });

    const roles = res.user.roles.join(', ');
    console.log(`✓ Authenticated as ${res.user.email} (${roles})`);
    console.log(`  Token saved to ${configHome}/config.json`);
    console.log(`  API: ${api}`);
    console.log('');
    console.log('Cloud commands now available:');
    console.log('  agentx submit "goal"   — run task in the cloud');
    console.log('  agentx status          — list cloud tasks');
    console.log('  agentx status <id>     — task details');
    console.log('  agentx watch <id>      — stream task events');
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 401 || status === 403) {
      throw new Error('Login failed — invalid email or password.');
    }
    throw new Error(`Login failed: ${(err as Error).message}`);
  }
}

async function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.resume();
    process.stdin.on('data', (chunk: string) => {
      // Handle single character at a time for interactive prompt
      for (const ch of chunk) {
        if (ch === '\n' || ch === '\r') {
          process.stdin.pause();
          resolve(data.trim());
          return;
        }
        if (ch === '\x7f' || ch === '\b') {
          data = data.slice(0, -1);
        } else {
          data += ch;
        }
      }
    });
  });
}

async function promptPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.resume();

    // Hide input
    if (process.stdin.isTTY) {
      process.stdin.setRawMode?.(true);
    }

    process.stdin.on('data', (chunk: string) => {
      for (const ch of chunk) {
        if (ch === '\n' || ch === '\r') {
          process.stdout.write('\n');
          if (process.stdin.isTTY) {
            process.stdin.setRawMode?.(false);
          }
          process.stdin.pause();
          resolve(data);
          return;
        }
        if (ch === '\x7f' || ch === '\b') {
          data = data.slice(0, -1);
        } else if (ch === '\x03') {
          // Ctrl+C
          process.exit(130);
        } else {
          data += ch;
          process.stdout.write('*');
        }
      }
    });
  });
}
