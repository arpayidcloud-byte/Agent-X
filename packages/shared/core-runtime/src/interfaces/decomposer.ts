/**
 * @module core-runtime/interfaces/decomposer
 * @description Task decomposition interfaces for breaking goals into subtasks.
 */

/**
 * Input provided to the decomposer for breaking a goal into subtasks.
 *
 * @example
 * ```ts
 * const input: DecompositionInput = {
 *   goalId: 'goal-001',
 *   title: 'Build REST API',
 *   description: 'Create a RESTful API for user management',
 *   context: { framework: 'express', database: 'postgres' },
 * };
 * ```
 */
export interface DecompositionInput {
  /** Unique identifier of the goal to decompose */
  readonly goalId: string;
  /** Short title of the goal */
  readonly title: string;
  /** Detailed description of the goal */
  readonly description: string;
  /** Additional context variables for the decomposition */
  readonly context: Record<string, unknown>;
}

/**
 * Output produced by the decomposer containing generated subtasks.
 *
 * @example
 * ```ts
 * const output: DecompositionOutput = {
 *   subtasks: [
 *     {
 *       id: 'sub-1',
 *       title: 'Define schema',
 *       description: 'Create database schema',
 *       dependencies: [],
 *       estimatedComplexity: 'low',
 *     },
 *   ],
 * };
 * ```
 */
export interface DecompositionOutput {
  /** List of subtasks produced by the decomposition */
  readonly subtasks: Array<{
    /** Unique identifier for the subtask */
    id: string;
    /** Short title of the subtask */
    title: string;
    /** Detailed description of the subtask */
    description: string;
    /** IDs of subtasks that must complete before this one */
    dependencies: string[];
    /** Estimated complexity level */
    estimatedComplexity: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Decomposer interface for breaking high-level goals into actionable subtasks.
 *
 * @example
 * ```ts
 * const decomposer: IDecomposer = new LLMDecomposer();
 * const result = await decomposer.decompose({
 *   goalId: 'goal-001',
 *   title: 'Build REST API',
 *   description: 'Create a RESTful API for user management',
 *   context: {},
 * });
 * console.log(result.subtasks.length); // e.g. 5
 * ```
 */
export interface IDecomposer {
  /**
   * Decompose a high-level goal into a set of subtasks.
   *
   * @param input - The decomposition input containing goal details and context
   * @returns The decomposition output with generated subtasks
   */
  decompose(input: DecompositionInput): Promise<DecompositionOutput>;
}
