/**
 * AgentX Load Test Suite
 * Performance and scalability testing with k6
 * 
 * Install k6: https://k6.io/docs/getting-started/installation/
 * Run: k6 run load-tests/performance.test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const taskSubmissionLatency = new Trend('task_submission_latency');
const taskCompletionLatency = new Trend('task_completion_latency');

// Performance budgets
const PERF_BUDGETS = {
  p95Latency: 500,  // ms
  p99Latency: 1000, // ms
  errorRate: 0.01,  // 1%
};

// Test configuration
export const options = {
  // Stage 1: Ramp up to 100 users
  stages: [
    { duration: '30s', target: 100 },  // Ramp to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 500 },  // Ramp to 500 users
    { duration: '2m', target: 500 },   // Stay at 500 users
    { duration: '30s', target: 1000 }, // Ramp to 1000 users
    { duration: '3m', target: 1000 },  // Stay at 1000 users (peak load)
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  
  thresholds: {
    'http_req_duration': [`p(95)<${PERF_BUDGETS.p95Latency}`, `p(99)<${PERF_BUDGETS.p99Latency}`],
    'errors': [`rate<${PERF_BUDGETS.errorRate}`],
    'task_submission_latency': [`p(95)<${PERF_BUDGETS.p95Latency}`],
    'task_completion_latency': [`p(99)<${PERF_BUDGETS.p99Latency}`],
  },
  
  // Scenarios for different user behaviors
  scenarios: {
    // 70% users submit tasks
    submit_task: {
      executor: 'ramping-vus',
      exec: 'submitTask',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 70 },
        { duration: '2m', target: 70 },
        { duration: '30s', target: 0 },
      ],
    },
    
    // 20% users check status
    check_status: {
      executor: 'ramping-vus',
      exec: 'checkStatus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '2m', target: 20 },
        { duration: '30s', target: 0 },
      ],
    },
    
    // 10% users list all tasks
    list_tasks: {
      executor: 'ramping-vus',
      exec: 'listTasks',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '2m', target: 10 },
        { duration: '30s', target: 0 },
      ],
    },
  },
};

// Test data
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_KEY = __ENV.API_KEY || 'test-api-key';

const commonHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

/**
 * Scenario 1: Submit a new task
 * Simulates user submitting a goal for agent execution
 */
export function submitTask() {
  const startTime = Date.now();
  
  const payloads = [
    { goal: 'Write a hello world function', role: 'coder' },
    { goal: 'Review this code for security issues', role: 'reviewer' },
    { goal: 'Write unit tests for user service', role: 'tester' },
    { goal: 'Check for SQL injection vulnerabilities', role: 'security' },
    { goal: 'Refactor the authentication module', role: 'coder' },
  ];
  
  const payload = payloads[Math.floor(Math.random() * payloads.length)];
  
  const params = {
    headers: commonHeaders,
    tags: { name: 'SubmitTask' },
  };
  
  const res = http.post(`${BASE_URL}/api/v1/tasks/submit`, JSON.stringify(payload), params);
  
  const latency = Date.now() - startTime;
  taskSubmissionLatency.add(latency);
  
  const success = check(res, {
    'task submission status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'task submission returns task ID': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.taskId !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  sleep(1); // Think time
}

/**
 * Scenario 2: Check task status
 * Simulates user polling for task completion
 */
export function checkStatus() {
  const startTime = Date.now();
  
  // Use a mix of task IDs (some real, some fake to test error handling)
  const taskIds = [
    'test-task-1',
    'test-task-2',
    'test-task-3',
    'nonexistent-task',
  ];
  
  const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];
  
  const params = {
    headers: commonHeaders,
    tags: { name: 'CheckStatus' },
  };
  
  const res = http.get(`${BASE_URL}/api/v1/tasks/${taskId}`, params);
  
  const latency = Date.now() - startTime;
  taskCompletionLatency.add(latency);
  
  const success = check(res, {
    'status check returns 200 or 404': (r) => r.status === 200 || r.status === 404,
    'status check response is valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  sleep(0.5); // Think time
}

/**
 * Scenario 3: List all tasks
 * Simulates user viewing task dashboard
 */
export function listTasks() {
  const startTime = Date.now();
  
  const params = {
    headers: commonHeaders,
    tags: { name: 'ListTasks' },
  };
  
  const res = http.get(`${BASE_URL}/api/v1/tasks`, params);
  
  const latency = Date.now() - startTime;
  taskCompletionLatency.add(latency);
  
  const success = check(res, {
    'list tasks status is 200': (r) => r.status === 200,
    'list tasks returns array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.tasks);
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  sleep(2); // Think time
}

/**
 * Setup: Create test data before load test
 */
export function setup() {
  console.log('Setting up load test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Performance Budgets:`);
  console.log(`  - p95 Latency: < ${PERF_BUDGETS.p95Latency}ms`);
  console.log(`  - p99 Latency: < ${PERF_BUDGETS.p99Latency}ms`);
  console.log(`  - Error Rate: < ${(PERF_BUDGETS.errorRate * 100).toFixed(1)}%`);
  
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  if (healthRes.status !== 200) {
    throw new Error(`Target system is not healthy: ${healthRes.status}`);
  }
  
  console.log('Target system is healthy ✓');
  
  return { startTime: Date.now() };
}

/**
 * Teardown: Cleanup after load test
 */
export function teardown(data) {
  const duration = Date.now() - data.startTime;
  console.log(`\nLoad test completed in ${(duration / 1000).toFixed(1)}s`);
  console.log('\nPerformance Summary:');
  console.log('  Check k6 HTML report for detailed metrics');
  console.log('  Key metrics: p95 latency, p99 latency, error rate');
}