import { Option, Criterion, EvaluationResult } from './types';

export class DecisionEngine {
    private options: Option[] = [];
    private criteria: Criterion[] = [];

    constructor() { }

    setOptions(options: Option[]) {
        this.options = options;
    }

    setCriteria(criteria: Criterion[]) {
        this.criteria = criteria;
    }

    evaluate(): EvaluationResult[] {
        const results: EvaluationResult[] = this.options.map(option => {
            let totalScore = 0;

            this.criteria.forEach(criterion => {
                const rating = option.ratings[criterion.id] || 0;
                totalScore += rating * criterion.weight;
            });

            return {
                optionId: option.id,
                score: totalScore,
                rank: 0 // to be assigned
            };
        });

        // Sort descending
        results.sort((a, b) => b.score - a.score);

        // Assign ranks
        results.forEach((res, index) => {
            res.rank = index + 1;
        });

        return results;
    }

    // Explain why an option got its score
    explain(optionId: string): string {
        const option = this.options.find(o => o.id === optionId);
        if (!option) return "Option not found.";

        const result = this.evaluate().find(r => r.optionId === optionId);
        if (!result) return "Not evaluated.";

        let explanation = `Option '${option.name}' received a total score of ${result.score}.\n\nBreakdown:\n`;

        // Sort criteria by impact (weight * rating) to show strengths first
        const contributions = this.criteria.map(c => {
            const rating = option.ratings[c.id] || 0;
            return {
                name: c.name,
                contribution: rating * c.weight,
                weight: c.weight,
                rating: rating
            };
        }).sort((a, b) => b.contribution - a.contribution);

        contributions.forEach(c => {
            explanation += `- ${c.name}: ${c.rating}/10 (Weight: ${c.weight}) => +${c.contribution} points\n`;
        });

        return explanation;
    }
}
