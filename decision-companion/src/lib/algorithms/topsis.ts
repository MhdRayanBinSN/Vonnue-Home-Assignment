/**
 * algorithms/topsis.ts
 *
 * TOPSIS — Technique for Order Preference by Similarity to Ideal Solution.
 *
 * Standard 6-step MCDM formulation:
 *  1. Vector normalisation:   r_ij = x_ij / √(Σ x_ij²)
 *  2. Weighted matrix:        v_ij = w_j × r_ij
 *  3. Ideal Best  (A+):       max v_ij for benefit, min for cost
 *  4. Ideal Worst (A-):       min v_ij for benefit, max for cost
 *  5. Euclidean distances:    D+ = √Σ(v_ij − A+_j)²,  D- = √Σ(v_ij − A-_j)²
 *  6. Closeness Coefficient:  CC = D- / (D+ + D-)   → higher is better
 *
 * Unlike WSM, TOPSIS penalises options that are far from ideal on any single
 * dimension ("balanced" options win over "strong-on-one" options).
 */

import {
    DecisionProblem,
    OptionResult,
    TopsisResult,
    TopsisOptionResult,
    TopsisIdealPoint,
    RankAgreement,
} from '../types';
import { NormalizedWeights } from './base';
import { normalizeVector } from './utils';

export class TopsisAlgorithm {
    /**
     * Run TOPSIS and return a full TopsisResult including ideal points,
     * per-option CC scores, and Kendall's Tau rank agreement vs WSM.
     *
     * @param problem          The decision problem (options + criteria)
     * @param normalizedWeights Criterion weights summing to 1 (from utils.normalizeWeights)
     * @param wsmResults       Ranked WSM OptionResult array (for cross-comparison)
     */
    run(
        problem: DecisionProblem,
        normalizedWeights: NormalizedWeights,
        wsmResults: OptionResult[],
    ): TopsisResult {
        const { options, criteria } = problem;

        // ── Step 1: Vector normalisation ─────────────────────────────────────────
        const vectorMatrix = normalizeVector(problem);

        // ── Step 2: Weighted normalised matrix  v_ij = w_j × r_ij ───────────────
        const weighted: Record<string, Record<string, number>> = {};
        for (const opt of options) {
            weighted[opt.id] = {};
            for (const c of criteria) {
                weighted[opt.id][c.id] = normalizedWeights[c.id] * vectorMatrix[opt.id][c.id];
            }
        }

        // ── Steps 3 & 4: Ideal Best (A+) and Ideal Worst (A-) ───────────────────
        const idealBest: Record<string, number> = {};
        const idealWorst: Record<string, number> = {};
        const idealPoints: TopsisIdealPoint[] = [];

        for (const c of criteria) {
            const vals = options.map(o => weighted[o.id][c.id]);
            const minV = Math.min(...vals);
            const maxV = Math.max(...vals);

            if (c.type === 'benefit') {
                idealBest[c.id] = maxV;
                idealWorst[c.id] = minV;
            } else {
                // cost: lower raw value is better → lower weighted value is better
                idealBest[c.id] = minV;
                idealWorst[c.id] = maxV;
            }

            idealPoints.push({
                criterionId: c.id,
                criterionName: c.name,
                idealBest: idealBest[c.id],
                idealWorst: idealWorst[c.id],
            });
        }

        // ── Steps 5 & 6: Distances + Closeness Coefficient ──────────────────────
        const rawResults = options.map(opt => {
            let sumBest = 0;
            let sumWorst = 0;

            for (const c of criteria) {
                const v = weighted[opt.id][c.id];
                sumBest += Math.pow(v - idealBest[c.id], 2);
                sumWorst += Math.pow(v - idealWorst[c.id], 2);
            }

            const dBest = Math.sqrt(sumBest);
            const dWorst = Math.sqrt(sumWorst);
            const cc = dBest + dWorst > 0 ? dWorst / (dBest + dWorst) : 0;

            return { optionId: opt.id, optionName: opt.name, dBest, dWorst, cc };
        });

        // Sort by CC descending → assign TOPSIS ranks
        rawResults.sort((a, b) => b.cc - a.cc);

        // Build WSM rank lookup map
        const wsmRankMap: Record<string, number> = {};
        for (const wr of wsmResults) wsmRankMap[wr.optionId] = wr.rank;

        // Assemble TopsisOptionResult[]
        const topsisResults: TopsisOptionResult[] = rawResults.map((r, i) => {
            const tRank = i + 1;
            const wsmRank = wsmRankMap[r.optionId] ?? 0;
            return {
                optionId: r.optionId,
                optionName: r.optionName,
                distanceFromBest: Math.round(r.dBest * 10000) / 10000,
                distanceFromWorst: Math.round(r.dWorst * 10000) / 10000,
                closenessCoefficient: Math.round(r.cc * 10000) / 10000,
                rank: tRank,
                wsmRank,
                rankAgreement: tRank === wsmRank,
            };
        });

        // Rank agreement (Kendall's Tau)
        const rankAgreement = this.computeRankAgreement(topsisResults);

        return {
            results: topsisResults,
            idealPoints,
            rankAgreement,
            winner: topsisResults[0].optionName,
            winnerAgreement: topsisResults[0].wsmRank === 1,
        };
    }

    // ─── Kendall's Tau ─────────────────────────────────────────────────────────

    /**
     * Compute Kendall's Tau rank correlation between TOPSIS and WSM rankings.
     *
     * τ = (concordant − discordant) / C(n, 2)
     * Range: −1 (perfect disagreement) → +1 (perfect agreement)
     */
    private computeRankAgreement(results: TopsisOptionResult[]): RankAgreement {
        const n = results.length;
        const agreementCount = results.filter(r => r.rankAgreement).length;

        let concordant = 0;
        let discordant = 0;

        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                const tSign = Math.sign(results[i].rank - results[j].rank);
                const wSign = Math.sign(results[i].wsmRank - results[j].wsmRank);
                if (tSign === wSign) concordant++;
                else discordant++;
            }
        }

        const totalPairs = (n * (n - 1)) / 2;
        const tau = totalPairs > 0 ? (concordant - discordant) / totalPairs : 1;

        let level: RankAgreement['level'];
        let interpretation: string;

        if (tau >= 1.0) {
            level = 'full';
            interpretation = 'Both algorithms rank identically — decision is very robust.';
        } else if (tau >= 0.7) {
            level = 'high';
            interpretation = 'Strong agreement. Minor rank differences, but recommendation is stable.';
        } else if (tau >= 0.3) {
            level = 'moderate';
            interpretation = 'Partial agreement. Review criteria where rankings differ.';
        } else {
            level = 'low';
            interpretation = 'Significant disagreement. The choice is sensitive to algorithm — consider weights carefully.';
        }

        return {
            agreementCount,
            kendallTau: Math.round(tau * 100) / 100,
            level,
            interpretation,
        };
    }
}
