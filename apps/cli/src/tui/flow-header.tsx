import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';

interface FlowHeaderProps {
  email?: string;
  healthOk: boolean;
}

function nowLabel(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Rounded header box — matches the mock: ┌ Agent-X Platform ● api ── HH:MM ┐ */
export function FlowHeader({ email, healthOk }: FlowHeaderProps): React.ReactNode {
  return (
    <Box
      borderStyle="round"
      borderColor={c(palette.borderPassive)}
      paddingX={1}
      flexDirection="column"
    >
      <Box justifyContent="space-between">
        <Box flexDirection="row" gap={2}>
          <Text bold color={c(palette.accent)}>
            ▓▓ Agent-X Platform
          </Text>
          <Text color={c(healthOk ? palette.ok : palette.danger)}>
            {healthOk ? '● api' : '○ api'}
          </Text>
        </Box>
        <Text dimColor>
          {email ? `${email} · ` : ''}
          {nowLabel()}
        </Text>
      </Box>
    </Box>
  );
}
