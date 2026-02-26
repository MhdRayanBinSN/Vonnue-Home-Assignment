/**
 * Performance Calculator — Model Lookup Tables
 *
 * GPU scores mapped to 3DMark TimeSpy scale  (source: notebookcheck.net, 3dmark.com)
 * CPU scores mapped to Cinebench R23 multi-core scale  (source: notebookcheck.net)
 *
 * For GPUs with TDP variants (same model, different power limits),
 * each TDP tier is listed separately so users pick the one matching their laptop type.
 */

// ─── GPU Lookup Table ─────────────────────────────────────────────────────────

export interface GpuEntry {
    model: string;           // Display name shown to user
    score: number;           // 3DMark TimeSpy score
    brand: 'NVIDIA' | 'AMD' | 'Intel' | 'Apple' | 'Integrated';
    tier: 'integrated' | 'entry' | 'mid' | 'high' | 'ultra';
}

/**
 * Comprehensive GPU model list with real 3DMark TimeSpy benchmark scores.
 * TDP variants are listed separately for GPU models with significant power differences.
 */
export const GPU_MODELS: GpuEntry[] = [
    // ── Integrated ──
    { model: 'Intel HD Graphics 620 (7th Gen)', score: 400, brand: 'Intel', tier: 'integrated' },
    { model: 'Intel UHD 620 (8th/10th Gen)', score: 600, brand: 'Intel', tier: 'integrated' },
    { model: 'Intel UHD Graphics (12th/13th Gen)', score: 1000, brand: 'Intel', tier: 'integrated' },
    { model: 'Intel Iris Plus (10th Gen)', score: 900, brand: 'Intel', tier: 'integrated' },
    { model: 'Intel Iris Xe Graphics', score: 1500, brand: 'Intel', tier: 'integrated' },
    { model: 'Intel Arc (Laptop)', score: 4000, brand: 'Intel', tier: 'integrated' },
    { model: 'AMD Radeon Vega 3 / Vega 5 / Vega 8', score: 1000, brand: 'AMD', tier: 'integrated' },
    { model: 'AMD Radeon Vega (Ryzen 5000)', score: 1800, brand: 'AMD', tier: 'integrated' },
    { model: 'AMD Radeon 610M / 680M (Ryzen 6000)', score: 3000, brand: 'AMD', tier: 'integrated' },
    { model: 'AMD Radeon 780M (Ryzen 7000)', score: 3500, brand: 'AMD', tier: 'integrated' },
    { model: 'Apple M1 — 7-core GPU', score: 3500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M1 — 8-core GPU', score: 4000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M1 Pro — 14-core GPU', score: 7000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M1 Pro — 16-core GPU', score: 8000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M1 Max — 24-core GPU', score: 12000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M1 Max — 32-core GPU', score: 14500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 — 8-core GPU', score: 4500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 — 10-core GPU', score: 5000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 Pro — 16-core GPU', score: 8500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 Pro — 19-core GPU', score: 9500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 Max — 30-core GPU', score: 14000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M2 Max — 38-core GPU', score: 16000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M3 — 10-core GPU', score: 5500, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M3 Pro — 18-core GPU', score: 11000, brand: 'Apple', tier: 'integrated' },
    { model: 'Apple M3 Max — 40-core GPU', score: 18000, brand: 'Apple', tier: 'integrated' },

    // ── Entry / Budget Dedicated (GTX / Legacy) ──
    { model: 'NVIDIA GeForce 930MX', score: 500, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GeForce 940MX', score: 700, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1050 Laptop', score: 1500, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1050 Ti Laptop', score: 1800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1060 Laptop', score: 2500, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1650 Laptop', score: 2800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1650 Ti Laptop', score: 3200, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1660 Ti Laptop', score: 4500, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1070 Laptop', score: 3600, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA GTX 1080 Laptop', score: 4800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA MX130 / MX150', score: 800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA MX250 / MX330', score: 1200, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA MX450', score: 2200, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA MX550', score: 2600, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA MX570', score: 3000, brand: 'NVIDIA', tier: 'entry' },
    { model: 'AMD Radeon RX 540 / RX 550', score: 700, brand: 'AMD', tier: 'entry' },
    { model: 'AMD Radeon RX 560X Laptop', score: 1200, brand: 'AMD', tier: 'entry' },
    { model: 'AMD Radeon RX 5300M', score: 2200, brand: 'AMD', tier: 'entry' },
    { model: 'AMD Radeon RX 5500M', score: 3000, brand: 'AMD', tier: 'entry' },
    { model: 'AMD Radeon RX 6500M', score: 4500, brand: 'AMD', tier: 'entry' },
    { model: 'AMD Radeon RX 6600M', score: 7000, brand: 'AMD', tier: 'entry' },
    { model: 'Intel Arc A550M', score: 4500, brand: 'Intel', tier: 'entry' },
    { model: 'Intel Arc A770M', score: 6000, brand: 'Intel', tier: 'entry' },
    { model: 'NVIDIA RTX 2050 Laptop', score: 4500, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA RTX 2060 Laptop', score: 5800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA RTX 3050 Laptop', score: 6000, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA RTX 3050 Ti Laptop', score: 6800, brand: 'NVIDIA', tier: 'entry' },
    { model: 'NVIDIA RTX 4050 Laptop', score: 8000, brand: 'NVIDIA', tier: 'entry' },
    { model: 'AMD Radeon RX 7600M', score: 7500, brand: 'AMD', tier: 'entry' },

    // ── Mid-Range Dedicated ──
    { model: 'NVIDIA RTX 2070 Laptop', score: 7500, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 2070 Super Laptop', score: 8500, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 2080 Laptop', score: 9500, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 3060 Laptop', score: 7500, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 3070 Laptop', score: 10000, brand: 'NVIDIA', tier: 'mid' },
    { model: 'AMD Radeon RX 6700M', score: 8500, brand: 'AMD', tier: 'mid' },
    { model: 'AMD Radeon RX 6800M', score: 10500, brand: 'AMD', tier: 'mid' },
    { model: 'AMD Radeon RX 7700M', score: 9500, brand: 'AMD', tier: 'mid' },
    { model: 'AMD Radeon RX 7800M', score: 11000, brand: 'AMD', tier: 'mid' },
    { model: 'NVIDIA RTX 4060 Laptop — Thin & Light (~40W)', score: 8500, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 4060 Laptop — Standard Gaming (~65W)', score: 11000, brand: 'NVIDIA', tier: 'mid' },
    { model: 'NVIDIA RTX 4060 Laptop — High-Power Gaming (~115W)', score: 13500, brand: 'NVIDIA', tier: 'mid' },

    // ── High-End Dedicated ──
    { model: 'NVIDIA RTX 3070 Ti Laptop', score: 11500, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 3080 Laptop', score: 12500, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 3080 Ti Laptop', score: 14000, brand: 'NVIDIA', tier: 'high' },
    { model: 'AMD Radeon RX 6850M XT', score: 12000, brand: 'AMD', tier: 'high' },
    { model: 'AMD Radeon RX 7900M', score: 14500, brand: 'AMD', tier: 'high' },
    { model: 'NVIDIA RTX 4070 Laptop — Thin & Light (~35W)', score: 9000, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 4070 Laptop — Standard Gaming (~80W)', score: 13500, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 4070 Laptop — High-Power Gaming (~115W)', score: 16000, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 4070 Ti Laptop', score: 17000, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 4080 Laptop — Standard (~80W)', score: 15000, brand: 'NVIDIA', tier: 'high' },
    { model: 'NVIDIA RTX 4080 Laptop — Full Power (~150W)', score: 18500, brand: 'NVIDIA', tier: 'high' },

    // ── Ultra / Flagship ──
    { model: 'NVIDIA RTX 3090 Laptop', score: 16000, brand: 'NVIDIA', tier: 'ultra' },
    { model: 'NVIDIA RTX 4090 Laptop', score: 20000, brand: 'NVIDIA', tier: 'ultra' },
];

/** Group GPU models by tier for display */
export function getGpuModelsByTier(): Record<string, GpuEntry[]> {
    const groups: Record<string, GpuEntry[]> = {
        'Integrated': [],
        'Entry (Budget Gaming)': [],
        'Mid-Range (Gaming)': [],
        'High-End': [],
        'Ultra / Flagship': [],
    };
    const tierMap: Record<GpuEntry['tier'], string> = {
        integrated: 'Integrated',
        entry: 'Entry (Budget Gaming)',
        mid: 'Mid-Range (Gaming)',
        high: 'High-End',
        ultra: 'Ultra / Flagship',
    };
    for (const gpu of GPU_MODELS) {
        groups[tierMap[gpu.tier]].push(gpu);
    }
    return groups;
}

// ─── CPU Lookup Table ─────────────────────────────────────────────────────────

export interface CpuEntry {
    model: string;         // Display name shown to user
    score: number;         // Cinebench R23 multi-core score
    brand: 'Intel' | 'AMD' | 'Apple';
    series: string;        // For grouping in dropdown
}

/**
 * Comprehensive CPU model list with real Cinebench R23 multi-core benchmark scores.
 * Source: notebookcheck.net benchmark database.
 */
export const CPU_MODELS: CpuEntry[] = [
    // ── Intel 13th Gen ──
    { model: 'Intel Core i9-13980HX', score: 35000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i9-13900HX', score: 33000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i9-13900H', score: 27000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i7-13700HX', score: 24000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i7-13700H', score: 19000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i7-13620H', score: 16000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i5-13500H', score: 13500, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i5-13420H', score: 10000, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i5-1340P', score: 11500, brand: 'Intel', series: 'Intel 13th Gen' },
    { model: 'Intel Core i3-1315U', score: 6000, brand: 'Intel', series: 'Intel 13th Gen' },
    // ── Intel 12th Gen ──
    { model: 'Intel Core i9-12900HX', score: 28000, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i9-12900H', score: 22000, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i7-12700H', score: 16000, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i7-1265U', score: 9000, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i5-12500H', score: 12000, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i5-1235U', score: 8500, brand: 'Intel', series: 'Intel 12th Gen' },
    { model: 'Intel Core i3-1215U', score: 5500, brand: 'Intel', series: 'Intel 12th Gen' },
    // ── Intel 11th Gen ──
    { model: 'Intel Core i9-11900H', score: 14000, brand: 'Intel', series: 'Intel 11th Gen' },
    { model: 'Intel Core i7-11800H', score: 12000, brand: 'Intel', series: 'Intel 11th Gen' },
    { model: 'Intel Core i7-1165G7', score: 6000, brand: 'Intel', series: 'Intel 11th Gen' },
    { model: 'Intel Core i5-11400H', score: 10000, brand: 'Intel', series: 'Intel 11th Gen' },
    { model: 'Intel Core i5-1135G7', score: 5500, brand: 'Intel', series: 'Intel 11th Gen' },
    { model: 'Intel Core i3-1115G4', score: 3500, brand: 'Intel', series: 'Intel 11th Gen' },
    // ── Intel 10th Gen ──
    { model: 'Intel Core i9-10980HK', score: 9000, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i7-10870H', score: 8500, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i7-10750H', score: 7500, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i7-1065G7', score: 4200, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i5-10300H', score: 5500, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i5-1035G1', score: 3500, brand: 'Intel', series: 'Intel 10th Gen' },
    { model: 'Intel Core i3-10110U', score: 2500, brand: 'Intel', series: 'Intel 10th Gen' },
    // ── Intel 8th / 9th Gen ──
    { model: 'Intel Core i9-9880H', score: 7500, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i7-9750H', score: 6000, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i7-8750H', score: 5500, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i5-9300H', score: 4200, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i5-8300H', score: 3800, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i5-8265U', score: 2800, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    { model: 'Intel Core i3-8145U', score: 2000, brand: 'Intel', series: 'Intel 8th/9th Gen' },
    // ── AMD Ryzen 7000 ──
    { model: 'AMD Ryzen 9 7945HX', score: 30000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 9 7940HS', score: 20000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 9 7940HX', score: 28000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 7 7745HX', score: 18000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 7 7735HS', score: 14000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 7 7730U', score: 11000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 5 7640HS', score: 11000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 5 7530U', score: 9500, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 5 7520U', score: 7000, brand: 'AMD', series: 'AMD Ryzen 7000' },
    { model: 'AMD Ryzen 3 7330U', score: 5500, brand: 'AMD', series: 'AMD Ryzen 7000' },
    // ── AMD Ryzen 6000 ──
    { model: 'AMD Ryzen 9 6900HX', score: 16000, brand: 'AMD', series: 'AMD Ryzen 6000' },
    { model: 'AMD Ryzen 7 6800H', score: 14000, brand: 'AMD', series: 'AMD Ryzen 6000' },
    { model: 'AMD Ryzen 5 6600H', score: 10500, brand: 'AMD', series: 'AMD Ryzen 6000' },
    { model: 'AMD Ryzen 5 6600U', score: 9000, brand: 'AMD', series: 'AMD Ryzen 6000' },
    // ── AMD Ryzen 5000 ──
    { model: 'AMD Ryzen 9 5900HX', score: 14000, brand: 'AMD', series: 'AMD Ryzen 5000' },
    { model: 'AMD Ryzen 7 5800H', score: 12000, brand: 'AMD', series: 'AMD Ryzen 5000' },
    { model: 'AMD Ryzen 7 5700U', score: 8500, brand: 'AMD', series: 'AMD Ryzen 5000' },
    { model: 'AMD Ryzen 5 5600H', score: 9000, brand: 'AMD', series: 'AMD Ryzen 5000' },
    { model: 'AMD Ryzen 5 5500U', score: 7000, brand: 'AMD', series: 'AMD Ryzen 5000' },
    { model: 'AMD Ryzen 3 5300U', score: 5000, brand: 'AMD', series: 'AMD Ryzen 5000' },
    // ── AMD Ryzen 4000 / 3000 ──
    { model: 'AMD Ryzen 9 4900H', score: 10000, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 7 4800H', score: 9000, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 5 4600H', score: 7500, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 5 4500U', score: 5500, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 3 4300U', score: 3800, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 7 3750H', score: 5500, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 5 3550H', score: 4500, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD Ryzen 3 3300U', score: 3000, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    { model: 'AMD A9 / A6 (old budget)', score: 1500, brand: 'AMD', series: 'AMD Ryzen 4000/3000' },
    // ── Apple Silicon ──
    { model: 'Apple M3', score: 15000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M3 Pro', score: 22000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M3 Max', score: 28000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M2', score: 12000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M2 Pro', score: 20000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M2 Max', score: 25000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M1', score: 9000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M1 Pro', score: 16000, brand: 'Apple', series: 'Apple Silicon' },
    { model: 'Apple M1 Max', score: 20000, brand: 'Apple', series: 'Apple Silicon' },
];


/** Group CPU models by series for grouped select display */
export function getCpuModelsBySeries(): Record<string, CpuEntry[]> {
    const groups: Record<string, CpuEntry[]> = {};
    for (const cpu of CPU_MODELS) {
        if (!groups[cpu.series]) groups[cpu.series] = [];
        groups[cpu.series].push(cpu);
    }
    return groups;
}
