import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';

process.env.ENABLE_MOCK_PROVIDER = 'true';
process.env.AUTH_ENABLED = 'false';
delete process.env.NODE_ENV;
process.env.PORT = '0';
delete process.env.DATABASE_URL;

const templates = new Map<string, Record<string, unknown>>([
  [
    'unpublished-template',
    {
      id: 'unpublished-template',
      name: 'Draft',
      description: 'Not public',
      authorId: 'author-secret',
      authorName: 'Private Author',
      systemPrompt: 'secret prompt',
      config: { secret: true },
      tags: ['draft'],
      category: 'coding',
      priceUsd: 99,
      installCount: 0,
      rating: 0,
      ratingCount: 0,
      isPublished: false,
      isFeatured: false,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
  [
    'published-template',
    {
      id: 'published-template',
      name: 'Public Template',
      description: 'Public description',
      authorId: 'author-secret',
      authorName: 'Public Author',
      systemPrompt: 'secret prompt',
      config: { secret: true },
      tags: ['public'],
      category: 'coding',
      priceUsd: 12,
      installCount: 3,
      rating: 4.5,
      ratingCount: 2,
      isPublished: true,
      isFeatured: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
]);

vi.mock('@agent-xai/persistence', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...(actual as Record<string, unknown>),
    CostEntryRepository: actual.CostEntryRepository,
    AgentTemplateRepository: class {
      async getPublishedById(id: string) {
        const template = templates.get(id);
        return template?.isPublished ? template : null;
      }
      async listPublished() {
        return [...templates.values()].filter((template) => template.isPublished);
      }
      async getFeatured() {
        return [...templates.values()].filter(
          (template) => template.isPublished && template.isFeatured,
        );
      }
      async getCategories() {
        return [{ category: 'coding', count: 1 }];
      }
    },
  };
});

const { app } = await import('../agentx-server.js');

describe('Public marketplace template detail', () => {
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    server = app.listen(0);
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it('returns 404 for an unpublished template', async () => {
    const response = await fetch(`${baseUrl}/v1/marketplace/templates/unpublished-template`);
    expect(response.status).toBe(404);
  });

  it('returns only the explicit public DTO for a published template', async () => {
    const response = await fetch(`${baseUrl}/v1/marketplace/templates/published-template`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as Record<string, unknown>;

    expect(body).toEqual({
      id: 'published-template',
      name: 'Public Template',
      description: 'Public description',
      authorName: 'Public Author',
      tags: ['public'],
      category: 'coding',
      installCount: 3,
      rating: 4.5,
      ratingCount: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(body).not.toHaveProperty('systemPrompt');
    expect(body).not.toHaveProperty('config');
    expect(body).not.toHaveProperty('authorId');
    expect(body).not.toHaveProperty('isPublished');
    expect(body).not.toHaveProperty('isFeatured');
    expect(body).not.toHaveProperty('priceUsd');
  });
});
