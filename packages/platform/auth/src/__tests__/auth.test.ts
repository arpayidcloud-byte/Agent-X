import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../jwt-auth.service.js';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    auth = new AuthService();
  });

  describe('register', () => {
    it('should register a new user without exposing passwordHash', async () => {
      const user = await auth.register('user@example.com', 'secure-password-123');

      expect(user.id).toBeDefined();
      expect(user.email).toBe('user@example.com');
      expect(user.roles).toEqual(['user']);
      expect(user).not.toHaveProperty('passwordHash');
    });

    it('should reject duplicate email registration', async () => {
      await auth.register('dup@example.com', 'password-1');

      await expect(auth.register('dup@example.com', 'password-2')).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    it('should return auth tokens and user without passwordHash on valid credentials', async () => {
      await auth.register('login@example.com', 'correct-password');

      const result = await auth.login('login@example.com', 'correct-password');

      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.tokens.expiresIn).toBe(3600);
      expect(result.user.email).toBe('login@example.com');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should reject wrong password', async () => {
      await auth.register('wrong@example.com', 'real-password');

      await expect(auth.login('wrong@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should reject unknown email', async () => {
      await expect(auth.login('nobody@example.com', 'any-password')).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('validateToken', () => {
    it('should verify a valid access token and expose payload claims', async () => {
      await auth.register('token@example.com', 'password-123');
      const { tokens } = await auth.login('token@example.com', 'password-123');

      const payload = auth.validateToken(tokens.accessToken);

      expect(payload.email).toBe('token@example.com');
      expect(payload.roles).toEqual(['user']);
      expect(payload.sub).toBeDefined();
      expect(payload.exp).toBeGreaterThan(payload.iat as number);
    });

    it('should reject tampered or invalid tokens', () => {
      expect(() => auth.validateToken('not-a-real-token')).toThrow('Invalid or expired token');
    });
  });

  describe('refreshToken', () => {
    it('should rotate refresh token and return fresh tokens', async () => {
      await auth.register('refresh@example.com', 'password-123');
      const { tokens } = await auth.login('refresh@example.com', 'password-123');

      const rotated = await auth.refreshToken(tokens.refreshToken);

      expect(rotated.accessToken).toBeDefined();
      expect(rotated.refreshToken).not.toBe(tokens.refreshToken);
      expect(rotated.expiresIn).toBe(3600);
    });

    it('should reject invalid or unknown refresh token', async () => {
      await expect(auth.refreshToken('unknown-refresh-token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('logout', () => {
    it('should revoke refresh token so it can no longer be used', async () => {
      await auth.register('logout@example.com', 'password-123');
      const { tokens } = await auth.login('logout@example.com', 'password-123');

      await auth.logout(tokens.refreshToken);

      await expect(auth.refreshToken(tokens.refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });
});
