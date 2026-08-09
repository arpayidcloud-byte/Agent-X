import React from 'react';
import { Box, Text } from 'ink';
import { c, palette } from './theme.js';
import type { DeckData } from './types.js';
import { Sparkline } from './sparkline.js';

interface DashOverlayProps {
  deck: DeckData | null;
  loading: boolean;
  version: string;
  email?: string;
  onClose: () => void;
}

export function DashOverlay({ deck, email, onClose: _onClose }: DashOverlayProps): React.ReactNode {
  if (!deck) {
    return (
      <Box
        flexDirection="column"
        paddingX={1}
        paddingY={1}
        borderStyle="round"
        borderColor={c(palette.dim)}
      >
        <Text dimColor>memuat dashboard…</Text>
      </Box>
    );
  }
  const { system, agents, task, logs, stats } = deck;
  return (
    <Box
      flexDirection="column"
      paddingX={1}
      paddingY={1}
      borderStyle="round"
      borderColor={c(palette.accent)}
      flexGrow={1}
    >
      <Box justifyContent="space-between">
        <Text bold color={c(palette.accent)}>
          ◆ DASH · Agent-X Platform
        </Text>
        <Text dimColor>
          {email ?? ''} · {system.cpu}% cpu · {system.memUsedGb.toFixed(1)}/
          {system.memTotalGb.toFixed(1)}GB · Esc close
        </Text>
      </Box>
      <Text dimColor>{'─'.repeat(46)}</Text>
      <Box flexDirection="row" gap={1} marginTop={1}>
        <Box
          flexDirection="column"
          flexGrow={1}
          borderStyle="round"
          borderColor={c(palette.borderPassive)}
          paddingX={1}
          paddingY={1}
        >
          <Text bold color={c(palette.accentBright)}>
            › AGENTS {agents.length ? `· ${agents.length}` : ''}
          </Text>
          <Text dimColor>{'─'.repeat(16)}</Text>
          {agents.length ? (
            agents.slice(0, 6).map((a, i) => (
              <Text key={i} dimColor>
                {a.name} · {a.status}
              </Text>
            ))
          ) : (
            <Text dimColor>idle · no active agents</Text>
          )}
          <Box marginTop={1}>
            <Sparkline
              data={[
                stats.totalTasks % 5,
                stats.totalTokens % 7,
                stats.totalTasks % 3,
                1,
                stats.totalTasks % 4,
              ]}
              color={palette.accent}
            />
          </Box>
        </Box>
        <Box
          flexDirection="column"
          flexGrow={1}
          borderStyle="round"
          borderColor={c(palette.borderPassive)}
          paddingX={1}
          paddingY={1}
        >
          <Text bold color={c(palette.accentBright)}>
            › TASK {task ? `· ${task.status}` : ''}
          </Text>
          <Text dimColor>{'─'.repeat(16)}</Text>
          {task ? (
            <>
              <Text>{task.description.slice(0, 44)}</Text>
              <Text dimColor>id {task.id}</Text>
              <Text dimColor>
                {'▓'.repeat(Math.round(task.progress / 12.5)) +
                  '░'.repeat(8 - Math.round(task.progress / 12.5)) +
                  ` ${task.progress}%`}
              </Text>
            </>
          ) : (
            <Text dimColor>no active task · /submit &lt;goal&gt;</Text>
          )}
        </Box>
        <Box
          flexDirection="column"
          flexGrow={1}
          borderStyle="round"
          borderColor={c(palette.borderPassive)}
          paddingX={1}
          paddingY={1}
        >
          <Text bold color={c(palette.accentBright)}>
            › LOGS
          </Text>
          <Text dimColor>{'─'.repeat(16)}</Text>
          {logs.length ? (
            logs.slice(0, 6).map((l, i) => (
              <Text key={i} dimColor>
                {l.message.slice(0, 40)}
              </Text>
            ))
          ) : (
            <Text dimColor>no logs yet</Text>
          )}
        </Box>
      </Box>
      <Text dimColor>{'─'.repeat(46)}</Text>
      <Box justifyContent="space-between">
        <Text dimColor>Tab toggle · /help · q quit</Text>
        <Text dimColor>Neon Zen Dash · Warp blocks + Enterprise stats</Text>
      </Box>
    </Box>
  );
}
