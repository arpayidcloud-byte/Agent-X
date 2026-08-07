import React from 'react';
import { Box, Text } from 'ink';

export function HelpPanel(): React.ReactNode {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ Help — Keyboard Shortcuts & Commands
        </Text>
      </Box>

      <Box flexDirection="column" gap={1}>
        <Text bold underline>
          Navigation
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            1-5
          </Text>{' '}
          Switch panels (Dashboard/Tasks/Providers/Cost/Settings)
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Tab
          </Text>{' '}
          Cycle panels forward
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Shift+Tab
          </Text>{' '}
          Cycle panels backward
        </Text>

        <Text bold underline>
          Task Panel
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            ↑/↓
          </Text>{' '}
          Navigate task list
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Enter
          </Text>{' '}
          Open task detail
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            S
          </Text>{' '}
          Submit new task
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Esc
          </Text>{' '}
          Back to list / exit
        </Text>

        <Text bold underline>
          Global
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            R
          </Text>{' '}
          Refresh all data
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Q
          </Text>{' '}
          Quit TUI
        </Text>
        <Text>
          {' '}
          <Text bold color="cyan">
            Esc
          </Text>{' '}
          Quit (from dashboard)
        </Text>

        <Text bold underline>
          Commands (type in command bar)
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            dashboard
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            d
          </Text>{' '}
          Go to dashboard
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            tasks
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            t
          </Text>{' '}
          Go to task list
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            providers
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            p
          </Text>{' '}
          Go to provider list
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            cost
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            c
          </Text>{' '}
          Go to cost analysis
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            submit
          </Text>{' '}
          Submit a new task
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            refresh
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            r
          </Text>{' '}
          Refresh data
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            logout
          </Text>{' '}
          Sign out
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            exit
          </Text>{' '}
          /{' '}
          <Text bold color="green">
            q
          </Text>{' '}
          Quit TUI
        </Text>
        <Text>
          {' '}
          <Text bold color="green">
            help
          </Text>{' '}
          Show this help
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>[Esc] back to previous panel</Text>
      </Box>
    </Box>
  );
}
