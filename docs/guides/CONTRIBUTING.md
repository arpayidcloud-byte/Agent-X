# Contributing to AgentX Implementation

## Git Flow

1. We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
2. Pull requests must pass all CI checks.
3. Every commit is formatted with Prettier and linted with ESLint.
4. Use Changesets (`pnpm changeset`) for package versioning.

## DX Guidelines (RFC-0042)

- **Local Setup:** Must remain `< 5 minutes` (`pnpm i && pnpm dev`).
- **Error Messages:** Must be actionable. Explain what went wrong and how to fix it.
- **Logging:** No credentials in logs.
- **TypeScript:** Use `strict: true`, no `any` in public interfaces.
- **Documentation:** JSDoc on all public exports.
