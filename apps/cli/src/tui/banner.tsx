import React from 'react';
import { Box, Text } from 'ink';

export function Banner(): React.ReactNode {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="cyanBright">
        {'  ╔════════════════════════════════════════════════════════╗'}
      </Text>
      <Text bold color="cyanBright">
        {'  ║'}
        <Text bold color="white">
          {'  ⚡ AgentX Enterprise AI Agent Platform — CLI TUI  '}
        </Text>
        {'║'}
      </Text>
      <Text bold color="cyanBright">
        {'  ╚════════════════════════════════════════════════════════╝'}
      </Text>
    </Box>
  );
}
