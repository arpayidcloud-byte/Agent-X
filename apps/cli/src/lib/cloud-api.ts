/**
 * Cloud API client for AgentX CLI.
 *
 * Provides authenticated access to the AgentX API server.
 * Config is stored in AGENTX_HOME (env) or ~/.agentx/ (default).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const AGENTX_HOME = process.env.AGENTX_HOME ?? path.join(os.homedir(), '.agentx');
const CONFIG_FILE = path.join(AGENTX_HOME, 'config.json');

/** Config directory — home-based (portable across machines). */
export const configHome = AGENTX_HOME;

export interface CloudConfig {
  apiToken?: string;
  apiUrl?: string;
}

export const DEFAULT_API_URL = 'https://api.id-tech.cloud';

export function loadCloudConfig(): CloudConfig {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Record<string, unknown>;
    return {
      apiToken: (raw.apiToken as string) || undefined,
      apiUrl: (raw.apiUrl as string) || undefined,
    };
  } catch {
    return {};
  }
}

export function saveCloudConfig(patch: Partial<CloudConfig>): void {
  if (!fs.existsSync(AGENTX_HOME)) fs.mkdirSync(AGENTX_HOME, { recursive: true });
  const existing = loadCloudConfig();
  const merged = { ...existing, ...patch };
  const raw: Record<string, unknown> = {};
  if (merged.apiToken) raw.apiToken = merged.apiToken;
  if (merged.apiUrl) raw.apiUrl = merged.apiUrl;

  // Preserve other config keys (providers, groups, cliToken, etc.)
  if (fs.existsSync(CONFIG_FILE)) {
    const full = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Record<string, unknown>;
    Object.assign(full, raw);
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(full, null, 2));
  } else {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(raw, null, 2));
  }
}

/** Returns the API base URL (no trailing slash). */
export function getApiUrl(): string {
  const cfg = loadCloudConfig();
  return (cfg.apiUrl || DEFAULT_API_URL).replace(/\/+$/, '');
}

/** Returns true if the user has a cloud auth token. */
export function isCloudAuthed(): boolean {
  return !!loadCloudConfig().apiToken;
}

/** Authenticated fetch wrapper. Throws on non-OK responses. */
export async function cloudFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<T> {
  const cfg = loadCloudConfig();
  const apiBase = getApiUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(cfg.apiToken ? { Authorization: `Bearer ${cfg.apiToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${apiBase}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let msg = `HTTP ${res.status}`;
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) msg = parsed.error;
    } catch {
      if (text) msg = text.slice(0, 200);
    }
    const err = new Error(msg) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

/**
 * Start an SSE connection.
 * Returns a Promise<Response> — the consumer reads response.body.getReader().
 * Accepts extra fetch init (e.g. { signal }) for abort/reconnect control.
 */
export function cloudSSE(ssePath: string, init: RequestInit = {}): Promise<Response> {
  const apiBase = getApiUrl();
  const cfg = loadCloudConfig();
  const url = `${apiBase}${ssePath}`;
  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  };
  if (cfg.apiToken) headers.Authorization = `Bearer ${cfg.apiToken}`;
  return fetch(url, { ...init, headers });
}
