import React from 'react';
import { Box, Text } from 'ink';
import type { TaskItem } from './types.js';
import { c, palette, statusColor, statusBadge } from './theme.js';
import { AgentAvatar } from './agent-avatar.js';
import { usePulse } from './use-pulse.js';

interface TaskListProps {
  tasks: TaskItem[];
  selectedId: string | null;
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function TaskList({ tasks, selectedId, loading }: TaskListProps): React.ReactNode {
  const running = tasks.some((t) => t.status === 'running');
  const pulse = usePulse(running);
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={c(palette.accent)}>
          ◆ Tasks
        </Text>
        <Text dimColor> ({tasks.length})</Text>
        {loading && <Text dimColor> refreshing...</Text>}
        {running && (
          <Text color={c(palette.warn)} dimColor={!pulse}>
            {' '}
            ▸ {tasks.filter((t) => t.status === 'running').length} running
          </Text>
        )}
      </Box>

      {/* Header */}
      <Box flexDirection="row" gap={1}>
        <Text bold dimColor>
          {'AGENT'.padEnd(8)}
        </Text>
        <Text bold dimColor>
          {'  ID'.padEnd(16)}
        </Text>
        <Text bold dimColor>
          {'STATUS'.padEnd(12)}
        </Text>
        <Text bold dimColor>
          {'PROVIDER'.padEnd(16)}
        </Text>
        <Text bold dimColor>
          {'DESCRIPTION'.padEnd(36)}
        </Text>
        <Text bold dimColor>
          TIME
        </Text>
      </Box>
      <Text dimColor>{'─'.repeat(100)}</Text>

      {tasks.length === 0 ? (
        <Text dimColor> No tasks yet — type "submit" to create one</Text>
      ) : (
        tasks.map((t) => {
          const isSelected = t.id === selectedId;
          return (
            <Box
              key={t.id}
              flexDirection="row"
              gap={1}
              backgroundColor={isSelected ? 'blue' : undefined}
            >
              <Text color={isSelected ? 'white' : 'dimColor'}>{isSelected ? '▸' : ' '}</Text>
              <AgentAvatar name={t.model ?? t.provider} dim={!isSelected} />
              <Text color={statusColor(t.status)} bold={isSelected}>
                {statusBadge(t.status)} {t.id.slice(0, 12).padEnd(13)}
              </Text>
              <Text color={statusColor(t.status)} bold={isSelected}>
                {t.status.padEnd(12)}
              </Text>
              <Text color={isSelected ? 'white' : 'dimColor'}>
                {(t.provider ?? '—').padEnd(16)}
              </Text>
              <Text color={isSelected ? 'white' : undefined}>
                {(t.description ?? t.prompt ?? '').slice(0, 35)}
              </Text>
              <Text dimColor>{timeAgo(t.createdAt)}</Text>
            </Box>
          );
        })
      )}

      <Box marginTop={1}>
        <Text dimColor>[↑↓] select [Enter] detail [S]ubmit new [R]efresh [Esc] back</Text>
      </Box>
    </Box>
  );
}
