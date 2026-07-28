# AgentX Load Tests

Performance and scalability testing suite using [k6](https://k6.io/).

## Prerequisites

### Install k6

**macOS:**

```bash
brew install k6
```

**Linux:**

```bash
curl https://k6.io/install.sh | sudo bash
```

**Windows:**

```bash
choco install k6
```

**Docker:**

```bash
docker run --rm grafana/k6 version
```

## Running Load Tests

### Performance Test (100-1000 concurrent users)

```bash
# Basic run
k6 run load-tests/performance.test.js

# With custom base URL
BASE_URL=http://localhost:3000 k6 run load-tests/performance.test.js

# With API key
BASE_URL=http://localhost:3000 API_KEY=your-key k6 run load-tests/performance.test.js

# Generate HTML report
k6 run load-tests/performance.test.js | tee summary.json
k6 convert summary.json --output report.html
```

### Graceful Shutdown Test

```bash
# Test shutdown under load
k6 run load-tests/shutdown.test.js

# With custom URL
BASE_URL=http://localhost:3000 k6 run load-tests/shutdown.test.js
```

## Test Scenarios

### Performance Test

**Objective:** Validate system performance under increasing load

**Stages:**

1. **Ramp-up** (30s): 0 → 100 users
2. **Steady** (1m): 100 users
3. **Ramp-up** (30s): 100 → 500 users
4. **Steady** (2m): 500 users
5. **Ramp-up** (30s): 500 → 1000 users (peak)
6. **Peak** (3m): 1000 users
7. **Ramp-down** (30s): 1000 → 0 users

**User Behavior:**

- 70% submit tasks
- 20% check task status
- 10% list all tasks

### Graceful Shutdown Test

**Objective:** Verify system handles shutdown gracefully under load

**Stages:**

1. **Ramp-up** (30s): 0 → 50 users
2. **Steady** (1m): 50 users
3. **Shutdown** (10s): Trigger SIGTERM, verify in-flight completion

## Performance Budgets

| Metric          | Threshold      | Description                       |
| --------------- | -------------- | --------------------------------- |
| p95 Latency     | < 500ms        | 95% of requests faster than 500ms |
| p99 Latency     | < 1000ms       | 99% of requests faster than 1s    |
| Error Rate      | < 1%           | Less than 1% failed requests      |
| Task Submission | < 500ms (p95)  | Task creation latency             |
| Task Completion | < 1000ms (p99) | Task status check latency         |

## Interpreting Results

### k6 Output Example

```
     ✓ http_req_duration
      ✓ p(95)<500
      ✓ p(99)<1000
     ✓ errors
      ✓ rate<0.01
```

✅ **All thresholds met** - System is performing within budget  
❌ **Threshold failed** - System needs optimization

### Key Metrics

**HTTP Request Duration:**

- `avg`: Average response time
- `min`: Fastest response
- `med`: Median response time
- `p(90)`: 90th percentile
- `p(95)`: 95th percentile (performance budget)
- `p(99)`: 99th percentile (performance budget)
- `max`: Slowest response

**Error Rate:**

- Percentage of failed requests
- Should be < 1% for production readiness

**Throughput:**

- Requests per second (reqs/s)
- Higher is better, but watch for saturation

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run Load Tests
  run: |
    npm install -g k6
    k6 run load-tests/performance.test.js

- name: Upload Load Test Results
  uses: actions/upload-artifact@v3
  with:
    name: load-test-results
    path: load-tests/results/
```

### Docker

```yaml
services:
  k6:
    image: grafana/k6:latest
    volumes:
      - ./load-tests:/scripts
    environment:
      - BASE_URL=http://api:3000
    command: run /scripts/performance.test.js
```

## Troubleshooting

### High Latency

**Symptoms:** p95 or p99 exceeds budget

**Actions:**

1. Check database query performance
2. Review LLM provider response times
3. Analyze resource utilization (CPU, memory)
4. Check for connection pool exhaustion

### High Error Rate

**Symptoms:** Error rate > 1%

**Actions:**

1. Check application logs for errors
2. Verify database connections
3. Review rate limiting configuration
4. Check LLM provider availability

### Test Fails to Connect

**Symptoms:** Connection refused errors

**Actions:**

1. Verify target system is running: `curl http://localhost:3000/health`
2. Check firewall rules
3. Verify BASE_URL environment variable
4. Ensure system has capacity for load test

## Performance Optimization Tips

1. **Database:**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Implement query caching

2. **LLM Providers:**
   - Implement request batching
   - Use response caching
   - Configure appropriate timeouts

3. **Application:**
   - Enable compression
   - Use CDN for static assets
   - Implement rate limiting

4. **Infrastructure:**
   - Scale horizontally under load
   - Use auto-scaling groups
   - Implement circuit breakers

## References

- [k6 Documentation](https://k6.io/docs/)
- [Performance Testing Best Practices](https://k6.io/docs/guides/)
- [Thresholds & Assertions](https://k6.io/docs/using-k6/thresholds/)

---

**Last Updated:** July 26, 2026  
**Test Suite Version:** 1.0.0  
**k6 Version:** 0.45+
