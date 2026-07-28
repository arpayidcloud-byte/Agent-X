/**
 * @module plugin-sdk/interfaces
 * @description Core interfaces for the Plugin Platform (Volume 8).
 */

export type PluginKind = 'agent' | 'tool' | 'provider';

export type PluginStatus =
  'installed' | 'pending-review' | 'enabled' | 'disabled' | 'rejected' | 'uninstalled';

export interface PluginManifest {
  readonly id: string;
  readonly version: string;
  readonly kind: PluginKind;
  readonly declaredToolCategories?: string[];
  readonly declaredAgentRole?: string;
  readonly entryPoint: string;
  readonly description?: string;
  readonly author?: string;
}

export interface PluginRegistration {
  readonly manifest: PluginManifest;
  readonly status: PluginStatus;
  readonly installedAt: Date;
  readonly enabledAt?: Date;
  readonly reviewNotes?: string;
}

export interface PluginContext {
  readonly pluginId: string;
  readonly logger: {
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
  };
}

export interface IAgentPlugin {
  readonly role: string;
  execute(input: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface IToolPlugin {
  readonly category: string;
  execute(params: Record<string, unknown>): Promise<{ output: string; success: boolean }>;
}

export interface IProviderPlugin {
  readonly providerId: string;
  complete(prompt: string, options?: Record<string, unknown>): Promise<string>;
}

export type PluginInstance = IAgentPlugin | IToolPlugin | IProviderPlugin;

export interface PluginLoadResult {
  readonly success: boolean;
  readonly instance?: PluginInstance;
  readonly error?: string;
}
