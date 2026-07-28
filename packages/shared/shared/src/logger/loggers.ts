import type { ILogger, LogLevel, LogContext, LogEntry, LoggerConfiguration } from './interfaces.js';
import { SecretRedactor } from '../redaction/redactor.js';
import { TraceContext } from '../trace/context.js';

export abstract class BaseLogger implements ILogger {
  protected constructor(
    protected readonly moduleName: string,
    protected readonly config: LoggerConfiguration,
    protected readonly boundContext: LogContext = {},
  ) {}

  public abstract print(entry: LogEntry): void;

  public trace(message: string, metadata?: Record<string, unknown>, context?: LogContext): void {
    this.log('TRACE', message, undefined, metadata, context);
  }

  public debug(message: string, metadata?: Record<string, unknown>, context?: LogContext): void {
    this.log('DEBUG', message, undefined, metadata, context);
  }

  public info(message: string, metadata?: Record<string, unknown>, context?: LogContext): void {
    this.log('INFO', message, undefined, metadata, context);
  }

  public warn(message: string, metadata?: Record<string, unknown>, context?: LogContext): void {
    this.log('WARN', message, undefined, metadata, context);
  }

  public error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    context?: LogContext,
  ): void {
    this.log('ERROR', message, error, metadata, context);
  }

  public fatal(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    context?: LogContext,
  ): void {
    this.log('FATAL', message, error, metadata, context);
  }

  public abstract withContext(context: LogContext): ILogger;
  public abstract withModule(moduleName: string): ILogger;

  protected log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    context?: LogContext,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    if (this.config.samplingRate !== undefined && this.config.samplingRate < 1.0) {
      if (Math.random() > this.config.samplingRate) {
        return;
      }
    }

    // Merge static context, bound context, dynamic context, and trace storage context
    const currentTrace = TraceContext.get() || {};
    const mergedContext = {
      ...currentTrace,
      ...this.boundContext,
      ...context,
    };

    let processedMetadata = metadata;
    let processedContext = mergedContext;
    let processedMessage = message;
    let processedError = error;

    if (this.config.enableRedaction) {
      processedMetadata = SecretRedactor.redact(metadata) as Record<string, unknown>;
      processedContext = SecretRedactor.redact(mergedContext) as LogContext;
      processedMessage = SecretRedactor.redact(message) as string;
      if (error) {
        processedError = SecretRedactor.redact(error) as Error;
      }
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.moduleName,
      message: processedMessage,
      context: Object.keys(processedContext).length > 0 ? processedContext : undefined,
      metadata: processedMetadata,
      error: processedError
        ? {
            message: processedError.message,
            stack: processedError.stack,
            code: (processedError as Error & { code?: string }).code,
          }
        : undefined,
    };

    this.print(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    const priorities: Record<LogLevel, number> = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      FATAL: 5,
    };
    return priorities[level] >= priorities[this.config.level];
  }
}

export class NullLogger implements ILogger {
  public trace(): void {}
  public debug(): void {}
  public info(): void {}
  public warn(): void {}
  public error(): void {}
  public fatal(): void {}
  public withContext(): ILogger {
    return this;
  }
  public withModule(): ILogger {
    return this;
  }
}

export class JsonLogger extends BaseLogger {
  constructor(moduleName: string, config: LoggerConfiguration, boundContext: LogContext = {}) {
    super(moduleName, config, boundContext);
  }

  public print(entry: LogEntry): void {
    if (entry.level === 'ERROR' || entry.level === 'FATAL') {
      console.error(JSON.stringify(entry));
    } else if (entry.level === 'WARN') {
      console.warn(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  public withContext(context: LogContext): ILogger {
    return new JsonLogger(this.moduleName, this.config, { ...this.boundContext, ...context });
  }

  public withModule(moduleName: string): ILogger {
    return new JsonLogger(moduleName, this.config, this.boundContext);
  }
}

export class ConsoleLogger extends BaseLogger {
  constructor(moduleName: string, config: LoggerConfiguration, boundContext: LogContext = {}) {
    super(moduleName, config, boundContext);
  }

  public print(entry: LogEntry): void {
    const colorMap: Record<LogLevel, string> = {
      TRACE: '\x1b[90m', // grey
      DEBUG: '\x1b[36m', // cyan
      INFO: '\x1b[32m', // green
      WARN: '\x1b[33m', // yellow
      ERROR: '\x1b[31m', // red
      FATAL: '\x1b[41m\x1b[37m', // red background
    };

    const reset = '\x1b[0m';
    const color = colorMap[entry.level] || '';
    const ctxString = entry.context ? ` [ctx:${JSON.stringify(entry.context)}]` : '';
    const metaString = entry.metadata ? ` [meta:${JSON.stringify(entry.metadata)}]` : '';
    const errString = entry.error
      ? `\nError: ${entry.error.message}\n${entry.error.stack || ''}`
      : '';

    const logLine = `${entry.timestamp} ${color}[${entry.level}]${reset} [${entry.module}] ${entry.message}${ctxString}${metaString}${errString}`;

    if (entry.level === 'ERROR' || entry.level === 'FATAL') {
      console.error(logLine);
    } else if (entry.level === 'WARN') {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  }

  public withContext(context: LogContext): ILogger {
    return new ConsoleLogger(this.moduleName, this.config, { ...this.boundContext, ...context });
  }

  public withModule(moduleName: string): ILogger {
    return new ConsoleLogger(moduleName, this.config, this.boundContext);
  }
}
