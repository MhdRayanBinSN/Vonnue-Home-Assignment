/**
 * algorithms/index.ts
 *
 * Barrel re-export for all MCDM algorithm modules.
 * Import from here to avoid deep relative paths:
 *
 *   import { WsmAlgorithm, TopsisAlgorithm, normalizeWeights } from '@/lib/algorithms';
 */

export { WsmAlgorithm } from './wsm';
export { TopsisAlgorithm } from './topsis';
export { normalizeWeights, normalizeMinMax, normalizeVector, identifyStrengthsWeaknesses } from './utils';
export type { IAlgorithm, NormalizedWeights, NormalizedMatrix } from './base';
