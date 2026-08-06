'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  email: string;
  action: string;
  target: string;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

interface TaskRecord {
  id: string;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  provider?: string;
  model?: string;
  createdAt: string;
  completedAt?: string;
}

interface ActivityItem {
  id: string;
  type: 'audit' | 'task' | 'system';
  icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  time: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function api<T>(path: string): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('agentx_admin_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

function timeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getActionIcon(action: string): { icon: React.ElementType; color: string } {
  if (action.includes('create') || action.includes('add'))
    return { icon: CheckCircle2, color: 'text-emerald-400' };
  if (action.includes('delete') || action.includes('remove'))
    return { icon: XCircle, color: 'text-rose-400' };
  if (action.includes('update') || action.includes('edit'))
    return { icon: AlertTriangle, color: 'text-amber-400' };
  if (action.includes('test') || action.includes('deploy'))
    return { icon: Zap, color: 'text-blue-400' };
  return { icon: ArrowUpRight, color: 'text-slate-400' };
}

export default function ActivityFeedView() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [auditRes, tasksRes] = await Promise.all([
        api<{ logs: AuditLogEntry[] }>('/v1/admin/audit-logs?limit=20'),
        api<{ tasks: TaskRecord[]; total: number }>('/v1/agentx/tasks?limit=20'),
      ]);

      const items: ActivityItem[] = [];

      // Convert audit logs to activity items
      for (const log of auditRes.logs) {
        const { icon, color } = getActionIcon(log.action);
        items.push({
          id: `audit-${log.id}`,
          type: 'audit',
          icon,
          color,
          title: `${log.action} ${log.target}`,
          description: log.email,
          time: log.createdAt,
        });
      }

      // Convert tasks to activity items
      for (const task of tasksRes.tasks) {
        let icon: React.ElementType;
        let color: string;
        if (task.status === 'completed') {
          icon = CheckCircle2;
          color = 'text-emerald-400';
        } else if (task.status === 'error') {
          icon = XCircle;
          color = 'text-rose-400';
        } else if (task.status === 'running') {
          icon = Zap;
          color = 'text-blue-400';
        } else {
          icon = Clock;
          color = 'text-amber-400';
        }

        items.push({
          id: `task-${task.id}`,
          type: 'task',
          icon,
          color,
          title: task.status.charAt(0).toUpperCase() + task.status.slice(1),
          description: task.prompt.slice(0, 80) + (task.prompt.length > 80 ? '...' : ''),
          time: task.createdAt,
        });
      }

      // Sort by time descending
      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      setActivities(items.slice(0, 30));
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [auditRes, tasksRes] = await Promise.all([
          api<{ logs: AuditLogEntry[] }>('/v1/admin/audit-logs?limit=20'),
          api<{ tasks: TaskRecord[]; total: number }>('/v1/agentx/tasks?limit=20'),
        ]);

        const items: ActivityItem[] = [];

        // Convert audit logs to activity items
        for (const log of auditRes.logs) {
          const { icon, color } = getActionIcon(log.action);
          items.push({
            id: `audit-${log.id}`,
            type: 'audit',
            icon,
            color,
            title: `${log.action} ${log.target}`,
            description: log.email,
            time: log.createdAt,
          });
        }

        // Convert tasks to activity items
        for (const task of tasksRes.tasks) {
          let icon: React.ElementType;
          let color: string;
          if (task.status === 'completed') {
            icon = CheckCircle2;
            color = 'text-emerald-400';
          } else if (task.status === 'error') {
            icon = XCircle;
            color = 'text-rose-400';
          } else if (task.status === 'running') {
            icon = Zap;
            color = 'text-blue-400';
          } else {
            icon = Clock;
            color = 'text-amber-400';
          }

          items.push({
            id: `task-${task.id}`,
            type: 'task',
            icon,
            color,
            title: task.status.charAt(0).toUpperCase() + task.status.slice(1),
            description: task.prompt.slice(0, 80) + (task.prompt.length > 80 ? '...' : ''),
            time: task.createdAt,
          });
        }

        // Sort by time descending
        items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        if (!cancelled) {
          setActivities(items.slice(0, 30));
          setLastRefresh(new Date());
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      void fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  function handleRefresh() {
    setRefreshing(true);
    setError(null);
    void fetchData();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Activity Feed</h1>
          <p className="mt-1 text-sm text-slate-500">
            {activities.length} recent activities
            {lastRefresh && (
              <span className="ml-2 text-slate-600">
                · Last updated {timeAgo(lastRefresh.toISOString())}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              autoRefresh
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-white/[0.06] bg-surface-2/60 text-slate-500'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}
            />
            {autoRefresh ? 'Auto' : 'Paused'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-surface-2/60 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/[0.1] hover:text-slate-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
          <p className="text-sm text-rose-300">⚠ {error}</p>
        </div>
      )}

      {/* Activity List */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-200">Recent Activity</h2>
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <Activity className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-2/40"
                >
                  <div className={`mt-0.5 ${item.color}`}>
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{item.title}</span>
                      <span className="rounded bg-surface-3/60 px-1.5 py-0.5 text-[10px] text-slate-500">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-600">{timeAgo(item.time)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
