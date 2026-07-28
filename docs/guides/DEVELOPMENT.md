# Development Guide

## Environment

- Node 20.x
- pnpm 8+ (or 11.x)
- Docker (for PostgreSQL & Redis)

## Scripts

- `pnpm build`: Build all packages via Turborepo
- `pnpm dev`: Start watching and rebuilding
- `pnpm lint`: Run ESLint across workspace
- `pnpm lint:handbook`: Run handbook validations (schema, refs)
- `pnpm test`: Run vitest tests
- `pnpm typecheck`: Run tsc typecheck

## Testing

We use `vitest` for fast execution. Contract tests (`08-Examples/*`) validate Volume interfaces.

## Releasing

Releases are handled via `@changesets/cli`.
Run `pnpm changeset` when making a significant change.
