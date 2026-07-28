import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface JWTPayload {
  sub: string; // subject (user ID)
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  tokens: AuthTokens;
}

export class AuthService {
  private users = new Map<string, User>();
  private refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();

  private readonly JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  private readonly ACCESS_TOKEN_TTL = 3600; // 1 hour
  private readonly REFRESH_TOKEN_TTL = 86400000; // 24 hours

  async register(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
    const existingUser = Array.from(this.users.values()).find((u) => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      email,
      passwordHash,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const tokenData = this.refreshTokens.get(refreshToken);
    if (!tokenData || new Date() > tokenData.expiresAt) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = this.users.get(tokenData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    this.refreshTokens.delete(refreshToken);
    const tokens = this.generateTokens(user);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    this.refreshTokens.delete(refreshToken);
  }

  validateToken(token: string): JWTPayload {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private generateTokens(user: User): AuthTokens {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ACCESS_TOKEN_TTL,
    };
  }

  private generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });
  }

  private generateRefreshToken(user: User): string {
    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_TTL);

    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      expiresAt,
    });

    return refreshToken;
  }
}
