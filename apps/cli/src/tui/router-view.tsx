/**
 * RouterView — visual task-type → model routing map (Command Deck v2 §6).
 *
 * Renders a simple box diagram: TASK TYPES → [auto router] → active providers
 * with their models. Data comes from the real /v1/agentx/providers fetch.
 */
import React from 'react';
import { Box, Text } from 'ink';
import type { ProviderInfo } from './types.js';
import { c, palette } from './theme.js';
import { AgentAvatar } from './agent-avatar.js';

const TASK_TYPES = ['reasoning', 'coding', 'agentic', 'summarization'];

interface RouterViewProps {
  providers: ProviderInfo[];
  loading: boolean;
}

export function RouterView({ providers, loading }: RouterViewProps): React.ReactNode {
  const active = providers.filter((p) => p.isActive);
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color={c(palette.accent)}>
          ◆ Model Router
        </Text>
        <Text dimColor> — task type → model map</Text>
      </Box>

      {/* Task types → router */}
      <Box flexDirection="row" gap={1} marginBottom={1}>
        {TASK_TYPES.map((t) => (
          <Box key={t} borderStyle="round" borderColor={c(palette.borderPassive)} paddingX={1}>
            <Text dimColor>{t}</Text>
          </Box>
        ))}
        <Text dimColor>→</Text>
        <Box borderStyle="round" borderColor={c(palette.brand)} paddingX={1}>
          <Text bold color={c(palette.brand)}>
            ⚡ router · auto
          </Text>
        </Box>
      </Box>

      <Text dimColor>{'─'.repeat(70)}</Text>

      {/* Providers */}
      {loading ? (
        <Text dimColor> memuat provider…</Text>
      ) : active.length === 0 ? (
        <Text dimColor> tidak ada provider aktif — kelola di panel.id-tech.cloud</Text>
      ) : (
        active.map((p) => (
          <Box
            key={p.id}
            flexDirection="column"
            marginBottom={1}
            borderStyle="round"
            borderColor={c(palette.borderPassive)}
            paddingX={1}
          >
            <Box flexDirection="row" gap={1}>
              <AgentAvatar name={p.name} />
              <Text bold>{p.displayName ?? p.name}</Text>
              <Text color={c(palette.ok)}>● active</Text>
            </Box>
            <Box marginTop={1} flexDirection="row" gap={1}>
              {p.models.map((m) => (
                <Text key={m} color={c(palette.accent)}>
                  {m}
                </Text>
              ))}
            </Box>
          </Box>
        ))
      )}

      <Box marginTop={1}>
        <Text dimColor>[esc] kembali · provider diatur di panel.id-tech.cloud</Text>
      </Box>
    </Box>
  );
}
