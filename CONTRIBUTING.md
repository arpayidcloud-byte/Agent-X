# Contributing to AgentX

Thank you for your interest in contributing to AgentX! This guide will help you get started with the development workflow.

## 1. Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 11.0.0
- **Docker** (for PostgreSQL, Redis, and other services)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/agentx.git
cd agentx

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development services (PostgreSQL, Redis)
docker compose up -d
```

### Development Setup

```bash
# Build all packages
pnpm build

# Start development mode (watch & rebuild)
pnpm dev

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 2. Development Workflow

### Branch Naming

Use descriptive branch names with prefix with the type of change:

- `feat/` - New features (e.g., `feat/add-auth-middleware`)
- `fix/` - Bug fixes (e.g., `fix/resolve-login-error`)
- `docs/` - Documentation updates (e.g., `docs/update-api-docs`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `refactor/` - Code refactoring (e.g., `refactor/simplify-auth-flow`)
- `test/` - Adding or updating tests (e.g., `test/add-unit-tests`)

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages. This enables automatic changelog generation and semantic versioning.

**Format:**

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without functionality changes
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes

**Examples:**

```
feat(auth): add JWT token refresh mechanism

fix(api-server): resolve null pointer in user handler

docs(readme): update installation instructions

chore(deps): upgrade TypeScript to 5.4.5
```

### Pull Request Process

1. **Create a branch** from `main` following the naming convention
2. **Make your changes** in small, focused commits
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Push your branch** and create a PR
6. **Fill out the PR template** completely
7. **Request review** from maintainers
8. **Address feedback** promptly
9. **Squash and merge** once approved

## 3. Code Standards

### TypeScript Strict Mode

All packages use TypeScript strict mode. Key rules:

- No `any` types in public interfaces
- Explicit return types for exported functions
- Use `unknown` instead of `any` when type is uncertain
- Leverage TypeScript's type inference where appropriate

```typescript
// Good
export function processUser(user: User): ProcessedUser {
  // implementation
}

// Bad
export function processUser(user: any): any {
  // implementation
}
```

### ESLint Rules

We use ESLint with the following configuration:

- `@typescript-eslint/eslint-plugin` for TypeScript-specific rules
- `eslint-config-prettier` to disable formatting rules
- `eslint-plugin-prettier` to run Prettier as an ESLint rule

Run linting:

```bash
pnpm lint
```

Fix auto-fixable issues:

```bash
pnpm lint --fix
```

### Prettier Formatting

All code is formatted with Prettier. Configuration is in `.prettierrc.js`:

```javascript
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
};
```

Run formatting:

```bash
pnpm format
```

Check formatting without making changes:

```bash
pnpm format:check
```

### Import Conventions

Use absolute imports with the `@agentx/` prefix for internal packages:

```typescript
// Good
import { UserService } from '@agentx/auth';
import { Logger } from '@agentx/shared';

// Bad
import { UserService } from '../../packages/auth/src';
import { Logger } from '../../../shared/src';
```

**Import order:**

1. Node.js built-in modules
2. External packages
3. Internal packages (`@agentx/*`)
4. Local modules (relative imports)

## 4. Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e
```

### Writing Tests (Vitest)

We use [Vitest](https://vitest.dev/) for testing. Tests should be:

- **Fast**: Unit tests should run in milliseconds
- **Isolated**: No dependencies on external services
- **Deterministic**: Same result every time
- **Readable**: Clear test names and assertions

**Test file structure:**

```
packages/
  auth/
    src/
      services/
        user.service.ts
        user.service.test.ts  # Test file next to source
```

**Example test:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const service = new UserService();
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should throw error for invalid email', async () => {
      const service = new UserService();

      await expect(
        service.createUser({
          email: 'invalid',
          name: 'Test User',
        }),
      ).rejects.toThrow('Invalid email');
    });
  });
});
```

### Coverage Requirements

- Minimum coverage threshold: 80%
- Focus on testing business logic and edge cases
- Don't chase 100% coverage at the expense of test quality

## 5. Monorepo Structure

### Package Naming

All internal packages use the `@agentx/` scope:

```
@agentx/shared
@agentx/auth
@agentx/api-server
@agentx/runtime
@agentx/provider
```

### Workspace Layout

```
agentx/
├── apps/                    # Applications
│   └── api-server/         # Main API server
├── packages/                # Shared packages
│   ├── shared/             # Common utilities
│   │   ├── shared/         # @agentx/shared
│   │   ├── cache/          # @agentx/cache
│   │   └── ...
│   ├── auth/               # Authentication
│   ├── runtime/            # Runtime engine
│   └── ...
├── tooling/                 # Development tools
│   └── eslint-plugin/      # Custom ESLint rules
├── tests/                   # End-to-end tests
└── docs/                    # Documentation
```

### Adding New Packages

1. **Create the package directory:**

   ```bash
   mkdir -p packages/<category>/<package-name>
   ```

2. **Initialize package.json:**

   ```json
   {
     "name": "@agentx/<package-name>",
     "version": "0.1.0",
     "private": true,
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "scripts": {
       "build": "tsc --build",
       "typecheck": "tsc --noEmit",
       "test": "vitest run",
       "test:coverage": "vitest run --coverage",
       "lint": "eslint src/"
     },
     "devDependencies": {
       "@vitest/coverage-v8": "1.6.0",
       "typescript": "5.4.5",
       "vitest": "1.6.0"
     }
   }
   ```

3. **Add to pnpm-workspace.yaml** (if new category):

   ```yaml
   packages:
     - 'packages/*/*'
     - 'apps/*'
     - 'tooling/*'
   ```

4. **Create tsconfig.json:**

   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": "./src"
     },
     "include": ["src/**/*"]
   }
   ```

5. **Create src/index.ts** as the entry point

### Dependencies Between Packages

Use workspace protocol for internal dependencies:

```json
{
  "dependencies": {
    "@agentx/shared": "workspace:*",
    "@agentx/auth": "workspace:*"
  }
}
```

**Dependency rules:**

- Shared packages should not depend on application packages
- Follow the dependency hierarchy: `shared` → `core` → `features` → `apps`
- Avoid circular dependencies

## 6. Documentation

### JSDoc Comments

All public exports must have JSDoc comments:

````typescript
/**
 * Processes a user authentication request.
 *
 * @param credentials - The user credentials to validate
 * @returns Promise resolving to the authentication result
 * @throws {AuthenticationError} If credentials are invalid
 *
 * @example
 * ```typescript
 * const result = await authenticate({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 * ```
 */
export async function authenticate(credentials: Credentials): Promise<AuthResult> {
  // implementation
}
````

### README Updates

Each package should have a README.md with:

- Package description
- Installation instructions
- Usage examples
- API reference (if applicable)

### Architecture Docs

Major architectural decisions should be documented in:

- `ARCHITECTURE.md` - High-level system architecture
- `docs/design/` - Detailed design documents
- `docs/guides/` - Development guides

## 7. PR Checklist

Before submitting a PR, ensure:

- [ ] **Typecheck passes**: `pnpm typecheck`
- [ ] **Lint passes**: `pnpm lint`
- [ ] **Tests pass**: `pnpm test`
- [ ] **Coverage threshold met**: `pnpm test:coverage` (minimum 80%)
- [ ] **Formatting correct**: `pnpm format:check`
- [ ] **Documentation updated** (if applicable)
- [ ] **Changeset added** (if publishing packages): `pnpm changeset`
- [ ] **Commit messages follow Conventional Commits**
- [ ] **PR description filled out completely**
- [ ] **No secrets or credentials in code**
- [ ] **No `any` types in public interfaces**

## Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check `docs/` directory for detailed guides

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
