# 🔒 .env Security Hardening

**Last Updated:** July 24, 2026  
**Version:** 1.0  
**Status:** ✅ Implemented

---

## ⚠️ Critical Security Warning

**NEVER commit real API keys to version control!**

This document outlines security best practices for managing secrets and environment variables in AgentX.

---

## File Permissions

### Required Permissions

```bash
# Set restrictive permissions on .env files
chmod 600 .env
chmod 600 .env.local
chmod 600 .env.test

# Verify permissions
ls -la .env*
# Should show: -rw------- (0600) for all .env files
```

### Permission Matrix

| File           | Permissions | Owner     | Purpose                          |
| -------------- | ----------- | --------- | -------------------------------- |
| `.env`         | `0600`      | root:root | Placeholder keys (safe to share) |
| `.env.local`   | `0600`      | root:root | Real keys (NEVER commit)         |
| `.env.test`    | `0600`      | root:root | Test keys (NEVER commit)         |
| `.env.example` | `0644`      | root:root | Template (safe to commit)        |

---

## Key Management

### File Structure

```
/root/Agentx/
├── .env              # Placeholder keys (committed)
├── .env.local        # Real keys (gitignored)
├── .env.test         # Test keys (gitignored)
└── .env.example      # Template (committed)
```

### Best Practices

1. **Use `.env` for placeholder keys only**

   ```bash
   # .env - SAFE TO COMMIT
   ANTHROPIC_API_KEY=sk-ant-placeholder-replace-with-your-key
   OPENAI_API_KEY=sk-placeholder-replace-with-your-key
   ```

2. **Use `.env.local` for real keys**

   ```bash
   # .env.local - NEVER COMMIT
   ANTHROPIC_API_KEY=sk-ant-api03-real-key-here
   OPENAI_API_KEY=sk-proj-real-key-here
   ```

3. **Rotate API keys every 90 days**
   - Set calendar reminder
   - Update `.env.local` with new keys
   - Test with new keys
   - Revoke old keys

4. **Use environment variables in production**
   ```bash
   # Production deployment
   export ANTHROPIC_API_KEY="sk-ant-api03-real-key"
   export OPENAI_API_KEY="sk-proj-real-key"
   ```

---

## Secret Naming Convention

### Standard Format

```
AGENTX_SECRET_{SERVICE}_{KEY_NAME}
```

### Examples

```bash
# Provider API Keys
AGENTX_SECRET_OPENAI_API_KEY=sk-proj-...
AGENTX_SECRET_ANTHROPIC_API_KEY=sk-ant-...
AGENTX_SECRET_GOOGLE_API_KEY=...

# Database
AGENTX_SECRET_DATABASE_URL=postgresql://...
AGENTX_SECRET_REDIS_URL=redis://...

# API Server
AGENTX_SECRET_API_KEY=your-api-key
AGENTX_SECRET_JWT_SECRET=your-jwt-secret
```

### Key Mapping

The `CachedCredentialResolver` automatically maps logical keys to environment variables:

| Logical Key                  | Environment Variable              |
| ---------------------------- | --------------------------------- |
| `provider.openai.api_key`    | `AGENTX_SECRET_OPENAI_API_KEY`    |
| `provider.anthropic.api_key` | `AGENTX_SECRET_ANTHROPIC_API_KEY` |
| `provider.google.api_key`    | `AGENTX_SECRET_GOOGLE_API_KEY`    |

---

## Security Features

### 1. Secure Audit Logging

**File:** `packages/shared/secrets/src/audit-trail.ts`

- ✅ NEVER logs actual key values
- ✅ Only logs SHA256 hash prefix (first 8 chars)
- ✅ Disabled in production by default
- ✅ Optional secure file logging

```typescript
// Example audit log entry
[Secret Audit] 2026-07-24T00:00:00.000Z: get for key hash: a1b2c3d4
```

### 2. Secret Scrubbing

**File:** `packages/shared/tool-sdk/src/shell/environment.ts`

Automatically strips secrets from child process environments:

- `AGENTX_SECRET_*`
- `*_API_KEY`
- `*_TOKEN`
- `*_SECRET`

### 3. Secret Detection

**File:** `packages/shared/security/src/secret-detector.ts`

Scans for 11 secret patterns:

- Anthropic API keys (`sk-ant-...`)
- OpenAI API keys (`sk-...`)
- Google API keys
- AWS credentials
- GitHub tokens
- Slack tokens
- Private keys
- JWT secrets

---

## Pre-commit Hook

### Automatic Security Checks

**File:** `.husky/pre-commit`

The pre-commit hook automatically checks:

1. ✅ `.env` file permissions (must be 0600)
2. ✅ No live API keys in `.env`
3. ✅ No secrets in committed files

### Hook Output

```bash
❌ ERROR: .env file has insecure permissions (644)
   Run: chmod 600 .env

❌ ERROR: .env contains live Anthropic API key
   Use placeholder keys in .env, real keys in .env.local
```

---

## CI/CD Security Checks

### GitHub Actions

**File:** `.github/workflows/security.yml`

```yaml
env-security:
  runs-on: ubuntu-latest
  steps:
    - name: Check .env not committed
      run: |
        if git ls-files | grep -q "^\.env$"; then
          echo "::error::.env file should not be tracked in git"
          exit 1
        fi

    - name: Scan for hardcoded secrets
      run: npm run security:scan
```

### Security Scan Command

```bash
# Run security scan
pnpm run security:scan

# Scan specific directory
pnpm run security:scan --dir packages/
```

---

## Production Deployment

### Environment Variables

In production, use environment variables instead of `.env` files:

```bash
# Docker Compose
services:
  agentx:
    environment:
      - AGENTX_SECRET_OPENAI_API_KEY=${OPENAI_API_KEY}
      - AGENTX_SECRET_ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

### Secret Managers

For production, consider using secret managers:

- **AWS:** Secrets Manager, Parameter Store
- **GCP:** Secret Manager
- **Azure:** Key Vault
- **HashiCorp:** Vault

### Integration Example

```typescript
// AWS Secrets Manager
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient();
const secret = await client.getSecretValue({
  SecretId: 'agentx/prod/api-keys',
});
```

---

## Incident Response

### If Secrets Are Leaked

1. **Immediately rotate all exposed keys**
   - Generate new API keys
   - Update `.env.local` with new keys
   - Revoke old keys

2. **Audit access logs**
   - Check `AGENTX_SECRET_AUDIT_LOG`
   - Review API usage patterns
   - Look for unauthorized access

3. **Update pre-commit hooks**
   - Ensure hooks are installed
   - Run `pnpm prepare` to install hooks

4. **Document the incident**
   - Create incident report
   - Update security documentation
   - Share learnings with team

### Contact

Report security issues to: security@agentx.example.com

---

## Checklist

### Development Setup

- [ ] Copy `.env.example` to `.env.local`
- [ ] Add real API keys to `.env.local`
- [ ] Set permissions: `chmod 600 .env.local`
- [ ] Verify `.env` has placeholder keys only
- [ ] Install pre-commit hooks: `pnpm prepare`

### Production Deployment

- [ ] Use environment variables or secret manager
- [ ] Never deploy `.env` or `.env.local` files
- [ ] Enable secure audit logging
- [ ] Set `NODE_ENV=production`
- [ ] Configure `AGENTX_SECRET_AUDIT_LOG`

### Regular Maintenance

- [ ] Rotate API keys every 90 days
- [ ] Review audit logs monthly
- [ ] Run security scan weekly: `pnpm run security:scan`
- [ ] Update this documentation as needed

---

## References

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App: Config](https://12factor.net/config)
- [AgentX Architecture](../ARCHITECTURE.md)
- [AgentX Deployment](../DEPLOYMENT.md)

---

**Document Owner:** Security Team  
**Review Cycle:** Quarterly  
**Next Review:** October 2026
