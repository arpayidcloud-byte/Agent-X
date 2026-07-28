# Phase 9: Validation Sprint Plan

**Document Version:** 1.0  
**Created:** July 23, 2026  
**Duration:** 2-3 days  
**Goal:** Validate production readiness before v1.0 release

---

## 🎯 Objectives

1. **Verify End-to-End Flow** - CLI → Runtime → Agents → LLM → Tools → Result
2. **Performance Benchmark** - Can handle production load
3. **Security Audit** - No vulnerabilities or leaked secrets
4. **Fix Critical Issues** - Address findings before release

---

## 📋 Day 1: Manual E2E Testing

### 1.1 Environment Setup

**Prerequisites:**

```bash
# 1. Get real API keys
# - Anthropic: https://console.anthropic.com/
# - OpenAI: https://platform.openai.com/api-keys

# 2. Create .env file
cp .env.example .env
# Edit .env with real keys:
# ANTHROPIC_API_KEY=sk-ant-...
# OPENAI_API_KEY=sk-...
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentx
# REDIS_URL=redis://localhost:6379

# 3. Start infrastructure
docker compose up -d postgres redis grafana prometheus

# 4. Build project
pnpm build

# 5. Generate Prisma client
pnpm prisma generate
```

**Verification:**

```bash
# Check services are running
docker ps

# Expected output:
# - agentx-postgres-1
# - agentx-redis-1
# - agentx-grafana-1
# - agentx-prometheus-1
```

---

### 1.2 Test Scenarios

#### Test 1.2.1: Basic Task Submission ✅

```bash
# Command
pnpm ts-node apps/cli/src/index.ts submit "Create a TypeScript function that adds two numbers"

# Expected:
# - Task created with UUID
# - Status: CREATED → QUEUED → RUNNING → COMPLETED
# - Real code generated (not stub)

# Verify
pnpm ts-node apps/cli/src/index.ts status <task-id>
```

**Success Criteria:**

- [ ] Task created successfully
- [ ] Task transitions through all statuses
- [ ] Final output contains valid TypeScript code
- [ ] No "stub" or "theater" responses

---

#### Test 1.2.2: Agent Selection ✅

```bash
# Test different agent roles
pnpm ts-node apps/cli/src/index.ts submit "Review this code for security issues" --role reviewer
pnpm ts-node apps/cli/src/index.ts submit "Write unit tests for this function" --role tester
pnpm ts-node apps/cli/src/index.ts submit "Scan for vulnerabilities" --role security

# Expected:
# - Each agent type responds appropriately
# - Reviewer: Code review comments
# - Tester: Test code
# - Security: Security findings
```

**Success Criteria:**

- [ ] All 4 agent types work (coder, reviewer, tester, security)
- [ ] Agent-specific responses are appropriate
- [ ] No agent returns stub responses

---

#### Test 1.2.3: Tool Execution ✅

```bash
# Test file system tools
pnpm ts-node apps/cli/src/index.ts submit "Create a file called test.txt with content 'hello world'"

# Test git tools
pnpm ts-node apps/cli/src/index.ts submit "Check git status of this repository"

# Test shell tools
pnpm ts-node apps/cli/src/index.ts submit "List files in current directory"

# Expected:
# - Tools execute successfully
# - Real file operations occur
# - Audit trail is logged
```

**Success Criteria:**

- [ ] File operations work (create, read, write)
- [ ] Git operations work (status, diff, log)
- [ ] Shell commands execute
- [ ] All operations logged in audit trail

---

#### Test 1.2.4: Persistence Verification ✅

```bash
# 1. Create task
TASK_ID=$(pnpm ts-node apps/cli/src/index.ts submit "Test persistence" | grep "Task created" | awk '{print $3}')

# 2. Check PostgreSQL
docker exec -it agentx-postgres-1 psql -U postgres -d agentx -c "SELECT * FROM \"Task\" WHERE id = '$TASK_ID';"

# 3. Check events
docker exec -it agentx-postgres-1 psql -U postgres -d agentx -c "SELECT * FROM \"Event\" WHERE \"taskId\" = '$TASK_ID';"

# 4. Check Redis locks
docker exec -it agentx-redis-1 redis-cli KEYS "lock:*"

# Expected:
# - Task exists in PostgreSQL
# - Events are logged
# - Redis locks are created/released properly
```

**Success Criteria:**

- [ ] Tasks persisted to PostgreSQL
- [ ] Events logged correctly
- [ ] Redis locks working
- [ ] Data survives restart

---

#### Test 1.2.5: Observability Verification ✅

```bash
# 1. Check health endpoint
curl http://localhost:3000/health | jq

# Expected:
# {
#   "overall": true,
#   "components": [
#     {"component": "database", "healthy": true},
#     {"component": "redis", "healthy": true},
#     {"component": "provider", "healthy": true}
#   ]
# }

# 2. Check Prometheus metrics
curl http://localhost:9090/metrics | grep agentx

# Expected:
# - agentx_tasks_total
# - agentx_task_duration_seconds
# - agentx_agents_active
# - agentx_health_status

# 3. Check Grafana dashboards
# Open http://localhost:3001
# Verify 5 dashboards are loaded:
# - Overview
# - Agents
# - Tasks
# - Providers
# - Health
```

**Success Criteria:**

- [ ] Health endpoint returns 200 OK
- [ ] All components healthy
- [ ] Prometheus metrics exposed
- [ ] Grafana dashboards loaded

---

### 1.3 Day 1 Checklist

```
[ ] 1.1 Environment setup complete
[ ] 1.2.1 Basic task submission works
[ ] 1.2.2 All agent types work
[ ] 1.2.3 Tool execution works
[ ] 1.2.4 Persistence verified
[ ] 1.2.5 Observability verified

Day 1 Result: [ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes: _________________________________________
```

---

## 📋 Day 2: Performance & Security

### 2.1 Performance Benchmark

#### Test 2.1.1: Concurrent Tasks ✅

```bash
# Install artillery for load testing
npm install -g artillery

# Create load test script
cat > load-test.yml << 'EOF'
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 10  # 10 tasks/second
  variables:
    goals:
      - "Create hello world function"
      - "Write unit tests"
      - "Review code for bugs"
      - "Fix security vulnerability"

scenarios:
  - name: "Submit task"
    requests:
      - post:
          url: "/api/v1/tasks"
          json:
            goal: "{{ goals }}"
            agentType: "coder"
            priority: 1
EOF

# Run load test
artillery run load-test.yml

# Expected metrics:
# - p50 latency < 500ms
# - p95 latency < 2s
# - p99 latency < 5s
# - Error rate < 1%
```

**Success Criteria:**

- [ ] System handles 10 tasks/second
- [ ] p95 latency < 2 seconds
- [ ] Error rate < 1%
- [ ] No memory leaks (heap stable)

---

#### Test 2.1.2: Memory Stress Test ✅

```bash
# Run with memory monitoring
node --expose-gc --inspect dist/index.js

# Monitor heap usage
# Open chrome://inspect
# Take heap snapshots every 5 minutes

# Expected:
# - Heap usage stable (~200-500MB)
# - No continuous growth (memory leak)
# - GC reclaims memory properly
```

**Success Criteria:**

- [ ] Heap usage stable
- [ ] No memory leaks detected
- [ ] GC working properly

---

#### Test 2.1.3: Database Load Test ✅

```bash
# Insert 1000 tasks
for i in {1..1000}; do
  curl -X POST http://localhost:3000/api/v1/tasks \
    -H "Content-Type: application/json" \
    -d "{\"goal\": \"Task $i\", \"agentType\": \"coder\"}" &
done

# Check database performance
docker exec -it agentx-postgres-1 psql -U postgres -d agentx -c "
  SELECT
    count(*) as total_tasks,
    count(*) FILTER (WHERE status = 'COMPLETED') as completed,
    avg(EXTRACT(EPOCH FROM (completedAt - createdAt))) as avg_duration_sec
  FROM \"Task\";
"

# Expected:
# - All 1000 tasks inserted
# - Query time < 100ms
# - No connection pool exhaustion
```

**Success Criteria:**

- [ ] 1000 tasks inserted successfully
- [ ] Query performance acceptable
- [ ] Connection pool stable

---

### 2.2 Security Audit

#### Test 2.2.1: Dependency Scan ✅

```bash
# Check for known vulnerabilities
pnpm audit --audit-level high

# Run snyk (if installed)
npx snyk test

# Expected:
# - No HIGH or CRITICAL vulnerabilities
# - MEDIUM vulnerabilities documented
```

**Success Criteria:**

- [ ] No CRITICAL vulnerabilities
- [ ] No HIGH vulnerabilities
- [ ] MEDIUM vulnerabilities documented

---

#### Test 2.2.2: Secrets Scan ✅

```bash
# Search for hardcoded secrets
echo "=== Checking for AWS keys ==="
grep -r "AKIAIOSFODNN7EXAMPLE" . --exclude-dir=node_modules --exclude-dir=.git

echo "=== Checking for GitHub tokens ==="
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git

echo "=== Checking for private keys ==="
grep -r "BEGIN RSA PRIVATE KEY" . --exclude-dir=node_modules --exclude-dir=.git

echo "=== Checking for API keys ==="
grep -r "sk-ant-" . --exclude-dir=node_modules --exclude-dir=.git --exclude=.env

echo "=== Checking .env not committed ==="
git ls-files | grep "\.env$"

# Expected:
# - No matches found (except in .env which is gitignored)
```

**Success Criteria:**

- [ ] No hardcoded secrets in code
- [ ] .env file not committed
- [ ] No API keys in repository

---

#### Test 2.2.3: Input Validation ✅

```bash
# Test SQL injection
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"goal\": \"'; DROP TABLE \\\"Task\\\"; --\", \"agentType\": \"coder\"}"

# Test XSS
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"goal\": \"<script>alert('xss')</script>\", \"agentType\": \"coder\"}"

# Test path traversal
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d "{\"goal\": \"Read ../../../etc/passwd\", \"agentType\": \"coder\"}"

# Expected:
# - All inputs sanitized
# - No SQL injection possible
# - No XSS possible
# - Path traversal blocked
```

**Success Criteria:**

- [ ] SQL injection blocked
- [ ] XSS blocked
- [ ] Path traversal blocked
- [ ] Input validation working

---

#### Test 2.2.4: Rate Limiting ✅

```bash
# Test rate limiting (100 requests in 10 seconds)
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3000/api/v1/tasks \
    -H "Content-Type: application/json" \
    -d "{\"goal\": \"Test $i\", \"agentType\": \"coder\"}" &
done

# Expected:
# - First 50 requests: 200 OK
# - After limit: 429 Too Many Requests
```

**Success Criteria:**

- [ ] Rate limiting active
- [ ] 429 returned after limit
- [ ] No DoS possible

---

### 2.3 Day 2 Checklist

```
[ ] 2.1.1 Concurrent tasks benchmark
[ ] 2.1.2 Memory stress test
[ ] 2.1.3 Database load test
[ ] 2.2.1 Dependency scan
[ ] 2.2.2 Secrets scan
[ ] 2.2.3 Input validation
[ ] 2.2.4 Rate limiting

Day 2 Result: [ ] PASS  [ ] FAIL  [ ] PARTIAL
Notes: _________________________________________
```

---

## 📋 Day 3: Analysis & Decision

### 3.1 Compile Results

| Test Category | Score     | Status |
| ------------- | --------- | ------ |
| E2E Flow      | _/5       | _/5    |
| Performance   | _/3       | _/3    |
| Security      | _/4       | _/4    |
| **Total**     | **\_/12** |        |

**Scoring:**

- ✅ PASS = 1 point
- ⚠️ PARTIAL = 0.5 points
- ❌ FAIL = 0 points

---

### 3.2 Decision Matrix

| Score     | Decision            | Action                             |
| --------- | ------------------- | ---------------------------------- |
| **11-12** | ✅ PRODUCTION READY | Release v1.0 immediately           |
| **9-10**  | ⚠️ READY WITH NOTES | Release v1.0 with known issues doc |
| **7-8**   | 🟡 NEEDS FIXES      | Fix critical issues, release v1.0  |
| **<7**    | 🔴 NOT READY        | Fix all issues, release v1.1       |

---

### 3.3 Known Issues Document

If score < 12, create `docs/KNOWN_ISSUES.md`:

```markdown
# Known Issues - v1.0

## Critical Issues

(None if score >= 9)

## Medium Issues

- Issue 1: Description, workaround, ETA for fix
- Issue 2: Description, workaround, ETA for fix

## Low Priority

- Issue 3: Description, planned fix in v1.1
```

---

### 3.4 Final Checklist

```
[ ] All test results compiled
[ ] Score calculated
[ ] Decision made (v1.0 or v1.1)
[ ] Known issues documented (if any)
[ ] Release notes prepared
[ ] Stakeholders notified

Final Score: __/12
Decision: [ ] v1.0  [ ] v1.0 with notes  [ ] v1.1

Approved by: ___________________
Date: ___________________
```

---

## 🚀 Post-Validation Actions

### If v1.0 Ready:

```bash
# 1. Create release branch
git checkout -b release/v1.0

# 2. Update version
pnpm changeset version

# 3. Create tag
git tag -a v1.0 -m "Release v1.0 - Production Ready"

# 4. Push release
git push origin release/v1.0 --tags

# 5. Create GitHub release
gh release create v1.0 --title "AgentX v1.0 - Production Ready" --notes "..."

# 6. Deploy to production
docker compose -f docker-compose.prod.yml up -d
```

### If v1.1 Needed:

```bash
# 1. Create issues for all findings
# 2. Prioritize by severity
# 3. Create sprint plan
# 4. Fix critical issues first
# 5. Re-run validation
# 6. Release v1.1
```

---

## 📞 Emergency Contacts

| Role         | Name | Contact |
| ------------ | ---- | ------- |
| Project Lead |      |         |
| DevOps       |      |         |
| Security     |      |         |

---

## 📊 Appendix: Test Templates

### A.1 Load Test Script (Full)

```yaml
# load-test.yml
config:
  target: http://localhost:3000
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 20
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 5
  variables:
    goals:
      - 'Create hello world function'
      - 'Write unit tests'
      - 'Review code'
      - 'Fix bug'

scenarios:
  - name: 'Submit task'
    requests:
      - post:
          url: '/api/v1/tasks'
          json:
            goal: '{{ goals }}'
            agentType: 'coder'
            priority: 1
          expect:
            - statusCode: 201

  - name: 'Check status'
    requests:
      - get:
          url: '/api/v1/tasks/{{ taskId }}'
          expect:
            - statusCode: 200
```

### A.2 Security Scan Script

```bash
#!/bin/bash
# security-scan.sh

echo "=== Starting Security Scan ==="

# 1. Dependency audit
echo "[1/4] Checking dependencies..."
pnpm audit --audit-level high

# 2. Secrets scan
echo "[2/4] Scanning for secrets..."
grep -r "AKIA" . --exclude-dir=node_modules --exclude-dir=.git --exclude=.env
grep -r "ghp_" . --exclude-dir=node_modules --exclude-dir=.git --exclude=.env

# 3. SAST (if available)
echo "[3/4] Running SAST..."
# npm install -g eslint-plugin-security
pnpm eslint --plugin security .

# 4. Report
echo "[4/4] Generating report..."
echo "Security scan complete!"
```

---

**End of Validation Plan**
