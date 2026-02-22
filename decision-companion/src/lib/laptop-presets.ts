/**
 * Laptop Selection - Domain-Specific Presets
 * 
 * Pre-defined criteria and use-case weight profiles for laptop comparison.
 * This provides domain expertise while allowing user customization.
 */

import { Criterion } from './types';

/**
 * Use-case preset definitions
 * Each preset has optimized weights for specific user needs
 */
export interface UseCasePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  weights: {
    price: number;
    performance: number;
    battery: number;
    display: number;
    build: number;
    portability: number;
    storage: number;
  };
}

/**
 * Pre-defined laptop criteria
 * These are fixed for the laptop selection domain
 */
export const LAPTOP_CRITERIA: Criterion[] = [
  {
    id: 'price',
    name: 'Price',
    weight: 25,
    type: 'cost',
    description: 'Total cost in ₹ (lower is better)',
    minValue: 30000,
    maxValue: 300000,
  },
  {
    id: 'performance',
    name: 'Performance',
    weight: 25,
    type: 'benefit',
    description: 'CPU/GPU power for your intended use (1-10 scale)',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'battery',
    name: 'Battery Life',
    weight: 15,
    type: 'benefit',
    description: 'Typical usage duration in hours',
    minValue: 2,
    maxValue: 20,
  },
  {
    id: 'display',
    name: 'Display Quality',
    weight: 10,
    type: 'benefit',
    description: 'Resolution, brightness, color accuracy (1-10 scale)',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'build',
    name: 'Build Quality',
    weight: 10,
    type: 'benefit',
    description: 'Materials, durability, premium feel (1-10 scale)',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'portability',
    name: 'Portability',
    weight: 10,
    type: 'benefit',
    description: 'Weight and size for easy carrying (1-10 scale)',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'storage',
    name: 'Storage',
    weight: 5,
    type: 'benefit',
    description: 'SSD capacity in GB',
    minValue: 128,
    maxValue: 2000,
  },
];

/**
 * Use-case presets with optimized weight distributions
 */
export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Coding, compilation, running IDEs and containers',
    icon: '💻',
    weights: {
      price: 20,
      performance: 30,
      battery: 15,
      display: 15,
      build: 10,
      portability: 5,
      storage: 5,
    },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-performance games and graphics-intensive tasks',
    icon: '🎮',
    weights: {
      price: 15,
      performance: 40,
      battery: 5,
      display: 20,
      build: 10,
      portability: 5,
      storage: 5,
    },
  },
  {
    id: 'business',
    name: 'Office / Business',
    description: 'Productivity, meetings, documents, presentations',
    icon: '💼',
    weights: {
      price: 25,
      performance: 15,
      battery: 25,
      display: 10,
      build: 10,
      portability: 10,
      storage: 5,
    },
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Notes, research, assignments, budget-friendly',
    icon: '📚',
    weights: {
      price: 30,
      performance: 15,
      battery: 20,
      display: 10,
      build: 5,
      portability: 15,
      storage: 5,
    },
  },
  {
    id: 'creative',
    name: 'Creative / Design',
    description: 'Video editing, graphic design, 3D rendering',
    icon: '🎨',
    weights: {
      price: 15,
      performance: 25,
      battery: 10,
      display: 30,
      build: 10,
      portability: 5,
      storage: 5,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Set your own weights based on your priorities',
    icon: '⚙️',
    weights: {
      price: 15,
      performance: 15,
      battery: 15,
      display: 15,
      build: 15,
      portability: 15,
      storage: 10,
    },
  },
];

/**
 * Sample laptops for demonstration
 */
export interface SampleLaptop {
  name: string;
  description: string;
  scores: {
    price: number;
    performance: number;
    battery: number;
    display: number;
    build: number;
    portability: number;
    storage: number;
  };
}

export const SAMPLE_LAPTOPS: SampleLaptop[] = [
  {
    name: 'MacBook Pro 14"',
    description: 'Apple M3 Pro, 18GB RAM, 512GB SSD',
    scores: {
      price: 199900,
      performance: 9,
      battery: 12,
      display: 9,
      build: 9,
      portability: 7,
      storage: 512,
    },
  },
  {
    name: 'Dell XPS 15',
    description: 'Intel i7-13700H, 16GB RAM, 512GB SSD',
    scores: {
      price: 149900,
      performance: 8,
      battery: 10,
      display: 8,
      build: 8,
      portability: 8,
      storage: 512,
    },
  },
  {
    name: 'ThinkPad X1 Carbon',
    description: 'Intel i7-1365U, 16GB RAM, 512GB SSD',
    scores: {
      price: 139900,
      performance: 7,
      battery: 14,
      display: 7,
      build: 9,
      portability: 9,
      storage: 512,
    },
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9, RTX 4060, 16GB RAM, 1TB SSD',
    scores: {
      price: 159900,
      performance: 9,
      battery: 8,
      display: 8,
      build: 8,
      portability: 8,
      storage: 1000,
    },
  },
  {
    name: 'HP Pavilion 15',
    description: 'Intel i5-1335U, 8GB RAM, 512GB SSD',
    scores: {
      price: 65000,
      performance: 6,
      battery: 8,
      display: 6,
      build: 6,
      portability: 7,
      storage: 512,
    },
  },
];

/**
 * Apply a use-case preset to get criteria with updated weights
 */
export function applyPreset(presetId: string): Criterion[] {
  const preset = USE_CASE_PRESETS.find(p => p.id === presetId);
  if (!preset) {
    return LAPTOP_CRITERIA;
  }

  return LAPTOP_CRITERIA.map(criterion => ({
    ...criterion,
    weight: preset.weights[criterion.id as keyof typeof preset.weights] || criterion.weight,
  }));
}

/**
 * Get criteria ID to name mapping for display
 */
export const CRITERIA_LABELS: Record<string, string> = {
  price: 'Price (₹)',
  performance: 'Performance',
  battery: 'Battery Life (hrs)',
  display: 'Display Quality',
  build: 'Build Quality',
  portability: 'Portability',
  storage: 'Storage (GB)',
};

/**
 * Get unit suffix for each criterion
 */
export const CRITERIA_UNITS: Record<string, string> = {
  price: '₹',
  performance: '/10',
  battery: 'hrs',
  display: '/10',
  build: '/10',
  portability: '/10',
  storage: 'GB',
};
