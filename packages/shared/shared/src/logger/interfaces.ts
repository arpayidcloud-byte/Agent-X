export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogContext {
  traceId?: string;
  taskId?: string;
  agentId?: string;
  providerId?: string;
  workflowId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  context?: LogContext;
  metadata?: Record<string, unknown>;
}

export interface ILogger {
  trace(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
  debug(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
  info(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
  warn(message: string, metadata?: Record<string, unknown>, context?: LogContext): void;
  error(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    context?: LogContext,
  ): void;
  fatal(
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
    context?: LogContext,
  ): void;

  withContext(context: LogContext): ILogger;
  withModule(moduleName: string): ILogger;
}

export interface LoggerConfiguration {
  level: LogLevel;
  format: 'json' | 'pretty';
  enableRedaction: boolean;
  samplingRate?: number; // 0.0 to 1.0
}

export interface LoggerFactory {
  createLogger(moduleName: string): ILogger;
  configure(config: Partial<LoggerConfiguration>): void;
}
