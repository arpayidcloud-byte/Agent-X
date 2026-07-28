/**
 * @module provider-sdk/provider-runner
 * @description Automatically configures and executes test pipelines.
 */

import type { IProvider } from '@agentx-fast/runtime-adapters';
import type { ConformanceReport } from './interfaces.js';
import { ContractHarness } from './contract-harness.js';
import { CompatibilityHarness } from './compatibility-harness.js';
import { BenchmarkHarness } from './benchmark-harness.js';
import { StressHarness } from './stress-harness.js';
import { ChaosHarness } from './chaos-harness.js';
import { SecurityHarness } from './security-harness.js';
import { createHash } from 'crypto';

export class ProviderRunner {
  private contractHarness = new ContractHarness();
  private compHarness = new CompatibilityHarness();
  private benchHarness = new BenchmarkHarness();
  private stressHarness = new StressHarness();
  private chaosHarness = new ChaosHarness();
  private secHarness = new SecurityHarness();

  async runSuite(provider: IProvider): Promise<ConformanceReport> {
    const contract = await this.contractHarness.run(provider);
    const compatibility = await this.compHarness.run(provider);
    const benchmark = await this.benchHarness.run(provider);
    const stress = await this.stressHarness.run(provider);
    const chaos = await this.chaosHarness.run(provider);
    const security = await this.secHarness.run(provider);

    const passed =
      contract.passed &&
      compatibility.passed &&
      benchmark.passed &&
      stress.passed &&
      chaos.passed &&
      security.passed;

    const report: ConformanceReport = {
      providerId: provider.getMetadata().id,
      contract,
      compatibility,
      benchmark,
      stress,
      chaos,
      security,
      status: passed ? 'PASS' : 'FAIL',
      timestamp: new Date(),
      checksum: '',
    };

    report.checksum = createHash('sha256').update(JSON.stringify(report)).digest('hex');
    return report;
  }
}
