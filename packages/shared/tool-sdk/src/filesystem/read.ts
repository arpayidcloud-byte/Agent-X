import * as fs from 'fs/promises';

import type { ISandbox, IFilesystemValidator, IFilesystemPolicy } from './interfaces.js';
import { InvalidEncodingError } from './errors.js';

export class FilesystemReadTool {
  private readonly timeoutMs: number;

  constructor(
    private readonly sandbox: ISandbox,
    private readonly validator: IFilesystemValidator,
    private readonly policy: IFilesystemPolicy,
    timeoutMs: number = 30000,
  ) {
    this.timeoutMs = timeoutMs;
  }

  public async read(requestPath: string): Promise<{
    content: string;
    metadata: { size: number; isBinary: boolean };
  }> {
    const realPath = await this.sandbox.validateRead(requestPath);
    this.sandbox.validateSymlinkEscape(realPath);

    const stats = await this.withTimeout(fs.stat(realPath));
    if (!stats.isFile()) {
      throw new Error(`Path "${realPath}" is not a file`);
    }

    this.policy.validateFileSize(stats.size);

    const buffer = await this.withTimeout(fs.readFile(realPath));
    const isBinary = this.validator.detectBinary(buffer);

    if (isBinary) {
      throw new InvalidEncodingError('Binary file detected and cannot be read as text');
    }

    const isValid = this.validator.validateEncoding(buffer);
    if (!isValid) {
      throw new InvalidEncodingError('Invalid UTF-8 encoding detected');
    }

    return {
      content: buffer.toString('utf-8'),
      metadata: { size: stats.size, isBinary: false },
    };
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Filesystem read timed out after ${this.timeoutMs}ms`)),
          this.timeoutMs,
        ),
      ),
    ]);
  }
}
