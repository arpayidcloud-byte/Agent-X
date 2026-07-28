import type { IFilesystemPolicy, FilesystemConfig } from './interfaces.js';
import { FileTooLargeError } from './errors.js';

export class FilesystemPolicy implements IFilesystemPolicy {
  private config: FilesystemConfig;
  private allowedReadPatterns: string[];
  private allowedWritePatterns: string[];

  constructor(config: FilesystemConfig) {
    this.config = config;
    this.allowedReadPatterns = config.allowedReadPatterns || config.allow || [];
    this.allowedWritePatterns = config.allowedWritePatterns || config.allow || [];
  }

  public getConfig(): FilesystemConfig {
    return this.config;
  }

  public isAllowed(realPath: string, operation?: 'read' | 'write'): boolean {
    const pathParts = realPath.split('/').filter(Boolean);

    if (!this.config.allowHiddenFiles) {
      const hasHiddenPart = pathParts.some((part) => part.startsWith('.'));
      if (hasHiddenPart) {
        return false;
      }
    }

    const patterns = operation === 'write' ? this.allowedWritePatterns : this.allowedReadPatterns;
    return patterns.some((pattern) => this.matchesPattern(realPath, pattern));
  }

  public isReadAllowed(realPath: string): boolean {
    return this.isAllowed(realPath, 'read');
  }

  public isWriteAllowed(realPath: string): boolean {
    return this.isAllowed(realPath, 'write');
  }

  public validateFileSize(sizeBytes: number): void {
    if (sizeBytes > this.config.maxFileSizeBytes) {
      throw new FileTooLargeError(sizeBytes, this.config.maxFileSizeBytes);
    }
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    const normalizedPath = filePath.replace(/^\//, '');
    const normalizedPattern = pattern.replace(/^\//, '');

    const patternParts = normalizedPattern.split('/');
    const pathParts = normalizedPath.split('/');

    if (patternParts.length > pathParts.length) return false;

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i] as string;
      const pathPart = pathParts[i] as string;
      if (patternPart === '**') return true;
      if (!patternPart.includes('*')) {
        if (patternPart !== pathPart) return false;
      } else {
        const regex = new RegExp('^' + patternPart.replace(/\*/g, '[^/]*') + '$');
        if (!regex.test(pathPart)) return false;
      }
    }

    return patternParts.length === pathParts.length;
  }
}
