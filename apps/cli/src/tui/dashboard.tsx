import React from 'react';
import { Box, Text } from 'ink';
import type {
  HealthResponse,
  StatsResponse,
  TaskItem,
  CostSummary,
  ProviderInfo,
} from './types.js';

interface DashboardProps {
  health: HealthResponse | null;
  stats: StatsResponse | null;
  recentTasks: TaskItem[];
  cost: CostSummary | null;
  providers: ProviderInfo[];
  loading: boolean;
}

function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'green';
    case 'RUNNING':
      return 'cyan';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    default:
      return 'white';
  }
}

function statusIcon(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return '✓';
    case 'RUNNING':
      return '●';
    case 'PENDING':
      return '○';
    case 'FAILED':
      return '✗';
    default:
      return '?';
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

export function Dashboard({
  health,
  stats,
  recentTasks,
  cost,
  providers,
  loading,
}: DashboardProps): React.ReactNode {
  const activeProviders = providers.filter((p) => p.isActive).length;

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ Dashboard
        </Text>
      </Box>

      {loading && (
        <Box>
          <Text dimColor> Loading data...</Text>
        </Box>
      )}

      {/* Health + Stats Row */}
      <Box flexDirection="row" gap={3} marginBottom={1}>
        {/* System Status */}
        <Box
          borderStyle="round"
          borderColor={health?.status === 'ok' ? 'green' : 'red'}
          width={30}
          flexDirection="column"
          paddingX={1}
        >
          <Text bold>System</Text>
          <Box flexDirection="row" gap={1}>
            <Text color={health?.status === 'ok' ? 'green' : 'red'}>
              {health?.status === 'ok' ? '●' : '○'}
            </Text>
            <Text>{health?.status === 'ok' ? 'Online' : 'Offline'}</Text>
          </Box>
          {health?.version && <Text dimColor>v{health.version}</Text>}
        </Box>

        {/* Task Stats */}
        <Box borderStyle="round" borderColor="cyan" width={30} flexDirection="column" paddingX={1}>
          <Text bold>Tasks</Text>
          <Text>
            Total:{' '}
            <Text bold color="white">
              {stats?.totalTasks ?? 0}
            </Text>
          </Text>
          <Text>
            Active:{' '}
            <Text bold color="cyan">
              {stats?.activeTasks ?? 0}
            </Text>
          </Text>
          <Text>
            Done:{' '}
            <Text bold color="green">
              {stats?.completedTasks ?? 0}
            </Text>
          </Text>
        </Box>

        {/* Cost */}
        <Box borderStyle="round" borderColor="green" width={30} flexDirection="column" paddingX={1}>
          <Text bold>Cost</Text>
          <Text>
            Total:{' '}
            <Text bold color="green">
              {formatCost(cost?.totalCost ?? 0)}
            </Text>
          </Text>
          <Text>
            Providers:{' '}
            <Text bold color="yellow">
              {activeProviders}
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Recent Tasks */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold underline>
          Recent Tasks
        </Text>
        {recentTasks.length === 0 ? (
          <Text dimColor> No tasks yet — use "submit" to create one</Text>
        ) : (
          recentTasks.slice(0, 8).map((t) => (
            <Box key={t.id} flexDirection="row" gap={1}>
              <Text color={statusColor(t.status)}>{statusIcon(t.status)}</Text>
              <Text dimColor>{t.id.slice(0, 12).padEnd(14)}</Text>
              <Text color={statusColor(t.status)}>{t.status.padEnd(10)}</Text>
              <Text>{(t.description ?? t.prompt ?? '').slice(0, 40)}</Text>
              <Text dimColor>{timeAgo(t.createdAt)}</Text>
            </Box>
          ))
        )}
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          [1] Dashboard [2] Tasks [3] Providers [4] Cost [5] Settings | [R]efresh [S]ubmit [Q]uit
        </Text>
      </Box>
    </Box>
  );
}
