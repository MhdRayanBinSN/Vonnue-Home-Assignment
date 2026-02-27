/**
 * Practical AI Advisor - Domain-Specific Recommendations
 * 
 * Provides actionable, user-friendly advice for laptop buying decisions.
 * Focuses on practical concerns, not algorithm internals.
 */

import {
  DecisionResult,
  TopsisResult,
  DecisionProblem,
  OptionResult,
} from './types';

export interface PracticalSuggestion {
  id: string;
  icon: string; // emoji
  category: 'deal-breaker' | 'consideration' | 'tip' | 'alternative';
  title: string;
  message: string;
  action?: string;
}

export interface PracticalAdvice {
  // Simple yes/no recommendation
  shouldBuy: boolean;
  confidence: 'confident' | 'somewhat-confident' | 'uncertain';
  
  // One-line summary
  summary: string;
  
  // Practical suggestions
  suggestions: PracticalSuggestion[];
  
  // Alternative recommendations
  alternatives?: {
    optionName: string;
    reason: string;
  }[];
  
  // Use case fit
  useCaseFit: {
    gaming: 'excellent' | 'good' | 'fair' | 'poor';
    productivity: 'excellent' | 'good' | 'fair' | 'poor';
    portability: 'excellent' | 'good' | 'fair' | 'poor';
    value: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export class PracticalAdvisor {
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
   * Generate practical, actionable advice
   */
  advise(): PracticalAdvice {
    const winner = this.wsmResult.results[0];
    const suggestions: PracticalSuggestion[] = [];

    // 1. Check if it's a clear winner
    const shouldBuy = this.shouldUserBuy();
    const confidence = this.getConfidenceLevel();

    // 2. Generate practical suggestions
    suggestions.push(...this.checkBudgetPractical(winner));
    suggestions.push(...this.checkPerformanceNeeds(winner));
    suggestions.push(...this.checkPortabilityNeeds(winner));
    suggestions.push(...this.checkBatteryLife(winner));
    suggestions.push(...this.checkValueForMoney(winner));
    suggestions.push(...this.checkFutureProofing(winner));
    suggestions.push(...this.checkAlternatives());

    // 3. Generate summary
    const summary = this.generatePracticalSummary(winner, shouldBuy, confidence);

    // 4. Assess use case fit
    const useCaseFit = this.assessUseCaseFit(winner);

    // 5. Find alternatives if needed
    const alternatives = this.findAlternatives(winner);

    return {
      shouldBuy,
      confidence,
      summary,
      suggestions: suggestions.slice(0, 5), // Max 5 suggestions
      alternatives,
      useCaseFit,
    };
  }

  // ─── Decision Logic ─────────────────────────────────────────────────────────

  private shouldUserBuy(): boolean {
    const winner = this.wsmResult.results[0];
    const runnerUp = this.wsmResult.results[1];

    // Don't buy if algorithms strongly disagree
    if (this.topsisResult && !this.topsisResult.winnerAgreement) {
      const wsmScore = winner.normalizedScore;
      const topsisWinner = this.topsisResult.results[0];
      const topsisScore = topsisWinner.closenessCoefficient * 100;
      
      // If both scores are close, it's genuinely unclear
      if (Math.abs(wsmScore - topsisScore) < 10) {
        return false; // Too uncertain
      }
    }

    // Don't buy if it's a tight race
    if (runnerUp) {
      const diff = winner.normalizedScore - runnerUp.normalizedScore;
      if (diff < 5) return false; // Too close
    }

    // Don't buy if winner has critical weaknesses
    const criticalWeaknesses = this.findCriticalWeaknesses(winner);
    if (criticalWeaknesses.length > 0) return false;

    // Don't buy if budget is maxed
    if (this.isBudgetMaxed(winner)) return false;

    return true; // Safe to buy
  }

  private getConfidenceLevel(): 'confident' | 'somewhat-confident' | 'uncertain' {
    const winner = this.wsmResult.results[0];
    const runnerUp = this.wsmResult.results[1];

    if (!runnerUp) return 'confident';

    const diff = winner.normalizedScore - runnerUp.normalizedScore;
    
    // Check algorithm agreement
    const algorithmsAgree = !this.topsisResult || this.topsisResult.winnerAgreement;
    
    if (diff > 15 && algorithmsAgree) return 'confident';
    if (diff > 8 && algorithmsAgree) return 'somewhat-confident';
    return 'uncertain';
  }

  // ─── Practical Checks ───────────────────────────────────────────────────────

  private checkBudgetPractical(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];
    
    if (!this.problem.budgetLimit) return suggestions;

    const price = winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;
    const utilization = price / this.problem.budgetLimit;

    if (utilization > 0.95) {
      suggestions.push({
        id: 'budget-maxed',
        icon: '💰',
        category: 'deal-breaker',
        title: 'Budget Maxed Out',
        message: `This laptop costs ₹${price.toLocaleString('en-IN')}, which is ${Math.round(utilization * 100)}% of your budget. You'll have no room for accessories, warranty, or unexpected costs.`,
        action: `Consider the runner-up at ₹${this.wsmResult.results[1]?.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore.toLocaleString('en-IN') || 'N/A'} to leave a buffer.`,
      });
    } else if (utilization > 0.85) {
      suggestions.push({
        id: 'budget-tight',
        icon: '💵',
        category: 'consideration',
        title: 'Budget is Tight',
        message: `You're using ${Math.round(utilization * 100)}% of your budget. Remember to budget for accessories (mouse, bag, etc.) and extended warranty.`,
        action: 'Set aside ₹5,000-10,000 for accessories and protection.',
      });
    }

    return suggestions;
  }

  private checkPerformanceNeeds(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];

    const cpu = winner.criteriaScores.find(cs => cs.criterionId === 'cpu')?.rawScore || 0;
    const gpu = winner.criteriaScores.find(cs => cs.criterionId === 'gpu')?.rawScore || 0;

    // Check if performance is weak
    if (cpu < 1500 && gpu < 3000) {
      suggestions.push({
        id: 'weak-performance',
        icon: '⚠️',
        category: 'deal-breaker',
        title: 'Weak Performance',
        message: 'This laptop has below-average CPU and GPU scores. It will struggle with demanding tasks like video editing, 3D rendering, or modern gaming.',
        action: 'If you need performance, look at options with CPU >2000 and GPU >5000.',
      });
    }

    // Check if it's overkill
    const performanceWeight = this.problem.criteria.find(c => c.id === 'cpu')?.weight || 0;
    if (cpu > 3000 && gpu > 10000 && performanceWeight < 20) {
      suggestions.push({
        id: 'overkill-performance',
        icon: '🎯',
        category: 'tip',
        title: 'Performance Overkill?',
        message: 'This laptop has high-end specs, but you gave performance low priority. You might be overpaying for power you won\'t use.',
        action: 'Consider a mid-range option to save money.',
      });
    }

    return suggestions;
  }

  private checkPortabilityNeeds(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];

    const weight = winner.criteriaScores.find(cs => cs.criterionId === 'weight')?.rawScore || 0;
    const battery = winner.criteriaScores.find(cs => cs.criterionId === 'battery')?.rawScore || 0;

    // Heavy laptop
    if (weight > 2.2) {
      suggestions.push({
        id: 'heavy-laptop',
        icon: '🎒',
        category: 'consideration',
        title: 'This is a Heavy Laptop',
        message: `At ${weight}kg, this laptop is not ideal for daily commuting. It's more of a desktop replacement.`,
        action: 'If you travel often, consider options under 2kg.',
      });
    }

    // Poor battery
    if (battery < 6) {
      suggestions.push({
        id: 'poor-battery',
        icon: '🔋',
        category: 'consideration',
        title: 'Short Battery Life',
        message: `With only ${battery} hours of battery, you'll need to stay near a power outlet. Not great for classes or travel.`,
        action: 'Look for laptops with 8+ hours if portability matters.',
      });
    }

    return suggestions;
  }

  private checkBatteryLife(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];

    const battery = winner.criteriaScores.find(cs => cs.criterionId === 'battery')?.rawScore || 0;
    const tdp = winner.criteriaScores.find(cs => cs.criterionId === 'tdp')?.rawScore || 0;

    // High TDP with poor battery
    if (tdp > 100 && battery < 6) {
      suggestions.push({
        id: 'power-hungry',
        icon: '⚡',
        category: 'consideration',
        title: 'Power-Hungry Configuration',
        message: `This laptop has a ${tdp}W TDP (high power consumption) and only ${battery}h battery. Expect 3-4 hours of real-world use.`,
        action: 'Always carry your charger. Not suitable for long flights or outdoor work.',
      });
    }

    return suggestions;
  }

  private checkValueForMoney(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];

    const pricePerf = winner.criteriaScores.find(cs => cs.criterionId === 'pricePerformance')?.rawScore || 0;
    const price = winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;

    // Poor value
    if (pricePerf < 50 && price > 80000) {
      suggestions.push({
        id: 'poor-value',
        icon: '💸',
        category: 'consideration',
        title: 'Not Great Value',
        message: 'This laptop has a low price-to-performance ratio. You\'re paying a premium, possibly for brand or build quality.',
        action: 'Check if the brand premium is worth it to you.',
      });
    }

    // Great value
    if (pricePerf > 100) {
      suggestions.push({
        id: 'great-value',
        icon: '🎉',
        category: 'tip',
        title: 'Excellent Value!',
        message: 'This laptop offers great performance for the price. You\'re getting a lot of bang for your buck.',
      });
    }

    return suggestions;
  }

  private checkFutureProofing(winner: OptionResult): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];

    const ram = winner.criteriaScores.find(cs => cs.criterionId === 'ram')?.rawScore || 0;
    const ssd = winner.criteriaScores.find(cs => cs.criterionId === 'ssd')?.rawScore || 0;

    // Low RAM
    if (ram < 16) {
      suggestions.push({
        id: 'low-ram',
        icon: '🧠',
        category: 'consideration',
        title: 'RAM Might Be Limiting',
        message: `${ram}GB RAM is okay for now, but may struggle in 2-3 years as software gets heavier.`,
        action: 'Check if RAM is upgradeable. If not, consider 16GB+ models.',
      });
    }

    // Small SSD
    if (ssd < 512) {
      suggestions.push({
        id: 'small-ssd',
        icon: '💾',
        category: 'consideration',
        title: 'Limited Storage',
        message: `${ssd}GB SSD will fill up quickly with games, videos, and projects.`,
        action: 'Budget for an external SSD or cloud storage.',
      });
    }

    return suggestions;
  }

  private checkAlternatives(): PracticalSuggestion[] {
    const suggestions: PracticalSuggestion[] = [];
    const winner = this.wsmResult.results[0];
    const runnerUp = this.wsmResult.results[1];

    if (!runnerUp) return suggestions;

    const diff = winner.normalizedScore - runnerUp.normalizedScore;

    // Close race
    if (diff < 8) {
      const priceDiff = (winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0) -
                        (runnerUp.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0);
      
      if (priceDiff > 10000) {
        suggestions.push({
          id: 'cheaper-alternative',
          icon: '🤔',
          category: 'alternative',
          title: 'Consider the Runner-Up',
          message: `"${runnerUp.optionName}" is only ${diff.toFixed(1)}% worse but costs ₹${Math.abs(priceDiff).toLocaleString('en-IN')} less. The difference might not be worth it.`,
          action: `Compare "${winner.optionName}" vs "${runnerUp.optionName}" side-by-side.`,
        });
      }
    }

    return suggestions;
  }

  // ─── Helper Methods ─────────────────────────────────────────────────────────

  private findCriticalWeaknesses(winner: OptionResult): string[] {
    const weaknesses: string[] = [];

    // Check each high-weight criterion
    for (const criterion of this.problem.criteria) {
      if (criterion.weight < 15) continue; // Only check important criteria

      const score = winner.criteriaScores.find(cs => cs.criterionId === criterion.id);
      if (!score) continue;

      // If score is below 30% on an important criterion, it's critical
      if (score.normalizedScore < 0.3) {
        weaknesses.push(criterion.name);
      }
    }

    return weaknesses;
  }

  private isBudgetMaxed(winner: OptionResult): boolean {
    if (!this.problem.budgetLimit) return false;

    const price = winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;
    return price / this.problem.budgetLimit > 0.95;
  }

  private generatePracticalSummary(
    winner: OptionResult,
    shouldBuy: boolean,
    confidence: string,
  ): string {
    if (!shouldBuy) {
      return `We're ${confidence.replace('-', ' ')} that "${winner.optionName}" is NOT the best choice right now. Review the concerns below before deciding.`;
    }

    if (confidence === 'confident') {
      return `"${winner.optionName}" is a solid choice. Both algorithms agree, and it fits your needs well. Go for it!`;
    }

    if (confidence === 'somewhat-confident') {
      return `"${winner.optionName}" is a good option, but there are some trade-offs to consider. Review the suggestions below.`;
    }

    return `The decision is close between "${winner.optionName}" and "${this.wsmResult.results[1]?.optionName}". Consider both carefully.`;
  }

  private assessUseCaseFit(winner: OptionResult): PracticalAdvice['useCaseFit'] {
    const cpu = winner.criteriaScores.find(cs => cs.criterionId === 'cpu')?.rawScore || 0;
    const gpu = winner.criteriaScores.find(cs => cs.criterionId === 'gpu')?.rawScore || 0;
    const weight = winner.criteriaScores.find(cs => cs.criterionId === 'weight')?.rawScore || 0;
    const battery = winner.criteriaScores.find(cs => cs.criterionId === 'battery')?.rawScore || 0;
    const pricePerf = winner.criteriaScores.find(cs => cs.criterionId === 'pricePerformance')?.rawScore || 0;

    return {
      gaming: this.rateGaming(gpu, cpu),
      productivity: this.rateProductivity(cpu, battery),
      portability: this.ratePortability(weight, battery),
      value: this.rateValue(pricePerf),
    };
  }

  private rateGaming(gpu: number, cpu: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (gpu > 10000 && cpu > 2500) return 'excellent';
    if (gpu > 6000 && cpu > 2000) return 'good';
    if (gpu > 3000 && cpu > 1500) return 'fair';
    return 'poor';
  }

  private rateProductivity(cpu: number, battery: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (cpu > 2500 && battery > 8) return 'excellent';
    if (cpu > 2000 && battery > 6) return 'good';
    if (cpu > 1500 && battery > 5) return 'fair';
    return 'poor';
  }

  private ratePortability(weight: number, battery: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (weight < 1.5 && battery > 10) return 'excellent';
    if (weight < 2.0 && battery > 8) return 'good';
    if (weight < 2.5 && battery > 6) return 'fair';
    return 'poor';
  }

  private rateValue(pricePerf: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (pricePerf > 100) return 'excellent';
    if (pricePerf > 70) return 'good';
    if (pricePerf > 50) return 'fair';
    return 'poor';
  }

  private findAlternatives(winner: OptionResult): PracticalAdvice['alternatives'] {
    const alternatives: PracticalAdvice['alternatives'] = [];
    const results = this.wsmResult.results;

    // Find cheaper alternative with similar performance
    for (let i = 1; i < Math.min(results.length, 4); i++) {
      const option = results[i];
      const scoreDiff = winner.normalizedScore - option.normalizedScore;
      
      if (scoreDiff < 10) {
        const winnerPrice = winner.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;
        const optionPrice = option.criteriaScores.find(cs => cs.criterionId === 'price')?.rawScore || 0;
        const priceDiff = winnerPrice - optionPrice;

        if (priceDiff > 5000) {
          alternatives.push({
            optionName: option.optionName,
            reason: `Save ₹${priceDiff.toLocaleString('en-IN')} with only ${scoreDiff.toFixed(1)}% performance difference`,
          });
        }
      }
    }

    return alternatives.length > 0 ? alternatives.slice(0, 2) : undefined;
  }
}
