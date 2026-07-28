import type { ILogger, LoggerConfiguration, LoggerFactory } from './interfaces.js';
import { JsonLogger, NullLogger, ConsoleLogger } from './loggers.js';

export class AgentXLoggerFactory implements LoggerFactory {
  private configuration: LoggerConfiguration = {
    level: 'INFO',
    format: 'json',
    enableRedaction: true,
    samplingRate: 1.0,
  };

  constructor() {
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    const level = (
      process.env.AGENTX_LOG_LEVEL || 'info'
    ).toUpperCase() as LoggerConfiguration['level'];
    const format = (process.env.AGENTX_LOG_FORMAT || 'json') as LoggerConfiguration['format'];

    if (level) {
      this.configuration.level = level;
    }
    if (format) {
      this.configuration.format = format;
    }
  }

  public configure(config: Partial<LoggerConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
  }

  public createLogger(moduleName: string): ILogger {
    switch (this.configuration.format) {
      case 'pretty':
        return new ConsoleLogger(moduleName, this.configuration);
      case 'json':
        return new JsonLogger(moduleName, this.configuration);
      default:
        return new NullLogger();
    }
  }
}
