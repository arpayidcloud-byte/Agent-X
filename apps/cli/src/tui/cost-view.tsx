import React from 'react';
import { Box, Text } from 'ink';
import type { CostSummary } from './types.js';

interface CostViewProps {
  cost: CostSummary | null;
  loading: boolean;
}

function formatCost(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return `$${amount.toFixed(6)}`;
  if (amount < 1) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}

function barChart(value: number, max: number, width = 20): string {
  if (max === 0) return '';
  const filled = Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

export function CostView({ cost, loading }: CostViewProps): React.ReactNode {
  const byProvider = cost?.byProvider ?? {};
  const byModel = cost?.byModel ?? {};
  const providerEntries = Object.entries(byProvider).sort((a, b) => b[1] - a[1]);
  const modelEntries = Object.entries(byModel).sort((a, b) => b[1] - a[1]);
  const maxProvider = Math.max(...providerEntries.map((e) => e[1]), 0.0001);
  const maxModel = Math.max(...modelEntries.map((e) => e[1]), 0.0001);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ Cost Analysis
        </Text>
        {loading && <Text dimColor> refreshing...</Text>}
      </Box>

      {/* Total */}
      <Box marginBottom={1}>
        <Text>Total Cost: </Text>
        <Text bold color="green">
          {formatCost(cost?.totalCost ?? 0)}
        </Text>
      </Box>

      {/* By Provider */}
      {providerEntries.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold underline>
            By Provider
          </Text>
          {providerEntries.map(([name, amount]) => (
            <Box key={name} flexDirection="row" gap={1}>
              <Text>{name.padEnd(20)}</Text>
              <Text color="cyan">{barChart(amount, maxProvider)}</Text>
              <Text bold color="green">
                {formatCost(amount)}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      {/* By Model */}
      {modelEntries.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold underline>
            By Model
          </Text>
          {modelEntries.slice(0, 10).map(([name, amount]) => (
            <Box key={name} flexDirection="row" gap={1}>
              <Text>{name.slice(0, 25).padEnd(27)}</Text>
              <Text color="yellow">{barChart(amount, maxModel, 15)}</Text>
              <Text bold>{formatCost(amount)}</Text>
            </Box>
          ))}
          {modelEntries.length > 10 && (
            <Text dimColor> ...and {modelEntries.length - 10} more</Text>
          )}
        </Box>
      )}

      {/* Empty state */}
      {providerEntries.length === 0 && modelEntries.length === 0 && (
        <Text dimColor> No cost data yet — run some tasks first</Text>
      )}

      <Box marginTop={1}>
        <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
      </Box>
    </Box>
  );
}
