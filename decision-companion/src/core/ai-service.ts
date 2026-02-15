import { Criterion } from './types';

// Mock AI Service to simulate LLM integration
// In a real app, this would call OpenAI/Gemini API

export const AIService = {
    async suggestCriteria(topic: string): Promise<Criterion[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const defaultWeights = {
            default: [
                { name: "Cost", weight: 8 },
                { name: "Quality", weight: 9 },
                { name: "Durability", weight: 7 },
                { name: "Ease of Use", weight: 6 }
            ],
            tech: [
                { name: "Performance", weight: 9 },
                { name: "Price", weight: 8 },
                { name: "Battery Life", weight: 7 },
                { name: "Build Quality", weight: 6 },
                { name: "Portability", weight: 5 }
            ],
            career: [
                { name: "Salary", weight: 9 },
                { name: "Work-Life Balance", weight: 10 },
                { name: "Growth Potential", weight: 8 },
                { name: "Company Culture", weight: 7 },
                { name: "Commute", weight: 5 }
            ],
            location: [
                { name: "Cost of Living", weight: 9 },
                { name: "Safety", weight: 10 },
                { name: "Climate", weight: 7 },
                { name: "Job Market", weight: 8 },
                { name: "Proximity to Family", weight: 6 }
            ]
        };

        const lowerTopic = topic.toLowerCase();
        if (lowerTopic.includes('laptop') || lowerTopic.includes('phone') || lowerTopic.includes('tech')) {
            return generateIds(defaultWeights.tech);
        }
        if (lowerTopic.includes('job') || lowerTopic.includes('career') || lowerTopic.includes('work')) {
            return generateIds(defaultWeights.career);
        }
        if (lowerTopic.includes('move') || lowerTopic.includes('city') || lowerTopic.includes('travel')) {
            return generateIds(defaultWeights.location);
        }

        return generateIds(defaultWeights.default);
    }
};

function generateIds(criteria: Omit<Criterion, 'id'>[]): Criterion[] {
    return criteria.map(c => ({
        ...c,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9)
    }));
}
