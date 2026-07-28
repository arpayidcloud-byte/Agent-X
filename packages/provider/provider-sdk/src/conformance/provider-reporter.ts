/**
 * @module provider-sdk/provider-reporter
 * @description Generates readable markdown/text reports.
 */

import type { ConformanceReport } from './interfaces.js';

export class ProviderReporter {
  generateMarkdown(report: ConformanceReport): string {
    const header = `# Provider Conformance Report\n\nID: ${report.providerId}\nStatus: ${report.status}`;
    const sections = [
      `## Contract\nPassed: ${report.contract.passed}`,
      `## Compatibility\nPassed: ${report.compatibility.passed}`,
      `## Benchmark\nPassed: ${report.benchmark.passed}`,
    ];
    return [header, ...sections].join('\n');
  }
}
