/**
 * algorithms/utils.ts
 *
 * Shared pure utility functions used by all MCDM algorithms.
 * No side-effects. No class. Just functions.
 */

import { Criterion, CriterionScore, DecisionProblem } from '../types';
import { NormalizedMatrix, NormalizedWeights } from './base';

// ─── Weight Normalisation ─────────────────────────────────────────────────────

/**
 * Normalise criterion weights so they sum to 1.
 * Handles the case where all weights are 0 (returns uniform weights).
 */
export function normalizeWeights(criteria: Criterion[]): NormalizedWeights {
    const total = criteria.reduce((s, c) => s + c.weight, 0);
    const result: NormalizedWeights = {};
    for (const c of criteria) {
        result[c.id] = total > 0 ? c.weight / total : 1 / criteria.length;
    }
    return result;
}

// ─── Score Normalisation ──────────────────────────────────────────────────────

/**
 * Min-Max normalisation (used by WSM).
 *
 * Benefit criterion:  n = (x - min) / (max - min)
 * Cost criterion:     n = (max - x) / (max - min)
 *
 * Corner case: if all values are identical, returns 0.5 (neutral — no
 * information to discriminate between options on this criterion).
 * Returning 1.0 would incorrectly inflate every option's score.
 */
export function normalizeMinMax(problem: DecisionProblem): NormalizedMatrix {
    const matrix: NormalizedMatrix = {};
    for (const opt of problem.options) matrix[opt.id] = {};

    for (const criterion of problem.criteria) {
        const values = problem.options.map(o => o.scores[criterion.id] ?? 0);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;

        for (const opt of problem.options) {
            const raw = opt.scores[criterion.id] ?? 0;
            if (range === 0) {
                // All options identical on this criterion → neutral score
                matrix[opt.id][criterion.id] = 0.5;
            } else if (criterion.type === 'benefit') {
                matrix[opt.id][criterion.id] = (raw - min) / range;
            } else {
                matrix[opt.id][criterion.id] = (max - raw) / range;
            }
        }
    }
    return matrix;
}

/**
 * Vector normalisation (used by TOPSIS).
 *
 * r_ij = x_ij / sqrt(Σ x_ij²)
 *
 * Preserves relative Euclidean distances; avoids the scale bias that
 * min-max introduces when comparing options with very different ranges.
 */
export function normalizeVector(problem: DecisionProblem): NormalizedMatrix {
    const matrix: NormalizedMatrix = {};
    for (const opt of problem.options) matrix[opt.id] = {};

    for (const criterion of problem.criteria) {
        const sumSq = problem.options.reduce(
            (s, o) => s + Math.pow(o.scores[criterion.id] ?? 0, 2),
            0,
        );
        const norm = Math.sqrt(sumSq) || 1;

        for (const opt of problem.options) {
            matrix[opt.id][criterion.id] = (opt.scores[criterion.id] ?? 0) / norm;
        }
    }
    return matrix;
}

// ─── Strengths & Weaknesses ───────────────────────────────────────────────────

/**
 * Classify an option's criteria scores into strengths (≥ 0.7) and
 * weaknesses (≤ 0.3). Falls back to top/bottom criteria if none qualify.
 */
export function identifyStrengthsWeaknesses(criteriaScores: CriterionScore[]): {
    strengths: string[];
    weaknesses: string[];
} {
    const sorted = [...criteriaScores].sort((a, b) => b.normalizedScore - a.normalizedScore);
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    sorted.filter(cs => cs.normalizedScore > 0.7).forEach(cs => {
        strengths.push(`Strong in ${cs.criterionName}`);
    });
    sorted.filter(cs => cs.normalizedScore < 0.3).forEach(cs => {
        weaknesses.push(`Weak in ${cs.criterionName}`);
    });

    if (strengths.length === 0 && sorted.length > 0) {
        strengths.push(`Best in ${sorted[0].criterionName}`);
    }
    if (weaknesses.length === 0 && sorted.length > 1) {
        weaknesses.push(`Could improve in ${sorted[sorted.length - 1].criterionName}`);
    }

    return { strengths, weaknesses };
}
