'use client';

import React, { useRef } from 'react';
import { Download } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   GRID-BASED LAYOUT ENGINE
   Each node is placed on a logical grid (col, row).
   Arrows are drawn as clean vertical/horizontal connectors.
   ═══════════════════════════════════════════════════════════ */

const CELL_W = 240;  // px per column
const CELL_H = 90;   // px per row
const NODE_W = 190;
const NODE_H = 56;
const DIAMOND_W = 170;
const DIAMOND_H = 68;
const PAD_TOP = 50;
const PAD_LEFT = 60;

type Shape = 'terminator' | 'process' | 'decision' | 'io' | 'subprocess';
type Color = 'green' | 'blue' | 'amber' | 'red' | 'violet' | 'teal' | 'slate';

interface N { id: string; label: string; shape: Shape; col: number; row: number; color: Color; tip: string; }
interface E { from: string; to: string; label?: string; path?: 'right' | 'left' | 'down' | 'right-down' | 'left-down'; }

/* ── Color Palette ─────────────────────────────────────── */
const P: Record<Color, { bg: string; border: string; text: string }> = {
    green: { bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
    blue: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a5f' },
    amber: { bg: '#fffbeb', border: '#f59e0b', text: '#78350f' },
    red: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d' },
    violet: { bg: '#f5f3ff', border: '#8b5cf6', text: '#4c1d95' },
    teal: { bg: '#f0fdfa', border: '#14b8a6', text: '#134e4a' },
    slate: { bg: '#f8fafc', border: '#64748b', text: '#1e293b' },
};

/* ── Nodes (Grid Positions: col 0-4, row 0-28) ────────── */
const nodes: N[] = [
    // Row 0 — Start
    { id: 'start', label: 'START', shape: 'terminator', col: 2, row: 0, color: 'green', tip: 'User clicks "Analyze" on Step 4 (ResultsStep)' },

    // Row 1 — Input
    { id: 'input', label: 'User Input\n(Options, Criteria, Weights)', shape: 'io', col: 2, row: 1, color: 'blue', tip: 'Data collected from Steps 0-3: PresetSelector → OptionsStep → CriteriaStep → ScoringStep' },

    // Row 2 — Validate
    { id: 'validate', label: 'validate()', shape: 'process', col: 2, row: 2, color: 'blue', tip: 'Checks options, criteria, and scores exist' },

    // Row 3 — Has Options?
    { id: 'd_options', label: 'Has\nOptions?', shape: 'decision', col: 2, row: 3, color: 'amber', tip: 'Decision: problem.options.length > 0?' },
    { id: 'err_no_opt', label: 'Error:\n"No options"', shape: 'terminator', col: 4, row: 3, color: 'red', tip: 'Validation error: At least one option required' },

    // Row 4 — Has Criteria?
    { id: 'd_criteria', label: 'Has\nCriteria?', shape: 'decision', col: 2, row: 4, color: 'amber', tip: 'Decision: problem.criteria.length > 0?' },
    { id: 'err_no_crit', label: 'Error:\n"No criteria"', shape: 'terminator', col: 4, row: 4, color: 'red', tip: 'Validation error: At least one criterion required' },

    // Row 5 — All Scores Filled?
    { id: 'd_scores', label: 'All Scores\nFilled?', shape: 'decision', col: 2, row: 5, color: 'amber', tip: 'Decision: Every option has a score for every criterion?' },
    { id: 'err_scores', label: 'Error:\n"Missing score"', shape: 'terminator', col: 4, row: 5, color: 'red', tip: 'Validation error: Option X is missing score for criterion Y' },

    // Row 6 — Weights = 100%?
    { id: 'd_weights', label: 'Weights\n= 100%?', shape: 'decision', col: 2, row: 6, color: 'amber', tip: 'Decision: Do criteria weights sum to exactly 100%?' },
    { id: 'warn_wt', label: 'Warning:\nAuto-normalize', shape: 'process', col: 4, row: 6, color: 'teal', tip: 'Warning only — weights will be auto-normalized to sum to 1.0' },

    // Row 7 — Derived Metrics
    { id: 'derived', label: 'calculateDerivedMetrics()\n(Price-to-Perf)', shape: 'process', col: 2, row: 7, color: 'blue', tip: 'Auto-calculates: pricePerformance = (cpu + gpu) / price × 1000' },

    // Row 8 — Has Price?
    { id: 'd_price', label: 'Price\n> 0?', shape: 'decision', col: 2, row: 8, color: 'amber', tip: 'Decision: Is price > 0 to avoid division by zero?' },
    { id: 'price_zero', label: 'Set ratio = 0\n(fallback)', shape: 'process', col: 4, row: 8, color: 'teal', tip: 'Fallback: pricePerformance = 0 when price is 0 or missing' },

    // Row 9 — Budget Filter
    { id: 'd_budget', label: 'Budget\nLimit Set?', shape: 'decision', col: 2, row: 9, color: 'amber', tip: 'Decision: problem.budgetLimit exists and > 0?' },
    { id: 'filter_bgt', label: 'Filter options\n> budget', shape: 'process', col: 4, row: 9, color: 'teal', tip: 'Remove options where price > budgetLimit' },

    // Row 10 — Threshold Filter
    { id: 'd_threshold', label: 'Min Thresholds\nSet?', shape: 'decision', col: 2, row: 10, color: 'amber', tip: 'Decision: problem.minThresholds has entries?' },
    { id: 'filter_thr', label: 'Filter below\nthresholds', shape: 'process', col: 4, row: 10, color: 'teal', tip: 'Benefit: remove if < min. Cost: remove if > max.' },

    // Row 11 — Criterion Type check (sub-decision)
    { id: 'd_benfit', label: 'Criterion\n= Benefit?', shape: 'decision', col: 4, row: 11, color: 'amber', tip: 'Decision: Is criterion.type === "benefit"?' },
    { id: 'flt_ben', label: 'Remove if\nscore < min', shape: 'process', col: 3, row: 12, color: 'teal', tip: 'For benefit criteria: value below threshold → filtered out' },
    { id: 'flt_cost', label: 'Remove if\nscore > max', shape: 'process', col: 5, row: 12, color: 'teal', tip: 'For cost criteria: value above threshold → filtered out' },

    // Row 13 — All Filtered?
    { id: 'd_all_filt', label: 'All Options\nFiltered Out?', shape: 'decision', col: 2, row: 13, color: 'amber', tip: 'Decision: filteredOptions.length === 0?' },
    { id: 'err_filt', label: 'Error:\n"All filtered out"', shape: 'terminator', col: 4, row: 13, color: 'red', tip: 'Error: No options remain after budget/threshold filtering' },

    // Row 14 — Normalize
    { id: 'normalize', label: 'normalizeWeights()\nnormalizeMinMax()', shape: 'process', col: 2, row: 14, color: 'blue', tip: 'Normalize weights to sum=1 and scores to 0-1 range' },

    // Row 15 — WSM
    { id: 'wsm', label: 'WsmAlgorithm.run()\nWeighted Sum', shape: 'subprocess', col: 2, row: 15, color: 'violet', tip: 'finalScore = Σ(weight × normalizedScore). Sort descending. Assign ranks.' },

    // Row 16 — Only 1 Option?
    { id: 'd_single', label: 'Only 1\nOption?', shape: 'decision', col: 2, row: 16, color: 'amber', tip: 'Decision: results.length === 1?' },
    { id: 'conf_auto', label: 'HIGH Confidence\n(only option)', shape: 'process', col: 4, row: 16, color: 'green', tip: 'Auto-assign high confidence when there is nothing to compare against' },

    // Row 17 — Score Diff > 20%?
    { id: 'd_high', label: 'Diff\n> 20%?', shape: 'decision', col: 2, row: 17, color: 'amber', tip: 'Decision: (winner − runnerUp) / avg > 0.20?' },
    { id: 'conf_high', label: 'HIGH\nConfidence', shape: 'process', col: 4, row: 17, color: 'green', tip: '"Winner leads by X% — clear advantage"' },

    // Row 18 — Score Diff < 5%?
    { id: 'd_low', label: 'Diff\n< 5%?', shape: 'decision', col: 2, row: 18, color: 'amber', tip: 'Decision: (winner − runnerUp) / avg < 0.05?' },
    { id: 'conf_low', label: 'LOW\nConfidence', shape: 'process', col: 4, row: 18, color: 'red', tip: '"Only X% difference — too close to call"' },

    // Row 19 — Medium
    { id: 'conf_med', label: 'MEDIUM\nConfidence', shape: 'process', col: 2, row: 19, color: 'amber', tip: '"X% difference — moderate advantage"' },

    // Row 20 — TOPSIS
    { id: 'topsis', label: 'TopsisAlgorithm.run()\n(Primary Engine)', shape: 'subprocess', col: 2, row: 20, color: 'violet', tip: 'TOPSIS: Vector normalize → Ideal Best/Worst → Euclidean distances → Closeness Coefficient' },

    // Row 21 — Agreement
    { id: 'd_agree', label: 'WSM Winner\n= TOPSIS?', shape: 'decision', col: 2, row: 21, color: 'amber', tip: "Kendall's Tau rank agreement — do both algorithms pick the same winner?" },
    { id: 'agree_yes', label: '✓ Algorithms\nAgree', shape: 'process', col: 4, row: 21, color: 'green', tip: 'Both WSM and TOPSIS independently chose the same winner' },
    { id: 'agree_no', label: '⚠ Algorithms\nDisagree', shape: 'process', col: 0, row: 21, color: 'red', tip: 'WSM and TOPSIS chose different winners — flag for user review' },

    // Row 22 — Skip Sensitivity?
    { id: 'd_sens', label: 'Skip\nSensitivity?', shape: 'decision', col: 2, row: 22, color: 'amber', tip: 'Decision: skipSensitivity flag (true for recursive sub-calls)' },

    // Row 23 — Sensitivity
    { id: 'sens', label: 'runSensitivity()\n±50% each criterion', shape: 'subprocess', col: 4, row: 22, color: 'violet', tip: 'For each criterion: boost weight +50%, re-run engine, check if ranking changes' },

    // Row 23 — Ranking Changed?
    { id: 'd_rank', label: 'Ranking\nChanged?', shape: 'decision', col: 4, row: 23, color: 'amber', tip: 'Decision: Did the modified weights produce a different winner?' },
    { id: 'mark_crit', label: 'Mark as\nCritical', shape: 'process', col: 5, row: 24, color: 'red', tip: 'This criterion is volatile — small changes flip the ranking' },

    // Row 24 — Robust?
    { id: 'd_robust', label: 'Any\nCritical?', shape: 'decision', col: 2, row: 24, color: 'amber', tip: 'Decision: criticalCriteria.length > 0?' },
    { id: 'not_robust', label: 'NOT Robust\n(Sensitive)', shape: 'process', col: 4, row: 24, color: 'red', tip: 'Result is sensitive — some weight changes would change the winner' },
    { id: 'robust', label: 'ROBUST\n(Stable)', shape: 'process', col: 0, row: 24, color: 'green', tip: 'Result is stable — no single criterion change flips the ranking' },

    // Row 25 — AI
    { id: 'ai', label: 'AI Analysis\n(Technical + Practical)', shape: 'subprocess', col: 2, row: 25, color: 'violet', tip: 'AISuggestionsEngine (10 detectors) + PracticalAdvisor (domain advice)' },

    // Row 26 — Output
    { id: 'output', label: 'Results Dashboard\n(Charts + Advice)', shape: 'io', col: 2, row: 26, color: 'blue', tip: 'ResultsStep UI: Winner banner, charts, score tables, AI insights, export' },

    // Row 27 — End
    { id: 'end', label: 'END', shape: 'terminator', col: 2, row: 27, color: 'green', tip: 'Analysis complete — user can export to JSON or review AI advice' },
];

/* ── Edges ─────────────────────────────────────────────── */
const edges: E[] = [
    { from: 'start', to: 'input' },
    { from: 'input', to: 'validate' },
    { from: 'validate', to: 'd_options' },
    { from: 'd_options', to: 'err_no_opt', label: 'No', path: 'right' },
    { from: 'd_options', to: 'd_criteria', label: 'Yes' },
    { from: 'd_criteria', to: 'err_no_crit', label: 'No', path: 'right' },
    { from: 'd_criteria', to: 'd_scores', label: 'Yes' },
    { from: 'd_scores', to: 'err_scores', label: 'No', path: 'right' },
    { from: 'd_scores', to: 'd_weights', label: 'Yes' },
    { from: 'd_weights', to: 'warn_wt', label: 'No', path: 'right' },
    { from: 'd_weights', to: 'derived', label: 'Yes' },
    { from: 'warn_wt', to: 'derived', path: 'left-down' },
    { from: 'derived', to: 'd_price' },
    { from: 'd_price', to: 'price_zero', label: 'No', path: 'right' },
    { from: 'd_price', to: 'd_budget', label: 'Yes' },
    { from: 'price_zero', to: 'd_budget', path: 'left-down' },
    { from: 'd_budget', to: 'filter_bgt', label: 'Yes', path: 'right' },
    { from: 'd_budget', to: 'd_threshold', label: 'No' },
    { from: 'filter_bgt', to: 'd_threshold', path: 'left-down' },
    { from: 'd_threshold', to: 'filter_thr', label: 'Yes', path: 'right' },
    { from: 'd_threshold', to: 'd_all_filt', label: 'No' },
    { from: 'filter_thr', to: 'd_benfit' },
    { from: 'd_benfit', to: 'flt_ben', label: 'Yes', path: 'left-down' },
    { from: 'd_benfit', to: 'flt_cost', label: 'No', path: 'right-down' },
    { from: 'flt_ben', to: 'd_all_filt', path: 'left-down' },
    { from: 'flt_cost', to: 'd_all_filt', path: 'left-down' },
    { from: 'd_all_filt', to: 'err_filt', label: 'Yes', path: 'right' },
    { from: 'd_all_filt', to: 'normalize', label: 'No' },
    { from: 'normalize', to: 'wsm' },
    { from: 'wsm', to: 'd_single' },
    { from: 'd_single', to: 'conf_auto', label: 'Yes', path: 'right' },
    { from: 'd_single', to: 'd_high', label: 'No' },
    { from: 'd_high', to: 'conf_high', label: 'Yes', path: 'right' },
    { from: 'd_high', to: 'd_low', label: 'No' },
    { from: 'd_low', to: 'conf_low', label: 'Yes', path: 'right' },
    { from: 'd_low', to: 'conf_med', label: 'No' },
    { from: 'conf_auto', to: 'topsis', path: 'left-down' },
    { from: 'conf_high', to: 'topsis', path: 'left-down' },
    { from: 'conf_low', to: 'topsis', path: 'left-down' },
    { from: 'conf_med', to: 'topsis' },
    { from: 'topsis', to: 'd_agree' },
    { from: 'd_agree', to: 'agree_yes', label: 'Yes', path: 'right' },
    { from: 'd_agree', to: 'agree_no', label: 'No', path: 'left' },
    { from: 'agree_yes', to: 'd_sens', path: 'left-down' },
    { from: 'agree_no', to: 'd_sens', path: 'right-down' },
    { from: 'd_sens', to: 'sens', label: 'No', path: 'right' },
    { from: 'd_sens', to: 'ai', label: 'Yes\n(skip)' },
    { from: 'sens', to: 'd_rank' },
    { from: 'd_rank', to: 'mark_crit', label: 'Yes', path: 'right-down' },
    { from: 'd_rank', to: 'd_robust', label: 'No', path: 'left-down' },
    { from: 'mark_crit', to: 'd_robust', path: 'left-down' },
    { from: 'd_robust', to: 'not_robust', label: 'Yes', path: 'right' },
    { from: 'd_robust', to: 'robust', label: 'No', path: 'left' },
    { from: 'not_robust', to: 'ai', path: 'left-down' },
    { from: 'robust', to: 'ai', path: 'right-down' },
    { from: 'ai', to: 'output' },
    { from: 'output', to: 'end' },
];

/* ── Coordinate Helpers ───────────────────────────────── */
function cx(col: number) { return PAD_LEFT + col * CELL_W + CELL_W / 2; }
function cy(row: number) { return PAD_TOP + row * CELL_H + CELL_H / 2; }

function getCenter(n: N) { return { x: cx(n.col), y: cy(n.row) }; }

function getAnchor(n: N, side: 'top' | 'bottom' | 'left' | 'right') {
    const c = getCenter(n);
    const hw = (n.shape === 'decision' ? DIAMOND_W : NODE_W) / 2;
    const hh = (n.shape === 'decision' ? DIAMOND_H : NODE_H) / 2;
    switch (side) {
        case 'top': return { x: c.x, y: c.y - hh };
        case 'bottom': return { x: c.x, y: c.y + hh };
        case 'left': return { x: c.x - hw, y: c.y };
        case 'right': return { x: c.x + hw, y: c.y };
    }
}

/* ── Shape Renderers ──────────────────────────────────── */
function renderShape(n: N, hovered: boolean) {
    const c = getCenter(n);
    const pal = P[n.color];
    const sw = hovered ? 3 : 1.5;
    const lines = n.label.split('\n');
    const lh = 14;
    const ty = c.y - ((lines.length - 1) * lh) / 2;

    const textEls = lines.map((l, i) => (
        <text key={i} x={c.x} y={ty + i * lh} textAnchor="middle" dominantBaseline="central"
            fill={pal.text} fontSize={11} fontWeight={i === 0 ? 700 : 400} fontFamily="Inter, system-ui, sans-serif">{l}</text>
    ));

    switch (n.shape) {
        case 'terminator':
            return <g><rect x={c.x - NODE_W / 2} y={c.y - NODE_H / 2} width={NODE_W} height={NODE_H}
                rx={NODE_H / 2} fill={pal.bg} stroke={pal.border} strokeWidth={sw} />{textEls}</g>;
        case 'process':
            return <g><rect x={c.x - NODE_W / 2} y={c.y - NODE_H / 2} width={NODE_W} height={NODE_H}
                rx={6} fill={pal.bg} stroke={pal.border} strokeWidth={sw} />{textEls}</g>;
        case 'subprocess':
            return <g>
                <rect x={c.x - NODE_W / 2} y={c.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} fill={pal.bg} stroke={pal.border} strokeWidth={sw} />
                <rect x={c.x - NODE_W / 2 + 4} y={c.y - NODE_H / 2 + 4} width={NODE_W - 8} height={NODE_H - 8} rx={3} fill="none" stroke={pal.border} strokeWidth={0.8} strokeDasharray="3 2" />
                {textEls}
            </g>;
        case 'decision': {
            const hw = DIAMOND_W / 2, hh = DIAMOND_H / 2;
            return <g><polygon points={`${c.x},${c.y - hh} ${c.x + hw},${c.y} ${c.x},${c.y + hh} ${c.x - hw},${c.y}`}
                fill={pal.bg} stroke={pal.border} strokeWidth={sw} />{textEls}</g>;
        }
        case 'io': {
            const hw = NODE_W / 2, hh = NODE_H / 2, sk = 18;
            return <g><polygon points={`${c.x - hw + sk},${c.y - hh} ${c.x + hw + sk},${c.y - hh} ${c.x + hw - sk},${c.y + hh} ${c.x - hw - sk},${c.y + hh}`}
                fill={pal.bg} stroke={pal.border} strokeWidth={sw} />{textEls}</g>;
        }
    }
}

/* ── Edge Renderer ────────────────────────────────────── */
function renderEdge(e: E, map: Map<string, N>) {
    const fn = map.get(e.from)!, tn = map.get(e.to)!;
    if (!fn || !tn) return null;

    let start: { x: number, y: number }, end: { x: number, y: number }, path: string;

    switch (e.path) {
        case 'right': {
            start = getAnchor(fn, 'right');
            end = getAnchor(tn, 'left');
            path = `M${start.x},${start.y} L${end.x},${end.y}`;
            break;
        }
        case 'left': {
            start = getAnchor(fn, 'left');
            end = getAnchor(tn, 'right');
            path = `M${start.x},${start.y} L${end.x},${end.y}`;
            break;
        }
        case 'right-down': {
            start = getAnchor(fn, 'bottom');
            end = getAnchor(tn, 'top');
            const midY = (start.y + end.y) / 2;
            path = `M${start.x},${start.y} L${start.x},${midY} L${end.x},${midY} L${end.x},${end.y}`;
            break;
        }
        case 'left-down': {
            start = getAnchor(fn, 'bottom');
            end = getAnchor(tn, 'top');
            const midY2 = (start.y + end.y) / 2;
            path = `M${start.x},${start.y} L${start.x},${midY2} L${end.x},${midY2} L${end.x},${end.y}`;
            break;
        }
        default: {
            // straight down
            start = getAnchor(fn, 'bottom');
            end = getAnchor(tn, 'top');
            path = `M${start.x},${start.y} L${end.x},${end.y}`;
        }
    }

    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;

    return (
        <g key={`${e.from}-${e.to}`}>
            <path d={path} fill="none" stroke="#94a3b8" strokeWidth={1.2} markerEnd="url(#ah)" />
            {e.label && (
                <>
                    <rect x={mx - 16} y={my - 9} width={32} height={15} rx={3} fill="white" opacity={0.95} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={9}
                        fontWeight={700} fontFamily="Inter, sans-serif"
                        fill={e.label.startsWith('Yes') ? '#10b981' : e.label.startsWith('No') ? '#ef4444' : '#64748b'}>
                        {e.label.split('\n')[0]}
                    </text>
                </>
            )}
        </g>
    );
}

/* ── Legend ────────────────────────────────────────────── */
function Legend() {
    const items: { s: Shape; l: string; c: Color }[] = [
        { s: 'terminator', l: 'Start / End', c: 'green' },
        { s: 'process', l: 'Process', c: 'blue' },
        { s: 'decision', l: 'Decision', c: 'amber' },
        { s: 'io', l: 'Input / Output', c: 'blue' },
        { s: 'subprocess', l: 'Algorithm Call', c: 'violet' },
    ];
    return (
        <div className="flex flex-wrap gap-3 justify-center mb-4" id="legend">
            {items.map(i => {
                const p = P[i.c];
                return (
                    <div key={i.s} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <svg width="24" height="18" viewBox="0 0 24 18">
                            {i.s === 'terminator' && <rect x={1} y={1} width={22} height={16} rx={8} fill={p.bg} stroke={p.border} strokeWidth={1.2} />}
                            {i.s === 'process' && <rect x={1} y={1} width={22} height={16} rx={3} fill={p.bg} stroke={p.border} strokeWidth={1.2} />}
                            {i.s === 'decision' && <polygon points="12,1 23,9 12,17 1,9" fill={p.bg} stroke={p.border} strokeWidth={1.2} />}
                            {i.s === 'io' && <polygon points="5,1 23,1 19,17 1,17" fill={p.bg} stroke={p.border} strokeWidth={1.2} />}
                            {i.s === 'subprocess' && <><rect x={1} y={1} width={22} height={16} rx={3} fill={p.bg} stroke={p.border} strokeWidth={1.2} /><rect x={3} y={3} width={18} height={12} rx={2} fill="none" stroke={p.border} strokeWidth={0.6} strokeDasharray="2 1" /></>}
                        </svg>
                        <span className="font-medium">{i.l}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function DecisionFlowchart() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hovered, setHovered] = React.useState<string | null>(null);

    const map = new Map(nodes.map(n => [n.id, n]));

    const maxCol = Math.max(...nodes.map(n => n.col));
    const maxRow = Math.max(...nodes.map(n => n.row));
    const svgW = PAD_LEFT * 2 + (maxCol + 1) * CELL_W;
    const svgH = PAD_TOP * 2 + (maxRow + 1) * CELL_H;

    const hovNode = hovered ? map.get(hovered) : null;

    const handleExportPDF = () => {
        const printWin = window.open('', '_blank');
        if (!printWin || !svgRef.current) return;

        const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svgClone);

        printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Decision Logic Flowchart — Decision Companion System</title>
          <style>
            @page { size: A3 landscape; margin: 10mm; }
            body { margin: 0; display: flex; flex-direction: column; align-items: center; font-family: Inter, system-ui, sans-serif; }
            h1 { font-size: 18px; margin: 12px 0 4px; color: #1e293b; }
            p { font-size: 11px; color: #64748b; margin: 0 0 10px; }
            svg { width: 100%; max-height: 95vh; }
            .stats { display: flex; gap: 24px; margin-top: 8px; font-size: 11px; color: #64748b; }
            .stats span { font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>Decision Logic Flowchart</h1>
          <p>Decision Companion System — Complete Decision Logic with ${nodes.filter(n => n.shape === 'decision').length} Decision Points</p>
          ${svgStr}
          <div class="stats">
            <div><span style="color:#f59e0b">${nodes.filter(n => n.shape === 'decision').length}</span> Decision Points</div>
            <div><span style="color:#3b82f6">${nodes.filter(n => n.shape === 'process').length}</span> Processes</div>
            <div><span style="color:#8b5cf6">${nodes.filter(n => n.shape === 'subprocess').length}</span> Algorithm Calls</div>
          </div>
        </body>
      </html>
    `);
        printWin.document.close();
        setTimeout(() => { printWin.print(); }, 500);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Decision Logic Flowchart</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {nodes.filter(n => n.shape === 'decision').length} decision points · {nodes.filter(n => n.shape === 'process').length} processes · {nodes.filter(n => n.shape === 'subprocess').length} algorithm calls
                    </p>
                </div>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            <Legend />

            {/* Tooltip */}
            {hovNode && (
                <div className="fixed top-4 right-4 z-50 max-w-xs bg-slate-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-slate-700">
                    <div className="font-bold text-violet-300 mb-1">{hovNode.label.split('\n')[0]}</div>
                    <div className="text-slate-300 leading-relaxed">{hovNode.tip}</div>
                </div>
            )}

            {/* SVG */}
            <div className="overflow-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                <svg ref={svgRef} viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="select-none" style={{ minWidth: svgW }}>
                    <defs>
                        <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                        </marker>
                    </defs>

                    {/* Phase Labels */}
                    {[
                        { row: 2, endRow: 6, label: 'Validation Phase', color: '#eff6ff' },
                        { row: 7, endRow: 13, label: 'Filtering Phase', color: '#f0fdfa' },
                        { row: 14, endRow: 19, label: 'WSM Analysis', color: '#f5f3ff' },
                        { row: 20, endRow: 24, label: 'TOPSIS + Sensitivity', color: '#fffbeb' },
                        { row: 25, endRow: 27, label: 'AI + Output', color: '#ecfdf5' },
                    ].map(phase => (
                        <g key={phase.label}>
                            <rect x={8} y={PAD_TOP + phase.row * CELL_H - 5} width={svgW - 16}
                                height={(phase.endRow - phase.row + 1) * CELL_H + 10} rx={10} fill={phase.color} opacity={0.4} />
                            <text x={20} y={PAD_TOP + phase.row * CELL_H + 12} fontSize={10} fontWeight={700}
                                fill="#64748b" fontFamily="Inter, sans-serif" opacity={0.7}>{phase.label}</text>
                        </g>
                    ))}

                    {/* Edges (behind nodes) */}
                    {edges.map(e => renderEdge(e, map))}

                    {/* Nodes */}
                    {nodes.map(n => (
                        <g key={n.id}
                            onMouseEnter={() => setHovered(n.id)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'pointer' }}
                            filter={hovered === n.id ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.15))' : undefined}
                        >
                            {renderShape(n, hovered === n.id)}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
