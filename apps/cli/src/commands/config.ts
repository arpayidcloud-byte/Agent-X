import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE = path.resolve(process.cwd(), '.agentx', 'config.json');

function loadConfig(): Record<string, unknown> {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Record<string, unknown>;
}

function saveConfig(config: Record<string, unknown>): void {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function config(args: string[]): Promise<void> {
  const action = args[0];

  if (!action || action === 'get') {
    const key = args[1];
    const cfg = loadConfig();
    if (key) {
      const value = cfg[key];
      if (value === undefined) {
        console.log(`${key}: (not set)`);
      } else {
        console.log(`${key}: ${JSON.stringify(value)}`);
      }
    } else {
      const entries = Object.entries(cfg);
      if (entries.length === 0) {
        console.log('No configuration set.');
        return;
      }
      console.log('Configuration:');
      for (const [k, v] of entries) {
        console.log(`  ${k}: ${JSON.stringify(v)}`);
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
    cfg[key] = parsed;
    saveConfig(cfg);
    console.log(`Set ${key} = ${JSON.stringify(parsed)}`);
    return;
  }

  throw new Error(`Unknown config action: ${action}. Use: get|set`);
}
