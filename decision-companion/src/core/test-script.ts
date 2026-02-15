import { DecisionEngine } from './DecisionEngine';
import { Option, Criterion } from './types';

const engine = new DecisionEngine();

const criteria: Criterion[] = [
    { id: 'c1', name: 'Price', weight: 8 },
    { id: 'c2', name: 'Performance', weight: 9 },
    { id: 'c3', name: 'Battery', weight: 6 }
];

const options: Option[] = [
    {
        id: 'o1',
        name: 'Laptop A (Cheap but slow)',
        ratings: { 'c1': 9, 'c2': 6, 'c3': 7 }
    },
    {
        id: 'o2',
        name: 'Laptop B (Expensive but fast)',
        ratings: { 'c1': 5, 'c2': 9, 'c3': 8 }
    }
];

engine.setCriteria(criteria);
engine.setOptions(options);

const results = engine.evaluate();
console.log("Evaluation Results:", JSON.stringify(results, null, 2));

const winnerId = results[0].optionId;
const explanation = engine.explain(winnerId);
console.log("\nWinner Explanation:\n", explanation);

// Expected:
// Laptop A: 9*8 + 6*9 + 7*6 = 72 + 54 + 42 = 168
// Laptop B: 5*8 + 9*9 + 8*6 = 40 + 81 + 48 = 169
// Laptop B should win by 1 point.
