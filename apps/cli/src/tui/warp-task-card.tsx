import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';

interface TaskCardProps {
  id: string;
  description: string;
  progress: number | null;
  status: string;
  fileHint?: string | null;
  agents?: string[];
  providerHint?: string | null;
  tokens?: { in?: number; out?: number } | null;
}

function bar(pct: number): { filled: string; empty: string; color: string } {
  const n = Math.max(0, Math.min(100, pct));
  const filled = Math.round(n / 5);
  return {
    filled: '▓'.repeat(filled),
    empty: '░'.repeat(20 - filled),
    color: n >= 75 ? palette.ok : n >= 35 ? palette.warn : palette.accent,
  };
}

export function WarpTaskCard({
  id,
  description,
  progress,
  status,
  fileHint,
  agents,
  providerHint,
  tokens,
}: TaskCardProps): React.ReactNode {
  const pct = progress ?? (status === 'complete' || status === 'completed' ? 100 : 0);
  const b = bar(pct);
  const isLive = status === 'running' || status === 'pending' || status === 'generating';
  const badge = isLive ? '●' : status === 'complete' || status === 'completed' ? '✓' : '○';
  const short = id.length > 8 ? `#${id.slice(0, 6)}` : `#${id}`;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={c(isLive ? palette.accent : palette.borderPassive)}
      paddingX={1}
      paddingY={1}
    >
      {/* Title row inside the card — task id + status badge */}
      <Box justifyContent="space-between">
        <Text bold color={c(palette.brand)}>
          {badge} {description || short}
        </Text>
        <Text dimColor>
          {short} · {isLive ? `${pct}%` : status}
        </Text>
      </Box>
      {/* Progress */}
      <Box marginTop={1}>
        <Text color={c(b.color)}>{b.filled}</Text>
        <Text dimColor>{b.empty}</Text>
        <Text dimColor> eta sec</Text>
        {tokens?.out != null || tokens?.in != null ? (
          <Text dimColor>
            {' '}
            {tokens?.in ?? 0} → {tokens?.out ?? 0}
          </Text>
        ) : null}
      </Box>
      {fileHint ? (
        <Box marginTop={1}>
          <Text dimColor>› {fileHint}</Text>
        </Box>
      ) : null}
      {agents && agents.length ? (
        <Box marginTop={1} gap={1}>
          {agents.slice(0, 4).map((a) => (
            <Text key={a} dimColor>
              ● {a}
            </Text>
          ))}
        </Box>
      ) : null}
      {providerHint ? (
        <Box marginTop={1}>
          <Text dimColor>⚡ {providerHint}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
