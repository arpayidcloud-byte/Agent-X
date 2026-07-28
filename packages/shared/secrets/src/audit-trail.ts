import { createHash } from 'crypto';
import * as fs from 'fs';
import { AgentXLoggerFactory } from '@agentx-fast/shared';

const LOG_FILE = process.env.AGENTX_SECRET_AUDIT_LOG;
const logger = new AgentXLoggerFactory().createLogger('secret-audit');

/**
 * Check if audit logging is enabled
 * Disabled in production by default to prevent secret leakage
 */
const isEnabled = (): boolean => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return !!LOG_FILE;
  }
  return true;
};

/**
 * Secure audit trail logging
 *
 * NEVER logs the actual key value - only logs a hash prefix
 * This prevents secret leakage through logs
 *
 * @param key - Secret key identifier (will be hashed)
 * @param action - Action performed (e.g., 'get', 'set', 'rotate')
 */
export const auditTrail = (key: string, action: string): void => {
  if (!isEnabled()) {
    return;
  }

  // Hash the key to prevent leakage - only show first 8 chars of hash
  const keyHash = createHash('sha256').update(key).digest('hex').substring(0, 8);

  if (LOG_FILE) {
    // Write to secure log file
    const entry = `[Secret Audit] ${new Date().toISOString()}: ${action} for key hash: ${keyHash}\n`;
    fs.appendFileSync(LOG_FILE, entry, 'utf8');
  } else if (process.env.NODE_ENV !== 'production') {
    // Use structured logger instead of console.log
    logger.info('Secret audit', { action, keyHash });
  }
};
