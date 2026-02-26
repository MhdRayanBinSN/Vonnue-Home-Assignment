/**
 * Laptop Selection - Domain-Specific Presets (Enhanced)
 * 
 * Provides structured input definitions, GPU/CPU tiers with auto-scoring,
 * real laptop specs, and use-case weight profiles.
 */

import { Criterion } from './types';

// ─── Structured Input Definitions ────────────────────────────────────────────

/**
 * Defines how each criterion is input by the user.
 * - 'number': plain numeric input (price, battery, weight)
 * - 'select': dropdown with predefined options that auto-map to scores
 */
export interface CriterionInputConfig {
  type: 'number' | 'select';
  options?: { label: string; value: number }[];
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Input configurations for each criterion.
 * These define what the user sees in the scoring step.
 */
export const CRITERION_INPUTS: Record<string, CriterionInputConfig> = {
  price: {
    type: 'number',
    unit: '₹',
    placeholder: 'e.g. 75000',
    min: 20000,
    max: 500000,
    step: 1000,
  },
  cpu: {
    type: 'select',
    options: [
      { label: 'Intel i3 / Ryzen 3 (Cinebench ~6000)', value: 6000 },
      { label: 'Intel i5 / Ryzen 5 (Cinebench ~10000)', value: 10000 },
      { label: 'Intel i7 / Ryzen 7 (Cinebench ~15000)', value: 15000 },
      { label: 'Apple M3 (Cinebench ~15000)', value: 15000 },
      { label: 'AMD Ryzen 9 / Intel i9 (Cinebench ~22000)', value: 22000 },
      { label: 'Apple M3 Pro (Cinebench ~22000)', value: 22000 },
      { label: 'Apple M3 Max (Cinebench ~28000)', value: 28000 },
    ],
  },
  gpu: {
    type: 'select',
    options: [
      // Integrated GPUs
      { label: 'Integrated — Intel UHD / Iris Xe (3DMark ~1200)', value: 1200 },
      { label: 'Integrated — AMD Radeon 610M/680M (3DMark ~3200)', value: 3200 },
      { label: 'Integrated — Apple M3 10-core (3DMark ~5500)', value: 5500 },
      { label: 'Integrated — Apple M3 Pro 18-core (3DMark ~11000)', value: 11000 },
      { label: 'Integrated — Apple M3 Max 40-core (3DMark ~18000)', value: 18000 },
      // Entry dedicated
      { label: 'NVIDIA MX550 / MX570 (3DMark ~2800)', value: 2800 },
      { label: 'NVIDIA RTX 3050 Laptop (3DMark ~6500)', value: 6500 },
      // RTX 4050
      { label: 'NVIDIA RTX 4050 Laptop — 60W Standard (3DMark ~8000)', value: 8000 },
      // RTX 4060 — TDP variants
      { label: 'NVIDIA RTX 4060 Laptop — Low Power 40W (3DMark ~8500)', value: 8500 },
      { label: 'NVIDIA RTX 4060 Laptop — Standard 65W (3DMark ~11000)', value: 11000 },
      { label: 'NVIDIA RTX 4060 Laptop — High Power 115W (3DMark ~13500)', value: 13500 },
      // RTX 4070 — TDP variants
      { label: 'NVIDIA RTX 4070 Laptop — Low Power 35W (3DMark ~9000)', value: 9000 },
      { label: 'NVIDIA RTX 4070 Laptop — Standard 80W (3DMark ~13500)', value: 13500 },
      { label: 'NVIDIA RTX 4070 Laptop — High Power 115W (3DMark ~16000)', value: 16000 },
      // RTX 4080/4090
      { label: 'NVIDIA RTX 4080 Laptop — Standard 80W (3DMark ~15000)', value: 15000 },
      { label: 'NVIDIA RTX 4080 Laptop — Full Power 150W (3DMark ~18500)', value: 18500 },
      { label: 'NVIDIA RTX 4090 Laptop — Full Power 150W+ (3DMark ~20000)', value: 20000 },
    ],
  },

  ram: {
    type: 'select',
    options: [
      { label: '4 GB', value: 4 },
      { label: '8 GB', value: 8 },
      { label: '16 GB', value: 16 },
      { label: '18 GB', value: 18 },
      { label: '24 GB', value: 24 },
      { label: '32 GB', value: 32 },
      { label: '64 GB', value: 64 },
    ],
  },
  ssd: {
    type: 'select',
    options: [
      { label: 'No SSD', value: 0 },
      { label: '128 GB SSD', value: 128 },
      { label: '256 GB SSD', value: 256 },
      { label: '512 GB SSD', value: 512 },
      { label: '1 TB SSD', value: 1000 },
      { label: '2 TB SSD', value: 2000 },
    ],
  },
  hdd: {
    type: 'select',
    options: [
      { label: 'No HDD', value: 0 },
      { label: '500 GB HDD', value: 500 },
      { label: '1 TB HDD', value: 1000 },
      { label: '2 TB HDD', value: 2000 },
    ],
  },
  displaySize: {
    type: 'select',
    options: [
      { label: '13.3"', value: 13.3 },
      { label: '14"', value: 14 },
      { label: '15.6"', value: 15.6 },
      { label: '16"', value: 16 },
      { label: '17.3"', value: 17.3 },
    ],
  },
  refreshRate: {
    type: 'select',
    options: [
      { label: '60 Hz', value: 60 },
      { label: '90 Hz', value: 90 },
      { label: '120 Hz', value: 120 },
      { label: '144 Hz', value: 144 },
      { label: '165 Hz', value: 165 },
      { label: '240 Hz', value: 240 },
    ],
  },
  resolution: {
    type: 'select',
    options: [
      { label: 'HD (1366×768)', value: 2 },
      { label: 'Full HD (1920×1080)', value: 5 },
      { label: '2K / QHD (2560×1440)', value: 7 },
      { label: 'Retina / 3K', value: 8 },
      { label: '4K UHD (3840×2160)', value: 9 },
    ],
  },
  battery: {
    type: 'number',
    unit: 'hrs',
    placeholder: 'e.g. 10',
    min: 1,
    max: 24,
    step: 0.5,
  },
  weight: {
    type: 'number',
    unit: 'kg',
    placeholder: 'e.g. 1.8',
    min: 0.5,
    max: 5,
    step: 0.1,
  },
  build: {
    type: 'select',
    options: [
      { label: 'All Plastic', value: 3 },
      { label: 'Metal + Plastic', value: 5 },
      { label: 'Full Aluminum', value: 7 },
      { label: 'Premium (CNC Aluminum / Magnesium)', value: 9 },
    ],
  },
  tdp: {
    type: 'select',
    options: [
      { label: '15W (Ultra Low Power - Fanless)', value: 15 },
      { label: '28W (Low Power - Thin & Light)', value: 28 },
      { label: '35W (Efficient - Ultrabooks)', value: 35 },
      { label: '45W (Standard - Mainstream)', value: 45 },
      { label: '65W (Performance - Gaming/Workstation)', value: 65 },
      { label: '80W (High Performance)', value: 80 },
      { label: '115W (Maximum Performance)', value: 115 },
      { label: '150W+ (Desktop Replacement)', value: 150 },
    ],
  },
  pricePerformance: {
    type: 'number',
    unit: 'score',
    placeholder: 'Auto-calculated',
    min: 0,
    max: 1,
    step: 0.001,
  },
};

// ─── Criteria Definitions ────────────────────────────────────────────────────

/**
 * 12 laptop-specific criteria with descriptions and input types
 */
export const LAPTOP_CRITERIA: Criterion[] = [
  {
    id: 'price',
    name: 'Price',
    weight: 20,
    type: 'cost',
    description: 'Total cost in ₹ (lower is better)',
    minValue: 20000,
    maxValue: 500000,
  },
  {
    id: 'cpu',
    name: 'CPU',
    weight: 12,
    type: 'benefit',
    description: 'Cinebench R23 multi-core score — real CPU performance benchmark',
    minValue: 6000,
    maxValue: 28000,
  },
  {
    id: 'gpu',
    name: 'GPU',
    weight: 12,
    type: 'benefit',
    description: '3DMark TimeSpy score — real GPU performance benchmark',
    minValue: 1200,
    maxValue: 20000,
  },
  {
    id: 'ram',
    name: 'RAM',
    weight: 10,
    type: 'benefit',
    description: 'Memory in GB — affects multitasking and heavy workloads',
    minValue: 4,
    maxValue: 64,
  },
  {
    id: 'ssd',
    name: 'SSD Storage',
    weight: 8,
    type: 'benefit',
    description: 'Solid State Drive capacity — fast boot & load times',
    minValue: 0,
    maxValue: 2000,
  },
  {
    id: 'hdd',
    name: 'HDD Storage',
    weight: 3,
    type: 'benefit',
    description: 'Hard Disk Drive — bulk storage for files, cheaper per GB',
    minValue: 0,
    maxValue: 2000,
  },
  {
    id: 'displaySize',
    name: 'Display Size',
    weight: 5,
    type: 'benefit',
    description: 'Screen diagonal in inches',
    minValue: 13,
    maxValue: 18,
  },
  {
    id: 'refreshRate',
    name: 'Refresh Rate',
    weight: 5,
    type: 'benefit',
    description: 'Hz — smoothness of motion, important for gaming',
    minValue: 60,
    maxValue: 240,
  },
  {
    id: 'resolution',
    name: 'Resolution',
    weight: 5,
    type: 'benefit',
    description: 'Display resolution — sharpness and detail',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'battery',
    name: 'Battery Life',
    weight: 8,
    type: 'benefit',
    description: 'Typical usage hours on a single charge',
    minValue: 2,
    maxValue: 24,
  },
  {
    id: 'weight',
    name: 'Weight',
    weight: 5,
    type: 'cost',
    description: 'Laptop weight in kg (lower is better for portability)',
    minValue: 0.5,
    maxValue: 5,
  },
  {
    id: 'build',
    name: 'Build Quality',
    weight: 7,
    type: 'benefit',
    description: 'Materials, durability, and premium feel',
    minValue: 1,
    maxValue: 10,
  },
  {
    id: 'tdp',
    name: 'TDP (Power Draw)',
    weight: 5,
    type: 'cost',
    description: 'Thermal Design Power in Watts — affects heat, noise, and battery drain (lower is better)',
    minValue: 15,
    maxValue: 150,
  },
  {
    id: 'pricePerformance',
    name: 'Price-to-Performance',
    weight: 0, // Derived metric, not weighted by default
    type: 'benefit',
    description: 'Value score: (CPU + GPU) / Price — bang for buck (auto-calculated)',
    minValue: 0,
    maxValue: 1,
  },
];

// ─── Use-Case Presets ────────────────────────────────────────────────────────

export interface UseCasePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  weights: Record<string, number>;
}

export const USE_CASE_PRESETS: UseCasePreset[] = [
  {
    id: 'software-dev',
    name: 'Software Development',
    description: 'Coding, compilation, Docker, IDEs',
    icon: 'Code2',
    weights: {
      price: 15, cpu: 18, gpu: 4, ram: 14, ssd: 10, hdd: 2,
      displaySize: 5, refreshRate: 3, resolution: 8, battery: 8, weight: 4, build: 5, tdp: 4, pricePerformance: 0,
    },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-FPS games, graphics-intensive workloads',
    icon: 'Gamepad2',
    weights: {
      price: 8, cpu: 14, gpu: 24, ram: 10, ssd: 8, hdd: 2,
      displaySize: 5, refreshRate: 12, resolution: 5, battery: 2, weight: 2, build: 3, tdp: 5, pricePerformance: 0,
    },
  },
  {
    id: 'business',
    name: 'Office / Business',
    description: 'Productivity, meetings, presentations',
    icon: 'Briefcase',
    weights: {
      price: 18, cpu: 9, gpu: 2, ram: 9, ssd: 8, hdd: 5,
      displaySize: 5, refreshRate: 2, resolution: 5, battery: 17, weight: 8, build: 7, tdp: 5, pricePerformance: 0,
    },
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Notes, research, budget-friendly',
    icon: 'GraduationCap',
    weights: {
      price: 20, cpu: 9, gpu: 3, ram: 8, ssd: 8, hdd: 5,
      displaySize: 5, refreshRate: 2, resolution: 4, battery: 14, weight: 10, build: 4, tdp: 3, pricePerformance: 5,
    },
  },
  {
    id: 'creative',
    name: 'Creative / Design',
    description: 'Video editing, graphic design, 3D rendering',
    icon: 'Palette',
    weights: {
      price: 8, cpu: 14, gpu: 14, ram: 12, ssd: 10, hdd: 3,
      displaySize: 5, refreshRate: 5, resolution: 12, battery: 5, weight: 3, build: 5, tdp: 4, pricePerformance: 0,
    },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Set your own weights for each criterion',
    icon: 'Settings',
    weights: {
      price: 10, cpu: 10, gpu: 10, ram: 8, ssd: 8, hdd: 4,
      displaySize: 8, refreshRate: 8, resolution: 8, battery: 8, weight: 8, build: 10, tdp: 0, pricePerformance: 0,
    },
  },
];

// ─── Sample Laptops (Indian Market, 2024 Prices) ────────────────────────────

export interface SampleLaptop {
  name: string;
  description: string;
  scores: Record<string, number>;
}

export const SAMPLE_LAPTOPS: SampleLaptop[] = [
  {
    name: 'MacBook Pro 14"',
    description: 'Apple M3 Pro, 18GB RAM, 512GB SSD, 14" Retina 120Hz',
    scores: {
      price: 199900, cpu: 22000, gpu: 11000, ram: 18, ssd: 512, hdd: 0,
      displaySize: 14, refreshRate: 120, resolution: 8, battery: 14, weight: 1.6, build: 9, tdp: 35, pricePerformance: 0,
    },
  },
  {
    name: 'Dell XPS 15',
    description: 'Intel i7-13700H, 16GB RAM, 512GB SSD, 15.6" FHD+ 60Hz',
    scores: {
      price: 149900, cpu: 15000, gpu: 1200, ram: 16, ssd: 512, hdd: 0,
      displaySize: 15.6, refreshRate: 60, resolution: 5, battery: 10, weight: 1.86, build: 7, tdp: 45, pricePerformance: 0,
    },
  },
  {
    name: 'ThinkPad X1 Carbon',
    description: 'Intel i7-1365U, 16GB RAM, 512GB SSD, 14" 2K 60Hz',
    scores: {
      price: 139900, cpu: 12000, gpu: 1200, ram: 16, ssd: 512, hdd: 0,
      displaySize: 14, refreshRate: 60, resolution: 7, battery: 15, weight: 1.12, build: 9, tdp: 28, pricePerformance: 0,
    },
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9 7940HS, RTX 4060, 16GB RAM, 1TB SSD, 14" QHD+ 165Hz',
    scores: {
      price: 159900, cpu: 20000, gpu: 11000, ram: 16, ssd: 1000, hdd: 0,
      displaySize: 14, refreshRate: 165, resolution: 7, battery: 8, weight: 1.72, build: 7, tdp: 65, pricePerformance: 0,
    },
  },
  {
    name: 'HP Pavilion 15',
    description: 'Intel i5-1335U, 8GB RAM, 512GB SSD, 15.6" FHD 60Hz',
    scores: {
      price: 55000, cpu: 9500, gpu: 1200, ram: 8, ssd: 512, hdd: 0,
      displaySize: 15.6, refreshRate: 60, resolution: 5, battery: 8, weight: 1.75, build: 3, tdp: 28, pricePerformance: 0,
    },
  },
  {
    name: 'Acer Nitro V 15',
    description: 'Intel i5-13420H, RTX 4050, 16GB RAM, 512GB SSD, 15.6" FHD 144Hz',
    scores: {
      price: 72990, cpu: 10000, gpu: 8000, ram: 16, ssd: 512, hdd: 0,
      displaySize: 15.6, refreshRate: 144, resolution: 5, battery: 5, weight: 2.1, build: 3, tdp: 65, pricePerformance: 0,
    },
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

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
    weight: preset.weights[criterion.id] || criterion.weight,
  }));
}

/**
 * Get display label for a criterion value (for dropdowns)
 */
export function getValueLabel(criterionId: string, value: number): string {
  const input = CRITERION_INPUTS[criterionId];
  if (input?.type === 'select' && input.options) {
    const option = input.options.find(o => o.value === value);
    return option?.label || String(value);
  }
  const unit = input?.unit || '';
  return `${value}${unit ? ' ' + unit : ''}`;
}

/**
 * Get criteria labels for display
 */
export const CRITERIA_LABELS: Record<string, string> = Object.fromEntries(
  LAPTOP_CRITERIA.map(c => [c.id, c.name])
);

/**
 * Get unit suffix for each criterion
 */
export const CRITERIA_UNITS: Record<string, string> = {
  price: '₹',
  cpu: 'tier',
  gpu: 'tier',
  ram: 'GB',
  ssd: 'GB',
  hdd: 'GB',
  displaySize: '"',
  refreshRate: 'Hz',
  resolution: 'tier',
  battery: 'hrs',
  weight: 'kg',
  build: 'tier',
  tdp: 'W',
  pricePerformance: '',
};

/**
 * Calculate price-to-performance ratio for a laptop
 * Formula: (CPU_score + GPU_score) / Price
 * Higher is better (more performance per rupee)
 */
export function calculatePricePerformance(cpu: number, gpu: number, price: number): number {
  if (price <= 0) return 0;
  return ((cpu + gpu) / price) * 1000; // Multiply by 1000 for readable scale
}
