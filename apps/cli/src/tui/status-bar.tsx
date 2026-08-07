import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  version: string;
  authenticated: boolean;
  email?: string;
  taskCount: number;
  cost: string;
  healthStatus: string;
}

export function StatusBar({
  version,
  authenticated,
  email,
  taskCount,
  cost,
  healthStatus,
}: StatusBarProps): React.ReactNode {
  const healthColor = healthStatus === 'ok' ? 'green' : 'red';

  return (
    <Box
      borderStyle="single"
      borderColor={authenticated ? 'cyan' : 'gray'}
      paddingLeft={1}
      paddingRight={1}
      justifyContent="space-between"
    >
      <Box flexDirection="row" gap={2}>
        <Text bold color="cyan">
          AgentX v{version}
        </Text>
        <Text dimColor>|</Text>
        <Text color={healthColor}>{healthStatus === 'ok' ? '●' : '○'} API</Text>
      </Box>
      <Box flexDirection="row" gap={2}>
        {authenticated && email ? (
          <Text dimColor>{email}</Text>
        ) : (
          <Text dimColor>not logged in</Text>
        )}
        <Text dimColor>|</Text>
        <Text>
          Tasks:{' '}
          <Text bold color="yellow">
            {taskCount}
          </Text>
        </Text>
        <Text dimColor>|</Text>
        <Text>
          Cost:{' '}
          <Text bold color="green">
            {cost}
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
