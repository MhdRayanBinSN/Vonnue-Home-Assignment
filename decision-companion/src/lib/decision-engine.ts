/**
 * Decision Engine - Core Decision Making Algorithms
 * 
 * This module implements the Weighted Sum Model (WSM) - a Multi-Criteria Decision Making (MCDM) algorithm
 * that provides simple and intuitive weighted scoring for decision problems.
 * 
 * The algorithm is fully explainable and provides step-by-step reasoning.
 */

import {
  Option,
  Criterion,
  DecisionProblem,
  OptionResult,
  CriterionScore,
  DecisionResult,
  Recommendation,
  Explanation,
  ExplanationStep,
  SensitivityAnalysis,
  SensitivityScenario,
  DecisionMethod,
  MethodConfig,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types';

/**
 * Main Decision Engine class
 * Provides a clean interface for running decision analysis
 */
export class DecisionEngine {
  private problem: DecisionProblem;
  private config: MethodConfig;

  private skipSensitivity: boolean;

  constructor(problem: DecisionProblem, config?: Partial<MethodConfig>, skipSensitivity = false) {
    this.problem = problem;
    this.config = {
      method: config?.method || 'wsm',
      normalizationMethod: config?.normalizationMethod || 'minmax',
      handleTies: config?.handleTies || 'average',
    };
    this.skipSensitivity = skipSensitivity;
  }

  /**
   * Validate the decision problem before analysis
   */
  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check if there are options
    if (!this.problem.options || this.problem.options.length === 0) {
      errors.push({
        code: 'NO_OPTIONS',
        message: 'At least one option is required for decision analysis',
      });
    }

    // Check if there are criteria
    if (!this.problem.criteria || this.problem.criteria.length === 0) {
      errors.push({
        code: 'NO_CRITERIA',
        message: 'At least one criterion is required for decision analysis',
      });
    }

    // Validate each option has scores for all criteria
    if (this.problem.options && this.problem.criteria) {
      for (const option of this.problem.options) {
        for (const criterion of this.problem.criteria) {
          if (option.scores[criterion.id] === undefined) {
            errors.push({
              code: 'MISSING_SCORE',
              message: `Option "${option.name}" is missing score for criterion "${criterion.name}"`,
              field: `${option.id}.scores.${criterion.id}`,
            });
          }
        }
      }
    }

    // Validate weights
    if (this.problem.criteria) {
      const totalWeight = this.problem.criteria.reduce((sum, c) => sum + c.weight, 0);
      if (Math.abs(totalWeight - 100) > 0.01) {
        warnings.push({
          code: 'WEIGHTS_NOT_100',
          message: `Criterion weights sum to ${totalWeight.toFixed(1)}%, not 100%`,
          suggestion: 'Weights will be normalized automatically',
        });
      }

      // Check for zero weights
      const zeroWeights = this.problem.criteria.filter(c => c.weight === 0);
      if (zeroWeights.length > 0) {
        warnings.push({
          code: 'ZERO_WEIGHTS',
          message: `${zeroWeights.length} criteria have zero weight and will not affect the result`,
          suggestion: 'Consider removing criteria with zero weight or adjusting weights',
        });
      }
    }

    // Check for only one option
    if (this.problem.options && this.problem.options.length === 1) {
      warnings.push({
        code: 'SINGLE_OPTION',
        message: 'Only one option provided - no comparison possible',
        suggestion: 'Add more options for meaningful analysis',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Run the decision analysis using the configured method
   */
  analyze(): DecisionResult {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid decision problem: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    let results: OptionResult[];
    let explanation: Explanation;

    // Using WSM (Weighted Sum Model) algorithm
    results = this.runWSM();
    explanation = this.explainWSM();

    // Sort by score and assign ranks
    results.sort((a, b) => b.finalScore - a.finalScore);
    results.forEach((result, index) => {
      result.rank = index + 1;
    });

    const recommendation = this.generateRecommendation(results);
    const sensitivity = this.skipSensitivity ? null : this.runSensitivityAnalysis(results);

    return {
      problemId: this.problem.id,
      method: this.config.method,
      results,
      recommendation,
      explanation,
      sensitivity: sensitivity || { isRobust: true, criticalCriteria: [], scenarios: [] },
      timestamp: new Date(),
    };
  }

  /**
   * Weighted Sum Model (WSM)
   * 
   * Formula: Score(i) = Σ(w_j × n_ij)
   * Where:
   * - w_j = normalized weight of criterion j
   * - n_ij = normalized score of option i for criterion j
   */
  private runWSM(): OptionResult[] {
    const normalizedWeights = this.normalizeWeights();
    const normalizedScores = this.normalizeScoresMinMax();

    return this.problem.options.map(option => {
      const criteriaScores: CriterionScore[] = [];
      let totalScore = 0;

      for (const criterion of this.problem.criteria) {
        const rawScore = option.scores[criterion.id] || 0;
        const normalizedScore = normalizedScores[option.id][criterion.id];
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
          contribution: 0, // Will be calculated after
        });
      }

      // Calculate contribution percentages
      criteriaScores.forEach(cs => {
        cs.contribution = totalScore > 0 ? (cs.weightedScore / totalScore) * 100 : 0;
      });

      // Identify strengths and weaknesses
      const { strengths, weaknesses } = this.identifyStrengthsWeaknesses(criteriaScores);

      return {
        optionId: option.id,
        optionName: option.name,
        finalScore: totalScore,
        normalizedScore: totalScore * 100,
        rank: 0, // Will be assigned after sorting
        criteriaScores,
        strengths,
        weaknesses,
      };
    });
  }



  /**
   * Normalize weights to sum to 1
   */
  private normalizeWeights(): Record<string, number> {
    const totalWeight = this.problem.criteria.reduce((sum, c) => sum + c.weight, 0);
    const normalized: Record<string, number> = {};
    
    for (const criterion of this.problem.criteria) {
      normalized[criterion.id] = totalWeight > 0 ? criterion.weight / totalWeight : 0;
    }
    
    return normalized;
  }

  /**
   * Min-Max normalization (scales values to 0-1)
   */
  private normalizeScoresMinMax(): Record<string, Record<string, number>> {
    const normalized: Record<string, Record<string, number>> = {};

    for (const option of this.problem.options) {
      normalized[option.id] = {};
    }

    for (const criterion of this.problem.criteria) {
      const values = this.problem.options.map(o => o.scores[criterion.id] || 0);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      for (const option of this.problem.options) {
        const rawValue = option.scores[criterion.id] || 0;
        
        if (range === 0) {
          normalized[option.id][criterion.id] = 1; // All values are the same
        } else if (criterion.type === 'benefit') {
          normalized[option.id][criterion.id] = (rawValue - min) / range;
        } else {
          // Cost criterion: lower is better
          normalized[option.id][criterion.id] = (max - rawValue) / range;
        }
      }
    }

    return normalized;
  }

  /**
   * Identify strengths and weaknesses for an option
   */
  private identifyStrengthsWeaknesses(criteriaScores: CriterionScore[]): {
    strengths: string[];
    weaknesses: string[];
  } {
    const sorted = [...criteriaScores].sort((a, b) => b.normalizedScore - a.normalizedScore);
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Top performers (normalized score > 0.7)
    sorted.filter(cs => cs.normalizedScore > 0.7).forEach(cs => {
      strengths.push(`Strong in ${cs.criterionName}`);
    });

    // Weak areas (normalized score < 0.3)
    sorted.filter(cs => cs.normalizedScore < 0.3).forEach(cs => {
      weaknesses.push(`Weak in ${cs.criterionName}`);
    });

    // If no clear strengths/weaknesses, take top/bottom 2
    if (strengths.length === 0 && sorted.length > 0) {
      strengths.push(`Best in ${sorted[0].criterionName}`);
    }
    if (weaknesses.length === 0 && sorted.length > 1) {
      weaknesses.push(`Could improve in ${sorted[sorted.length - 1].criterionName}`);
    }

    return { strengths, weaknesses };
  }

  /**
   * Generate recommendation with reasoning
   */
  private generateRecommendation(results: OptionResult[]): Recommendation {
    const winner = results[0];
    const runnerUp = results[1];

    // Calculate confidence based on score difference
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (results.length > 1) {
      const scoreDiff = winner.finalScore - runnerUp.finalScore;
      const avgScore = (winner.finalScore + runnerUp.finalScore) / 2;
      const relDiff = avgScore > 0 ? scoreDiff / avgScore : 0;

      if (relDiff > 0.2) confidence = 'high';
      else if (relDiff < 0.05) confidence = 'low';
    } else {
      confidence = 'high'; // Only one option
    }

    // Generate key reasons
    const keyReasons: string[] = [];
    const topCriteria = [...winner.criteriaScores]
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3);

    topCriteria.forEach(cs => {
      keyReasons.push(
        `Scores ${(cs.normalizedScore * 100).toFixed(0)}% on ${cs.criterionName} (weighted ${cs.weight.toFixed(0)}% importance)`
      );
    });

    // Generate tradeoffs
    const tradeoffs: string[] = [];
    if (winner.weaknesses.length > 0) {
      tradeoffs.push(...winner.weaknesses.slice(0, 2));
    }
    if (runnerUp) {
      const runnerUpStrengths = runnerUp.criteriaScores
        .filter(cs => {
          const winnerScore = winner.criteriaScores.find(wcs => wcs.criterionId === cs.criterionId);
          return cs.normalizedScore > (winnerScore?.normalizedScore ?? 0);
        });
      
      runnerUpStrengths.slice(0, 2).forEach(cs => {
        tradeoffs.push(`${runnerUp.optionName} is better in ${cs.criterionName}`);
      });
    }

    // Generate summary
    const summary = `Based on ${this.config.method.toUpperCase()} analysis across ${this.problem.criteria.length} criteria, ` +
      `"${winner.optionName}" is recommended with a score of ${(winner.normalizedScore).toFixed(1)}%. ` +
      (runnerUp ? `Second choice "${runnerUp.optionName}" scored ${(runnerUp.normalizedScore).toFixed(1)}%.` : '');

    return {
      optionId: winner.optionId,
      optionName: winner.optionName,
      confidence,
      summary,
      keyReasons,
      tradeoffs,
    };
  }

  /**
   * Run sensitivity analysis to understand decision robustness
   */
  private runSensitivityAnalysis(results: OptionResult[]): SensitivityAnalysis {
    const scenarios: SensitivityScenario[] = [];
    const criticalCriteria: string[] = [];

    // Test each criterion with ±20% weight change
    for (const criterion of this.problem.criteria) {
      const originalWeight = criterion.weight;
      
      // Increase weight by 50%
      const increasedWeights: Record<string, number> = {};
      let totalAdjustment = originalWeight * 0.5;
      
      for (const c of this.problem.criteria) {
        if (c.id === criterion.id) {
          increasedWeights[c.id] = Math.min(c.weight * 1.5, 100);
        } else {
          // Reduce other weights proportionally
          const reduction = (totalAdjustment * c.weight) / 
            this.problem.criteria.filter(x => x.id !== criterion.id).reduce((s, x) => s + x.weight, 0);
          increasedWeights[c.id] = Math.max(c.weight - reduction, 0);
        }
      }

      // Create modified problem and run analysis
      const modifiedProblem: DecisionProblem = {
        ...this.problem,
        criteria: this.problem.criteria.map(c => ({
          ...c,
          weight: increasedWeights[c.id],
        })),
      };

      const modifiedEngine = new DecisionEngine(modifiedProblem, this.config, true);
      const modifiedResult = modifiedEngine.analyze();
      
      const originalRanking = results.map(r => r.optionId);
      const newRanking = modifiedResult.results.map(r => r.optionId);
      const rankingChanged = JSON.stringify(originalRanking) !== JSON.stringify(newRanking);

      if (rankingChanged) {
        criticalCriteria.push(criterion.name);
      }

      scenarios.push({
        description: `Increase "${criterion.name}" weight by 50%`,
        weightChanges: increasedWeights,
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

  /**
   * Generate explanation for WSM
   */
  private explainWSM(): Explanation {
    const steps: ExplanationStep[] = [
      {
        step: 1,
        title: 'Weight Normalization',
        description: 'First, we normalize the criterion weights to ensure they sum to 1 (100%). This maintains the relative importance while allowing proper mathematical calculation.',
        formula: 'w_normalized = w_i / Σw_i',
      },
      {
        step: 2,
        title: 'Score Normalization',
        description: 'Each option\'s raw scores are normalized to a 0-1 scale using Min-Max normalization. For benefit criteria (higher is better), we use (x-min)/(max-min). For cost criteria (lower is better), we use (max-x)/(max-min).',
        formula: 'n_ij = (x_ij - min_j) / (max_j - min_j)',
      },
      {
        step: 3,
        title: 'Weighted Score Calculation',
        description: 'We multiply each normalized score by its corresponding weight to get the weighted score for each criterion.',
        formula: 'ws_ij = n_ij × w_j',
      },
      {
        step: 4,
        title: 'Final Score Aggregation',
        description: 'The final score for each option is the sum of all weighted scores across all criteria.',
        formula: 'Score(i) = Σ(w_j × n_ij)',
      },
      {
        step: 5,
        title: 'Ranking',
        description: 'Options are ranked from highest to lowest score. The option with the highest score is the recommended choice.',
      },
    ];

    return {
      methodDescription: 'The Weighted Sum Model (WSM) is a simple and intuitive multi-criteria decision-making method. It calculates a composite score for each option by summing the weighted normalized scores across all criteria. The method assumes that criteria are independent and that higher scores are always better (after proper normalization).',
      stepByStep: steps,
      assumptions: [
        'Criteria are independent of each other',
        'Scores can be meaningfully combined through addition',
        'Linear relationship between scores and preference',
        'Weights accurately reflect the relative importance of criteria',
      ],
      limitations: [
        'May oversimplify complex trade-offs',
        'Sensitive to the scale of measurement',
        'Assumes compensatory preferences (a high score in one criterion can compensate for a low score in another)',
      ],
    };
  }


}

/**
 * Utility function to create a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Create an empty decision problem
 */
export function createEmptyProblem(title: string = 'New Decision'): DecisionProblem {
  return {
    id: generateId(),
    title,
    description: '',
    options: [],
    criteria: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Create a sample decision problem for demonstration
 */
export function createSampleProblem(): DecisionProblem {
  return {
    id: generateId(),
    title: 'Choosing a Laptop',
    description: 'Help me decide which laptop to buy for software development',
    options: [
      {
        id: 'opt1',
        name: 'MacBook Pro 14"',
        description: 'Apple MacBook Pro with M3 Pro chip',
        scores: {
          crit1: 9,
          crit2: 85000,
          crit3: 8,
          crit4: 9,
          crit5: 7,
        },
      },
      {
        id: 'opt2',
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 with Intel i7',
        scores: {
          crit1: 8,
          crit2: 65000,
          crit3: 7,
          crit4: 7,
          crit5: 9,
        },
      },
      {
        id: 'opt3',
        name: 'ThinkPad X1 Carbon',
        description: 'Lenovo ThinkPad X1 Carbon Gen 11',
        scores: {
          crit1: 7,
          crit2: 55000,
          crit3: 9,
          crit4: 6,
          crit5: 8,
        },
      },
    ],
    criteria: [
      {
        id: 'crit1',
        name: 'Performance',
        weight: 30,
        type: 'benefit',
        description: 'CPU/GPU performance for development and light gaming',
        minValue: 1,
        maxValue: 10,
      },
      {
        id: 'crit2',
        name: 'Price (₹)',
        weight: 25,
        type: 'cost',
        description: 'Total cost including accessories',
        minValue: 30000,
        maxValue: 150000,
      },
      {
        id: 'crit3',
        name: 'Build Quality',
        weight: 20,
        type: 'benefit',
        description: 'Material quality and durability',
        minValue: 1,
        maxValue: 10,
      },
      {
        id: 'crit4',
        name: 'Display Quality',
        weight: 15,
        type: 'benefit',
        description: 'Screen resolution, color accuracy, brightness',
        minValue: 1,
        maxValue: 10,
      },
      {
        id: 'crit5',
        name: 'Portability',
        weight: 10,
        type: 'benefit',
        description: 'Weight and size for carrying',
        minValue: 1,
        maxValue: 10,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
