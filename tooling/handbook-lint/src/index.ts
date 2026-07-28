import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

const HANDBOOK_DIR =
  process.env.HANDBOOK_DIR || path.resolve(process.cwd(), '..', 'agentx-handbook');

function logSuccess(message: string) {
  console.log(`\x1b[32m✔ ${message}\x1b[0m`);
}

function logError(message: string) {
  console.error(`\x1b[31m✘ ${message}\x1b[0m`);
}

function logWarning(message: string) {
  console.warn(`\x1b[33m⚠ ${message}\x1b[0m`);
}

// 1. Schema Lint
function runSchemaLint(): boolean {
  console.log('\n--- Running Schema Lint ---');
  let hasError = false;
  const schemas = globSync(path.join(HANDBOOK_DIR, '04-Schemas/*.schema.json'));

  if (schemas.length === 0) {
    logError('No schema files found in 04-Schemas/');
    return false;
  }

  // Check valid JSON
  for (const schemaPath of schemas) {
    try {
      const content = fs.readFileSync(schemaPath, 'utf8');
      JSON.parse(content);
    } catch (e: any) {
      logError(`Invalid JSON in schema file ${path.basename(schemaPath)}: ${(e as Error).message}`);
      hasError = true;
    }
  }

  // Check Volume mapping: volumes 1 to 16 should have schemas
  for (let i = 1; i <= 16; i++) {
    const volNum = String(i).padStart(2, '0');
    const matching = schemas.filter((s) => {
      const base = path.basename(s);
      return base.startsWith(`volume-${volNum}`);
    });
    if (matching.length === 0) {
      logWarning(`Missing schema for Volume ${volNum}`);
    }
  }

  if (!hasError) {
    logSuccess('Schema Lint passed.');
  }
  return !hasError;
}

// 2. Cross-Reference Lint
function runXrefLint(): boolean {
  console.log('\n--- Running Cross-Reference Lint ---');
  const hasError = false;
  const docs = globSync(path.join(HANDBOOK_DIR, '**/*.md'));

  const docIds = new Set<string>();
  const references = new Map<string, string[]>();

  // Map known document IDs
  for (const docPath of docs) {
    const base = path.basename(docPath, '.md');
    let docId = base;
    if (base.startsWith('Volume-')) {
      const match = base.match(/^Volume-(\d{2})/);
      if (match && match[1]) {
        docId = `Volume-${match[1]}`;
      }
    }
    docIds.add(docId);
  }

  // Also add special/governance doc names to docIds
  docIds.add('PROJECT_CONSTITUTION');
  docIds.add('SECURITY_STANDARDS');
  docIds.add('API_STANDARDS');
  docIds.add('THREAT_MODEL');
  docIds.add('PERFORMANCE_TARGETS');
  docIds.add('CONTRIBUTING');
  docIds.add('GLOSSARY');

  // Parse files for references
  for (const docPath of docs) {
    const base = path.basename(docPath, '.md');
    let docId = base;
    const matchVal = base.match(/^Volume-(\d{2})/);
    if (base.startsWith('Volume-') && matchVal && matchVal[1]) {
      docId = `Volume-${matchVal[1]}`;
    }

    const content = fs.readFileSync(docPath, 'utf8');

    const volRegex = /Volume-(\d{2})/g;
    const rfcRegex = /RFC-(\d{4})/g;
    const adrRegex = /ADR-(\d{4})/g;

    const refs: string[] = [];
    let match;

    while ((match = volRegex.exec(content)) !== null) {
      if (match[1]) refs.push(`Volume-${match[1]}`);
    }
    while ((match = rfcRegex.exec(content)) !== null) {
      if (match[1]) refs.push(`RFC-${match[1]}`);
    }
    while ((match = adrRegex.exec(content)) !== null) {
      if (match[1]) refs.push(`ADR-${match[1]}`);
    }

    const filteredRefs = refs.filter((r) => r !== docId);
    references.set(docId, filteredRefs);

    // Validate references exist
    for (const ref of filteredRefs) {
      const refBase = ref;
      const refExists = Array.from(docIds).some(
        (id) => id.startsWith(refBase) || refBase.startsWith(id),
      );
      if (!refExists) {
        logWarning(`Broken reference in ${docId}: Reference to ${ref} cannot be resolved.`);
      }
    }
  }

  // Find Orphan documents
  const referencedTargets = new Set<string>();
  for (const refs of references.values()) {
    refs.forEach((r) => referencedTargets.add(r));
  }

  for (const docId of docIds) {
    if (
      docId.toLowerCase().includes('readme') ||
      docId.toLowerCase().includes('template') ||
      docId.toLowerCase().includes('review') ||
      docId.toLowerCase().includes('backlog') ||
      docId.toLowerCase().includes('assessment') ||
      docId.toLowerCase().includes('plan') ||
      docId.toLowerCase().includes('program') ||
      docId.toLowerCase().includes('runbook') ||
      docId.toLowerCase().includes('disaster') ||
      docId.toLowerCase().includes('incident') ||
      docId.toLowerCase().includes('rollback') ||
      docId.toLowerCase().includes('security') ||
      docId === 'CERTIFICATION'
    ) {
      continue;
    }

    const hasIncoming = Array.from(referencedTargets).some(
      (t) => t.startsWith(docId) || docId.startsWith(t),
    );
    if (!hasIncoming && docId !== 'Volume-01') {
      logWarning(`Orphan document detected: ${docId} has no incoming references.`);
    }
  }

  logSuccess('Cross-Reference Lint completed with warnings reported.');
  return !hasError;
}

// 3. Template & Section Lint
function runTemplateLint(): boolean {
  console.log('\n--- Running Template & Section Lint ---');
  let hasError = false;

  const rfcs = globSync(path.join(HANDBOOK_DIR, '02-RFC/*.md'));
  const adrs = globSync(path.join(HANDBOOK_DIR, '03-ADR/*.md'));
  const volumes = globSync(path.join(HANDBOOK_DIR, '01-Volumes/*.md'));

  // RFC Linting
  for (const rfcPath of rfcs) {
    const base = path.basename(rfcPath, '.md');
    const rfcNumMatch = base.match(/^RFC-(\d{4})/);
    if (!rfcNumMatch || !rfcNumMatch[1]) continue;
    const rfcNum = parseInt(rfcNumMatch[1], 10);

    if (rfcNum <= 20) continue;

    const content = fs.readFileSync(rfcPath, 'utf8');
    const lines = content.split('\n');

    if (lines.length < 80) {
      logError(
        `${base} fails line count check: got ${lines.length} lines, expected minimum 80 (RFC-0031).`,
      );
      hasError = true;
    }

    const requiredSections = [
      /problem\s+statement|context/i,
      /proposed\s+solution|proposed\s+decision/i,
      /alternatives\s+considered/i,
      /consequences/i,
    ];

    for (const pattern of requiredSections) {
      const match = lines.some((line) => line.startsWith('#') && pattern.test(line));
      if (!match) {
        logError(`${base} is missing required section matching pattern: ${pattern.source}`);
        hasError = true;
      }
    }

    const altIndex = lines.findIndex(
      (line) => line.startsWith('#') && /alternatives\s+considered/i.test(line),
    );
    if (altIndex !== -1) {
      let altCount = 0;
      for (let i = altIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line && line.startsWith('# ')) break;
        if (line && line.startsWith('## ')) altCount++;
      }
      if (altCount < 2) {
        logError(
          `${base} has fewer than 2 alternatives under Alternatives Considered: got ${altCount}, expected minimum 2 (RFC-0031).`,
        );
        hasError = true;
      }
    }
  }

  // ADR Linting
  for (const adrPath of adrs) {
    const base = path.basename(adrPath, '.md');
    const adrNumMatch = base.match(/^ADR-(\d{4})/);
    if (!adrNumMatch || !adrNumMatch[1]) continue;
    const adrNum = parseInt(adrNumMatch[1], 10);

    if (adrNum <= 10) continue;

    const content = fs.readFileSync(adrPath, 'utf8');
    const lines = content.split('\n');

    if (lines.length < 20) {
      logError(
        `${base} fails line count check: got ${lines.length} lines, expected minimum 20 (RFC-0031).`,
      );
      hasError = true;
    }

    const requiredSections = [
      /context/i,
      /decision|proposed\s+decision/i,
      /alternatives\s+considered/i,
      /consequences/i,
    ];

    for (const pattern of requiredSections) {
      const match = lines.some((line) => line.startsWith('#') && pattern.test(line));
      if (!match) {
        logError(`${base} is missing required section matching pattern: ${pattern.source}`);
        hasError = true;
      }
    }
  }

  // Volume Observability Linting (RFC-0033)
  for (const volPath of volumes) {
    const base = path.basename(volPath, '.md');
    const content = fs.readFileSync(volPath, 'utf8');
    const lines = content.split('\n');

    const hasObs = lines.some((line) => line.startsWith('#') && /observability/i.test(line));
    if (!hasObs) {
      logError(
        `${base} is missing required Observability / Observability Requirements section (RFC-0033).`,
      );
      hasError = true;
    }
  }

  if (!hasError) {
    logSuccess('Template & Section Lint passed.');
  }
  return !hasError;
}

// Main execution
console.log('Starting agentx Handbook Lint tool...');
const schemaPassed = runSchemaLint();
const xrefPassed = runXrefLint();
const templatePassed = runTemplateLint();

if (schemaPassed && templatePassed && xrefPassed) {
  logSuccess('Handbook Lint successfully completed with zero fatal errors.');
  process.exit(0);
} else {
  logError('Handbook Lint failed with fatal errors. Check logs above.');
  process.exit(1);
}
