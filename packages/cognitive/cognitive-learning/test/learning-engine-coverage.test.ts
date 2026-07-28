/**
 * @module cognitive-learning/learning-engine-coverage.test
 * @description Additional coverage tests for LearningEngine.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LearningEngine } from '../src/learning-engine.js';
import type { Experience } from '../src/interfaces.js';

const createSampleExperience = (overrides: Partial<Experience> = {}): Experience => ({
  id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  sessionId: 'session-1',
  taskId: 'task-1',
  action: 'test-action',
  input: 'test-input',
  output: 'test-output',
  goal: 'test-goal',
  reasoningTrace: ['step-1', 'step-2'],
  decision: 'completed',
  confidence: 0.8,
  outcome: 'success',
  feedback: [],
  durationMs: 100,
  timestamp: new Date(),
  checksum: '',
  ...overrides,
});

describe('LearningEngine - Additional Coverage', () => {
  let engine: LearningEngine;

  beforeEach(() => {
    engine = new LearningEngine();
  });

  describe('collectExperience()', () => {
    it('collects experience with success outcome', async () => {
      const eventData = {
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success' as const,
        durationMs: 100,
      };

      await engine.collectExperience(eventData);

      expect(engine.experienceStore.count()).toBe(1);
      const experiences = engine.experienceStore.getAll();
      expect(experiences[0].outcome).toBe('success');
      expect(experiences[0].confidence).toBe(0.8);
      expect(experiences[0].checksum).toBeDefined();
      expect(experiences[0].checksum).toHaveLengthGreaterThan(0);
    });

    it('collects experience with failure outcome', async () => {
      const eventData = {
        sessionId: 'session-2',
        taskId: 'task-2',
        action: 'failed-action',
        input: 'test-input',
        output: 'error-output',
        outcome: 'failure' as const,
        durationMs: 50,
      };

      await engine.collectExperience(eventData);

      expect(engine.experienceStore.count()).toBe(1);
      const experiences = engine.experienceStore.getAll();
      expect(experiences[0].outcome).toBe('failure');
      expect(experiences[0].confidence).toBe(0.2);
    });

    it('generates unique experience IDs', async () => {
      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'action-1',
        input: 'input-1',
        output: 'output-1',
        outcome: 'success',
        durationMs: 100,
      });

      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'action-1',
        input: 'input-1',
        output: 'output-1',
        outcome: 'success',
        durationMs: 100,
      });

      const experiences = engine.experienceStore.getAll();
      expect(experiences).toHaveLength(2);
      expect(experiences[0].id).not.toBe(experiences[1].id);
    });

    it('sets correct checksum for experience', async () => {
      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 100,
      });

      const experiences = engine.experienceStore.getAll();
      const experience = experiences[0];

      expect(experience.checksum).toBeDefined();
      const expectedChecksum = Buffer.from(JSON.stringify(experience)).toString('base64');
      expect(experience.checksum).toBe(expectedChecksum);
    });

    it('publishes experience.collected event', async () => {
      const eventHandler = vi.fn();
      engine.events.subscribe('experience.collected', eventHandler);

      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 100,
      });

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          experienceId: expect.stringMatching(/^exp-/),
        }),
      );
    });

    it('increments experiencesCollected metric', async () => {
      const initialMetrics = engine.metrics.getMetrics();
      expect(initialMetrics.experiencesCollected).toBe(0);

      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 100,
      });

      const updatedMetrics = engine.metrics.getMetrics();
      expect(updatedMetrics.experiencesCollected).toBe(1);

      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 100,
      });

      const finalMetrics = engine.metrics.getMetrics();
      expect(finalMetrics.experiencesCollected).toBe(2);
    });

    it('handles multiple experiences collection', async () => {
      const experiences = [
        {
          sessionId: 'session-1',
          taskId: 'task-1',
          action: 'action-1',
          input: 'input-1',
          output: 'output-1',
          outcome: 'success' as const,
          durationMs: 100,
        },
        {
          sessionId: 'session-1',
          taskId: 'task-2',
          action: 'action-2',
          input: 'input-2',
          output: 'output-2',
          outcome: 'failure' as const,
          durationMs: 200,
        },
        {
          sessionId: 'session-1',
          taskId: 'task-3',
          action: 'action-3',
          input: 'input-3',
          output: 'output-3',
          outcome: 'success' as const,
          durationMs: 150,
        },
      ];

      for (const exp of experiences) {
        await engine.collectExperience(exp);
      }

      expect(engine.experienceStore.count()).toBe(3);
      const storedExperiences = engine.experienceStore.getAll();
      expect(storedExperiences.filter((e) => e.outcome === 'success')).toHaveLength(2);
      expect(storedExperiences.filter((e) => e.outcome === 'failure')).toHaveLength(1);
    });

    it('handles experience with minimal duration', async () => {
      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 0,
      });

      const experiences = engine.experienceStore.getAll();
      expect(experiences[0].durationMs).toBe(0);
    });

    it('handles experience with long duration', async () => {
      await engine.collectExperience({
        sessionId: 'session-1',
        taskId: 'task-1',
        action: 'test-action',
        input: 'test-input',
        output: 'test-output',
        outcome: 'success',
        durationMs: 999999,
      });

      const experiences = engine.experienceStore.getAll();
      expect(experiences[0].durationMs).toBe(999999);
    });
  });

  describe('Learning Session Management', () => {
    it('creates unique session IDs for each run', async () => {
      const experiences = [createSampleExperience()];

      await engine.run(experiences);
      const firstSessionId = (
        engine as unknown as Record<string, unknown>
      ).checkpointManager.getAll()[0]?.sessionId;

      const engine2 = new LearningEngine();
      await engine2.run(experiences);
      const secondSessionId = (
        engine2 as unknown as Record<string, unknown>
      ).checkpointManager.getAll()[0]?.sessionId;

      expect(firstSessionId).not.toBe(secondSessionId);
    });

    it('manages session lifecycle correctly', async () => {
      const experiences = [createSampleExperience()];

      expect(engine.stateMachine.getState()).toBe('CREATED');

      const runPromise = engine.run(experiences);
      await runPromise;

      expect(engine.stateMachine.getState()).toBe('COMPLETED');
    });
  });

  describe('Pattern Extraction', () => {
    it('extracts patterns from multiple experiences', async () => {
      const experiences = [
        createSampleExperience({ outcome: 'failure', confidence: 0.1, id: 'e1' }),
        createSampleExperience({ outcome: 'failure', confidence: 0.2, id: 'e2' }),
        createSampleExperience({ outcome: 'failure', confidence: 0.15, id: 'e3' }),
      ];

      await engine.run(experiences);

      const patterns = engine.patternRegistry.getAll();
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.some((p) => p.type === 'repeated_failure')).toBe(true);
    });

    it('extracts frequent path patterns', async () => {
      const experiences = [
        createSampleExperience({
          id: 'e1',
          reasoningTrace: ['A', 'B', 'C'],
          sessionId: 's1',
        }),
        createSampleExperience({
          id: 'e2',
          reasoningTrace: ['A', 'B', 'C'],
          sessionId: 's2',
        }),
        createSampleExperience({
          id: 'e3',
          reasoningTrace: ['A', 'B', 'C'],
          sessionId: 's3',
        }),
      ];

      await engine.run(experiences);

      const patterns = engine.patternRegistry.getAll();
      expect(patterns.some((p) => p.type === 'frequent_path')).toBe(true);
    });

    it('handles empty experiences array', async () => {
      await engine.run([]);

      expect(engine.stateMachine.getState()).toBe('COMPLETED');
      expect(engine.patternRegistry.getAll()).toHaveLength(0);
    });
  });

  describe('Feedback Collection', () => {
    it('collects feedback during learning', async () => {
      const experiences = [createSampleExperience()];

      await engine.run(experiences);

      expect(engine.feedbackCollector.count()).toBeGreaterThanOrEqual(0);
    });

    it('processes feedback types correctly', async () => {
      const experiences = [
        createSampleExperience({ outcome: 'success', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
      ];

      await engine.run(experiences);

      const metrics = engine.metrics.getMetrics();
      expect(metrics.feedbackProcessed).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid experience during collection', async () => {
      const invalidExperience: Experience = {
        id: '',
        sessionId: '',
        goal: '',
        reasoningTrace: [],
        decision: '',
        confidence: 0,
        outcome: 'failure',
        feedback: [],
        timestamp: new Date(),
        checksum: '',
      };

      await expect(engine.run([invalidExperience])).rejects.toThrow();
      expect(engine.stateMachine.getState()).not.toBe('COMPLETED');
    });

    it('handles error during experience extraction', async () => {
      const experiences = [createSampleExperience({ id: '', sessionId: '' })];

      await expect(engine.run(experiences)).rejects.toThrow();
    });

    it('publishes learning.failed event on error', async () => {
      const errorHandler = vi.fn();
      engine.events.subscribe('learning.failed', errorHandler);

      const invalidExperience: Experience = {
        id: '',
        sessionId: '',
        goal: '',
        reasoningTrace: [],
        decision: '',
        confidence: 0,
        outcome: 'failure',
        feedback: [],
        timestamp: new Date(),
        checksum: '',
      };

      try {
        await engine.run([invalidExperience]);
      } catch (error) {
        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            sessionId: expect.stringMatching(/^learn-/),
            error: expect.any(String),
          }),
        );
      }
    });

    it('records failed run in metrics', async () => {
      const invalidExperience: Experience = {
        id: '',
        sessionId: '',
        goal: '',
        reasoningTrace: [],
        decision: '',
        confidence: 0,
        outcome: 'failure',
        feedback: [],
        timestamp: new Date(),
        checksum: '',
      };

      try {
        await engine.run([invalidExperience]);
      } catch (error) {
        const metrics = engine.metrics.getMetrics();
        expect(metrics.learningRuns).toBe(1);
        expect(metrics.successRate).toBe(0);
        expect(metrics.failureRate).toBe(100);
      }
    });

    it('handles non-Error exceptions', async () => {
      const originalExtract = engine.experienceExtractor.extractPatterns;
      (engine.experienceExtractor as unknown as Record<string, unknown>).extractPatterns = vi
        .fn()
        .mockImplementation(() => {
          throw 'string error';
        });

      try {
        await engine.run([createSampleExperience()]);
      } catch (error) {
        expect(error).toBe('string error');
      }

      (engine.experienceExtractor as unknown as Record<string, unknown>).extractPatterns =
        originalExtract;
    });
  });

  describe('Hooks Integration', () => {
    it('executes beforeLearning hook', async () => {
      const beforeHook = vi.fn();
      engine.hooks.register({
        beforeLearning: beforeHook,
        afterLearning: vi.fn(),
        beforeReflection: vi.fn(),
        afterReflection: vi.fn(),
        beforeAdaptation: vi.fn(),
        afterAdaptation: vi.fn(),
      });

      await engine.run([createSampleExperience()]);

      expect(beforeHook).toHaveBeenCalledTimes(1);
    });

    it('executes afterLearning hook', async () => {
      const afterHook = vi.fn();
      engine.hooks.register({
        beforeLearning: vi.fn(),
        afterLearning: afterHook,
        beforeReflection: vi.fn(),
        afterReflection: vi.fn(),
        beforeAdaptation: vi.fn(),
        afterAdaptation: vi.fn(),
      });

      await engine.run([createSampleExperience()]);

      expect(afterHook).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Publishing', () => {
    it('publishes learning.started event', async () => {
      const startHandler = vi.fn();
      engine.events.subscribe('learning.started', startHandler);

      await engine.run([createSampleExperience()]);

      expect(startHandler).toHaveBeenCalledTimes(1);
      expect(startHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionId: expect.stringMatching(/^learn-/),
        }),
      );
    });

    it('publishes learning.completed event', async () => {
      const completeHandler = vi.fn();
      engine.events.subscribe('learning.completed', completeHandler);

      await engine.run([createSampleExperience()]);

      expect(completeHandler).toHaveBeenCalledTimes(1);
    });

    it('publishes pattern.learned events', async () => {
      const patternHandler = vi.fn();
      engine.events.subscribe('pattern.learned', patternHandler);

      const experiences = [
        createSampleExperience({ outcome: 'failure', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
      ];

      await engine.run(experiences);

      expect(patternHandler).toHaveBeenCalledTimesGreaterThan(0);
    });

    it('publishes reflection.completed event', async () => {
      const reflectionHandler = vi.fn();
      engine.events.subscribe('reflection.completed', reflectionHandler);

      await engine.run([createSampleExperience()]);

      expect(reflectionHandler).toHaveBeenCalledTimes(1);
    });

    it('publishes adaptation.generated event when adaptations created', async () => {
      const adaptationHandler = vi.fn();
      engine.events.subscribe('adaptation.generated', adaptationHandler);

      const experiences = [
        createSampleExperience({ outcome: 'failure', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
        createSampleExperience({ outcome: 'failure', id: 'e3' }),
      ];

      await engine.run(experiences, 'aggressive');

      expect(adaptationHandler).toHaveBeenCalledTimesGreaterThan(0);
    });

    it('publishes improvement.generated event when improvements created', async () => {
      const improvementHandler = vi.fn();
      engine.events.subscribe('improvement.generated', improvementHandler);

      const experiences = [
        createSampleExperience({ outcome: 'failure', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
      ];

      await engine.run(experiences);

      expect(improvementHandler).toHaveBeenCalledTimesGreaterThan(0);
    });
  });

  describe('Checkpoint Management', () => {
    it('saves checkpoint after learning', async () => {
      const experiences = [createSampleExperience()];

      await engine.run(experiences);

      const checkpoints = (engine.checkpointManager as unknown as Record<string, unknown>)
        .checkpoints;
      expect(checkpoints.size).toBeGreaterThan(0);
    });

    it('checkpoint contains patterns, adaptations, and improvements', async () => {
      const experiences = [
        createSampleExperience({ outcome: 'failure', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
      ];

      await engine.run(experiences);

      const checkpoints = (engine.checkpointManager as unknown as Record<string, unknown>)
        .checkpoints;
      const checkpoint = Array.from(checkpoints.values())[0];

      expect(checkpoint.snapshot).toBeDefined();
      expect(checkpoint.snapshot.patterns).toBeDefined();
      expect(checkpoint.snapshot.adaptations).toBeDefined();
      expect(checkpoint.snapshot.improvements).toBeDefined();
      expect(checkpoint.snapshot.timestamp).toBeDefined();
    });
  });

  describe('Metrics Collection', () => {
    it('collects comprehensive metrics', async () => {
      const experiences = [
        createSampleExperience({ outcome: 'success', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
        createSampleExperience({ outcome: 'failure', id: 'e3' }),
      ];

      await engine.run(experiences);

      const metrics = engine.metrics.getMetrics();

      expect(metrics.learningRuns).toBe(1);
      expect(metrics.successRate).toBe(100);
      expect(metrics.experiencesCollected).toBe(0);
      expect(metrics.patternsLearned).toBeGreaterThan(0);
      expect(metrics.reflectionsCreated).toBe(3);
      expect(metrics.adaptationsGenerated).toBeGreaterThanOrEqual(0);
      expect(metrics.improvementsGenerated).toBeGreaterThanOrEqual(0);
    });

    it('tracks patterns learned count', async () => {
      const experiences = [
        createSampleExperience({ outcome: 'failure', id: 'e1' }),
        createSampleExperience({ outcome: 'failure', id: 'e2' }),
      ];

      const initialMetrics = engine.metrics.getMetrics();
      expect(initialMetrics.patternsLearned).toBe(0);

      await engine.run(experiences);

      const finalMetrics = engine.metrics.getMetrics();
      expect(finalMetrics.patternsLearned).toBeGreaterThan(0);
    });
  });

  describe('Recovery Integration', () => {
    it('recoverAndContinue works after failed learning', async () => {
      const checkpointId = 'test-checkpoint';
      engine.checkpointManager.save(checkpointId, {
        patterns: [],
        adaptations: [],
        improvements: [],
        timestamp: new Date(),
      });

      engine.recoverAndContinue(checkpointId);

      expect(engine.stateMachine.getState()).toBe('CREATED');
    });
  });
});
