import type { OpenAPIV3 } from 'openapi-types';

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'AgentX API',
    description:
      'AI Agent platform API — run tasks, manage LLM providers, browse marketplace templates, track costs.',
    version: '1.0.0',
    contact: { name: 'AgentX Team', email: 'support@id-tech.cloud' },
  },
  servers: [
    { url: 'https://api.id-tech.cloud', description: 'Production' },
    { url: 'http://localhost:4000', description: 'Local dev' },
  ],
  security: [],
  tags: [
    { name: 'Health', description: 'System health & metrics' },
    { name: 'Auth', description: 'Authentication & account management' },
    { name: 'Agent', description: 'Task submission, chat, and streaming' },
    { name: 'Multi-Agent', description: 'Multi-agent orchestration' },
    { name: 'Admin', description: 'Admin-only user & audit management' },
    { name: 'LLM Providers', description: 'LLM provider CRUD & testing' },
    { name: 'Prompt Templates', description: 'Prompt template management' },
    { name: 'Marketplace', description: 'Agent template marketplace' },
    { name: 'Cost', description: 'Cost tracking & breakdown' },
    { name: 'Analytics', description: 'Usage analytics' },
    { name: 'Quality', description: 'Quality scoring' },
    { name: 'Feedback', description: 'Feedback generation & management' },
    { name: 'Beta', description: 'Beta waitlist & feedback' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/metrics': {
      get: {
        tags: ['Health'],
        summary: 'Prometheus metrics',
        responses: {
          200: {
            description: 'Metrics text',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 8, example: 'securepass123' },
                  turnstileToken: { type: 'string', description: 'Cloudflare Turnstile token' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Account created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tokens: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                      },
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login (requires Turnstile)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  turnstileToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tokens: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/cli-login': {
      post: {
        tags: ['Auth'],
        summary: 'CLI login (no Turnstile)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'cli-test@agentx.dev' },
                  password: { type: 'string', example: 'test123456' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tokens: { type: 'object', properties: { accessToken: { type: 'string' } } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User info',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change password',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password changed' },
          401: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/set-password': {
      post: {
        tags: ['Auth'],
        summary: 'Set first password (OAuth-only accounts)',
        description:
          'For accounts created via Google/GitHub that have no local password. ' +
          'Refuses with 409 once a password already exists (use change-password then).',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['newPassword'],
                properties: {
                  newPassword: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password set' },
          400: { $ref: '#/components/responses/Error' },
          401: { $ref: '#/components/responses/Error' },
          409: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email',
        description:
          'Always answers 200 for existing and unknown emails alike (no account ' +
          'enumeration). When the account exists an email with a one-time reset ' +
          'link (valid 30 minutes) is sent.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Accepted (email sent when the account exists)' },
          400: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with a one-time token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', description: 'One-time token from the reset email' },
                  newPassword: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset' },
          400: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/agentx/run': {
      post: {
        tags: ['Agent'],
        summary: 'Submit agent task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt'],
                properties: {
                  prompt: { type: 'string', example: 'Write a hello world in Python' },
                  provider: { type: 'string', example: 'deepseek' },
                  model: { type: 'string', example: 'deepseek-v3' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Task created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    status: { type: 'string' },
                    prompt: { type: 'string' },
                    response: { type: 'string' },
                    provider: { type: 'string' },
                    model: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/agentx/run/stream': {
      post: {
        tags: ['Agent'],
        summary: 'Submit task with SSE streaming',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt'],
                properties: {
                  prompt: { type: 'string' },
                  provider: { type: 'string' },
                  model: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'SSE stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/agentx/tasks': {
      get: {
        tags: ['Agent'],
        summary: 'List tasks',
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }],
        responses: {
          200: {
            description: 'Task list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/agentx/stats': {
      get: {
        tags: ['Agent'],
        summary: 'Task statistics',
        responses: {
          200: {
            description: 'Stats',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    completed: { type: 'integer' },
                    errors: { type: 'integer' },
                    pending: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/agentx/providers': {
      get: {
        tags: ['Agent'],
        summary: 'Public provider list (name, models, active) — no admin required',
        responses: {
          200: { description: 'Provider list without secrets' },
        },
      },
    },
    '/v1/agentx/deck': {
      get: {
        tags: ['Agent'],
        summary: 'Command Deck aggregate — system, agents, task, logs, stats',
        responses: {
          200: {
            description:
              'Deck payload: system (cpu/mem), agents (multi-agent runs), task (latest, with progress/tokens), logs (recent events), stats (totals)',
          },
          500: { description: 'Server error' },
        },
      },
    },
    '/v1/agentx/tasks/{id}/events': {
      get: {
        tags: ['Agent'],
        summary: 'Stream task events (SSE)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'SSE event stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/agentx/chat': {
      post: {
        tags: ['Agent'],
        summary: 'Chat with agent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', example: 'Hello, what can you do?' },
                  sessionId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Chat response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    chatId: { type: 'string' },
                    message: { type: 'string' },
                    provider: { type: 'string' },
                    model: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/agentx/chat/stream': {
      post: {
        tags: ['Agent'],
        summary: 'Chat with SSE streaming',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: { message: { type: 'string' }, sessionId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'SSE chat stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/agentx/chat/{id}/events': {
      get: {
        tags: ['Agent'],
        summary: 'Stream chat events (SSE)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'SSE event stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/agentx/multi-agent/run': {
      post: {
        tags: ['Multi-Agent'],
        summary: 'Run multi-agent task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt'],
                properties: {
                  prompt: { type: 'string' },
                  agents: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Multi-agent run created' } },
      },
    },
    '/v1/agentx/multi-agent/{runId}': {
      get: {
        tags: ['Multi-Agent'],
        summary: 'Get multi-agent run status',
        parameters: [{ name: 'runId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Run status' } },
      },
    },
    '/v1/agentx/multi-agent/{runId}/events': {
      get: {
        tags: ['Multi-Agent'],
        summary: 'Stream multi-agent events (SSE)',
        parameters: [{ name: 'runId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'SSE event stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/v1/admin/audit-logs': {
      get: {
        tags: ['Admin'],
        summary: 'List audit logs',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }],
        responses: {
          200: {
            description: 'Audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    logs: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          action: { type: 'string' },
                          target: { type: 'string' },
                          email: { type: 'string' },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List users',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Admin'],
        summary: 'Create user',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  roles: { type: 'array', items: { type: 'string' }, example: ['admin'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          400: { $ref: '#/components/responses/Error' },
        },
      },
    },
    '/v1/admin/users/{id}': {
      delete: {
        tags: ['Admin'],
        summary: 'Delete user',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User deleted' } },
      },
      patch: {
        tags: ['Admin'],
        summary: 'Update user roles',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { roles: { type: 'array', items: { type: 'string' } } },
              },
            },
          },
        },
        responses: { 200: { description: 'User updated' } },
      },
    },
    '/v1/prompt-templates': {
      get: {
        tags: ['Prompt Templates'],
        summary: 'List prompt templates',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Template list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    templates: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          content: { type: 'string' },
                          tags: { type: 'array', items: { type: 'string' } },
                          version: { type: 'integer' },
                          usageCount: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Prompt Templates'],
        summary: 'Create prompt template',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'content'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  content: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Template created' } },
      },
    },
    '/v1/prompt-templates/{id}': {
      put: {
        tags: ['Prompt Templates'],
        summary: 'Update prompt template',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  content: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Template updated' } },
      },
      delete: {
        tags: ['Prompt Templates'],
        summary: 'Delete prompt template',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Template deleted' } },
      },
    },
    '/v1/marketplace/templates': {
      get: {
        tags: ['Marketplace'],
        summary: 'Browse marketplace templates',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'Template list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    templates: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AgentTemplate' },
                    },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/marketplace/featured': {
      get: {
        tags: ['Marketplace'],
        summary: 'Get featured templates',
        responses: {
          200: {
            description: 'Featured templates',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    templates: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AgentTemplate' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/marketplace/categories': {
      get: {
        tags: ['Marketplace'],
        summary: 'List marketplace categories',
        responses: {
          200: {
            description: 'Categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    categories: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: { category: { type: 'string' }, count: { type: 'integer' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/marketplace/templates/{id}': {
      get: {
        tags: ['Marketplace'],
        summary: 'Get template detail',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Template detail',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { template: { $ref: '#/components/schemas/AgentTemplate' } },
                },
              },
            },
          },
        },
      },
    },
    '/v1/marketplace/templates/{id}/install': {
      post: {
        tags: ['Marketplace'],
        summary: 'Install marketplace template',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { turnstileToken: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Template installed' } },
      },
    },
    '/v1/marketplace/templates/{id}/rate': {
      post: {
        tags: ['Marketplace'],
        summary: 'Rate marketplace template',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  turnstileToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Template rated' } },
      },
    },
    '/v1/admin/templates': {
      post: {
        tags: ['Marketplace'],
        summary: 'Create marketplace template (admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'category'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  priceUsd: { type: 'number' },
                  systemPrompt: { type: 'string' },
                  isPublished: { type: 'boolean' },
                  isFeatured: { type: 'boolean' },
                  turnstileResponse: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Template created' } },
      },
    },
    '/v1/admin/templates/{id}': {
      put: {
        tags: ['Marketplace'],
        summary: 'Update marketplace template (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  priceUsd: { type: 'number' },
                  systemPrompt: { type: 'string' },
                  isPublished: { type: 'boolean' },
                  isFeatured: { type: 'boolean' },
                  turnstileResponse: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Template updated' } },
      },
      delete: {
        tags: ['Marketplace'],
        summary: 'Delete marketplace template (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Template deleted' } },
      },
    },
    '/v1/cost/summary': {
      get: {
        tags: ['Cost'],
        summary: 'Cost summary by provider/model',
        parameters: [{ name: 'days', in: 'query', schema: { type: 'integer', default: 30 } }],
        responses: {
          200: {
            description: 'Cost summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    overview: {
                      type: 'object',
                      properties: {
                        totalCostUsd: { type: 'number' },
                        totalTokens: { type: 'integer' },
                        totalRequests: { type: 'integer' },
                        activeProviders: { type: 'integer' },
                        avgLatencyMs: { type: 'number' },
                      },
                    },
                    byProvider: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          provider: { type: 'string' },
                          requests: { type: 'integer' },
                          costUsd: { type: 'number' },
                          tokens: { type: 'integer' },
                        },
                      },
                    },
                    byModel: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          model: { type: 'string' },
                          requests: { type: 'integer' },
                          costUsd: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/cost/entries': {
      get: {
        tags: ['Cost'],
        summary: 'List cost entries',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: {
          200: {
            description: 'Cost entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    entries: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          provider: { type: 'string' },
                          model: { type: 'string' },
                          tokens: { type: 'integer' },
                          costUsd: { type: 'number' },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/analytics/summary': {
      get: {
        tags: ['Analytics'],
        summary: 'Analytics summary (in-memory)',
        responses: { 200: { description: 'Analytics summary' } },
      },
    },
    '/v1/quality/score': {
      post: {
        tags: ['Quality'],
        summary: 'Score response quality',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt', 'response'],
                properties: {
                  prompt: { type: 'string' },
                  response: { type: 'string' },
                  provider: { type: 'string' },
                  model: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Quality score',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    score: { type: 'number', minimum: 0, maximum: 1 },
                    breakdown: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/quality/scores': {
      get: {
        tags: ['Quality'],
        summary: 'List quality scores',
        responses: { 200: { description: 'Score list' } },
      },
    },
    '/v1/quality/stats': {
      get: {
        tags: ['Quality'],
        summary: 'Quality statistics',
        responses: { 200: { description: 'Quality stats' } },
      },
    },
    '/v1/feedback/generate': {
      post: {
        tags: ['Feedback'],
        summary: 'Generate AI feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string' },
                  type: { type: 'string', enum: ['code', 'text', 'general'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Generated feedback' } },
      },
    },
    '/v1/feedback': {
      get: {
        tags: ['Feedback'],
        summary: 'List feedback entries',
        responses: { 200: { description: 'Feedback list' } },
      },
    },
    '/v1/feedback/stats': {
      get: {
        tags: ['Feedback'],
        summary: 'Feedback statistics',
        responses: { 200: { description: 'Feedback stats' } },
      },
    },
    '/v1/feedback/{id}/revision': {
      post: {
        tags: ['Feedback'],
        summary: 'Request feedback revision',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { instructions: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Revised feedback' } },
      },
    },
    '/v1/beta/waitlist': {
      post: {
        tags: ['Beta'],
        summary: 'Join beta waitlist',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: 'string' },
                  company: { type: 'string' },
                  useCase: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Added to waitlist' } },
      },
      get: {
        tags: ['Beta'],
        summary: 'List waitlist entries (admin)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Waitlist entries' } },
      },
    },
    '/v1/beta/waitlist/{id}/status': {
      patch: {
        tags: ['Beta'],
        summary: 'Update waitlist status (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/v1/beta/waitlist/stats': {
      get: {
        tags: ['Beta'],
        summary: 'Waitlist statistics',
        responses: { 200: { description: 'Waitlist stats' } },
      },
    },
    '/v1/beta/feedback': {
      post: {
        tags: ['Beta'],
        summary: 'Submit beta feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['feedback'],
                properties: {
                  feedback: { type: 'string' },
                  category: { type: 'string' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Feedback submitted' } },
      },
      get: {
        tags: ['Beta'],
        summary: 'List beta feedback (admin)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Beta feedback list' } },
      },
    },
    '/v1/agents': {
      get: {
        tags: ['Agent'],
        summary: 'List configured agents',
        responses: {
          200: {
            description: 'Agent list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    agents: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          role: { type: 'string' },
                          model: { type: 'string' },
                          enabled: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/agents/{id}': {
      patch: {
        tags: ['Agent'],
        summary: 'Update agent config (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  model: { type: 'string' },
                  enabled: { type: 'boolean' },
                  complexity: { type: 'string', enum: ['simple', 'medium', 'complex'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Agent updated' } },
      },
    },
    '/v1/admin/llm-providers': {
      get: {
        tags: ['LLM Providers'],
        summary: 'List LLM providers',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Provider list' } },
      },
      post: {
        tags: ['LLM Providers'],
        summary: 'Create LLM provider',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type'],
                properties: {
                  name: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['openai', 'anthropic', 'openai-compatible', 'anthropic-compatible'],
                  },
                  baseUrl: { type: 'string' },
                  apiKey: { type: 'string' },
                  models: { type: 'array', items: { type: 'string' } },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Provider created' } },
      },
    },
    '/v1/admin/llm-providers/{name}': {
      patch: {
        tags: ['LLM Providers'],
        summary: 'Update LLM provider',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  baseUrl: { type: 'string' },
                  apiKey: { type: 'string' },
                  models: { type: 'array', items: { type: 'string' } },
                  enabled: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Provider updated' } },
      },
      delete: {
        tags: ['LLM Providers'],
        summary: 'Delete LLM provider',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Provider deleted' } },
      },
    },
    '/v1/admin/llm-providers/{name}/test': {
      post: {
        tags: ['LLM Providers'],
        summary: 'Test LLM provider connection',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Test result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    latencyMs: { type: 'number' },
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/v1/admin/llm-providers/export': {
      get: {
        tags: ['LLM Providers'],
        summary: 'Export provider config (no API keys)',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Exported config' } },
      },
    },
    '/v1/admin/llm-providers/import': {
      post: {
        tags: ['LLM Providers'],
        summary: 'Import provider config',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['providers'],
                properties: { providers: { type: 'array', items: { type: 'object' } } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Import result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    imported: { type: 'integer' },
                    updated: { type: 'integer' },
                    errors: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from /v1/auth/login or /v1/auth/cli-login',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          roles: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          prompt: { type: 'string' },
          response: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'running', 'completed', 'error'] },
          provider: { type: 'string' },
          model: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AgentTemplate: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          systemPrompt: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          category: { type: 'string' },
          priceUsd: { type: 'number' },
          installCount: { type: 'integer' },
          rating: { type: 'number' },
          ratingCount: { type: 'integer' },
          isPublished: { type: 'boolean' },
          isFeatured: { type: 'boolean' },
          authorId: { type: 'string' },
          authorName: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
    responses: {
      Error: {
        description: 'Error response',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
};
