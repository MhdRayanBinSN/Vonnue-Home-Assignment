/**
 * algorithms/base.ts
 *
 * Base interface for all MCDM algorithm implementations.
 * Any new algorithm (AHP, ELECTRE, VIKOR, etc.) must implement IAlgorithm.
 */

import { DecisionProblem, OptionResult, Explanation } from '../types';

/** Normalised weights keyed by criterion ID (sum = 1) */
export type NormalizedWeights = Record<string, number>;

/** Normalised scores matrix: optionId → criterionId → 0-1 value */
export type NormalizedMatrix = Record<string, Record<string, number>>;

/**
 * Contract every MCDM algorithm must fulfil.
 */
export interface IAlgorithm {
    /**
     * Run the algorithm and return one OptionResult per alternative.
     * Ranks are NOT yet assigned here — the orchestrator (DecisionEngine) sorts and assigns them.
     */
    run(
        problem: DecisionProblem,
        normalizedWeights: NormalizedWeights,
        normalizedMatrix: NormalizedMatrix,
    ): OptionResult[];

    /**
     * Return a human-readable explanation of how this algorithm works.
     * Called by DecisionEngine after run() to populate DecisionResult.explanation.
     */
    explain(problem: DecisionProblem): Explanation;
}
