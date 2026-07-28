import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  ISandbox,
  IAtomicWriter,
  IFilesystemValidator,
  IFilesystemPolicy,
} from './interfaces.js';

export class FilesystemWriteTool {
  private readonly timeoutMs: number;

  constructor(
    private readonly sandbox: ISandbox,
    private readonly atomicWriter: IAtomicWriter,
    private readonly validator: IFilesystemValidator,
    private readonly policy: IFilesystemPolicy,
    timeoutMs: number = 30000,
  ) {
    this.timeoutMs = timeoutMs;
  }

  public async write(requestPath: string, content: string): Promise<{ success: boolean }> {
    const realPath = await this.sandbox.validateWrite(requestPath);
    this.sandbox.validateSymlinkEscape(realPath);

    const contentBuffer = Buffer.from(content, 'utf-8');

    if (this.validator.detectBinary(contentBuffer)) {
      throw new Error('Content contains binary data which cannot be written as text');
    }

    if (!this.validator.validateEncoding(contentBuffer)) {
      throw new Error('Content contains invalid UTF-8 encoding');
    }

    this.policy.validateFileSize(contentBuffer.length);

    const dir = path.dirname(realPath);
    try {
      await this.withTimeout(fs.mkdir(dir, { recursive: true }));
    } catch (err) {
      if (err instanceof Error && (err as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw err;
      }
    }

    await this.withTimeout(this.atomicWriter.write(realPath, content));
    return { success: true };
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Filesystem write timed out after ${this.timeoutMs}ms`)),
          this.timeoutMs,
        ),
      ),
    ]);
  }
}
