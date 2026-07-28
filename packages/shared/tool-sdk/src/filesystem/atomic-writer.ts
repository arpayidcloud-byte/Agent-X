import * as fs from 'fs/promises';
import * as path from 'path';
import type { IAtomicWriter } from './interfaces.js';
import { AtomicWriteError } from './errors.js';

export class AtomicWriter implements IAtomicWriter {
  public async write(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    const tempDir = path.join(dir, '.atomic-temp');
    const tempFilePath = path.join(tempDir, `${path.basename(filePath)}.${Date.now()}.tmp`);

    try {
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(tempFilePath, content, 'utf-8');
      await fs.rename(tempFilePath, filePath);
    } catch (error: unknown) {
      await this.cleanup(tempFilePath);

      const errMsg = error instanceof Error ? error.message : String(error);
      throw new AtomicWriteError(errMsg, error instanceof Error ? error : undefined);
    } finally {
      await this.cleanupDirectory(tempDir);
    }
  }

  public async rollback(tempFilePath: string): Promise<void> {
    await this.cleanup(tempFilePath);
  }

  private async cleanup(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore cleanup failures
    }
  }

  private async cleanupDirectory(dirPath: string): Promise<void> {
    try {
      const files = await fs.readdir(dirPath);
      if (files.length === 0) {
        await fs.rmdir(dirPath);
      }
    } catch {
      // Ignore cleanup failures
    }
  }
}
