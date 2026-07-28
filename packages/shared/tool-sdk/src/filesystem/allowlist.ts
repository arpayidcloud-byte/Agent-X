import * as fs from 'fs/promises';
import * as yaml from 'yaml';
import type { FilesystemConfig } from './interfaces.js';

export class AllowlistConfigLoader {
  private static defaultConfig: FilesystemConfig = {
    allow: ['src/**', 'packages/**', 'docs/**', 'prisma/**'],
    maxFileSizeBytes: 10 * 1024 * 1024,
    allowHiddenFiles: false,
  };

  public static async loadFromConfig(configPath?: string): Promise<FilesystemConfig> {
    if (!configPath) {
      return AllowlistConfigLoader.defaultConfig;
    }

    try {
      const content = await fs.readFile(configPath, 'utf-8');
      const config = yaml.parse(content) as
        | {
            tools?: {
              filesystem?: {
                allow?: string[];
                maxFileSizeBytes?: number;
                allowHiddenFiles?: boolean;
              };
            };
          }
        | undefined;

      if (config?.tools?.filesystem?.allow) {
        return {
          allow: config.tools.filesystem.allow as string[],
          maxFileSizeBytes:
            (config.tools.filesystem.maxFileSizeBytes as number) || 10 * 1024 * 1024,
          allowHiddenFiles: (config.tools.filesystem.allowHiddenFiles as boolean) ?? false,
        };
      }

      return AllowlistConfigLoader.defaultConfig;
    } catch {
      return AllowlistConfigLoader.defaultConfig;
    }
  }
}
