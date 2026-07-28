import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@agentx/core-runtime': path.resolve(root, 'packages/shared/core-runtime/src/index.ts'),
      '@agentx/tool-sdk': path.resolve(root, 'packages/shared/tool-sdk/src/index.ts'),
      '@agentx/security': path.resolve(root, 'packages/shared/security/src/index.ts'),
      '@agentx/telemetry': path.resolve(root, 'packages/shared/telemetry/src/index.ts'),
      '@agentx/observability': path.resolve(root, 'packages/shared/observability/src/index.ts'),
      '@agentx/shared': path.resolve(root, 'packages/shared/shared/src/index.ts'),
      '@agentx/provider-sdk': path.resolve(root, 'packages/provider/provider-sdk/src/index.ts'),
      '@agentx/agent-platform': path.resolve(root, 'packages/agent/agent-platform/src/index.ts'),
    },
  },
  test: {
    include: ['specs/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 10000,
  },
});
