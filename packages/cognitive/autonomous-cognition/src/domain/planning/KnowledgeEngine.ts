import { createHash } from 'crypto';

export interface FeedbackEntry {
  readonly entryId: string;
  readonly goalId: string;
  readonly outcome: string;
  readonly lessonsLearned: readonly string[];
  readonly checksum: string;
}

export class KnowledgeFeedbackEngine {
  private entries: FeedbackEntry[] = [];

  record(goalId: string, outcome: string, lessons: string[]): FeedbackEntry {
    const entryId = `kf-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, outcome, lessons }))
      .digest('hex');
    const entry: FeedbackEntry = Object.freeze({
      entryId,
      goalId,
      outcome,
      lessonsLearned: [...lessons],
      checksum,
    });
    this.entries.push(entry);
    return entry;
  }

  getByGoal(goalId: string): FeedbackEntry[] {
    return this.entries.filter((e) => e.goalId === goalId);
  }

  getAll(): FeedbackEntry[] {
    return [...this.entries];
  }
}

export interface MemoryEntry {
  readonly key: string;
  readonly value: unknown;
  readonly source: string;
  readonly ttlMs: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class LearningMemoryManager {
  private entries = new Map<string, MemoryEntry>();

  store(key: string, value: unknown, source: string, ttlMs: number = 600000): MemoryEntry {
    const checksum = createHash('sha256')
      .update(JSON.stringify({ key, value, source }))
      .digest('hex');
    const entry: MemoryEntry = Object.freeze({
      key,
      value: (typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value) as unknown,
      source,
      ttlMs,
      timestamp: new Date(),
      checksum,
    });
    this.entries.set(key, entry);
    return entry;
  }

  retrieve(key: string): MemoryEntry | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.ttlMs >= 0 && Date.now() - entry.timestamp.getTime() >= entry.ttlMs) {
      this.entries.delete(key);
      return undefined;
    }
    return entry;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  getAll(): MemoryEntry[] {
    return Array.from(this.entries.values());
  }
}

export interface Experience {
  readonly experienceId: string;
  readonly goalId: string;
  readonly action: string;
  readonly result: string;
  readonly score: number;
  readonly timestamp: Date;
  readonly checksum: string;
}

export class ExperienceRepository {
  private experiences: Experience[] = [];

  record(goalId: string, action: string, result: string, score: number): Experience {
    const experienceId = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const checksum = createHash('sha256')
      .update(JSON.stringify({ goalId, action, result, score }))
      .digest('hex');
    const exp: Experience = Object.freeze({
      experienceId,
      goalId,
      action,
      result,
      score,
      timestamp: new Date(),
      checksum,
    });
    this.experiences.push(exp);
    return exp;
  }

  getByGoal(goalId: string): Experience[] {
    return this.experiences.filter((e) => e.goalId === goalId);
  }

  getAll(): Experience[] {
    return [...this.experiences];
  }
}
