import * as fs from 'fs';
import * as path from 'path';
import { getRuntime } from '../lib/runtime.js';
import type { TaskStatus, TaskPriority, TaskMetadata } from '@agentx-fast/core-runtime';
import { TaskStatus as TaskStatusEnum } from '@agentx-fast/core-runtime';

interface PluginRecord {
  id: string;
  version: string;
  kind: string;
  status: 'pending-review' | 'enabled' | 'disabled' | 'rejected';
  installedAt: string;
}

export async function plugin(args: string[]): Promise<void> {
  const { taskRepo } = getRuntime();
  const pluginsKey = '__plugins__';

  async function loadPlugins(): Promise<Record<string, PluginRecord>> {
    const all = await taskRepo.getAll();
    const pluginTask = all.find((t) => t.id === pluginsKey);
    if (!pluginTask) return {};
    return (pluginTask.context?.variables as Record<string, PluginRecord>) || {};
  }

  async function savePlugins(plugins: Record<string, PluginRecord>): Promise<void> {
    const existing = (await taskRepo.getAll()).find((t) => t.id === pluginsKey);
    if (existing) {
      existing.context!.variables = plugins as unknown as Record<string, unknown>;
      existing.updatedAt = new Date();
    } else {
      const metadata: TaskMetadata = { retryCount: 0 };
      void taskRepo.save({
        id: pluginsKey,
        goal: 'Plugin storage',
        status: TaskStatusEnum.CREATED as unknown as TaskStatus,
        priority: 'normal' as unknown as TaskPriority,
        rootTaskId: pluginsKey,
        dependsOn: [],
        traceId: pluginsKey,
        metadata,
        context: {
          variables: plugins as unknown as Record<string, unknown>,
          history: [],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  const subcommand = args[0];

  if (!subcommand || subcommand === 'list') {
    const plugins = await loadPlugins();
    const entries = Object.values(plugins);
    if (entries.length === 0) {
      console.log('No plugins installed.');
      return;
    }
    console.log('Installed Plugins:');
    for (const p of entries) {
      const icon = p.status === 'enabled' ? '🟢' : p.status === 'disabled' ? '🔴' : '🟡';
      console.log(`  ${icon} ${p.id}@${p.version} (${p.kind}) — ${p.status}`);
    }
    return;
  }

  if (subcommand === 'install') {
    const pluginPath = args[1];
    if (!pluginPath) throw new Error('Usage: agentx plugin install <path-or-name>');

    let manifest: { id: string; version: string; kind: string };
    if (fs.existsSync(pluginPath)) {
      const manifestPath = path.join(pluginPath, 'manifest.json');
      if (!fs.existsSync(manifestPath))
        throw new Error('No manifest.json found in plugin directory');
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
        id: string;
        version: string;
        kind: string;
      };
    } else {
      manifest = { id: pluginPath, version: '0.0.0', kind: 'unknown' };
    }

    const plugins = await loadPlugins();
    plugins[manifest.id] = {
      id: manifest.id,
      version: manifest.version,
      kind: manifest.kind,
      status: 'pending-review',
      installedAt: new Date().toISOString(),
    };
    await savePlugins(plugins);

    console.log(`Plugin installed: ${manifest.id}@${manifest.version}`);
    console.log(`Status: pending-review`);
    console.log(`Run "agentx plugin enable ${manifest.id}" after review.`);
    return;
  }

  if (subcommand === 'enable') {
    const id = args[1];
    if (!id) throw new Error('Usage: agentx plugin enable <id>');
    const plugins = await loadPlugins();
    const plugin = plugins[id];
    if (!plugin) throw new Error(`Plugin not found: ${id}`);
    plugin.status = 'enabled';
    await savePlugins(plugins);
    console.log(`✅ Plugin ${id} enabled.`);
    return;
  }

  if (subcommand === 'disable') {
    const id = args[1];
    if (!id) throw new Error('Usage: agentx plugin disable <id>');
    const plugins = await loadPlugins();
    const plugin = plugins[id];
    if (!plugin) throw new Error(`Plugin not found: ${id}`);
    plugin.status = 'disabled';
    await savePlugins(plugins);
    console.log(`🔴 Plugin ${id} disabled.`);
    return;
  }

  throw new Error(`Unknown plugin subcommand: ${subcommand}. Use: install|enable|disable|list`);
}
