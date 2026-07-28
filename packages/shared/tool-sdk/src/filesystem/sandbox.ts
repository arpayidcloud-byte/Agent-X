import * as path from 'path';
import * as fs from 'fs/promises';
import type { ISandbox, IPathResolver, IFilesystemPolicy } from './interfaces.js';
import { SandboxViolationError, AllowlistViolationError } from './errors.js';

export class FilesystemSandbox implements ISandbox {
  constructor(
    public readonly workspaceRoot: string,
    private readonly pathResolver: IPathResolver,
    private readonly policy: IFilesystemPolicy,
  ) {}

  public async validateRead(requestPath: string): Promise<string> {
    return this.validateAccess(requestPath, 'read');
  }

  public async validateWrite(requestPath: string): Promise<string> {
    return this.validateAccess(requestPath, 'write');
  }

  private async validateAccess(requestPath: string, _operation: string): Promise<string> {
    if (!this.workspaceRoot) {
      throw new SandboxViolationError('Workspace root is not configured');
    }

    const resolvedPath = await this.pathResolver.resolve(this.workspaceRoot, requestPath);

    this.validateWorkspaceJail(resolvedPath);
    this.validateAllowlist(resolvedPath);

    const hiddenAllowed = this.policy.getConfig().allowHiddenFiles;
    if (!hiddenAllowed) {
      this.validateHiddenFilePolicy(resolvedPath);
    }

    return resolvedPath;
  }

  public validateWorkspaceJail(realPath: string): void {
    if (!realPath.startsWith(this.workspaceRoot)) {
      throw new SandboxViolationError(
        `Path "${realPath}" escapes workspace jail "${this.workspaceRoot}"`,
      );
    }
  }

  public async validateSymlinkEscape(realPath: string): Promise<void> {
    try {
      const stats = await fs.lstat(realPath);
      if (stats.isSymbolicLink()) {
        const target = await fs.realpath(realPath);
        this.validateWorkspaceJail(target);
      }
    } catch (err) {
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw err;
    }
  }

  public validateAllowlist(realPath: string): void {
    // Check if path is relative to workspace root
    const relativePath = path.relative(this.workspaceRoot, realPath);
    if (!this.policy.isAllowed(relativePath) && !this.policy.isAllowed(realPath)) {
      throw new AllowlistViolationError(realPath);
    }
  }

  public validateHiddenFilePolicy(realPath: string): void {
    const parts = path.relative(this.workspaceRoot, realPath).split(path.sep);
    const hasHidden = parts.some((part) => part.startsWith('.'));
    if (hasHidden) {
      throw new SandboxViolationError(
        `Path "${realPath}" accesses hidden files which is disabled in policy`,
      );
    }
  }
}
