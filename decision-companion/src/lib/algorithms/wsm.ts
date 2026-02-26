/**
 * algorithms/wsm.ts
 *
 * Weighted Sum Model (WSM) — MCDM algorithm implementation.
 *
 * Formula:  Score(i) = Σ( w_j × n_ij )
 *   w_j  = normalised weight of criterion j
 *   n_ij = min-max normalised score of option i on criterion j
 *
 * Strengths:  simple, transparent, easily explainable.
 * Limitation: assumes criteria are independent; a very strong value on one
 *             criterion can fully compensate a weak value on another.
 */

import {
    DecisionProblem,
    OptionResult,
    CriterionScore,
    Explanation,
    ExplanationStep,
} from '../types';
import { IAlgorithm, NormalizedMatrix, NormalizedWeights } from './base';
import { identifyStrengthsWeaknesses } from './utils';

export class WsmAlgorithm implements IAlgorithm {
    // ─── IAlgorithm.run ────────────────────────────────────────────────────────

    run(
        problem: DecisionProblem,
        normalizedWeights: NormalizedWeights,
        normalizedMatrix: NormalizedMatrix,
    ): OptionResult[] {
        return problem.options.map(option => {
            const criteriaScores: CriterionScore[] = [];
            let totalScore = 0;

            for (const criterion of problem.criteria) {
                const rawScore = option.scores[criterion.id] ?? 0;
                const normalizedScore = normalizedMatrix[option.id][criterion.id];
                const weight = normalizedWeights[criterion.id];
                const weightedScore = normalizedScore * weight;

                totalScore += weightedScore;

                criteriaScores.push({
                    criterionId: criterion.id,
                    criterionName: criterion.name,
                    rawScore,
                    normalizedScore,
                    weightedScore,
                    weight: criterion.weight,
                    contribution: 0, // filled below
                });
            }

            // Contribution % = how much this criterion contributed to the total score
            criteriaScores.forEach(cs => {
                cs.contribution = totalScore > 0 ? (cs.weightedScore / totalScore) * 100 : 0;
            });

            const { strengths, weaknesses } = identifyStrengthsWeaknesses(criteriaScores);

            return {
                optionId: option.id,
                optionName: option.name,
                finalScore: totalScore,
                normalizedScore: totalScore * 100,
                rank: 0, // assigned by DecisionEngine after sorting
                criteriaScores,
                strengths,
                weaknesses,
            };
        });
    }

    // ─── IAlgorithm.explain ───────────────────────────────────────────────────

    explain(problem: DecisionProblem): Explanation {
        const steps: ExplanationStep[] = [
            {
                step: 1,
                title: 'Collect Raw Scores',
                description: `User-provided scores for each of the ${problem.options.length} options across ${problem.criteria.length} criteria.`,
            },
            {
                step: 2,
                title: 'Normalise Scores (Min-Max)',
                description: 'Scale each criterion column to 0–1 so different units are comparable. Cost criteria are inverted (lower = better).',
                formula: 'benefit: (x − min) / (max − min) | cost: (max − x) / (max − min)',
            },
            {
                step: 3,
                title: 'Apply Criterion Weights',
                description: 'Multiply each normalised score by its criterion weight (0–1 fractions that sum to 1).',
                formula: 'weighted_score = normalised_score × weight',
            },
            {
                step: 4,
                title: 'Sum Weighted Scores',
                description: 'Add all weighted scores for each option to get its final WSM score.',
                formula: 'Score(i) = Σ( w_j × n_ij )',
            },
            {
                step: 5,
                title: 'Rank Options',
                description: 'Sort options by final score in descending order. Highest score wins.',
            },
        ];

        return {
            methodDescription:
                'WSM (Weighted Sum Model) combines normalised scores weighted by importance into a single composite score per option. Simple, fast, and fully transparent.',
            stepByStep: steps,
            assumptions: [
                'Criteria are independent of each other',
                'A high score on one criterion can compensate a low score on another',
                'Weights accurately reflect the decision-maker\'s priorities',
            ],
            limitations: [
                'Compensatory nature may hide critical weaknesses',
                'Sensitive to how criteria weights are set',
                'Min-max normalisation is affected by extreme outliers',
            ],
        };
    }
}
