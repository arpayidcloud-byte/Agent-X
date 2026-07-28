import { AgentXLoggerFactory } from '@agentx-fast/shared';

export class CloudRuntime {
  private logger = new AgentXLoggerFactory().createLogger('cloud:runtime');

  async deploy(id: string): Promise<void> {
    this.logger.info('Deployment completed', { deploymentId: id });
  }
}
