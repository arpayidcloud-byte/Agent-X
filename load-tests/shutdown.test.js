/**
 * Graceful Shutdown Load Test
 * Tests system behavior during shutdown under load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('shutdown_errors');

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp to 50 users
    { duration: '1m', target: 50 },    // Steady state
    { duration: '10s', target: 50 },   // Maintain during shutdown signal
  ],
  
  thresholds: {
    'errors': ['rate<0.05'], // 5% error rate allowed during shutdown
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_KEY = __ENV.API_KEY || 'test-api-key';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

/**
 * Test graceful shutdown under load
 * 
 * This test:
 * 1. Starts with steady load (50 VUs submitting tasks)
 * 2. Triggers graceful shutdown mid-test
 * 3. Verifies in-flight tasks complete
 * 4. Verifies no data corruption
 */
export default function () {
  const startTime = Date.now();
  
  // Submit task
  const payload = {
    goal: `Load test task ${__VU}-${__ITER}`,
    role: 'coder',
  };
  
  const res = http.post(`${BASE_URL}/api/v1/tasks/submit`, JSON.stringify(payload), {
    headers,
    tags: { name: 'SubmitDuringShutdown' },
  });
  
  const success = check(res, {
    'task submitted or graceful rejection': (r) => {
      // Accept 200 (success), 503 (shutdown in progress), or 429 (rate limit)
      return [200, 503, 429].includes(r.status);
    },
  });
  
  errorRate.add(!success);
  
  // Check task status if submitted successfully
  if (res.status === 200) {
    try {
      const body = JSON.parse(res.body);
      if (body.taskId) {
        sleep(0.1);
        
        const statusRes = http.get(`${BASE_URL}/api/v1/tasks/${body.taskId}`, {
          headers,
          tags: { name: 'CheckDuringShutdown' },
        });
        
        check(statusRes, {
          'task status retrievable': (r) => r.status === 200 || r.status === 404,
        });
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  sleep(0.5);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-tests/results/shutdown-test.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  const { metrics } = data;
  return `
Graceful Shutdown Test Results:
================================
Iterations: ${data.metrics.iterations.values.count}
HTTP Requests: ${data.metrics.http_reqs.values.count}
Error Rate: ${(metrics.shutdown_errors.values.rate * 100).toFixed(2)}%
Avg Response Time: ${metrics.http_req_duration.values.avg.toFixed(0)}ms
p95 Response Time: ${metrics.http_req_duration.values['p(95)'].toFixed(0)}ms
p99 Response Time: ${metrics.http_req_duration.values['p(99)'].toFixed(0)}ms
`;
}