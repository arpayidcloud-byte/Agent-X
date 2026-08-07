import React from 'react';
import { Box, Text } from 'ink';
import type { TaskItem } from './types.js';

interface TaskDetailProps {
  task: TaskItem;
}

function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'green';
    case 'RUNNING':
      return 'cyan';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    default:
      return 'white';
  }
}

export function TaskDetail({ task }: TaskDetailProps): React.ReactNode {
  const duration = task.completedAt
    ? `${Math.round((new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()) / 1000)}s`
    : '—';

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ Task Detail
        </Text>
      </Box>

      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              ID:
            </Text>
          </Box>
          <Text>{task.id}</Text>
        </Box>

        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              Status:
            </Text>
          </Box>
          <Text color={statusColor(task.status)} bold>
            {task.status}
          </Text>
        </Box>

        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              Provider:
            </Text>
          </Box>
          <Text>{task.provider ?? '—'}</Text>
        </Box>

        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              Model:
            </Text>
          </Box>
          <Text>{task.model ?? '—'}</Text>
        </Box>

        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              Duration:
            </Text>
          </Box>
          <Text>{duration}</Text>
        </Box>

        <Box flexDirection="row" gap={2}>
          <Box width={16}>
            <Text bold color="cyan">
              Created:
            </Text>
          </Box>
          <Text dimColor>{new Date(task.createdAt).toLocaleString()}</Text>
        </Box>

        {task.completedAt && (
          <Box flexDirection="row" gap={2}>
            <Box width={16}>
              <Text bold color="cyan">
                Completed:
              </Text>
            </Box>
            <Text dimColor>{new Date(task.completedAt).toLocaleString()}</Text>
          </Box>
        )}
      </Box>

      {/* Prompt */}
      <Box flexDirection="column" marginTop={1}>
        <Text bold underline>
          Prompt
        </Text>
        <Text wrap="wrap">{task.prompt ?? task.description ?? '—'}</Text>
      </Box>

      {/* Response */}
      {task.response && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold underline color="green">
            Response
          </Text>
          <Text wrap="wrap">{task.response}</Text>
        </Box>
      )}

      {/* Error */}
      {task.error && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold underline color="red">
            Error
          </Text>
          <Text color="red" wrap="wrap">
            {task.error}
          </Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>[Esc] back to task list</Text>
      </Box>
    </Box>
  );
}
