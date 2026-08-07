import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { isCloudAuthed } from '../lib/cloud-api.js';
import { cloudFetch } from '../lib/cloud-api.js';

interface SubmitPanelProps {
  onSubmit: (result: { taskId: string; message?: string; provider?: string }) => void;
  onCancel: () => void;
}

export function SubmitPanel({ onSubmit, onCancel }: SubmitPanelProps): React.ReactNode {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const role = 'coder';

  useInput((_input, key) => {
    if (key.escape) onCancel();
  });

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const taskId = `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const res = await cloudFetch<{
        message?: string;
        provider?: string;
        model?: string;
      }>('/v1/agentx/run', {
        method: 'POST',
        body: {
          prompt: value.trim(),
          taskId,
          description: value.trim().slice(0, 120),
          complexity: 'medium',
          type: 'reasoning',
          budget: 'medium',
          role,
        },
      });
      onSubmit({
        taskId,
        message: res.message,
        provider: res.provider,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  if (!isCloudAuthed()) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="red">
          Login required to submit tasks
        </Text>
        <Text dimColor>Run "agentx login" first, then restart TUI</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ Submit Task
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red"> ✗ {error}</Text>
        </Box>
      )}

      {loading ? (
        <Box flexDirection="column">
          <Text color="cyan"> Submitting task to cloud...</Text>
          <Text dimColor> Provider will be auto-selected based on routing</Text>
        </Box>
      ) : (
        <Box flexDirection="column" gap={1}>
          <Box flexDirection="row">
            <Text bold color="cyan">
              {' '}
              Goal:{' '}
            </Text>
            <TextInput
              value={goal}
              onChange={setGoal}
              onSubmit={handleSubmit}
              placeholder="Describe what you want the AI agent to do..."
            />
          </Box>
          <Box flexDirection="row">
            <Text bold color="cyan">
              {' '}
              Role:{' '}
            </Text>
            <Text dimColor>{role}</Text>
            <Text dimColor> (auto-selected by router)</Text>
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>{loading ? '  Processing...' : '  [Enter] submit  [Esc] cancel'}</Text>
      </Box>
    </Box>
  );
}
