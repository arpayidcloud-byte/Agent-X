export interface LogMeta {
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

export class Logger {
  constructor(
    private context: string,
    private defaultMeta?: LogMeta,
  ) {}

  info(message: string, meta?: LogMeta): void {
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        context: this.context,
        message,
        ...this.defaultMeta,
        ...meta,
      }),
    );
  }

  warn(message: string, meta?: LogMeta): void {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        context: this.context,
        message,
        ...this.defaultMeta,
        ...meta,
      }),
    );
  }

  error(message: string, error?: Error, meta?: LogMeta): void {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        context: this.context,
        message,
        errorMessage: error?.message,
        errorStack: error?.stack,
        ...this.defaultMeta,
        ...meta,
      }),
    );
  }

  debug(message: string, meta?: LogMeta): void {
    console.debug(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'DEBUG',
        context: this.context,
        message,
        ...this.defaultMeta,
        ...meta,
      }),
    );
  }

  child(meta: LogMeta): Logger {
    return new Logger(this.context, { ...this.defaultMeta, ...meta });
  }
}
