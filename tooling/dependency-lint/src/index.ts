#!/usr/bin/env node

/**
 * Cross-Volume dependency lint.
 *
 * Enforces the rule from Volume 1 Ch. 3:
 * "Lower-numbered volumes must never depend on higher-numbered ones."
 *
 * Each package is mapped to a volume number. The script scans all .ts source
 * files for `from '@agentx-fast/...'` imports and checks that no package imports
 * from a higher-numbered volume.
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '../../..');

// Map package directory prefix → volume number
// Based on handbook Volumes 1-16 and RFCs 0043-0048
const PACKAGE_VOLUME_MAP: Record<string, number> = {
  // Vol 1 — Foundation
  'packages/shared/shared': 1,

  // Vol 2 — Core Runtime
  'packages/shared/core-runtime': 2,
  'packages/planning/planning-engine': 2,
  'packages/planning/goal-intelligence': 2,
  'packages/reasoning/reasoning-algorithms': 2,
  'packages/reasoning/reasoning-framework': 2,

  // Vol 3 — Agent Platform
  'packages/agent/agent-platform': 3,
  'packages/agent/multi-agent-collaboration': 3,
  'packages/agent/multi-agent-reasoning': 3,

  // Vol 4 — Provider Platform
  'packages/provider/provider-sdk': 4,
  'packages/provider/provider-qualification': 4,
  'packages/provider/native-providers': 4,
  'packages/provider/provider-release': 4,
  'packages/provider/vendor-certification': 4,

  // Vol 5 — Workflow Engine
  'packages/workflow/workflow-engine': 5,
  'packages/workflow/workflow-orchestration': 5,
  'packages/workflow/workflow-hardening': 5,

  // Vol 6 — Memory Engine
  'packages/shared/memory-engine': 6,
  'packages/shared/context-engine': 6,
  'packages/shared/knowledge-engine': 6,

  // Vol 7 — Tool SDK
  'packages/shared/tool-sdk': 7,

  // Vol 8 — Plugin Platform
  'packages/plugin-sdk': 8,

  // Vol 9 — CLI Platform
  'apps/cli': 9,

  // Vol 10 — Enterprise
  'packages/runtime/enterprise-runtime': 10,
  'packages/platform/developer-platform': 10,

  // Vol 11 — Cloud
  'packages/distributed/distributed-cognition': 11,

  // Vol 13 — Observability
  'packages/runtime/runtime-production': 13,

  // Vol 14 — Testing & QA
  'packages/quality/architecture-sdk': 14,
  'packages/quality/production-quality': 14,

  // Vol 16 — Secrets & Key Management
  'packages/shared/secrets': 16,

  // Cross-cutting / infrastructure (assigned to their closest volume)
  'packages/runtime/runtime': 2,
  'packages/runtime/runtime-adapters': 2,
  'packages/cognitive/cognitive-contracts': 2,
  'packages/cognitive/cognitive-kernel': 2,
  'packages/cognitive/cognitive-learning': 2,
  'packages/cognitive/autonomous-cognition': 2,

  // Tooling (not subject to volume rules)
  'tooling/eslint-plugin-internal': 0,
  'tooling/handbook-lint': 0,
  'tooling/dependency-lint': 0,
};

function getVolumeForPackage(pkgDir: string): number | null {
  // Normalize path relative to repo root
  const rel = path.relative(REPO_ROOT, pkgDir).replace(/\\/g, '/');
  const volume = PACKAGE_VOLUME_MAP[rel];
  if (volume !== undefined) return volume;

  // Fallback: try matching by prefix
  for (const [prefix, vol] of Object.entries(PACKAGE_VOLUME_MAP)) {
    if (rel.startsWith(prefix)) return vol;
  }
  return null;
}

function getVolumeForImport(importPath: string): number | null {
  // @agentx/shared → check sub-path
  const pkgName = importPath.replace('@agentx/', '');

  const VOLUME_BY_IMPORT: Record<string, number> = {
    shared: 1,
    'core-runtime': 2,
    'planning-engine': 2,
    'goal-intelligence': 2,
    'reasoning-algorithms': 2,
    'reasoning-framework': 2,
    'agent-platform': 3,
    'multi-agent-collaboration': 3,
    'multi-agent-reasoning': 3,
    'provider-sdk': 4,
    'provider-qualification': 4,
    'native-providers': 4,
    'provider-release': 4,
    'vendor-certification': 4,
    'workflow-engine': 5,
    'workflow-orchestration': 5,
    'workflow-hardening': 5,
    'memory-engine': 6,
    'context-engine': 6,
    'knowledge-engine': 6,
    'tool-sdk': 7,
    'plugin-sdk': 8,
    secrets: 16,
    'enterprise-runtime': 10,
    'developer-platform': 10,
    'distributed-cognition': 11,
    'runtime-production': 13,
    'architecture-sdk': 14,
    'production-quality': 14,
    runtime: 2,
    'runtime-adapters': 2,
    'cognitive-contracts': 2,
    'cognitive-kernel': 2,
    'cognitive-learning': 2,
    'autonomous-cognition': 2,
  };

  return VOLUME_BY_IMPORT[pkgName] ?? null;
}

function findSourceFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...findSourceFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      files.push(full);
    }
  }
  return files;
}

function extractImports(file: string): string[] {
  const content = fs.readFileSync(file, 'utf-8');
  const imports: string[] = [];
  const regex = /from\s+['"](@agentx\/[^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      imports.push(match[1]);
    }
  }
  return imports;
}

function main(): void {
  const packagesDir = path.join(REPO_ROOT, 'packages');
  const appsDir = path.join(REPO_ROOT, 'apps');
  const errors: string[] = [];

  const dirs = [
    ...fs
      .readdirSync(packagesDir)
      .map((d) => {
        const sub = path.join(packagesDir, d);
        if (fs.statSync(sub).isDirectory()) {
          return fs
            .readdirSync(sub)
            .map((s) => path.join(sub, s))
            .filter(
              (s) => fs.statSync(s).isDirectory() && fs.existsSync(path.join(s, 'package.json')),
            );
        }
        return [];
      })
      .flat(),
    ...fs
      .readdirSync(appsDir)
      .map((d) => path.join(appsDir, d))
      .filter((d) => fs.statSync(d).isDirectory()),
  ];

  // Also include top-level packages dirs
  const topLevelPkgs = fs
    .readdirSync(packagesDir)
    .map((d) => path.join(packagesDir, d))
    .filter((d) => fs.statSync(d).isDirectory() && fs.existsSync(path.join(d, 'package.json')));

  const allDirs = [...dirs, ...topLevelPkgs];

  for (const pkgDir of allDirs) {
    const srcDir = path.join(pkgDir, 'src');
    const pkgVolume = getVolumeForPackage(pkgDir);
    if (pkgVolume === null || pkgVolume === 0) continue;

    const files = findSourceFiles(srcDir);
    for (const file of files) {
      const imports = extractImports(file);
      for (const imp of imports) {
        const importVolume = getVolumeForImport(imp);
        if (importVolume === null) continue;

        if (importVolume > pkgVolume) {
          const relFile = path.relative(REPO_ROOT, file);
          errors.push(
            `VIOLATION: ${relFile} (Vol ${pkgVolume}) imports '${imp}' (Vol ${importVolume}). ` +
              `Lower-numbered volumes must never depend on higher-numbered ones.`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Cross-Volume dependency violations found: ${errors.length}\n`);
    for (const err of errors) {
      console.error(`  ${err}`);
    }
    process.exit(1);
  } else {
    console.log('✅ No cross-Volume dependency violations found.');
    process.exit(0);
  }
}

main();
