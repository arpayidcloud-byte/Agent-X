#!/bin/bash
PACKAGES=("core-runtime" "provider-sdk" "tool-sdk" "agent-platform" "workflow-engine" "memory-engine" "plugin-sdk" "secrets" "auth" "shared")
for pkg in "${PACKAGES[@]}"; do
  mkdir -p /root/agentx/packages/$pkg/src
  
  cat << PKG_EOF > /root/agentx/packages/$pkg/package.json
{
  "name": "@agentx/$pkg",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc --build",
    "typecheck": "turbo run typecheck",
    "test": "vitest run",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "vitest": "1.6.0"
  },
  "dependencies": {}
}
PKG_EOF

  cat << TS_EOF > /root/agentx/packages/$pkg/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
  "references": [
    { "path": "../shared-config" }
  ]
}
TS_EOF

  echo "export const dummy_$pkg = true;" > /root/agentx/packages/$pkg/src/index.ts
done

mkdir -p /root/agentx/apps/cli/src
cat << PKG_EOF > /root/agentx/apps/cli/package.json
{
  "name": "@agentx/cli",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "bin": {
    "agentx": "./dist/index.js"
  },
  "scripts": {
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "test": "vitest run",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "vitest": "1.6.0"
  },
  "dependencies": {}
}
PKG_EOF

cat << TS_EOF > /root/agentx/apps/cli/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
  "references": [
    { "path": "../../packages/shared-config" }
  ]
}
TS_EOF

echo "console.log('agentx cli');" > /root/agentx/apps/cli/src/index.ts
