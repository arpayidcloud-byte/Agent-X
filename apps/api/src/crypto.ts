// AES-256-GCM encryption for secrets at rest (LLM provider API keys).
//
// Master key: LLM_PROVIDER_ENC_KEY when set (32-byte key, hex/base64 or raw),
// otherwise derived from JWT_SECRET (sha256) so dev works out of the box.
// Payload format: "<iv b64>.<authTag b64>.<ciphertext b64>".

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

function masterKey(): Buffer {
  const enc = process.env.LLM_PROVIDER_ENC_KEY;
  if (enc) {
    // Accept raw 32-byte key, hex, or base64.
    if (/^[0-9a-fA-F]{64}$/.test(enc)) return Buffer.from(enc, 'hex');
    if (/^[A-Za-z0-9+/]{44}={0,2}$/.test(enc)) return Buffer.from(enc, 'base64');
    return Buffer.from(enc, 'utf8').slice(0, 32);
  }
  const source = process.env.JWT_SECRET ?? 'dev-only-insecure-key';
  return createHash('sha256').update(source).digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${tag.toString('base64')}.${enc.toString('base64')}`;
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) throw new Error('Malformed encrypted payload');
  const decipher = createDecipheriv('aes-256-gcm', masterKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
