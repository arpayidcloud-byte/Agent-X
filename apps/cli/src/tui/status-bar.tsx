import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';
import { Spinner } from './spinner.js';
import { Sparkline } from './sparkline.js';
import { usePulse } from './use-pulse.js';

interface StatusBarProps {
  version: string;
  email?: string;
  taskCount: number;
  cost: number;
  healthStatus: string;
  streaming: boolean;
  provider: string;
  reconnecting?: boolean;
  /** Task-count series across polls — activity sparkline. */
  activity?: number[];
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
  reconnecting = false,
  activity = [],
}: StatusBarProps): React.ReactNode {
  const healthColor = healthStatus === 'ok' ? palette.ok : palette.danger;
  const pulse = usePulse(streaming);
  return (
    <Box justifyContent="space-between">
      <Box flexDirection="row" gap={2}>
        <Text dimColor>v{version}</Text>
        <Text color={c(healthColor)}>{healthStatus === 'ok' ? '●' : '○'} api</Text>
        <Sparkline data={activity} color={palette.accent} />
        <Text dimColor>tasks:{taskCount}</Text>
        <Text dimColor>cost:{formatCost(cost)}</Text>
        {reconnecting && (
          <Text color={c(palette.warn)}>
            <Spinner /> reconnecting…
          </Text>
        )}
        {streaming && (
          <Text color={c(palette.brand)} dimColor={!pulse}>
            <Spinner color={palette.brand} /> streaming…
          </Text>
        )}
      </Box>
      <Box flexDirection="row" gap={2}>
        <Text dimColor>⚡{truncate(provider, 24)}</Text>
        {email ? <Text dimColor>{truncate(email, 28)}</Text> : null}
        <Text dimColor>/help</Text>
      </Box>
    </Box>
  );
}
