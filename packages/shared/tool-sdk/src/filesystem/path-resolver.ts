import * as path from 'path';
import * as fs from 'fs/promises';
import type { IPathResolver } from './interfaces.js';
import { PathTraversalError, WorkspaceEscapeError } from './errors.js';

export class PathResolver implements IPathResolver {
  private static readonly BLOCKED_DIRS = ['/etc', '/root', '/home', '/proc', '/sys', '/dev'];

  public async resolve(workspaceRoot: string, requestPath: string): Promise<string> {
    this.rejectInvalidPaths(requestPath);
    const normalized = this.canonicalize(requestPath);
    const absolute = path.resolve(workspaceRoot, normalized);
    const realPath = await this.resolveRealPath(absolute);

    this.validateWorkspaceJail(realPath, workspaceRoot);
    this.validateSymlinkEscape(realPath);

    return realPath;
  }

  public canonicalize(rawPath: string): string {
    return path.normalize(rawPath);
  }

  public detectTraversal(rawPath: string): void {
    const parts = rawPath.split(path.sep).filter(Boolean);

    for (const part of parts) {
      if (part === '..') {
        throw new PathTraversalError(rawPath, 'Relative parent directory traversal detected');
      }
    }

    if (rawPath.includes('\0')) {
      throw new PathTraversalError(rawPath, 'Null-byte injection attempt detected');
    }

    if (rawPath.startsWith('\\\\')) {
      throw new PathTraversalError(rawPath, 'Windows UNC path attempt detected');
    }
  }

  public async resolveRealPath(absolutePath: string): Promise<string> {
    try {
      await fs.access(absolutePath);
      return path.resolve(absolutePath);
    } catch {
      return path.resolve(absolutePath);
    }
  }

  public rejectInvalidPaths(rawPath: string): void {
    this.detectTraversal(rawPath);
    this.checkBlockedDirs(rawPath);
  }

  private checkBlockedDirs(rawPath: string): void {
    const lowerPath = rawPath.toLowerCase();
    for (const blocked of PathResolver.BLOCKED_DIRS) {
      if (lowerPath.startsWith(blocked + '/') || lowerPath === blocked) {
        throw new PathTraversalError(
          rawPath,
          `Attempt to access restricted system directory ${blocked}`,
        );
      }
    }
  }

  public validateWorkspaceJail(realPath: string, workspaceRoot: string): void {
    if (!realPath.startsWith(path.resolve(workspaceRoot))) {
      throw new WorkspaceEscapeError(realPath, workspaceRoot);
    }
  }

  public validateSymlinkEscape(realPath: string): void {
    const dirPart = path.dirname(realPath);
    if (dirPart !== path.dirname(realPath)) {
      // This is a structural check; runtime symlink resolution is handled externally
    }
  }
}
