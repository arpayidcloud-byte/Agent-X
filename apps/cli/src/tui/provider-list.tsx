import React from 'react';
import { Box, Text } from 'ink';
import type { ProviderInfo } from './types.js';

interface ProviderListProps {
  providers: ProviderInfo[];
  loading: boolean;
}

export function ProviderList({ providers, loading }: ProviderListProps): React.ReactNode {
  const active = providers.filter((p) => p.isActive);
  const inactive = providers.filter((p) => !p.isActive);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyanBright">
          ◆ LLM Providers
        </Text>
        <Text dimColor>
          {' '}
          ({active.length} active / {providers.length} total)
        </Text>
        {loading && <Text dimColor> refreshing...</Text>}
      </Box>

      {providers.length === 0 ? (
        <Text dimColor> No providers configured — add via Admin Panel</Text>
      ) : (
        <>
          {/* Active Providers */}
          {active.length > 0 && (
            <Box flexDirection="column" gap={1}>
              <Text bold color="green" underline>
                Active
              </Text>
              {active.map((p) => (
                <Box key={p.id} flexDirection="column">
                  <Box flexDirection="row" gap={2}>
                    <Text color="green">●</Text>
                    <Text bold>{p.displayName ?? p.name}</Text>
                    <Text dimColor>({p.models.length} models)</Text>
                  </Box>
                  <Box paddingLeft={3}>
                    <Text dimColor>{p.models.join(', ')}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Inactive Providers */}
          {inactive.length > 0 && (
            <Box flexDirection="column" gap={1} marginTop={1}>
              <Text bold color="red" underline>
                Inactive
              </Text>
              {inactive.map((p) => (
                <Box key={p.id} flexDirection="row" gap={2}>
                  <Text color="red">○</Text>
                  <Text dimColor>{p.displayName ?? p.name}</Text>
                  <Text dimColor>({p.models.length} models)</Text>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      <Box marginTop={1}>
        <Text dimColor>[1] Dashboard [2] Tasks [3] Providers [4] Cost</Text>
      </Box>
    </Box>
  );
}
