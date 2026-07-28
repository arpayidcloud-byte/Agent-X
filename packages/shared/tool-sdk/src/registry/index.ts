import type {
  IToolRegistry,
  ITool,
  ToolCategory,
  ToolCapability,
  ToolMetadata,
} from '../interfaces/index.js';
import { DuplicateToolError, ToolNotFoundError } from '../errors/index.js';
import { ToolClassifier } from '../classification/index.js';

/** Categories that are unconditionally classified as Destructive (ADR-0005). */
const DESTRUCTIVE_CATEGORIES: ReadonlySet<string> = new Set(['fs.write']);

/**
 * Enforce ADR-0005: any tool registered with a destructive category
 * automatically gets its classification overridden to 'Destructive'.
 */
function enforceClassification(tool: ITool): ITool {
  const category = tool.definition.category;
  if (DESTRUCTIVE_CATEGORIES.has(category)) {
    const enforcedMetadata: ToolMetadata = {
      ...tool.metadata,
      classification: 'Destructive',
      riskScore: ToolClassifier.getRiskScore(category),
    };
    return Object.create(Object.getPrototypeOf(tool) as object, {
      ...Object.getOwnPropertyDescriptors(tool),
      metadata: { value: Object.freeze(enforcedMetadata), writable: false, configurable: false },
    }) as ITool;
  }
  return tool;
}

export class ToolRegistry implements IToolRegistry {
  private tools = new Map<string, ITool>();
  private categories = new Map<ToolCategory, Set<string>>();

  public register(tool: ITool): void {
    const name = tool.definition.name;
    if (this.tools.has(name)) {
      throw new DuplicateToolError(name);
    }

    // ADR-0005: auto-classify destructive categories at registration time
    const enforced = enforceClassification(tool);
    this.tools.set(name, enforced);

    const category = enforced.definition.category;
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category)!.add(name);
  }

  public unregister(toolName: string): void {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new ToolNotFoundError(toolName);
    }

    this.tools.delete(toolName);
    const category = tool.definition.category;
    const categorySet = this.categories.get(category);
    if (categorySet) {
      categorySet.delete(toolName);
    }
  }

  public find(toolName: string): ITool | undefined {
    return this.tools.get(toolName);
  }

  public list(): ITool[] {
    return Array.from(this.tools.values());
  }

  public resolve(toolName: string, category: ToolCategory): ITool | undefined {
    const tool = this.tools.get(toolName);
    if (tool && tool.definition.category === category) {
      return tool;
    }
    return undefined;
  }

  public findByCategory(category: ToolCategory): ITool[] {
    const names = this.categories.get(category);
    if (!names) return [];

    const result: ITool[] = [];
    for (const name of names as Set<string>) {
      const tool = this.tools.get(name as string);
      if (tool) result.push(tool);
    }
    return result;
  }

  public hasCapability(toolName: string, capability: keyof ToolCapability): boolean {
    const tool = this.tools.get(toolName);
    if (!tool) return false;
    return !!tool.definition.capabilities[capability];
  }
}
