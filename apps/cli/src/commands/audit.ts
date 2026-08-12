/**
 * audit — AgentX CLI audit log command (§6.2 refactor).
 * Fetches from cloud API (admin), falls back to local file only if not cloud-authed.
 */
import * as fs from 'fs';
import * as path from 'path';
import { configHome, cloudFetch, isCloudAuthed } from '../lib/cloud-api.js';

const LOCAL_AUDIT_FILE = path.join(configHome, 'audit.jsonl');

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  detail: string;
  createdAt: string;
}

export async function audit(args: string[]): Promise<void> {
  const filter = args[0];

  if (isCloudAuthed()) {
    try {
      const data = await cloudFetch<{ auditLogs: AuditLogEntry[] }>(
        '/v1/admin/audit-logs?limit=100',
      );
      if (data.auditLogs.length === 0) {
        console.log('No audit logs found.');
        return;
      }
      const filtered = filter
        ? data.auditLogs.filter((r) => r.actor.includes(filter) || r.action.includes(filter))
        : data.auditLogs;
      console.table(filtered);
      return;
    } catch (e) {
      console.warn(
        `Cloud audit fetch failed (${e instanceof Error ? e.message : e}), falling back to local cache`,
      );
    }
  }

  // Fallback to local cache
  if (!fs.existsSync(LOCAL_AUDIT_FILE)) {
    console.log('No audit records found (cloud or local).');
    return;
  }
  const content = fs.readFileSync(LOCAL_AUDIT_FILE, 'utf-8');
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
  const filtered = filter ? records.filter((r) => r.graphId === filter) : records;
  if (filtered.length === 0) {
    console.log(filter ? `No audit records for ${filter}.` : 'No audit records found.');
    return;
  }
  console.table(filtered);
}
