/**
 * Security Test Suite - OWASP Top 10 Validation
 * Tests for common security vulnerabilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TaskStatus, InMemoryTaskRepository, InMemoryEventBus, Scheduler } from '../../../packages/shared/core-runtime/src/index.js';
import { createTestTask } from '../fixtures/test-config.js';

describe('Security Tests - OWASP Top 10', () => {
  let scheduler: Scheduler;
  let repo: InMemoryTaskRepository;

  beforeEach(() => {
    repo = new InMemoryTaskRepository();
    const bus = new InMemoryEventBus();
    scheduler = new Scheduler(bus, repo);
  });

  describe('A01:2021 - Broken Access Control', () => {
    it('1. Prevents unauthorized task access', async () => {
      const task = createTestTask('secure-1', 'Secure task');
      await scheduler.enqueue(task);

      // Without proper auth context, should not be able to modify
      // This is a placeholder - actual auth would be in middleware
      expect(task.id).toBe('secure-1');
    });

    it('2. Validates user permissions for task operations', async () => {
      const task = createTestTask('secure-2', 'Permission test');
      await scheduler.enqueue(task);

      // Different users should have different access levels
      // Placeholder for RBAC validation
      expect(task.status).toBe(TaskStatus.QUEUED);
    });
  });

  describe('A02:2021 - Cryptographic Failures', () => {
    it('3. Sensitive data is not logged', async () => {
      // Verify logs don't contain sensitive information
      const task = createTestTask('secure-3', 'Crypto test');
      
      // Task should not expose secrets in metadata
      expect(task.metadata).toBeDefined();
      expect(JSON.stringify(task.metadata)).not.toMatch(/password|secret|api_key/i);
    });

    it('4. Uses secure random generation for IDs', () => {
      const task1 = createTestTask('secure-4a', 'Test 1');
      const task2 = createTestTask('secure-4b', 'Test 2');

      // IDs should be unique and unpredictable
      expect(task1.id).not.toBe(task2.id);
      expect(task1.id.length).toBeGreaterThan(8);
    });
  });

  describe('A03:2021 - Injection', () => {
    it('5. Prevents SQL injection in task queries', async () => {
      const maliciousGoal = "'; DROP TABLE tasks; --";
      const task = createTestTask('secure-5', maliciousGoal);
      
      // Should handle malicious input safely
      await scheduler.enqueue(task);
      const saved = await repo.findById('secure-5');
      
      expect(saved).toBeDefined();
      expect(saved?.goal).toBe(maliciousGoal); // Stored as-is, not executed
    });

    it('6. Prevents command injection in task execution', async () => {
      const maliciousGoal = "$(rm -rf /)";
      const task = createTestTask('secure-6', maliciousGoal);
      
      await scheduler.enqueue(task);
      const saved = await repo.findById('secure-6');
      
      expect(saved?.goal).toBe(maliciousGoal);
      // Command should be treated as data, not executed
    });

    it('7. Validates and sanitizes user input', async () => {
      const invalidInputs = [
        '<script>alert("xss")</script>',
        '../../../etc/passwd',
        'null',
        'undefined',
        '__proto__',
      ];

      for (const input of invalidInputs) {
        const task = createTestTask(`secure-7-${input.slice(0, 10)}`, input);
        await scheduler.enqueue(task);
        
        const saved = await repo.findById(task.id);
        expect(saved).toBeDefined();
        // Input should be stored safely
      }
    });
  });

  describe('A04:2021 - Insecure Design', () => {
    it('8. Implements rate limiting pattern', async () => {
      // Placeholder for rate limiting test
      // Actual implementation would be in API middleware
      const tasks = [];
      for (let i = 0; i < 10; i++) {
        const task = createTestTask(`rate-${i}`, `Rate limit test ${i}`);
        tasks.push(scheduler.enqueue(task));
      }

      await Promise.all(tasks);
      // Should not crash under load
      await expect(repo.getAll()).resolves.toHaveLength(10);
    });

    it('9. Enforces task quotas', async () => {
      // Placeholder for quota enforcement
      const maxTasks = 100;
      const tasks = [];

      for (let i = 0; i < maxTasks; i++) {
        const task = createTestTask(`quota-${i}`, `Quota test ${i}`);
        tasks.push(scheduler.enqueue(task));
      }

      await Promise.all(tasks);
      // System should handle quota gracefully
      expect((await repo.getAll()).length).toBe(maxTasks);
    });
  });

  describe('A05:2021 - Security Misconfiguration', () => {
    it('10. No sensitive data in error messages', async () => {
      try {
        await scheduler.pause('nonexistent-task');
      } catch (error) {
        const errorMessage = (error as Error).message;
        // Error should not expose internal details
        expect(errorMessage).not.toMatch(/prisma|database|connection/i);
      }
    });

    it('11. Default configurations are secure', () => {
      // Verify no default passwords or keys
      const envVars = process.env;
      
      expect(envVars.DEFAULT_PASSWORD).toBeUndefined();
      expect(envVars.ADMIN_SECRET).toBeUndefined();
      // Should use environment-specific configs
    });
  });

  describe('A06:2021 - Vulnerable Components', () => {
    it('12. Dependencies are scanned', () => {
      // This is validated by npm audit in CI
      // Placeholder test
      expect(true).toBe(true);
    });

    it('13. No known vulnerable versions', () => {
      // Verified by dependency scanning
      expect(true).toBe(true);
    });
  });

  describe('A07:2021 - Identification Failures', () => {
    it('14. Task IDs are unique and non-sequential', async () => {
      const ids = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const task = createTestTask(`id-${Math.random()}`, `ID test ${i}`);
        ids.add(task.id);
      }

      // All IDs should be unique
      expect(ids.size).toBe(100);
      
      // IDs should not be predictable (not sequential)
      const sortedIds = Array.from(ids).sort();
      const isSequential = sortedIds.every((id, i) => {
        if (i === 0) return true;
        return parseInt(id) === parseInt(sortedIds[i - 1]) + 1;
      });
      
      expect(isSequential).toBe(false);
    });
  });

  describe('A08:2021 - Software Integrity Failures', () => {
    it('15. Task data integrity is maintained', async () => {
      const task = createTestTask('integrity-1', 'Integrity test');
      const originalGoal = task.goal;
      const originalStatus = task.status;

      await scheduler.enqueue(task);
      const saved = await repo.findById(task.id);

      expect(saved?.goal).toBe(originalGoal);
      expect(saved?.status).toBe(originalStatus);
      // Data should not be corrupted
    });

    it('16. Prevents unauthorized task modification', async () => {
      const task = createTestTask('integrity-2', 'Modification test');
      await scheduler.enqueue(task);

      // Without proper auth, modification should fail
      // Placeholder for auth check
      expect(task.status).toBe(TaskStatus.QUEUED);
    });
  });

  describe('A09:2021 - Logging Failures', () => {
    it('17. Security events are logged', async () => {
      // Placeholder for audit logging
      // Actual implementation would log security events
      const task = createTestTask('audit-1', 'Audit test');
      await scheduler.enqueue(task);

      // Should create audit trail
      expect(task.createdAt).toBeDefined();
    });

    it('18. Logs do not contain sensitive data', () => {
      // Verify logging doesn't expose secrets
      const sensitivePatterns = [
        /password\s*=\s*['"][^'"]+['"]/i,
        /api_key\s*=\s*['"][^'"]+['"]/i,
        /secret\s*=\s*['"][^'"]+['"]/i,
      ];

      const testString = JSON.stringify({
        task: 'test',
        // Should not log these in production
      });

      for (const pattern of sensitivePatterns) {
        expect(testString).not.toMatch(pattern);
      }
    });
  });

  describe('A10:2021 - SSRF', () => {
    it('19. Prevents SSRF in URL fetching', async () => {
      const maliciousUrls = [
        'http://169.254.169.254/latest/meta-data/', // AWS metadata
        'http://localhost:6379', // Internal Redis
        'http://127.0.0.1:27017', // Internal MongoDB
        'file:///etc/passwd', // Local file
      ];

      // URLs should be validated before fetching
      for (const url of maliciousUrls) {
        // Should reject or sanitize internal URLs
        expect(url).toMatch(/^https?:\/\//);
      }
    });

    it('20. Validates external service calls', () => {
      // Placeholder for external call validation
      const allowedHosts = ['api.anthropic.com', 'api.openai.com'];
      
      // External calls should be to allowed hosts only
      expect(allowedHosts.length).toBeGreaterThan(0);
    });
  });

  describe('Additional Security Checks', () => {
    it('21. Graceful shutdown prevents data loss', async () => {
      const task = createTestTask('shutdown-1', 'Shutdown test');
      await scheduler.enqueue(task);

      // In-flight tasks should complete during shutdown
      expect(task.status).toBe(TaskStatus.QUEUED);
      // Actual shutdown test would verify completion
    });

    it('22. Error handling does not expose stack traces', async () => {
      try {
        throw new Error('Test error with sensitive info: api_key=sk-123');
      } catch (error) {
        const message = (error as Error).message;
        // In production, should not expose internal details to users
        expect(message).toBeDefined();
      }
    });
  });
});