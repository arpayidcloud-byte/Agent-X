#!/usr/bin/env node

/**
 * Cross-Volume dependency lint.
 *
 * Enforces the rule from Volume 1 Ch. 3:
 * "Lower-numbered volumes must never depend on higher-numbered ones."
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

// Map package directory → volume number
const PACKAGE_VOLUME_MAP = {
  // Vol 1 — Foundation
  'packages/shared/shared': 1,

  // Vol 2 — Core Runtime
  'packages/shared/core-runtime': 2,
  'packages/planning/planning-engine': 2,
  'packages/planning/goal-intelligence': 2,
  'packages/reasoning/reasoning-algorithms': 2,
  'packages/reasoning/reasoning-framework': 2,
  'packages/runtime/runtime': 2,
  'packages/runtime/runtime-adapters': 2,
  'packages/cognitive/cognitive-contracts': 2,
  'packages/cognitive/cognitive-kernel': 2,
  'packages/cognitive/cognitive-learning': 2,
  'packages/cognitive/autonomous-cognition': 2,

  // Vol 3 — Agent Platform
  'packages/agent/agent-platform': 4,  // Moved to Vol 4 (depends on provider-sdk)
  'packages/agent/multi-agent-collaboration': 4,
  'packages/agent/multi-agent-reasoning': 4,

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
  'packages/runtime/runtime-production': 8,

  // Vol 14 — Testing & QA
  'packages/quality/architecture-sdk': 14,
  'packages/quality/production-quality': 14,

  // Vol 16 — Secrets & Key Management
  'packages/shared/secrets': 16,
};

// Map import name → volume number
const IMPORT_VOLUME_MAP = {
  'shared': 1,
  'core-runtime': 2,
  'planning-engine': 2,
  'goal-intelligence': 2,
  'reasoning-algorithms': 2,
  'reasoning-framework': 2,
  'runtime': 2,
  'runtime-adapters': 2,
  'cognitive-contracts': 2,
  'cognitive-kernel': 2,
  'cognitive-learning': 2,
  'autonomous-cognition': 2,
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
  'enterprise-runtime': 10,
  'developer-platform': 10,
  'distributed-cognition': 11,
  'runtime-production': 8,
  'architecture-sdk': 14,
  'production-quality': 14,
  'secrets': 16,
};

function getVolumeForPackage(pkgDir) {
  const rel = path.relative(REPO_ROOT, pkgDir).replace(/\\/g, '/');
  if (PACKAGE_VOLUME_MAP[rel] !== undefined) return PACKAGE_VOLUME_MAP[rel];
  for (const [prefix, vol] of Object.entries(PACKAGE_VOLUME_MAP)) {
    if (rel.startsWith(prefix)) return vol;
  }
  return null;
}

function getVolumeForImport(importPath) {
  const pkgName = importPath.replace('@agentx/', '');
  return IMPORT_VOLUME_MAP[pkgName] ?? null;
}

function findSourceFiles(dir) {
  const files = [];
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

function extractImports(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const imports = [];
  const regex = /from\s+['"](@agentx\/[^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function getAllPackageDirs() {
  const dirs = [];
  const packagesDir = path.join(REPO_ROOT, 'packages');
  const appsDir = path.join(REPO_ROOT, 'apps');

  // Nested packages (e.g., packages/shared/core-runtime)
  for (const domain of fs.readdirSync(packagesDir)) {
    const domainPath = path.join(packagesDir, domain);
    if (!fs.statSync(domainPath).isDirectory()) continue;

    // Check if domain itself is a package
    if (fs.existsSync(path.join(domainPath, 'package.json'))) {
      dirs.push(domainPath);
    }

    // Check sub-packages
    for (const sub of fs.readdirSync(domainPath)) {
      const subPath = path.join(domainPath, sub);
      if (fs.statSync(subPath).isDirectory() && fs.existsSync(path.join(subPath, 'package.json'))) {
        dirs.push(subPath);
      }
    }
  }

  // Apps
  for (const app of fs.readdirSync(appsDir)) {
    const appPath = path.join(appsDir, app);
    if (fs.statSync(appPath).isDirectory()) dirs.push(appPath);
  }

  return dirs;
}

function main() {
  const dirs = getAllPackageDirs();
  const errors = [];

  for (const pkgDir of dirs) {
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
            `  ${relFile} (Vol ${pkgVolume}) → '${imp}' (Vol ${importVolume})`
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Cross-Volume dependency violations: ${errors.length}`);
    console.error('   Lower-numbered volumes must never depend on higher-numbered ones.\n');
    for (const err of errors) {
      console.error(err);
    }
    process.exit(1);
  } else {
    console.log('✅ No cross-Volume dependency violations found.');
  }
}

main();
