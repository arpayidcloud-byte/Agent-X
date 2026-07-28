# AgentX Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** July 2026

---

## 🔍 Common Issues

### Build Errors

#### TypeScript Compilation Errors

**Error:** `Cannot find module '@agentx/...'`

**Solution:**

```bash
pnpm install
pnpm build
```

#### Missing Dependencies

**Error:** `Module not found: 'prom-client'`

**Solution:**

```bash
pnpm install
```

#### Version Conflicts

**Error:** `TS2305: Module has no exported member...`

**Solution:**

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

---

### Runtime Errors

#### Missing Environment Variables

**Error:** `ANTHROPIC_API_KEY is not defined`

**Solution:**

```bash
# Copy template
cp .env.example .env

# Edit .env with your keys
ANTHROPIC_API_KEY=your-key-here
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
```

#### Database Connection Failure

**Error:** `ECONNREFUSED 127.0.0.1:5432`

**Solution:**

```bash
# Start PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16

# Or use docker-compose
docker compose up -d postgres
```

#### Redis Connection Failure

**Error:** `ECONNREFUSED 127.0.0.1:6379`

**Solution:**

```bash
# Start Redis
docker run -d -p 6379:6379 redis:7

# Or use docker-compose
docker compose up -d redis
```

#### Provider API Errors

**Error:** `401 Unauthorized` from Anthropic/OpenAI

**Solution:**

1. Verify API key in `.env`
2. Check API key has correct permissions
3. Verify billing/credits available

---

## 📚 Error Reference

### RuntimeError

**Class:** `@agentx/runtime`

```typescript
class RuntimeError extends Error {
  constructor(message: string, public readonly code: string)
}
```

- **Cause:** General runtime failure
- **Examples:** Task execution failed, agent not found
- **Solution:** Check logs, verify configuration

### RuntimeRecoverableError

**Class:** `@agentx/runtime`

```typescript
class RuntimeRecoverableError extends RuntimeError {
  constructor(message: string, public readonly retryAfter?: number)
}
```

- **Cause:** Temporary failure (retryable)
- **Examples:** Network timeout, service unavailable
- **Solution:** Automatic retry, check service health

### RuntimeTimeoutError

**Class:** `@agentx/runtime`

```typescript
class RuntimeTimeoutError extends RuntimeError {
  constructor(operation: string, timeoutMs: number);
}
```

- **Cause:** Operation exceeded timeout
- **Examples:** Long-running task, slow query
- **Solution:** Increase timeout, optimize query

### PluginError

**Class:** `@agentx/plugin-sdk`

```typescript
class PluginError extends Error {
  constructor(message: string, public readonly pluginName: string)
}
```

- **Cause:** Plugin loading/execution failure
- **Examples:** Invalid manifest, missing entry point
- **Solution:** Validate plugin manifest, check permissions

### ManifestValidationError

**Class:** `@agentx/plugin-sdk`

```typescript
class ManifestValidationError extends PluginError {
  constructor(pluginName: string, public readonly violations: string[])
}
```

- **Cause:** Invalid plugin/task manifest
- **Examples:** Missing required fields, wrong types
- **Solution:** Fix schema violations

### SecretError

**Class:** `@agentx/secrets`

```typescript
class SecretError extends Error {
  constructor(message: string, public readonly secretName?: string)
}
```

- **Cause:** Missing/invalid secrets
- **Examples:** API key not found, expired token
- **Solution:** Configure secrets in `.env`

---

## 🐛 Debug Mode

### Enable Verbose Logging

```bash
# All debug output
DEBUG=* pnpm dev

# AgentX namespaces only
DEBUG=agentx:* pnpm dev

# Specific namespaces
DEBUG=agentx:runtime pnpm dev
DEBUG=agentx:agents pnpm dev
DEBUG=agentx:providers pnpm dev
DEBUG=agentx:workflow pnpm dev
```

### Node.js Debug

```bash
# Inspect mode
node --inspect dist/index.js

# Break on uncaught exceptions
node --inspect-brk dist/index.js
```

### VS Code Debug Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug AgentX",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/apps/cli/src/index.ts",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"]
    }
  ]
}
```

---

## 📊 Log Analysis

### Log Location

| Environment | Location                  |
| ----------- | ------------------------- |
| Development | Console output            |
| Production  | `/var/log/agentx/`        |
| Docker      | `docker logs <container>` |

### Log Format

```json
{
  "level": "error",
  "timestamp": "2026-07-23T16:00:00.000Z",
  "service": "agentx-runtime",
  "traceId": "abc123",
  "spanId": "def456",
  "message": "Task execution failed",
  "error": "RuntimeError: Agent not found",
  "context": {
    "taskId": "task-123",
    "agentType": "coder"
  }
}
```

### Log Levels

| Level   | When to Use          |
| ------- | -------------------- |
| `error` | Failures, exceptions |
| `warn`  | Recoverable issues   |
| `info`  | Important events     |
| `debug` | Detailed debugging   |
| `trace` | Full execution trace |

### Search Logs

```bash
# Find errors
grep '"level":"error"' /var/log/agentx/*.log

# Find specific task
grep 'task-123' /var/log/agentx/*.log

# Time range
grep '2026-07-23T16:' /var/log/agentx/*.log
```

---

## ❤️ Health Checks

### Check All Components

```bash
curl http://localhost:3000/health
```

**Response:**

```json
{
  "overall": true,
  "components": [
    { "component": "database", "healthy": true, "latencyMs": 5 },
    { "component": "redis", "healthy": true, "latencyMs": 2 },
    { "component": "provider", "healthy": true, "latencyMs": 150 }
  ],
  "timestamp": "2026-07-23T16:00:00.000Z",
  "uptimeMs": 3600000
}
```

### Check Individual Components

```bash
# Database
curl http://localhost:3000/health/db

# Redis
curl http://localhost:3000/health/redis

# Provider
curl http://localhost:3000/health/provider
```

### Health Check Failures

| Component  | Common Issues                   | Solution                                 |
| ---------- | ------------------------------- | ---------------------------------------- |
| `database` | Connection refused, auth failed | Start PostgreSQL, check credentials      |
| `redis`    | Connection refused              | Start Redis                              |
| `provider` | 401 Unauthorized, rate limit    | Check API key, wait for rate limit reset |

---

## ⚡ Performance Issues

### Slow Queries

**Symptoms:** High latency, timeout errors

**Diagnosis:**

```bash
# Enable query logging
DATABASE_DEBUG=true pnpm dev

# Check slow queries
grep 'slow query' /var/log/agentx/*.log
```

**Solutions:**

1. Add database indexes
2. Optimize queries
3. Use connection pooling
4. Cache frequent queries

### High Memory Usage

**Symptoms:** OOM errors, slow performance

**Diagnosis:**

```bash
# Monitor heap
node --inspect --expose-gc dist/index.js

# Check memory in logs
grep 'memory usage' /var/log/agentx/*.log
```

**Solutions:**

1. Increase Node.js heap: `NODE_OPTIONS="--max-old-space-size=4096"`
2. Fix memory leaks (check event listeners, caches)
3. Reduce worker pool size

### High CPU Usage

**Symptoms:** Slow response, high load average

**Diagnosis:**

```bash
# Profile CPU
node --prof dist/index.js

# Analyze profile
node --prof-process isolate-*.log
```

**Solutions:**

1. Optimize hot paths
2. Check infinite loops
3. Reduce concurrent workers
4. Use caching

---

## 🔧 CLI Commands

### Reset Runtime

```bash
# Clear all tasks and events
pnpm ts-node apps/cli/src/index.ts reset-runtime
```

### Check Configuration

```bash
# Show current config
pnpm ts-node apps/cli/src/index.ts config

# Set config
pnpm ts-node apps/cli/src/index.ts config set provider anthropic
```

### View Task History

```bash
# List all tasks
pnpm ts-node apps/cli/src/index.ts status

# View specific task
pnpm ts-node apps/cli/src/index.ts status <task-id>
```

---

## 🆘 Getting Help

### Resources

- **Documentation:** `/docs` folder
- **Architecture:** `ARCHITECTURE.md`
- **Deployment:** `DEPLOYMENT.md`
- **Contributing:** `CONTRIBUTING.md`

### Support Channels

- **GitHub Issues:** https://github.com/arpayidcloud-byte/Agentx/issues
- **Discussions:** https://github.com/arpayidcloud-byte/Agentx/discussions

### What to Include in Bug Reports

1. **Environment:**
   - Node.js version: `node --version`
   - pnpm version: `pnpm --version`
   - OS: `uname -a`

2. **Logs:**
   - Full error stack trace
   - Relevant log excerpts

3. **Steps to Reproduce:**
   - Exact commands run
   - Expected vs actual behavior

4. **Configuration:**
   - `.env` (redact secrets)
   - `docker-compose.yml` if applicable

---

## 📖 Additional Resources

| Topic               | File                          |
| ------------------- | ----------------------------- |
| Architecture        | `ARCHITECTURE.md`             |
| Development Setup   | `CONTRIBUTING.md`             |
| Deployment          | `DEPLOYMENT.md`               |
| Code Examples       | `docs/examples/README.md`     |
| Workflow            | `WORKFLOW.md`                 |
| Implementation Plan | `IMPLEMENTATION_PLAN_2026.md` |
