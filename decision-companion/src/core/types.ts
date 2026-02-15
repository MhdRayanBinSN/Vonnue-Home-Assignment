export interface Option {
  id: string;
  name: string;
  ratings: Record<string, number>; // criterionId -> score (0-10)
}

export interface Criterion {
  id: string;
  name: string;
  weight: number; // 1-10
}

export interface EvaluationResult {
  optionId: string;
  score: number;
  rank: number;
}
