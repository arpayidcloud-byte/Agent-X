import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlanningEngine } from '../src/index.js';
import { InMemoryEventBus } from '@agentx-fast/core-runtime';

describe('Planning Engine', () => {
  let eventBus: InMemoryEventBus;
  let engine: PlanningEngine;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
    engine = new PlanningEngine(eventBus);
  });

  it('creates plan', async () => {
    const plan = await engine.createPlan('Build an app', { scope: 'test' });
    expect(plan.id).toBeDefined();
    expect(plan.goal).toBe('Build an app');
    expect(plan.tasks).toHaveLength(2);
    expect(plan.dependencies).toHaveLength(1);
    expect(plan.metadata.scope).toBe('test');
  });

  it('optimizes plan', async () => {
    const plan = await engine.createPlan('test', {});
    const optimized = await engine.optimizePlan(plan);

    expect(optimized.estimatedCostUsd).toBeLessThan(plan.estimatedCostUsd);
    expect(optimized.metadata.optimized).toBe(true);
  });

  it('validates valid plan', async () => {
    const plan = await engine.createPlan('test', {});
    const result = await engine.validatePlan(plan);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  it('validates invalid plan', async () => {
    const plan = await engine.createPlan('test', {});
    plan.goal = '';
    plan.tasks = [];

    const result = await engine.validatePlan(plan);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Goal is required');
    expect(result.errors).toContain('Plan must have at least one task');
  });

  it('generates warnings for high risk', async () => {
    const plan = await engine.createPlan('test', {});
    plan.riskScore = 95;

    const result = await engine.validatePlan(plan);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain('High risk score, requires double confirmation');
  });

  it('explains plan', async () => {
    const plan = await engine.createPlan('test goal', {});
    const explanation = engine.explainPlan(plan);

    expect(explanation).toContain('Plan for: test goal');
    expect(explanation).toContain('Tasks: 2');
    expect(explanation).toContain('- [planner]');
  });

  it('updates metrics correctly', async () => {
    await engine.createPlan('test 1', {});
    const plan2 = await engine.createPlan('test 2', {});
    await engine.optimizePlan(plan2);

    const metrics = engine.getMetrics();
    expect(metrics.totalPlansCreated).toBe(2);
    expect(metrics.totalPlansOptimized).toBe(1);
    expect(metrics.averageTasksPerPlan).toBe(2);
    expect(metrics.averageRiskScore).toBe(40);
  });
});
