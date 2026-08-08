import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';

interface FlowHeaderProps {
  email?: string;
  healthOk: boolean;
}

/** Clock: HH:MM, updated each render (parent polls every 15s). */
function nowLabel(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function FlowHeader({ email, healthOk }: FlowHeaderProps): React.ReactNode {
  return (
    <Box flexDirection="column">
      <Box justifyContent="space-between">
        <Box flexDirection="row" gap={2}>
          <Text bold color={c(palette.accent)}>
            ▓▓ Agent-X Platform
          </Text>
          <Text dimColor>· Enterprise AI</Text>
          <Text color={c(healthOk ? palette.ok : palette.danger)}>
            {healthOk ? '● api' : '○ api'}
          </Text>
        </Box>
        <Text dimColor>
          {email ? `${email} · ` : ''}
          {nowLabel()}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>{'─'.repeat(48)}</Text>
      </Box>
    </Box>
  );
}
