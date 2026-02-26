/**
 * Decision Companion System - Core Types
 * 
 * This module defines the core data structures used throughout the decision-making system.
 * These types ensure type safety and provide clear contracts for the decision engine.
 */

/**
 * Represents a single option/alternative being evaluated
 */
export interface Option {
  id: string;
  name: string;
  description?: string;
  scores: Record<string, number>; // criterionId -> score
}

/**
 * Represents a criterion for evaluation
 * Can be either a "benefit" (higher is better) or "cost" (lower is better) criterion
 */
export interface Criterion {
  id: string;
  name: string;
  weight: number; // 0-100 representing importance
  type: 'benefit' | 'cost'; // benefit = higher is better, cost = lower is better
  description?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * The complete decision problem containing all options and criteria
 */
export interface DecisionProblem {
  id: string;
  title: string;
  description?: string;
  options: Option[];
  criteria: Criterion[];
  createdAt: Date;
  updatedAt: Date;
  budgetLimit?: number; // Maximum budget filter (optional)
  minThresholds?: Record<string, number>; // Minimum acceptable values per criterion
}

/**
 * Result of evaluating a single option
 */
export interface OptionResult {
  optionId: string;
  optionName: string;
  finalScore: number;
  normalizedScore: number; // 0-100 scale for easy comparison
  rank: number;
  criteriaScores: CriterionScore[];
  strengths: string[];
  weaknesses: string[];
}

/**
 * Score breakdown for a specific criterion
 */
export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  rawScore: number;
  normalizedScore: number;
  weightedScore: number;
  weight: number;
  contribution: number; // percentage contribution to final score
}

/**
 * Complete analysis result
 */
export interface DecisionResult {
  problemId: string;
  method: DecisionMethod;
  results: OptionResult[];
  recommendation: Recommendation;
  explanation: Explanation;
  sensitivity: SensitivityAnalysis;
  timestamp: Date;
  filteredOutCount?: number; // Number of options filtered by budget/thresholds
  filteredOutReasons?: string[]; // Why options were filtered
}

/**
 * The recommended option with reasoning
 */
export interface Recommendation {
  optionId: string;
  optionName: string;
  confidence: 'high' | 'medium' | 'low';
  summary: string;
  keyReasons: string[];
  tradeoffs: string[];
}

/**
 * Detailed explanation of the decision
 */
export interface Explanation {
  methodDescription: string;
  stepByStep: ExplanationStep[];
  assumptions: string[];
  limitations: string[];
}

export interface ExplanationStep {
  step: number;
  title: string;
  description: string;
  formula?: string;
  data?: Record<string, unknown>;
}

/**
 * Sensitivity analysis to understand robustness
 */
export interface SensitivityAnalysis {
  isRobust: boolean;
  criticalCriteria: string[]; // criteria that most affect the outcome
  scenarios: SensitivityScenario[];
}

export interface SensitivityScenario {
  description: string;
  weightChanges: Record<string, number>;
  newRanking: string[]; // option IDs in new order
  rankingChanged: boolean;
}

/**
 * Available decision-making methods
 */
export type DecisionMethod = 'wsm' | 'topsis';

/**
 * Method configuration
 */
export interface MethodConfig {
  method: DecisionMethod;
  normalizationMethod?: 'minmax' | 'vector' | 'sum';
  handleTies?: 'average' | 'first' | 'random';
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

// ─── TOPSIS Types ──────────────────────────────────────────────────────────────

/**
 * Per-option result from TOPSIS analysis
 */
export interface TopsisOptionResult {
  optionId: string;
  optionName: string;
  /** Distance from ideal best (A+) — lower is better */
  distanceFromBest: number;
  /** Distance from ideal worst (A-) — higher is better */
  distanceFromWorst: number;
  /** Closeness Coefficient: CC = D- / (D+ + D-)  range 0-1, higher = better */
  closenessCoefficient: number;
  rank: number;
  /** WSM rank for comparison */
  wsmRank: number;
  /** Whether TOPSIS and WSM agree on this option's rank */
  rankAgreement: boolean;
}

/**
 * Per-criterion ideal and anti-ideal values used in TOPSIS
 */
export interface TopsisIdealPoint {
  criterionId: string;
  criterionName: string;
  idealBest: number;   // A+ value
  idealWorst: number;  // A- value
}

/**
 * Rank agreement summary between WSM and TOPSIS
 */
export interface RankAgreement {
  /** Number of options where WSM rank === TOPSIS rank */
  agreementCount: number;
  /** Kendall's Tau correlation between WSM and TOPSIS ranks (-1 to 1) */
  kendallTau: number;
  /** Agreement level: 'full' | 'high' | 'moderate' | 'low' */
  level: 'full' | 'high' | 'moderate' | 'low';
  /** Human-readable interpretation */
  interpretation: string;
}

/**
 * Complete TOPSIS analysis result
 */
export interface TopsisResult {
  results: TopsisOptionResult[];
  idealPoints: TopsisIdealPoint[];
  rankAgreement: RankAgreement;
  /** The winner according to TOPSIS */
  winner: string;
  /** Whether TOPSIS winner matches WSM winner */
  winnerAgreement: boolean;
}
