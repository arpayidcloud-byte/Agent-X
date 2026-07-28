import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AgentXLoggerFactory,
  SecretRedactor,
  TraceContext,
  ConsoleLogger,
  JsonLogger,
  NullLogger,
  ILogger,
  LogLevel,
} from '../src/index.js';

describe('SecretRedactor', () => {
  it('should redact sensitive string values completely', () => {
    const redacted = SecretRedactor.redact('This is a key: AGENTX_SECRET_MY_KEY');
    expect(redacted).toBe('This is a key: [REDACTED]');
  });

  it('should redact JWT tokens', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const redacted = SecretRedactor.redact(`Bearer ${jwt}`);
    expect(redacted).toBe('Bearer [REDACTED]');
  });

  it('should recursively redact objects and arrays containing sensitive keys', () => {
    const original = {
      password: 'mypassword',
      otherKey: 'safe',
      nested: {
        api_key: 'secretkey',
      },
      AGENTX_SECRET_DB_PASS: 'password_val',
      array: ['safe_value', 'AGENTX_SECRET_VALUE'],
    };

    const redacted = SecretRedactor.redact(original) as any;
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.otherKey).toBe('safe');
    expect(redacted.nested.api_key).toBe('[REDACTED]');
    expect(redacted.array[0]).toBe('safe_value');
    expect(redacted.array[1]).toBe('[REDACTED]');
  });

  it('should redact sensitive key values with custom case and delimiters', () => {
    const original = {
      'Client-Secret': 'cs',
      access_token: 'at',
    };
    const redacted = SecretRedactor.redact(original) as any;
    expect(redacted['Client-Secret']).toBe('[REDACTED]');
    expect(redacted['access_token']).toBe('[REDACTED]');
  });

  it('should redact Error objects', () => {
    const error = new Error('Database password is AGENTX_SECRET_DB_PASS');
    (error as any).code = 'CONN_ERR';

    const redacted = SecretRedactor.redact(error) as any;
    expect(redacted.message).toBe('Database password is [REDACTED]');
    expect(redacted.code).toBe('CONN_ERR');
  });

  it('should pass through null, undefined, non-objects, and numbers without change', () => {
    expect(SecretRedactor.redact(null)).toBe(null);
    expect(SecretRedactor.redact(undefined)).toBe(undefined);
    expect(SecretRedactor.redact(123)).toBe(123);
  });
});

describe('TraceContext', () => {
  it('should propagate trace context through sync operations', () => {
    const traceId = TraceContext.generateId();
    TraceContext.run({ traceId }, () => {
      const current = TraceContext.get();
      expect(current?.traceId).toBe(traceId);
    });
  });

  it('should propagate trace context through async operations and support nesting', async () => {
    const traceId1 = 'trace-1';
    const traceId2 = 'trace-2';

    await TraceContext.runAsync({ traceId: traceId1 }, async () => {
      expect(TraceContext.get()?.traceId).toBe(traceId1);

      await TraceContext.runAsync({ traceId: traceId2 }, async () => {
        expect(TraceContext.get()?.traceId).toBe(traceId2);
      });

      expect(TraceContext.get()?.traceId).toBe(traceId1);
    });
  });
});

describe('StructuredLogger Implementations', () => {
  let logSpy: any;
  let errorSpy: any;
  let warnSpy: any;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('NullLogger should not print anything', () => {
    const logger = new NullLogger();
    logger.trace('test');
    logger.debug('test');
    logger.info('test');
    logger.warn('test');
    logger.error('test');
    logger.fatal('test');
    logger.withContext({}).debug('test');
    logger.withModule('test').trace('test');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('JsonLogger should output logs in JSON format', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'TRACE', format: 'json', enableRedaction: true });
    const logger = factory.createLogger('MyModule');

    logger.info('test-info');
    expect(logSpy).toHaveBeenCalled();
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.level).toBe('INFO');
    expect(parsed.module).toBe('MyModule');
    expect(parsed.message).toBe('test-info');
  });

  it('JsonLogger should redact secrets before writing log', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'INFO', format: 'json', enableRedaction: true });
    const logger = factory.createLogger('MyModule');

    logger.info('Contains AGENTX_SECRET_API_KEY');
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.message).toBe('Contains [REDACTED]');
  });

  it('JsonLogger should output to console.error for WARN/ERROR/FATAL', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'TRACE', format: 'json', enableRedaction: true });
    const logger = factory.createLogger('MyModule');

    logger.warn('test-warn');
    expect(warnSpy).toHaveBeenCalled();

    logger.error('test-error', new Error('fail'), { traceId: '123' });
    expect(errorSpy).toHaveBeenCalled();

    logger.fatal('test-fatal');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('ConsoleLogger should output formatted logs', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'TRACE', format: 'pretty', enableRedaction: true });
    const logger = factory.createLogger('MyModule');

    logger.trace('test-trace');
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy.mock.calls[0][0]).toContain('[TRACE]');

    logger.debug('test-debug');
    expect(logSpy.mock.calls[1][0]).toContain('[DEBUG]');

    logger.info('test-info', { metadataKey: 'val' });
    expect(logSpy.mock.calls[2][0]).toContain('[INFO]');

    logger.withContext({ taskId: 'task-1' }).info('test-context');

    logger.warn('test-warn');
    expect(warnSpy).toHaveBeenCalled();

    logger.error('test-error', new Error('fail'));
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should support Logger.withContext and Logger.withModule chaining', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'INFO', format: 'json' });
    let logger = factory.createLogger('MyModule');

    logger = logger.withContext({ taskId: 'task-1' });
    logger.info('with context');
    const parsed = JSON.parse(logSpy.mock.calls[0][0]);
    expect(parsed.context.taskId).toBe('task-1');

    logger = logger.withModule('NewModule');
    logger.info('with new module');
    const parsed2 = JSON.parse(logSpy.mock.calls[1][0]);
    expect(parsed2.module).toBe('NewModule');
  });

  it('ConsoleLogger should support withContext and withModule chaining', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'INFO', format: 'pretty' });
    let logger = factory.createLogger('MyModule');

    logger = logger.withContext({ taskId: 'task-1' });
    logger.info('with context');
    expect(logSpy.mock.calls[0][0]).toContain('[INFO]');

    logger = logger.withModule('NewModule');
    logger.info('with new module');
    expect(logSpy.mock.calls[1][0]).toContain('[INFO]');
  });

  it('should respect logger level priority gating', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'ERROR', format: 'json' });
    const logger = factory.createLogger('MyModule');

    logger.info('should not log');
    expect(logSpy).not.toHaveBeenCalled();

    logger.error('should log');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should apply log sampling correctly', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ level: 'INFO', format: 'json', samplingRate: 0.0 });
    const logger = factory.createLogger('MyModule');

    logger.info('sampled out');
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('LoggerFactory should default to NullLogger for unsupported formats', () => {
    const factory = new AgentXLoggerFactory();
    factory.configure({ format: 'invalid' as any });
    const logger = factory.createLogger('MyModule');
    expect(logger).toBeInstanceOf(NullLogger);
  });
});
