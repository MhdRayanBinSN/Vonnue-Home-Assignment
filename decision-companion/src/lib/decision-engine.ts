/**
 * decision-engine.ts  —  Orchestrator
 *
 * Thin facade that:
 *  1. Validates the decision problem
 *  2. Normalises weights (via algorithms/utils)
 *  3. Delegates scoring to the appropriate algorithm (WSM or TOPSIS)
 *  4. Assigns ranks, generates a recommendation, runs sensitivity analysis
 *
 * All algorithm logic lives in src/lib/algorithms/.
 * To add a new MCDM method, create a class implementing IAlgorithm and
 * call it here — no changes needed elsewhere.
 */

import {
  DecisionProblem,
  OptionResult,
  DecisionResult,
  Recommendation,
  SensitivityAnalysis,
  SensitivityScenario,
  TopsisResult,
  DecisionMethod,
  MethodConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types';

import {
  WsmAlgorithm,
  TopsisAlgorithm,
  normalizeWeights,
  normalizeMinMax,
} from './algorithms';

// ─────────────────────────────────────────────────────────────────────────────

export class DecisionEngine {
  private problem: DecisionProblem;
  private config: MethodConfig;
  private skipSensitivity: boolean;

  constructor(
    problem: DecisionProblem,
    config?: Partial<MethodConfig>,
    skipSensitivity = false,
  ) {
    this.problem = problem;
    this.config = {
      method: config?.method ?? 'wsm',
      normalizationMethod: config?.normalizationMethod ?? 'minmax',
      handleTies: config?.handleTies ?? 'average',
    };
    this.skipSensitivity = skipSensitivity;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Validate the problem before analysis */
  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!this.problem.options?.length) {
      errors.push({ code: 'NO_OPTIONS', message: 'At least one option is required.' });
    }
    if (!this.problem.criteria?.length) {
      errors.push({ code: 'NO_CRITERIA', message: 'At least one criterion is required.' });
    }

    if (this.problem.options && this.problem.criteria) {
      for (const option of this.problem.options) {
        for (const criterion of this.problem.criteria) {
          if (option.scores[criterion.id] === undefined) {
            errors.push({
              code: 'MISSING_SCORE',
              message: `"${option.name}" is missing a score for "${criterion.name}"`,
              field: `${option.id}.scores.${criterion.id}`,
            });
          }
        }
      }
    }

    if (this.problem.criteria) {
      const totalWeight = this.problem.criteria.reduce((s, c) => s + c.weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        warnings.push({
          code: 'WEIGHTS_NOT_100',
          message: `Weights sum to ${totalWeight.toFixed(1)}%, not 100%`,
          suggestion: 'Weights will be normalised automatically.',
        });
      }
      const zeros = this.problem.criteria.filter(c => c.weight === 0);
      if (zeros.length > 0) {
        warnings.push({
          code: 'ZERO_WEIGHTS',
          message: `${zeros.length} criteria have zero weight`,
          suggestion: 'Remove or adjust zero-weight criteria.',
        });
      }
    }

    if (this.problem.options?.length === 1) {
      warnings.push({
        code: 'SINGLE_OPTION',
        message: 'Only one option — no comparison possible.',
        suggestion: 'Add more options for meaningful analysis.',
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Run WSM analysis and return the full DecisionResult.
   * TOPSIS can be run separately via runTOPSIS().
   */
  analyze(): DecisionResult {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(
        `Invalid decision problem: ${validation.errors.map(e => e.message).join(', ')}`,
      );
    }

    // ── Step 1: Auto-calculate derived metrics ──────────────────────────────
    this.calculateDerivedMetrics();

    // ── Step 2: Apply budget and threshold filters ──────────────────────────
    const { filteredOptions, filteredOutCount, filteredOutReasons } = this.applyFilters();

    // If all options filtered out, throw error
    if (filteredOptions.length === 0) {
      throw new Error(
        `All options filtered out. ${filteredOutReasons.join(' ')}`,
      );
    }

    // Create temporary problem with filtered options
    const filteredProblem: DecisionProblem = {
      ...this.problem,
      options: filteredOptions,
    };

    // ── Step 3: Run WSM algorithm ────────────────────────────────────────────
    const weights = normalizeWeights(filteredProblem.criteria);
    const matrix = normalizeMinMax(filteredProblem);

    const wsm = new WsmAlgorithm();
    const results = wsm.run(filteredProblem, weights, matrix);
    results.sort((a, b) => b.finalScore - a.finalScore);
    results.forEach((r, i) => { r.rank = i + 1; });

    const recommendation = this.generateRecommendation(results);
    const explanation = wsm.explain(filteredProblem);
    const sensitivity = this.skipSensitivity
      ? { isRobust: true, criticalCriteria: [], scenarios: [] }
      : this.runSensitivityAnalysis(results);

    return {
      problemId: this.problem.id,
      method: this.config.method,
      results,
      recommendation,
      explanation,
      sensitivity,
      timestamp: new Date(),
      filteredOutCount,
      filteredOutReasons,
    };
  }

  /**
   * Run TOPSIS analysis.
   * Call after analyze() so WSM ranks are available for cross-comparison.
   *
   * @param wsmResults - results array from analyze() (already ranked)
   */
  runTOPSIS(wsmResults: OptionResult[]): TopsisResult {
    const weights = normalizeWeights(this.problem.criteria);
    const topsis = new TopsisAlgorithm();
    return topsis.run(this.problem, weights, wsmResults);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Auto-calculate derived metrics like price-to-performance ratio
   */
  private calculateDerivedMetrics(): void {
    for (const option of this.problem.options) {
      const cpu = option.scores['cpu'] || 0;
      const gpu = option.scores['gpu'] || 0;
      const price = option.scores['price'] || 1;

      // Price-to-Performance: (CPU + GPU) / Price * 1000
      if (price > 0) {
        option.scores['pricePerformance'] = ((cpu + gpu) / price) * 1000;
      } else {
        option.scores['pricePerformance'] = 0;
      }
    }
  }

  /**
   * Apply budget limit and minimum threshold filters
   * Returns filtered options and metadata about what was filtered
   */
  private applyFilters(): {
    filteredOptions: typeof this.problem.options;
    filteredOutCount: number;
    filteredOutReasons: string[];
  } {
    const reasons: string[] = [];
    let budgetFilteredCount = 0;
    let thresholdFilteredCount = 0;

    const filteredOptions = this.problem.options.filter(option => {
      // Budget filter (if set)
      if (this.problem.budgetLimit && this.problem.budgetLimit > 0) {
        const price = option.scores['price'];
        if (price && price > this.problem.budgetLimit) {
          budgetFilteredCount++;
          return false;
        }
      }

      // Minimum threshold filters (if set)
      if (this.problem.minThresholds) {
        for (const [criterionId, minValue] of Object.entries(this.problem.minThresholds)) {
          const criterion = this.problem.criteria.find(c => c.id === criterionId);
          if (!criterion) continue;

          const score = option.scores[criterionId];
          if (score === undefined) continue;

          // For cost criteria (lower is better), threshold is maximum allowed
          // For benefit criteria (higher is better), threshold is minimum required
          if (criterion.type === 'benefit' && score < minValue) {
            thresholdFilteredCount++;
            return false;
          } else if (criterion.type === 'cost' && score > minValue) {
            thresholdFilteredCount++;
            return false;
          }
        }
      }

      return true;
    });

    if (budgetFilteredCount > 0) {
      reasons.push(`${budgetFilteredCount} option(s) exceeded budget of ₹${this.problem.budgetLimit?.toLocaleString('en-IN')}.`);
    }
    if (thresholdFilteredCount > 0) {
      reasons.push(`${thresholdFilteredCount} option(s) didn't meet minimum requirements.`);
    }

    return {
      filteredOptions,
      filteredOutCount: budgetFilteredCount + thresholdFilteredCount,
      filteredOutReasons: reasons,
    };
  }

  private generateRecommendation(results: OptionResult[]): Recommendation {
    const winner = results[0];
    const runnerUp = results[1];

    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let confidenceReason = '';
    
    if (results.length > 1) {
      const diff = winner.finalScore - runnerUp.finalScore;
      const avg = (winner.finalScore + runnerUp.finalScore) / 2;
      const relDiff = avg > 0 ? diff / avg : 0;
      const percentDiff = relDiff * 100;
      
      if (relDiff > 0.2) {
        confidence = 'high';
        confidenceReason = `Winner leads by ${percentDiff.toFixed(1)}% - clear advantage`;
      } else if (relDiff < 0.05) {
        confidence = 'low';
        confidenceReason = `Only ${percentDiff.toFixed(1)}% difference - too close to call`;
      } else {
        confidence = 'medium';
        confidenceReason = `${percentDiff.toFixed(1)}% difference - moderate advantage`;
      }
    } else {
      confidence = 'high';
      confidenceReason = 'Only one option available';
    }

    // Top-3 contributing criteria
    const keyReasons = [...winner.criteriaScores]
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3)
      .map(cs =>
        `Scores ${(cs.normalizedScore * 100).toFixed(0)}% on ${cs.criterionName} ` +
        `(weighted ${cs.weight.toFixed(0)}% importance)`,
      );

    // Trade-offs
    const tradeoffs: string[] = [];
    if (winner.weaknesses.length > 0) {
      tradeoffs.push(...winner.weaknesses.slice(0, 2));
    }
    if (runnerUp) {
      runnerUp.criteriaScores
        .filter(cs => {
          const ws = winner.criteriaScores.find(w => w.criterionId === cs.criterionId);
          return cs.normalizedScore > (ws?.normalizedScore ?? 0);
        })
        .slice(0, 2)
        .forEach(cs => tradeoffs.push(`${runnerUp.optionName} is better in ${cs.criterionName}`));
    }

    const summary =
      `Based on WSM analysis across ${this.problem.criteria.length} criteria, ` +
      `"${winner.optionName}" is recommended with a score of ${winner.normalizedScore.toFixed(1)}%. ` +
      (runnerUp ? `Runner-up "${runnerUp.optionName}" scored ${runnerUp.normalizedScore.toFixed(1)}%. ${confidenceReason}` : '');

    return {
      optionId: winner.optionId,
      optionName: winner.optionName,
      confidence,
      summary,
      keyReasons,
      tradeoffs,
    };
  }

  private runSensitivityAnalysis(results: OptionResult[]): SensitivityAnalysis {
    const scenarios: SensitivityScenario[] = [];
    const criticalCriteria: string[] = [];

    for (const criterion of this.problem.criteria) {
      const boost = criterion.weight * 0.5;
      const otherTotal = this.problem.criteria
        .filter(c => c.id !== criterion.id)
        .reduce((s, c) => s + c.weight, 0);

      const adjustedWeights: Record<string, number> = {};
      for (const c of this.problem.criteria) {
        if (c.id === criterion.id) {
          adjustedWeights[c.id] = Math.min(c.weight * 1.5, 100);
        } else {
          const reduction = otherTotal > 0 ? (boost * c.weight) / otherTotal : 0;
          adjustedWeights[c.id] = Math.max(c.weight - reduction, 0);
        }
      }

      const modifiedProblem: DecisionProblem = {
        ...this.problem,
        criteria: this.problem.criteria.map(c => ({ ...c, weight: adjustedWeights[c.id] })),
      };

      const modResult = new DecisionEngine(modifiedProblem, this.config, true).analyze();
      const origRanking = results.map(r => r.optionId);
      const newRanking = modResult.results.map(r => r.optionId);
      const rankingChanged = JSON.stringify(origRanking) !== JSON.stringify(newRanking);

      if (rankingChanged) criticalCriteria.push(criterion.name);

      scenarios.push({
        description: `Increase "${criterion.name}" weight by 50%`,
        weightChanges: adjustedWeights,
        newRanking,
        rankingChanged,
      });
    }

    return {
      isRobust: criticalCriteria.length === 0,
      criticalCriteria,
      scenarios,
    };
  }
}

// ─── Utility factories ────────────────────────────────────────────────────────

export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function createEmptyProblem(title = 'New Decision'): DecisionProblem {
  return {
    id: generateId(), title, description: '',
    options: [], criteria: [],
    createdAt: new Date(), updatedAt: new Date(),
  };
}

export function createSampleProblem(): DecisionProblem {
  return {
    id: generateId(),
    title: 'Choosing a Laptop',
    description: 'Help me decide which laptop to buy for software development',
    options: [
      {
        id: 'opt1', name: 'MacBook Pro 14"', description: 'Apple MacBook Pro M3 Pro',
        scores: { crit1: 9, crit2: 85000, crit3: 8, crit4: 9, crit5: 7 }
      },
      {
        id: 'opt2', name: 'Dell XPS 15', description: 'Dell XPS 15 Intel i7',
        scores: { crit1: 8, crit2: 65000, crit3: 7, crit4: 7, crit5: 9 }
      },
      {
        id: 'opt3', name: 'ThinkPad X1 Carbon', description: 'Lenovo ThinkPad X1 Carbon Gen 11',
        scores: { crit1: 7, crit2: 55000, crit3: 9, crit4: 6, crit5: 8 }
      },
    ],
    criteria: [
      { id: 'crit1', name: 'Performance', weight: 30, type: 'benefit', description: 'CPU/GPU performance', minValue: 1, maxValue: 10 },
      { id: 'crit2', name: 'Price (₹)', weight: 25, type: 'cost', description: 'Total cost', minValue: 30000, maxValue: 150000 },
      { id: 'crit3', name: 'Build Quality', weight: 20, type: 'benefit', description: 'Material & durability', minValue: 1, maxValue: 10 },
      { id: 'crit4', name: 'Display Quality', weight: 15, type: 'benefit', description: 'Screen quality', minValue: 1, maxValue: 10 },
      { id: 'crit5', name: 'Portability', weight: 10, type: 'benefit', description: 'Weight & size', minValue: 1, maxValue: 10 },
    ],
    createdAt: new Date(), updatedAt: new Date(),
  };
}
