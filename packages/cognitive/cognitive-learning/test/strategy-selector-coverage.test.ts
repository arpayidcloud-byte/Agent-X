/**
 * @module cognitive-learning/strategy-selector-coverage.test
 * @description Additional coverage tests for StrategySelector.
 */

import { describe, it, expect } from 'vitest';
import { StrategySelector } from '../src/strategy-selector.js';
import { LearningError } from '../src/errors.js';
import type { Pattern, StrategyRecord } from '../src/interfaces.js';

describe('StrategySelector - Additional Coverage', () => {
  let selector: StrategySelector;

  beforeEach(() => {
    selector = new StrategySelector();
  });

  describe('select() - Error Handling', () => {
    it('throws LearningError when strategies array is empty', () => {
      const patterns: Pattern[] = [];
      const strategies: StrategyRecord[] = [];

      expect(() => selector.select(patterns, strategies)).toThrow(LearningError);
      expect(() => selector.select(patterns, strategies)).toThrow('No strategies available');
    });

    it('throws LearningError with correct error code STRATEGY_EMPTY', () => {
      const patterns: Pattern[] = [];
      const strategies: StrategyRecord[] = [];

      try {
        selector.select(patterns, strategies);
        fail('Should have thrown LearningError');
      } catch (error) {
        expect(error).toBeInstanceOf(LearningError);
        expect((error as LearningError).code).toBe('STRATEGY_EMPTY');
        expect((error as LearningError).source).toBe('strategy-selector');
      }
    });
  });

  describe('select() - Strategy Selection Paths', () => {
    it('selects strategy with confidence > 70 when failure patterns exist', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 3,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 60 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 75 },
        { id: 's3', name: 'Strategy3', version: '1.0', priority: 3, confidence: 85 },
      ];

      const selected = selector.select([failurePattern], strategies);
      expect(selected.confidence).toBeGreaterThan(70);
      expect(selected.id).toBe('s2');
    });

    it('selects first strategy as fallback when no strategy has confidence > 70 with failures', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 3,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 50 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 60 },
      ];

      const selected = selector.select([failurePattern], strategies);
      expect(selected.id).toBe('s1');
    });

    it('selects highest confidence strategy when no failure patterns exist', () => {
      const successPattern: Pattern = {
        id: 'sp1',
        type: 'repeated_success',
        signature: 'success-sig',
        occurrenceCount: 3,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 50 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 90 },
        { id: 's3', name: 'Strategy3', version: '1.0', priority: 3, confidence: 70 },
      ];

      const selected = selector.select([successPattern], strategies);
      expect(selected.id).toBe('s2');
      expect(selected.confidence).toBe(90);
    });

    it('handles multiple failure patterns correctly', () => {
      const failurePattern1: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig-1',
        occurrenceCount: 2,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum1',
      };

      const failurePattern2: Pattern = {
        id: 'fp2',
        type: 'repeated_failure',
        signature: 'failure-sig-2',
        occurrenceCount: 3,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum2',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 80 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 85 },
      ];

      const selected = selector.select([failurePattern1, failurePattern2], strategies);
      expect(selected.confidence).toBeGreaterThan(70);
      expect(selected.id).toBe('s1');
    });

    it('handles mixed pattern types correctly', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 2,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const successPattern: Pattern = {
        id: 'sp1',
        type: 'repeated_success',
        signature: 'success-sig',
        occurrenceCount: 5,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const frequentPathPattern: Pattern = {
        id: 'fpp1',
        type: 'frequent_path',
        signature: 'path-sig',
        occurrenceCount: 4,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 95 },
      ];

      const selected = selector.select(
        [failurePattern, successPattern, frequentPathPattern],
        strategies,
      );
      expect(selected.confidence).toBeGreaterThan(70);
    });
  });

  describe('select() - Edge Cases', () => {
    it('handles single strategy with failure patterns', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 1,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 100 },
      ];

      const selected = selector.select([failurePattern], strategies);
      expect(selected.id).toBe('s1');
      expect(selected.confidence).toBe(100);
    });

    it('handles single strategy without failure patterns', () => {
      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 40 },
      ];

      const selected = selector.select([], strategies);
      expect(selected.id).toBe('s1');
    });

    it('handles strategies with equal confidence', () => {
      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 70 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 70 },
        { id: 's3', name: 'Strategy3', version: '1.0', priority: 3, confidence: 70 },
      ];

      const selected = selector.select([], strategies);
      expect(selected.confidence).toBe(70);
    });

    it('handles strategies with zero confidence', () => {
      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 0 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 0 },
      ];

      const selected = selector.select([], strategies);
      expect(selected.confidence).toBe(0);
    });

    it('handles strategies with negative confidence', () => {
      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: -10 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: -5 },
      ];

      const selected = selector.select([], strategies);
      expect(selected.id).toBe('s2');
    });

    it('handles exactly 70 confidence threshold', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 1,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 70 },
        { id: 's2', name: 'Strategy2', version: '1.0', priority: 2, confidence: 69 },
      ];

      const selected = selector.select([failurePattern], strategies);
      expect(selected.id).toBe('s1');
      expect(selected.confidence).toBe(70);
    });

    it('handles exactly 71 confidence threshold', () => {
      const failurePattern: Pattern = {
        id: 'fp1',
        type: 'repeated_failure',
        signature: 'failure-sig',
        occurrenceCount: 1,
        firstSeen: new Date(),
        lastSeen: new Date(),
        checksum: 'checksum',
      };

      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 71 },
      ];

      const selected = selector.select([failurePattern], strategies);
      expect(selected.id).toBe('s1');
      expect(selected.confidence).toBe(71);
    });
  });

  describe('select() - Invalid Inputs', () => {
    it('handles empty patterns array', () => {
      const strategies: StrategyRecord[] = [
        { id: 's1', name: 'Strategy1', version: '1.0', priority: 1, confidence: 80 },
      ];

      const selected = selector.select([], strategies);
      expect(selected.id).toBe('s1');
    });
  });
});
