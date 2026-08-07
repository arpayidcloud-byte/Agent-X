import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  version: string;
  email?: string;
  taskCount: number;
  cost: number;
  healthStatus: string;
  streaming: boolean;
  provider: string;
}

function formatCost(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  if (amount < 1) return `$${amount.toFixed(3)}`;
  return `$${amount.toFixed(2)}`;
}

/** Truncate with ellipsis on narrow terminals (Antigravity statusline behavior). */
function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function StatusBar({
  version,
  email,
  taskCount,
  cost,
  healthStatus,
  streaming,
  provider,
}: StatusBarProps): React.ReactNode {
  const healthColor = healthStatus === 'ok' ? 'green' : 'red';
  return (
    <Box justifyContent="space-between">
      <Box flexDirection="row" gap={2}>
        <Text dimColor>v{version}</Text>
        <Text color={healthColor}>{healthStatus === 'ok' ? '●' : '○'} api</Text>
        <Text dimColor>tasks:{taskCount}</Text>
        <Text dimColor>cost:{formatCost(cost)}</Text>
        {streaming && <Text color="cyan">streaming…</Text>}
      </Box>
      <Box flexDirection="row" gap={2}>
        <Text dimColor>⚡{truncate(provider, 24)}</Text>
        {email ? <Text dimColor>{truncate(email, 28)}</Text> : null}
        <Text dimColor>/help</Text>
      </Box>
    </Box>
  );
}
