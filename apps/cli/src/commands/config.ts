import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE = path.resolve(process.cwd(), '.agentx', 'config.json');
const DEFAULT_API = 'https://api.id-tech.cloud';

function loadConfig(): Record<string, unknown> {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Record<string, unknown>;
}

function saveConfig(config: Record<string, unknown>): void {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

interface PullOptions {
  token?: string;
  api?: string;
}

interface SyncedProvider {
  name: string;
  type: string;
  baseUrl: string;
  models: string[];
  enabled: boolean;
  provider: string;
  authMethod: string;
  apiKey?: string;
}

/**
 * agentx config pull --token <cli-token> [--api <url>]
 *
 * Fetches the provider configuration from the AgentX panel API and stores it
 * under config.providers. Provider API keys are NOT delivered over the wire —
 * existing local keys are preserved; new providers start without a key (set it
 * later with `agentx config set providers.<name>.apiKey <key>`).
 */
export async function pull(args: string[]): Promise<void> {
  const options: PullOptions = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--token' && args[i + 1]) options.token = args[i + 1];
    if (args[i] === '--api' && args[i + 1]) options.api = args[i + 1];
  }

  const token = options.token ?? (loadConfig().cliToken as string | undefined);
  if (!token) {
    throw new Error(
      'Missing CLI token. Generate one in the panel: Settings → CLI Sync, then run: agentx config pull --token <cli-token>',
    );
  }
  const api = options.api ?? (loadConfig().cliApi as string | undefined) ?? DEFAULT_API;

  console.log(`Pulling provider config from ${api} …`);
  const res = await fetch(`${api.replace(/\/+$/, '')}/v1/cli/config`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    throw new Error(
      'CLI token invalid or revoked — generate a new one in the panel (Settings → CLI Sync).',
    );
  }
  if (!res.ok) {
    throw new Error(`Sync failed: HTTP ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as {
    schema: number;
    syncedAt: string;
    providers: SyncedProvider[];
  };

  const cfg = loadConfig();
  const existing = (cfg.providers ?? []) as SyncedProvider[];
  const existingKeys = new Map(existing.map((p) => [p.name, p.apiKey]));

  const providers = body.providers.map((p) => ({
    ...p,
    // Preserve locally-stored keys; never request keys from the server.
    apiKey: existingKeys.get(p.name) ?? '',
  }));

  cfg.providers = providers;
  if (options.token) cfg.cliToken = options.token;
  if (options.api) cfg.cliApi = options.api;
  cfg.lastSyncAt = body.syncedAt;
  saveConfig(cfg);

  const enabled = providers.filter((p) => p.enabled).length;
  const withKey = providers.filter((p) => p.apiKey).length;
  console.log(
    `Synced ${providers.length} provider(s) (${enabled} enabled, ${withKey} with local API key) at ${body.syncedAt}`,
  );
  for (const p of providers) {
    const keyNote = p.apiKey ? 'key ✓' : 'key — set via config set';
    console.log(`  • ${p.name} (${p.provider}) ${p.enabled ? 'enabled' : 'disabled'} — ${keyNote}`);
  }
}

export async function config(args: string[]): Promise<void> {
  const action = args[0];

  if (action === 'pull') {
    await pull(args.slice(1));
    return;
  }

  if (!action || action === 'get') {
    const key = args[1];
    const cfg = loadConfig();

    const redact = (k: string, v: unknown): string => {
      if (k === 'cliToken' && typeof v === 'string') return `${v.slice(0, 8)}… (redacted)`;
      if (k === 'apiKey' && typeof v === 'string') return '•••••••• (redacted)';
      return JSON.stringify(v);
    };

    // Nested read: providers.<name>.apiKey
    if (key && key.startsWith('providers.')) {
      const parts = key.split('.');
      if (parts.length === 3 && parts[0] === 'providers') {
        const providerName = parts[1] as string;
        const providers = (cfg.providers ?? []) as SyncedProvider[];
        const target = providers.find((p) => p.name === providerName);
        if (!target) {
          console.log(`${key}: (provider not found)`);
          return;
        }
        const field = parts[2] as string;
        const value = (target as unknown as Record<string, unknown>)[field];
        if (value === undefined) {
          console.log(`${key}: (not set)`);
        } else {
          console.log(`${key}: ${redact(field, value)}`);
        }
        return;
      }
    }

    if (key) {
      const value = cfg[key];
      if (value === undefined) {
        console.log(`${key}: (not set)`);
      } else {
        console.log(`${key}: ${redact(key, value)}`);
      }
    } else {
      const entries = Object.entries(cfg);
      if (entries.length === 0) {
        console.log('No configuration set.');
        return;
      }
      console.log('Configuration:');
      for (const [k, v] of entries) {
        if (k === 'providers') {
          const providers = v as SyncedProvider[];
          console.log(`  providers: ${providers.length} provider(s)`);
          for (const p of providers) {
            console.log(
              `    ${p.name} (${p.provider}) ${p.enabled ? 'enabled' : 'disabled'} — ${p.apiKey ? 'key set' : 'key not set'}`,
            );
          }
          continue;
        }
        console.log(`  ${k}: ${redact(k, v)}`);
      }
    }
    return;
  }

  if (action === 'set') {
    const key = args[1];
    const value = args.slice(2).join(' ');
    if (!key || !value) throw new Error('Usage: agentx config set <key> <value>');

    const cfg = loadConfig();
    const parsed =
      value === 'true'
        ? true
        : value === 'false'
          ? false
          : isNaN(Number(value))
            ? value
            : Number(value);

    // Support nested keys: providers.<name>.apiKey
    const parts = key.split('.');
    if (parts.length === 3 && parts[0] === 'providers') {
      const providerName = parts[1] as string;
      const providers = (cfg.providers ?? []) as SyncedProvider[];
      const target = providers.find((p) => p.name === providerName);
      if (!target) {
        throw new Error(`Provider "${providerName}" not found. Run "agentx config pull" first.`);
      }
      if (parts[2] === 'apiKey') {
        target.apiKey = String(parsed);
      } else {
        const field = parts[2] as string;
        (target as unknown as Record<string, unknown>)[field] = parsed;
      }
      cfg.providers = providers;
      saveConfig(cfg);
      console.log(
        `Set providers.${providerName}.${parts[2]} = ${parts[2] === 'apiKey' ? '••••••••' : JSON.stringify(parsed)}`,
      );
      return;
    }

    cfg[key] = parsed;
    saveConfig(cfg);
    console.log(`Set ${key} = ${key === 'cliToken' ? '••••••••' : JSON.stringify(parsed)}`);
    return;
  }

  throw new Error(`Unknown config action: ${action}. Use: get|set|pull`);
}
