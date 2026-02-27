/**
 * AI Suggestions Engine
 * 
 * Analyzes decision results and provides intelligent recommendations
 * for edge cases, conflicts, and improvements.
 */

import {
  DecisionResult,
  TopsisResult,
  DecisionProblem,
  OptionResult,
} from './types';

export interface AISuggestion {
  id: string;
  type: 'warning' | 'insight' | 'recommendation' | 'edge-case';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
  reasoning: string;
}

export interface AIAnalysis {
  suggestions: AISuggestion[];
  edgeCasesDetected: string[];
  overallConfidence: number; // 0-100
  recommendationStrength: 'very-strong' | 'strong' | 'moderate' | 'weak' | 'very-weak';
}

export class AISuggestionsEngine {
  private problem: DecisionProblem;
  private wsmResult: DecisionResult;
  private topsisResult?: TopsisResult;

  constructor(
    problem: DecisionProblem,
    wsmResult: DecisionResult,
    topsisResult?: TopsisResult,
  ) {
    this.problem = problem;
    this.wsmResult = wsmResult;
    this.topsisResult = topsisResult;
  }

  /**
   * Generate comprehensive AI analysis with edge case detection
   */
  analyze(): AIAnalysis {
    const suggestions: AISuggestion[] = [];
    const edgeCases: string[] = [];

    // Run all detection methods
    suggestions.push(...this.detectAlgorithmDisagreement());
    suggestions.push(...this.detectTightRace());
    suggestions.push(...this.detectDominatedOptions());
    suggestions.push(...this.detectWeightImbalance());
    suggestions.push(...this.detectMissingData());
    suggestions.push(...this.detectOutliers());
    suggestions.push(...this.detectTradeoffPatterns());
    suggestions.push(...this.detectSensitivityIssues());
    suggestions.push(...this.detectBudgetEdgeCases());
    suggestions.push(...this.detectCriteriaConflicts());

    // Collect edge cases
    edgeCases.push(...this.identifyEdgeCases());

    // Calculate overall confidence
    const confidence = this.calculateOverallConfidence();
    const strength = this.determineRecommendationStrength(confidence);

    return {
      suggestions: suggestions.sort((a, b) => this.severityScore(b.severity) - this.severityScore(a.severity)),
      edgeCasesDetected: edgeCases,
      overallConfidence: confidence,
      recommendationStrength: strength,
    };
  }

  // ─── Edge Case Detection Methods ────────────────────────────────────────────

  private detectAlgorithmDisagreement(): AISuggestion[] {
    if (!this.topsisResult) return [];

    const suggestions: AISuggestion[] = [];
    const wsmWinner = this.wsmResult.results[0].optionName;
    const topsisWinner = this.topsisResult.winner;

    // Critical: Winners disagree
    if (!this.topsisResult.winnerAgreement) {
      suggestions.push({
        id: 'algo-winner-disagree',
        type: 'warning',
        severity: 'critical',
        title: 'Algorithms Disagree on Winner',
        description: `WSM recommends "${wsmWinner}" while TOPSIS recommends "${topsisWinner}". This indicates the decision is highly sensitive to methodology.`,
        actionable: true,
        action: 'Review both options carefully. Consider which algorithm better fits your decision style: WSM (compensatory) or TOPSIS (geometric distance).',
        reasoning: 'Different algorithms use different mathematical approaches. Disagreement suggests no clear winner exists.',
      });
    }

    // Low Kendall's Tau
    if (this.topsisResult.rankAgreement.kendallTau < 0.5) {
      suggestions.push({
        id: 'algo-low-correlation',
        type: 'warning',
        severity: 'high',
        title: 'Low Rank Correlation Between Algorithms',
        description: `Kendall's Tau is ${this.topsisResult.rankAgreement.kendallTau.toFixed(2)}, indicating significant ranking differences between WSM and TOPSIS.`,
        actionable: true,
        action: 'Re-evaluate your criteria weights. Low correlation often means criteria are conflicting or weights don\'t reflect true priorities.',
        reasoning: 'Kendall\'s Tau < 0.5 suggests algorithms are producing substantially different rankings.',
      });
    }

    // Moderate agreement with different winners
    if (!this.topsisResult.winnerAgreement && this.topsisResult.rankAgreement.kendallTau > 0.6) {
      suggestions.push({
        id: 'algo-paradox',
        type: 'insight',
        severity: 'medium',
        title: 'Ranking Paradox Detected',
        description: 'Algorithms agree on most rankings but disagree on the winner. This is a rare edge case.',
        actionable: true,
        action: 'Check if the top 2 options have very similar scores. Consider a hybrid approach or additional criteria.',
        reasoning: 'High overall correlation but different winners suggests the top options are extremely close.',
      });
    }

    return suggestions;
  }

  private detectTightRace(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const results = this.wsmResult.results;

    if (results.length < 2) return suggestions;

    const winner = results[0];
    const runnerUp = results[1];
    const scoreDiff = winner.normalizedScore - runnerUp.normalizedScore;

    // Critical: < 2% difference
    if (scoreDiff < 2) {
      suggestions.push({
        id: 'tight-race-critical',
        type: 'warning',
        severity: 'critical',
        title: 'Extremely Tight Race',
        description: `Top 2 options differ by only ${scoreDiff.toFixed(2)}%. This is within measurement error.`,
        actionable: true,
        action: 'Consider both options as equally valid. Look for qualitative factors not captured in criteria.',
        reasoning: 'Differences < 2% are statistically insignificant in multi-criteria analysis.',
      });
    }

    // High: 2-5% difference
    else if (scoreDiff < 5) {
      suggestions.push({
        id: 'tight-race-high',
        type: 'warning',
        severity: 'high',
        title: 'Very Close Decision',
        description: `"${winner.optionName}" leads "${runnerUp.optionName}" by only ${scoreDiff.toFixed(1)}%.`,
        actionable: true,
        action: 'Review sensitivity analysis. Small weight changes may flip the winner.',
        reasoning: 'Differences < 5% indicate low confidence. Decision is fragile.',
      });
    }

    // Check for 3-way tie
    if (results.length >= 3) {
      const third = results[2];
      const range = winner.normalizedScore - third.normalizedScore;
      if (range < 5) {
        suggestions.push({
          id: 'three-way-tie',
          type: 'edge-case',
          severity: 'high',
          title: 'Three-Way Tie Detected',
          description: `Top 3 options are within ${range.toFixed(1)}% of each other.`,
          actionable: true,
          action: 'Consider creating a shortlist of all 3 options. Use qualitative factors to decide.',
          reasoning: 'When top 3 are this close, quantitative analysis alone is insufficient.',
        });
      }
    }

    return suggestions;
  }

  private detectDominatedOptions(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const results = this.wsmResult.results;

    // Find options that are dominated (worse in all criteria)
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const optA = results[i];
        const optB = results[j];

        let aDominatesB = true;
        let bDominatesA = true;

        for (const criterion of this.problem.criteria) {
          const scoreA = optA.criteriaScores.find(cs => cs.criterionId === criterion.id)?.normalizedScore || 0;
          const scoreB = optB.criteriaScores.find(cs => cs.criterionId === criterion.id)?.normalizedScore || 0;

          if (scoreA < scoreB) aDominatesB = false;
          if (scoreB < scoreA) bDominatesA = false;
        }

        if (aDominatesB) {
          suggestions.push({
            id: `dominated-${optB.optionId}`,
            type: 'insight',
            severity: 'low',
            title: `"${optB.optionName}" is Dominated`,
            description: `"${optA.optionName}" is better or equal in all criteria. "${optB.optionName}" can be eliminated.`,
            actionable: true,
            action: `Remove "${optB.optionName}" from consideration to simplify the decision.`,
            reasoning: 'Dominated options are objectively inferior and should not be chosen.',
          });
        }
      }
    }

    return suggestions;
  }

  private detectWeightImbalance(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const weights = this.problem.criteria.map(c => c.weight);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights.filter(w => w > 0));
    const ratio = maxWeight / minWeight;

    // Critical: One criterion dominates (>50%)
    if (maxWeight > 50) {
      const dominantCriterion = this.problem.criteria.find(c => c.weight === maxWeight);
      suggestions.push({
        id: 'weight-dominance',
        type: 'warning',
        severity: 'high',
        title: 'Single Criterion Dominates',
        description: `"${dominantCriterion?.name}" has ${maxWeight}% weight, dominating the decision.`,
        actionable: true,
        action: 'Consider if this criterion truly deserves >50% importance. If yes, you might not need other criteria.',
        reasoning: 'When one criterion has >50% weight, other criteria become nearly irrelevant.',
      });
    }

    // High imbalance ratio
    if (ratio > 10) {
      suggestions.push({
        id: 'weight-imbalance',
        type: 'recommendation',
        severity: 'medium',
        title: 'Extreme Weight Imbalance',
        description: `Largest weight is ${ratio.toFixed(1)}x the smallest. This may indicate unclear priorities.`,
        actionable: true,
        action: 'Review if all criteria are truly needed. Consider removing very low-weight criteria.',
        reasoning: 'Extreme weight ratios suggest some criteria are token additions without real impact.',
      });
    }

    return suggestions;
  }

  private detectMissingData(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    for (const option of this.problem.options) {
      const missingCriteria: string[] = [];
      for (const criterion of this.problem.criteria) {
        if (option.scores[criterion.id] === undefined || option.scores[criterion.id] === 0) {
          missingCriteria.push(criterion.name);
        }
      }

      if (missingCriteria.length > 0) {
        suggestions.push({
          id: `missing-data-${option.id}`,
          type: 'warning',
          severity: 'medium',
          title: `Incomplete Data for "${option.name}"`,
          description: `Missing or zero scores for: ${missingCriteria.join(', ')}`,
          actionable: true,
          action: 'Fill in missing data or remove this option. Zero scores may unfairly penalize the option.',
          reasoning: 'Missing data can skew results. Ensure all options have complete information.',
        });
      }
    }

    return suggestions;
  }

  private detectOutliers(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    for (const criterion of this.problem.criteria) {
      const scores = this.problem.options.map(o => o.scores[criterion.id]).filter(s => s !== undefined);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const stdDev = Math.sqrt(scores.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / scores.length);

      for (const option of this.problem.options) {
        const score = option.scores[criterion.id];
        if (score === undefined) continue;

        const zScore = Math.abs((score - mean) / stdDev);
        if (zScore > 2.5) {
          suggestions.push({
            id: `outlier-${option.id}-${criterion.id}`,
            type: 'insight',
            severity: 'low',
            title: `Outlier Detected in "${option.name}"`,
            description: `"${criterion.name}" score (${score}) is ${zScore.toFixed(1)} standard deviations from average.`,
            actionable: false,
            action: '',
            reasoning: 'Outliers can disproportionately affect rankings. Verify this score is accurate.',
          });
        }
      }
    }

    return suggestions;
  }

  private detectTradeoffPatterns(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const winner = this.wsmResult.results[0];

    // Check if winner has significant weaknesses
    const weakCriteria = winner.criteriaScores.filter(cs => cs.normalizedScore < 0.5);
    if (weakCriteria.length > 0 && weakCriteria.length >= this.problem.criteria.length * 0.3) {
      suggestions.push({
        id: 'winner-has-weaknesses',
        type: 'insight',
        severity: 'medium',
        title: 'Winner Has Notable Weaknesses',
        description: `"${winner.optionName}" scores poorly in ${weakCriteria.length} criteria: ${weakCriteria.map(c => c.criterionName).join(', ')}`,
        actionable: true,
        action: 'Verify these weaknesses are acceptable. Consider if a more balanced option might be better.',
        reasoning: 'Winners with many weaknesses may not be satisfactory in practice despite high overall score.',
      });
    }

    // Check for "jack of all trades" pattern
    const variance = this.calculateVariance(winner.criteriaScores.map(cs => cs.normalizedScore));
    if (variance < 0.05) {
      suggestions.push({
        id: 'balanced-winner',
        type: 'insight',
        severity: 'low',
        title: 'Winner is Highly Balanced',
        description: `"${winner.optionName}" has consistent scores across all criteria (low variance).`,
        actionable: false,
        action: '',
        reasoning: 'Balanced options are safe choices but may not excel in any particular area.',
      });
    }

    return suggestions;
  }

  private detectSensitivityIssues(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const sensitivity = this.wsmResult.sensitivity;

    if (!sensitivity.isRobust) {
      suggestions.push({
        id: 'not-robust',
        type: 'warning',
        severity: 'high',
        title: 'Decision is Not Robust',
        description: `${sensitivity.criticalCriteria.length} criteria can change the winner: ${sensitivity.criticalCriteria.join(', ')}`,
        actionable: true,
        action: 'Review weights for critical criteria. Ensure they accurately reflect your priorities.',
        reasoning: 'Non-robust decisions are fragile and may not hold up under scrutiny.',
      });
    }

    // Check how many scenarios change ranking
    const changedScenarios = sensitivity.scenarios.filter(s => s.rankingChanged).length;
    const changeRate = changedScenarios / sensitivity.scenarios.length;

    if (changeRate > 0.5) {
      suggestions.push({
        id: 'high-sensitivity',
        type: 'warning',
        severity: 'medium',
        title: 'High Sensitivity to Weight Changes',
        description: `${Math.round(changeRate * 100)}% of weight scenarios change the ranking.`,
        actionable: true,
        action: 'Decision is highly sensitive. Consider gathering more data or refining criteria.',
        reasoning: 'High sensitivity indicates uncertainty in the decision structure.',
      });
    }

    return suggestions;
  }

  private detectBudgetEdgeCases(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    if (this.wsmResult.filteredOutCount && this.wsmResult.filteredOutCount > 0) {
      const remainingCount = this.wsmResult.results.length;
      const totalCount = remainingCount + this.wsmResult.filteredOutCount;

      // Critical: Most options filtered
      if (this.wsmResult.filteredOutCount / totalCount > 0.7) {
        suggestions.push({
          id: 'excessive-filtering',
          type: 'warning',
          severity: 'high',
          title: 'Excessive Filtering',
          description: `${this.wsmResult.filteredOutCount} of ${totalCount} options were filtered out. You may be missing good alternatives.`,
          actionable: true,
          action: 'Consider relaxing budget or threshold constraints to see more options.',
          reasoning: 'Filtering out >70% of options may be too restrictive.',
        });
      }

      // Winner is close to budget limit
      const priceCriterion = this.problem.criteria.find(c => c.id === 'price');
      if (priceCriterion && this.problem.budgetLimit) {
        const winner = this.wsmResult.results[0];
        const winnerPrice = winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;
        const budgetUtilization = winnerPrice / this.problem.budgetLimit;

        if (budgetUtilization > 0.95) {
          suggestions.push({
            id: 'budget-maxed',
            type: 'insight',
            severity: 'medium',
            title: 'Winner Uses 95%+ of Budget',
            description: `"${winner.optionName}" costs ₹${winnerPrice.toLocaleString('en-IN')} (${Math.round(budgetUtilization * 100)}% of budget).`,
            actionable: true,
            action: 'Consider if you have room for unexpected costs or accessories.',
            reasoning: 'Maxing out budget leaves no buffer for additional expenses.',
          });
        }
      }
    }

    return suggestions;
  }

  private detectCriteriaConflicts(): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // Check for negative correlations between high-weight criteria
    const highWeightCriteria = this.problem.criteria.filter(c => c.weight > 20);
    
    for (let i = 0; i < highWeightCriteria.length; i++) {
      for (let j = i + 1; j < highWeightCriteria.length; j++) {
        const critA = highWeightCriteria[i];
        const critB = highWeightCriteria[j];

        const correlation = this.calculateCorrelation(critA.id, critB.id);
        
        if (correlation < -0.7) {
          suggestions.push({
            id: `conflict-${critA.id}-${critB.id}`,
            type: 'insight',
            severity: 'medium',
            title: 'Conflicting High-Priority Criteria',
            description: `"${critA.name}" and "${critB.name}" are negatively correlated (${correlation.toFixed(2)}). Options good at one tend to be bad at the other.`,
            actionable: true,
            action: 'This is a fundamental trade-off. Decide which criterion is more important.',
            reasoning: 'Negative correlation between high-weight criteria creates inherent tension in the decision.',
          });
        }
      }
    }

    return suggestions;
  }

  // ─── Edge Case Identification ───────────────────────────────────────────────

  private identifyEdgeCases(): string[] {
    const cases: string[] = [];

    // Single option
    if (this.problem.options.length === 1) {
      cases.push('SINGLE_OPTION: Only one option available - no comparison possible');
    }

    // All options filtered
    if (this.wsmResult.results.length === 0) {
      cases.push('ALL_FILTERED: All options filtered by budget/thresholds');
    }

    // Perfect tie
    if (this.wsmResult.results.length >= 2) {
      const top2Diff = this.wsmResult.results[0].normalizedScore - this.wsmResult.results[1].normalizedScore;
      if (Math.abs(top2Diff) < 0.01) {
        cases.push('PERFECT_TIE: Top 2 options have identical scores');
      }
    }

    // Algorithm disagreement
    if (this.topsisResult && !this.topsisResult.winnerAgreement) {
      cases.push('ALGORITHM_CONFLICT: WSM and TOPSIS recommend different winners');
    }

    // Rank reversal
    if (this.topsisResult) {
      const wsmTop3 = this.wsmResult.results.slice(0, 3).map(r => r.optionId);
      const topsisTop3 = this.topsisResult.results.slice(0, 3).map(r => r.optionId);
      const reversals = wsmTop3.filter((id, idx) => topsisTop3[idx] !== id).length;
      if (reversals >= 2) {
        cases.push('RANK_REVERSAL: Top 3 rankings differ significantly between algorithms');
      }
    }

    // Zero variance (all options identical)
    const firstScore = this.wsmResult.results[0].normalizedScore;
    const allSame = this.wsmResult.results.every(r => Math.abs(r.normalizedScore - firstScore) < 0.01);
    if (allSame) {
      cases.push('ZERO_VARIANCE: All options have nearly identical scores');
    }

    // Missing critical data
    const missingCount = this.problem.options.filter(opt => 
      this.problem.criteria.some(crit => opt.scores[crit.id] === undefined || opt.scores[crit.id] === 0)
    ).length;
    if (missingCount > this.problem.options.length * 0.3) {
      cases.push('INCOMPLETE_DATA: >30% of options have missing scores');
    }

    // Extreme weight concentration
    const maxWeight = Math.max(...this.problem.criteria.map(c => c.weight));
    if (maxWeight > 60) {
      cases.push('WEIGHT_CONCENTRATION: Single criterion has >60% weight');
    }

    return cases;
  }

  // ─── Helper Methods ─────────────────────────────────────────────────────────

  private calculateOverallConfidence(): number {
    let confidence = 100;

    // Deduct for low WSM confidence
    if (this.wsmResult.recommendation.confidence === 'low') confidence -= 30;
    else if (this.wsmResult.recommendation.confidence === 'medium') confidence -= 15;

    // Deduct for algorithm disagreement
    if (this.topsisResult && !this.topsisResult.winnerAgreement) confidence -= 25;
    else if (this.topsisResult && this.topsisResult.rankAgreement.kendallTau < 0.7) confidence -= 15;

    // Deduct for non-robust decision
    if (!this.wsmResult.sensitivity.isRobust) confidence -= 20;

    // Deduct for filtered options
    if (this.wsmResult.filteredOutCount && this.wsmResult.filteredOutCount > 0) {
      const filterRate = this.wsmResult.filteredOutCount / (this.wsmResult.results.length + this.wsmResult.filteredOutCount);
      confidence -= Math.round(filterRate * 10);
    }

    return Math.max(0, Math.min(100, confidence));
  }

  private determineRecommendationStrength(confidence: number): 'very-strong' | 'strong' | 'moderate' | 'weak' | 'very-weak' {
    if (confidence >= 85) return 'very-strong';
    if (confidence >= 70) return 'strong';
    if (confidence >= 50) return 'moderate';
    if (confidence >= 30) return 'weak';
    return 'very-weak';
  }

  private severityScore(severity: AISuggestion['severity']): number {
    switch (severity) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
  }

  private calculateCorrelation(criterionA: string, criterionB: string): number {
    const scoresA = this.problem.options.map(o => o.scores[criterionA]);
    const scoresB = this.problem.options.map(o => o.scores[criterionB]);

    const meanA = scoresA.reduce((a, b) => a + b, 0) / scoresA.length;
    const meanB = scoresB.reduce((a, b) => a + b, 0) / scoresB.length;

    let numerator = 0;
    let denomA = 0;
    let denomB = 0;

    for (let i = 0; i < scoresA.length; i++) {
      const diffA = scoresA[i] - meanA;
      const diffB = scoresB[i] - meanB;
      numerator += diffA * diffB;
      denomA += diffA * diffA;
      denomB += diffB * diffB;
    }

    return numerator / Math.sqrt(denomA * denomB);
  }
}
