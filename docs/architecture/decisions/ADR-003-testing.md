# ADR-003: Vitest for Testing

## Status

Accepted

## Context

AgentX needs a fast, modern test framework for unit tests, integration tests, and E2E tests across 40+ packages.

## Decision

Adopt Vitest as the standard test framework:

- Vitest for unit and integration tests
- Custom vitest.e2e.config.ts for E2E tests
- `@vitest/coverage-v8` for code coverage

## Consequences

### Positive

- Native TypeScript/ESM support
- Watch mode with HMR
- Compatible with Jest API
- Fast execution with Vite

### Negative

- Newer ecosystem, fewer plugins than Jest
- Some Jest plugins not compatible
