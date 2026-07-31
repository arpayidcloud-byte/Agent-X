import { describe, it, expect, vi, afterEach } from 'vitest';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { createRequestLogger, CORRELATION_ID_HEADER } from '../request-logger.js';

function createTestServer(): {
  server: ReturnType<typeof app.listen>;
  baseUrl: string;
  close: () => Promise<void>;
} {
  const app = express();
  app.use(createRequestLogger());
  app.get('/ping', (_req, res) => {
    res.json({ ok: true });
  });
  app.get('/error', (_req, res) => {
    res.status(500).json({ error: 'boom' });
  });

  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    server,
    baseUrl,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  };
}

describe('createRequestLogger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set X-Correlation-Id response header on every request', async () => {
    const { baseUrl, close } = createTestServer();

    try {
      const res = await fetch(`${baseUrl}/ping`);
      const correlationId = res.headers.get('X-Correlation-Id');

      expect(res.status).toBe(200);
      expect(correlationId).toBeDefined();
      expect(correlationId?.length).toBeGreaterThan(0);
    } finally {
      await close();
    }
  });

  it('should honour an incoming correlation id header', async () => {
    const { baseUrl, close } = createTestServer();

    try {
      const res = await fetch(`${baseUrl}/ping`, {
        headers: { [CORRELATION_ID_HEADER]: 'trace-abc-123' },
      });

      expect(res.headers.get('X-Correlation-Id')).toBe('trace-abc-123');
    } finally {
      await close();
    }
  });

  it('should emit a structured JSON log line with method, path, status and correlationId', async () => {
    const logSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const { baseUrl, close } = createTestServer();

    try {
      await fetch(`${baseUrl}/ping`);
    } finally {
      await close();
    }

    expect(logSpy).toHaveBeenCalled();
    const raw = logSpy.mock.calls[0]?.[0];
    expect(typeof raw).toBe('string');

    const parsed = JSON.parse(raw as string) as Record<string, unknown>;
    expect(parsed.level).toBe('INFO');
    expect(parsed.context).toBe('http');
    expect(parsed.message).toContain('GET /ping -> 200');
    expect(parsed.correlationId).toBeDefined();
    expect(parsed.method).toBe('GET');
    expect(parsed.status).toBe(200);
    expect(parsed.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should use WARN level for 4xx responses', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { baseUrl, close } = createTestServer();

    try {
      await fetch(`${baseUrl}/missing`);
    } finally {
      await close();
    }

    expect(warnSpy).toHaveBeenCalled();
    const raw = warnSpy.mock.calls[0]?.[0];
    const parsed = JSON.parse(raw as string) as Record<string, unknown>;
    expect(parsed.level).toBe('WARN');
    expect(parsed.status).toBe(404);
  });

  it('should use ERROR level for 5xx responses', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { baseUrl, close } = createTestServer();

    try {
      await fetch(`${baseUrl}/error`);
    } finally {
      await close();
    }

    expect(errorSpy).toHaveBeenCalled();
    const raw = errorSpy.mock.calls[0]?.[0];
    const parsed = JSON.parse(raw as string) as Record<string, unknown>;
    expect(parsed.level).toBe('ERROR');
    expect(parsed.status).toBe(500);
  });
});
