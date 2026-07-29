import React, { useState, useCallback } from 'react';
import { render, Box, Text, useApp, useInput } from 'ink';
import TextInput from 'ink-text-input';

// ─── Status Bar ────
function StatusBar({ taskCount, cost }: { taskCount: number; cost: string }) {
  return (
    <Box borderStyle="single" borderColor="cyan" marginTop={1}>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        <Text bold color="cyan">Agent-X v2.0.0</Text>
        <Text>
          Tasks: <Text bold color="yellow">{taskCount}</Text>
          {'  '}
          Cost: <Text bold color="green">{cost}</Text>
        </Text>
      </Box>
    </Box>
  );
}

// ─── Task List ────
function TaskList() {
  const tasks = [
    { id: '1', status: 'RUNNING', desc: 'LLM Router setup', time: '1m ago' },
    { id: '2', status: 'PENDING', desc: 'Build CLI TUI', time: 'now' },
    { id: '3', status: 'PENDING', desc: 'Web Dashboard MVP', time: 'pending' },
  ];

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold underline>Recent Tasks</Text>
      {tasks.map((t) => (
        <Box key={t.id} flexDirection="row" gap={2}>
          <Text dimColor>[{t.id}]</Text>
          <Text color={t.status === 'RUNNING' ? 'cyan' : 'white'}>{t.status.padEnd(8)}</Text>
          <Text>{t.desc}</Text>
          <Text dimColor>({t.time})</Text>
        </Box>
      ))}
    </Box>
  );
}

// ─── Command Input ────
function CommandBar({ onSubmit }: { onSubmit: (cmd: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <Box borderStyle="single" borderColor="green" marginTop={1}>
      <Text bold color="green"> {'>'} </Text>
      <TextInput
        value={value}
        onChange={setValue}
        onSubmit={(v) => {
          onSubmit(v.trim());
          setValue('');
        }}
        placeholder="Type a command (submit, status, help, exit)..."
      />
    </Box>
  );
}

// ─── Main App ────
export default function AgentXTUI() {
  const { exit } = useApp();

  const handleCommand = useCallback(
    (cmd: string) => {
      if (cmd === 'exit' || cmd === 'quit') {
        exit();
      } else {
        // TODO: wire to actual commands
      }
    },
    [exit],
  );

  useInput(
    useCallback(
      (input, key) => {
        if (key.escape) exit();
      },
      [exit],
    ),
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box borderStyle="double" borderColor="cyanBright" padding={1} marginBottom={1}>
        <Text bold color="cyanBright">
          [ Agent-X Enterprise AI Agent Platform ]
        </Text>
      </Box>

      <StatusBar taskCount={3} cost="$0.02" />
      <TaskList />
      <CommandBar onSubmit={handleCommand} />

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          [ESC: exit TUI] | Commands: submit, status, config, cost, help
        </Text>
      </Box>
    </Box>
  );
}

// ─── Entry point ────
export function launchTUI(): void {
  render(<AgentXTUI />);
}