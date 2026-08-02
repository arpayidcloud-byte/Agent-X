/**
 * @module quality-scoring/scorer
 * @description Deterministic heuristic quality scorer for LLM outputs.
 *
 * Scores six dimensions (relevance, completeness, clarity, correctness,
 * formatting, safety) with rule-based heuristics so the result is fast,
 * reproducible, and fully unit-testable. An optional LLM judge can override
 * any dimension via QualityScoringOptions.judge.
 */

import type {
  LlmJudge,
  QualityDimension,
  QualityDimensionName,
  QualityGrade,
  QualityScore,
  QualityScoringOptions,
  ScoredInput,
} from './interfaces.js';

export const DEFAULT_WEIGHTS: Record<QualityDimensionName, number> = {
  relevance: 0.25,
  completeness: 0.2,
  clarity: 0.15,
  correctness: 0.2,
  formatting: 0.1,
  safety: 0.1,
};

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'you',
  'your',
  'that',
  'this',
  'have',
  'from',
  'are',
  'was',
  'were',
  'will',
  'would',
  'can',
  'could',
  'should',
  'their',
  'there',
  'they',
  'them',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'about',
  'into',
  'over',
  'after',
  'before',
  'between',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'because',
  'does',
  'not',
  'but',
  'its',
  'has',
  'been',
  'being',
  'also',
  'may',
  'might',
]);

const HEDGES = [
  'i think',
  'i believe',
  'i guess',
  'maybe',
  'perhaps',
  'probably',
  'not sure',
  'i am not sure',
  "i'm not sure",
  'could be',
  'might be',
  'it seems',
  'sort of',
  'kind of',
  'as far as i know',
  'i would say',
];

const UNSURE_MARKERS = [
  'i do not know',
  "i don't know",
  'i have no idea',
  'cannot answer',
  'unknown',
];

const FILLERS = ['basically', 'actually', 'literally', 'um', 'uh', 'you know', 'i mean'];

const BLOCKLIST = [
  'ignore previous instructions',
  'ignore all previous',
  'disregard your',
  'prompt injection',
  'jailbreak',
  'reveal your system prompt',
  'system prompt:',
  'bypass safety',
  'steal credentials',
  'malware payload',
  'exploit vulnerability',
];

const CODE_WORDS = [
  'code',
  'function',
  'implement',
  'script',
  'api',
  'sql',
  'json',
  'typescript',
  'python',
  'regex',
  'component',
  'endpoint',
];
const LIST_WORDS = ['list', 'steps', 'bullets', 'pros', 'cons', 'steps', 'checklist', 'outline'];

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

function countOccurrences(haystack: string, needles: string[]): number {
  const lower = haystack.toLowerCase();
  let count = 0;
  for (const n of needles) {
    let idx = lower.indexOf(n);
    while (idx !== -1) {
      count += 1;
      idx = lower.indexOf(n, idx + n.length);
    }
  }
  return count;
}

function promptKeywords(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

/** Keyword-overlap coverage: share of prompt keywords present in the response. */
function keywordCoverage(prompt: string, response: string): number {
  const kws = promptKeywords(prompt);
  if (kws.length === 0) return 0.8; // nothing to measure — be lenient
  const lower = response.toLowerCase();
  const hit = kws.filter((k) => lower.includes(k)).length;
  return hit / kws.length;
}

function repetitionPenalty(text: string): number {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 16) return 0;
  const seen = new Map<string, number>();
  for (let i = 0; i <= words.length - 4; i += 1) {
    const gram = words.slice(i, i + 4).join(' ');
    seen.set(gram, (seen.get(gram) ?? 0) + 1);
  }
  const repeated = Array.from(seen.values()).filter((c) => c >= 2).length;
  return clamp(repeated * 6, 0, 40);
}

function scoreRelevance(prompt: string, response: string): QualityDimension {
  const coverage = keywordCoverage(prompt, response);
  const notes: string[] = [];
  let score = Math.round(coverage * 100);
  if (coverage >= 0.8) notes.push('sebagian besar kata kunci prompt tercakup');
  else if (coverage >= 0.5) notes.push('cakupan kata kunci sedang');
  else notes.push('sedikit kata kunci prompt yang muncul di respons');
  if (response.trim().length < 10) {
    score = 0;
    notes.push('respons nyaris kosong');
  }
  return { name: 'relevance', score: clamp(score), weight: DEFAULT_WEIGHTS.relevance, notes };
}

function scoreCompleteness(prompt: string, response: string): QualityDimension {
  const words = response.trim().split(/\s+/).filter(Boolean).length;
  const notes: string[] = [];
  const complex =
    /explain|design|build|implement|how|why|compare|analyze|detail|architecture|plan/.test(
      prompt.toLowerCase(),
    );
  // Expected minimum length: complex asks need substance, simple asks can be short.
  const minExpected = complex ? 60 : 20;
  let score: number;
  if (words === 0) {
    score = 0;
  } else if (words >= minExpected * 2) {
    score = 100;
  } else {
    score = Math.round((words / (minExpected * 2)) * 100);
  }
  notes.push(
    `${words} kata (ekspektasi minimum ${minExpected} untuk pertanyaan ${complex ? 'kompleks' : 'sederhana'})`,
  );
  if (words > 400) {
    score = clamp(score - 10);
    notes.push('respons sangat panjang — berisiko bertele-tele');
  }
  return { name: 'completeness', score: clamp(score), weight: DEFAULT_WEIGHTS.completeness, notes };
}

function scoreClarity(text: string): QualityDimension {
  const notes: string[] = [];
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (sentences.length === 0)
    return {
      name: 'clarity',
      score: 0,
      weight: DEFAULT_WEIGHTS.clarity,
      notes: ['tidak ada kalimat'],
    };
  const avgWords =
    sentences.reduce((sum, s) => sum + s.split(/\s+/).filter(Boolean).length, 0) / sentences.length;
  let score = 100;
  if (avgWords > 30) {
    score -= Math.round((avgWords - 30) * 2);
    notes.push(`kalimat rata-rata ${avgWords.toFixed(0)} kata — terlalu panjang`);
  } else {
    notes.push(`kalimat rata-rata ${avgWords.toFixed(0)} kata — mudah dibaca`);
  }
  const reps = repetitionPenalty(text);
  if (reps > 0) {
    score -= reps;
    notes.push('terdeteksi pengulangan frasa');
  }
  const fillers = countOccurrences(text, FILLERS);
  if (fillers > 0) {
    score -= fillers * 5;
    notes.push(`${fillers} kata pengisi (filler)`);
  }
  return { name: 'clarity', score: clamp(score), weight: DEFAULT_WEIGHTS.clarity, notes };
}

function scoreCorrectness(text: string): QualityDimension {
  const notes: string[] = [];
  let score = 100;
  const hedges = countOccurrences(text, HEDGES);
  if (hedges > 0) {
    score -= hedges * 12;
    notes.push(`${hedges} frasa ketidakpastian (hedging)`);
  } else {
    notes.push('tidak ada frasa ketidakpastian');
  }
  const unsure = countOccurrences(text, UNSURE_MARKERS);
  if (unsure > 0) {
    score -= unsure * 30;
    notes.push('respons mengakui ketidaktahuan');
  }
  return { name: 'correctness', score: clamp(score), weight: DEFAULT_WEIGHTS.correctness, notes };
}

function scoreFormatting(prompt: string, response: string): QualityDimension {
  const notes: string[] = [];
  const p = prompt.toLowerCase();
  const wantsCode = CODE_WORDS.some((w) => p.includes(w));
  const wantsList = LIST_WORDS.some((w) => p.includes(w));
  const hasFence = /```/.test(response) || /`[^`]+`/.test(response);
  const hasList = /^\s*[-*•]|\d+\.\s/.test(response);
  const hasStructure =
    hasFence || hasList || /^#{1,3}\s/m.test(response) || response.split('\n\n').length >= 3;

  let score = 100;
  if (wantsCode && !hasFence) {
    score = Math.min(score, 40);
    notes.push('prompt meminta kode tapi tidak ada blok kode');
  } else if (wantsCode && hasFence) {
    notes.push('blok kode disediakan');
  }
  if (wantsList && !hasList) {
    score = Math.min(score, 50);
    notes.push('prompt meminta daftar tapi tidak ada bullet/nomor');
  } else if (wantsList && hasList) {
    notes.push('daftar disediakan');
  }
  if (!wantsCode && !wantsList) {
    score = hasStructure ? 100 : 60;
    notes.push(
      hasStructure ? 'respons terstruktur dengan baik' : 'respons berupa satu blok teks panjang',
    );
  }
  return { name: 'formatting', score: clamp(score), weight: DEFAULT_WEIGHTS.formatting, notes };
}

function scoreSafety(text: string): QualityDimension {
  const hits = BLOCKLIST.filter((b) => text.toLowerCase().includes(b));
  if (hits.length > 0) {
    return {
      name: 'safety',
      score: 0,
      weight: DEFAULT_WEIGHTS.safety,
      notes: [`terdeteksi konten berbahaya: ${hits.join(', ')}`],
    };
  }
  return {
    name: 'safety',
    score: 100,
    weight: DEFAULT_WEIGHTS.safety,
    notes: ['tidak ada konten berbahaya terdeteksi'],
  };
}

export function gradeFor(overall: number): QualityGrade {
  if (overall >= 90) return 'Excellent';
  if (overall >= 75) return 'Good';
  if (overall >= 60) return 'Fair';
  return 'Poor';
}

export class QualityScorer {
  private judge?: LlmJudge;
  private weights: Record<QualityDimensionName, number>;

  constructor(options: QualityScoringOptions = {}) {
    this.judge = options.judge;
    this.weights = { ...DEFAULT_WEIGHTS, ...options.weights };
  }

  async score(input: ScoredInput): Promise<QualityScore> {
    const prompt = input.prompt ?? '';
    const response = input.response ?? '';
    const dimensions: QualityDimension[] = [
      scoreRelevance(prompt, response),
      scoreCompleteness(prompt, response),
      scoreClarity(response),
      scoreCorrectness(response),
      scoreFormatting(prompt, response),
      scoreSafety(response),
    ];

    // Optional LLM judge overrides deterministic scores per dimension.
    let evaluator: QualityScore['evaluator'] = 'heuristic';
    if (this.judge) {
      try {
        const judged = await this.judge(input);
        for (const dim of dimensions) {
          const override = judged[dim.name];
          if (typeof override === 'number') {
            dim.score = clamp(Math.round(override));
            dim.notes.push(`dinilai LLM judge: ${override.toFixed(0)}`);
            evaluator = 'llm';
          }
        }
      } catch {
        // Judge failure must not break scoring — fall back to heuristics.
      }
    }

    let overall = 0;
    for (const dim of dimensions) {
      // Propagate effective (possibly custom) weights into the record.
      dim.weight = this.weights[dim.name]!;
      overall += dim.score * this.weights[dim.name]!;
    }
    overall = Math.round(overall);

    // Safety is a hard gate: a flagged response can never score well.
    const safety = dimensions.find((d) => d.name === 'safety');
    if (safety && safety.score === 0) {
      overall = Math.min(overall, 55);
    }

    return {
      id: `qs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      prompt,
      response,
      provider: input.provider,
      model: input.model,
      taskId: input.taskId,
      dimensions,
      overall,
      grade: gradeFor(overall),
      evaluator,
      createdAt: new Date().toISOString(),
    };
  }
}
