'use client';

import React, { useMemo, useState } from 'react';
import { ClipboardList, TrendingUp, TrendingDown, CheckCircle2, Sparkles, Loader2, Link2 } from 'lucide-react';
import { useApp } from '@/lib/context';
import { CRITERION_INPUTS } from '@/lib/laptop-presets';
import { getGpuModelsByTier, getCpuModelsBySeries } from '@/lib/performance-calculator';

export function ScoringStep() {
  const { state, updateScore, nextStep, prevStep } = useApp();
  const { problem } = state;

  // AI auto-fill state per option
  const [aiSearches, setAiSearches] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [aiSuccess, setAiSuccess] = useState<Record<string, boolean>>({});

  // URL fallback state
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [showUrlInput, setShowUrlInput] = useState<Record<string, boolean>>({});
  const [urlLoading, setUrlLoading] = useState<Record<string, boolean>>({});

  // Calculate completion percentage
  const { completedScores, totalScores, completionPercentage } = useMemo(() => {
    const total = problem.options.length * problem.criteria.length;
    let completed = 0;

    for (const option of problem.options) {
      for (const criterion of problem.criteria) {
        if (option.scores[criterion.id] !== undefined) {
          completed++;
        }
      }
    }

    return {
      completedScores: completed,
      totalScores: total,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [problem.options, problem.criteria]);

  const canProceed = completedScores === totalScores;

  const handleScoreChange = (optionId: string, criterionId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateScore(optionId, criterionId, numValue);
    }
  };

  // AI Auto-Fill handler
  const getSearchQuery = (optionId: string, optionName: string) => {
    return (aiSearches[optionId] ?? optionName).trim();
  };

  const handleAiAutoFill = async (optionId: string, optionName: string) => {
    const searchQuery = getSearchQuery(optionId, optionName);
    if (!searchQuery) return;

    setAiLoading(prev => ({ ...prev, [optionId]: true }));
    setAiErrors(prev => ({ ...prev, [optionId]: '' }));
    setAiSuccess(prev => ({ ...prev, [optionId]: false }));

    try {
      const response = await fetch('/api/lookup-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ laptopName: searchQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to look up specs');
      }

      // Fill all scores for this option
      const specs = data.specs;
      for (const criterion of problem.criteria) {
        if (specs[criterion.id] !== undefined) {
          updateScore(optionId, criterion.id, specs[criterion.id]);
        }
      }

      setAiSuccess(prev => ({ ...prev, [optionId]: true }));
      setTimeout(() => setAiSuccess(prev => ({ ...prev, [optionId]: false })), 3000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Auto-fill failed';
      setAiErrors(prev => ({ ...prev, [optionId]: msg }));
      // Show URL fallback on error
      setShowUrlInput(prev => ({ ...prev, [optionId]: true }));
    } finally {
      setAiLoading(prev => ({ ...prev, [optionId]: false }));
    }
  };

  // URL-based auto-fill handler
  const handleUrlAutoFill = async (optionId: string) => {
    const url = urlInputs[optionId]?.trim();
    if (!url) return;

    setUrlLoading(prev => ({ ...prev, [optionId]: true }));
    setAiErrors(prev => ({ ...prev, [optionId]: '' }));
    setAiSuccess(prev => ({ ...prev, [optionId]: false }));

    try {
      const response = await fetch('/api/lookup-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract specs from URL');
      }

      const specs = data.specs;
      for (const criterion of problem.criteria) {
        if (specs[criterion.id] !== undefined) {
          updateScore(optionId, criterion.id, specs[criterion.id]);
        }
      }

      setAiSuccess(prev => ({ ...prev, [optionId]: true }));
      setShowUrlInput(prev => ({ ...prev, [optionId]: false }));
      setTimeout(() => setAiSuccess(prev => ({ ...prev, [optionId]: false })), 3000);
    } catch (error) {
      setAiErrors(prev => ({
        ...prev,
        [optionId]: error instanceof Error ? error.message : 'URL extraction failed',
      }));
    } finally {
      setUrlLoading(prev => ({ ...prev, [optionId]: false }));
    }
  };

  // ── Input renderers ─────────────────────────────────────────────────────────

  const selectBase = () =>
    `w-full px-3 py-2.5 text-sm rounded-xl border-2 border-slate-200 bg-white text-slate-700
     transition-all duration-200 appearance-none cursor-pointer
     focus:outline-none focus:border-primary-400 focus:ring-0`;

  // ── Dropdown: standard select for predefined options ───────────────────────
  const renderDropdown = (optionId: string, criterionId: string, currentScore: number | undefined) => {
    const config = CRITERION_INPUTS[criterionId];
    if (!config?.options) return null;
    const filled = currentScore !== undefined;
    return (
      <select
        value={filled ? currentScore : ''}
        onChange={(e) => handleScoreChange(optionId, criterionId, e.target.value)}
        className={selectBase()}
      >
        <option value="" disabled>—</option>
        {config.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };

  // ── Slider: for continuous numeric ranges (battery, weight) ─────────────────
  const renderSlider = (optionId: string, criterionId: string, currentScore: number | undefined) => {
    const config = CRITERION_INPUTS[criterionId];
    const min = config?.min ?? 0;
    const max = config?.max ?? 100;
    const step = config?.step ?? 1;
    const unit = config?.unit ?? '';
    const filled = currentScore !== undefined;
    const pct = filled ? ((currentScore - min) / (max - min)) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{min}{unit}</span>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${filled ? 'bg-blue-100 text-blue-700' : 'text-slate-400 bg-slate-100'}`}>
            {filled ? `${currentScore}${unit}` : '—'}
          </span>
          <span className="text-xs text-slate-400">{max}{unit}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={filled ? currentScore : min}
            onChange={(e) => handleScoreChange(optionId, criterionId, e.target.value)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200"
            style={{
              background: filled
                ? `linear-gradient(to right, #3b82f6 0%, #2563eb ${pct}%, #e2e8f0 ${pct}%)`
                : '#e2e8f0',
            }}
          />
        </div>
      </div>
    );
  };

  // ── Price: plain number with ₹ prefix ────────────────────────────────────────
  const renderPriceInput = (optionId: string, currentScore: number | undefined) => {
    return (
      <div className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 transition-all
        focus-within:border-primary-400">
        <span className="text-sm font-bold text-slate-500 shrink-0">₹</span>
        <input
          type="number"
          value={currentScore !== undefined ? currentScore : ''}
          onChange={(e) => handleScoreChange(optionId, 'price', e.target.value)}
          placeholder="e.g. 75000"
          min={20000}
          max={500000}
          step={1000}
          className="w-full text-sm bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-300 font-medium"
        />
      </div>
    );
  };

  // ── CPU grouped dropdown ─────────────────────────────────────────────────────
  const renderCpuSelect = (optionId: string, currentScore: number | undefined) => {
    const cpuGroups = getCpuModelsBySeries();
    const filled = currentScore !== undefined;
    return (
      <select
        value={filled ? currentScore : ''}
        onChange={(e) => handleScoreChange(optionId, 'cpu', e.target.value)}
        className={selectBase()}
      >
        <option value="" disabled>— Select CPU model —</option>
        {Object.entries(cpuGroups).map(([series, cpus]) => (
          <optgroup key={series} label={series}>
            {cpus.map((c) => (
              <option key={c.model} value={c.score}>{c.model}</option>
            ))}
          </optgroup>
        ))}
      </select>
    );
  };

  // ── GPU grouped dropdown ─────────────────────────────────────────────────────
  const renderGpuSelect = (optionId: string, currentScore: number | undefined) => {
    const gpuGroups = getGpuModelsByTier();
    const filled = currentScore !== undefined;
    return (
      <select
        value={filled ? currentScore : ''}
        onChange={(e) => handleScoreChange(optionId, 'gpu', e.target.value)}
        className={selectBase()}
      >
        <option value="" disabled>— Select GPU model —</option>
        {Object.entries(gpuGroups).map(([tier, gpus]) => (
          <optgroup key={tier} label={tier}>
            {gpus.map((g) => (
              <option key={g.model} value={g.score}>{g.model}</option>
            ))}
          </optgroup>
        ))}
      </select>
    );
  };

  // ── Master renderer: picks the right control per criterion ───────────────────
  const renderInput = (optionId: string, criterionId: string, currentScore: number | undefined) => {
    if (criterionId === 'cpu') return renderCpuSelect(optionId, currentScore);
    if (criterionId === 'gpu') return renderGpuSelect(optionId, currentScore);
    if (criterionId === 'price') return renderPriceInput(optionId, currentScore);
    const config = CRITERION_INPUTS[criterionId];
    if (config?.type === 'select' && config.options) {
      return renderDropdown(optionId, criterionId, currentScore);
    }
    // Continuous number (battery, weight)
    return renderSlider(optionId, criterionId, currentScore);
  };



  // Weight badge: blue tiers matching importance
  const weightBadge = (w: number) =>
    w >= 20 ? 'bg-blue-100 text-blue-800 border-blue-300 font-bold' :
      w >= 10 ? 'bg-blue-50 text-blue-600 border-blue-200' :
        'bg-slate-100 text-slate-400 border-slate-200';

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600 text-white mb-3 shadow-lg shadow-primary-200">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Enter Laptop Specs</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Use <span className="font-semibold text-primary-600">AI Auto-Fill</span> per laptop, or fill each cell manually.
        </p>
      </div>

      {/* ── Progress bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Filling Progress</span>
          <span className="text-sm font-bold text-primary-600">
            {completionPercentage}%
            <span className="font-normal text-slate-400 ml-1">— {completedScores}/{totalScores} specs</span>
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionPercentage}%`,
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              boxShadow: completionPercentage > 0 ? '0 0 8px rgba(59,130,246,0.35)' : 'none',
            }}
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="mb-6 rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-320px)] min-h-[400px]">
          <table className="w-full border-collapse" style={{ minWidth: `${280 + problem.options.length * 220}px` }}>

            {/* ── Column headers: blank corner + one per laptop ── */}
            <thead className="sticky top-0 z-30">
              {/* Row 1: Laptop names */}
              <tr className="bg-slate-900 shadow-sm">
                {/* Corner cell */}
                <th className="w-44 min-w-[11rem] px-4 py-4 text-left border-r border-slate-700 sticky left-0 top-0 bg-slate-900 z-40">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Criterion</span>
                </th>
                {problem.options.map((option, idx) => {
                  const filledCount = problem.criteria.filter(c => option.scores[c.id] !== undefined).length;
                  const isComplete = filledCount === problem.criteria.length;
                  return (
                    <th key={option.id} className="px-3 py-4 text-left border-r border-slate-700 last:border-r-0 sticky top-0 bg-slate-900 z-30">
                      <div className="flex items-start gap-2">
                        <span className={`w-6 h-6 shrink-0 flex items-center justify-center rounded-lg text-xs font-bold
                          ${isComplete ? 'bg-teal-400 text-white' : 'bg-primary-500 text-white'}`}>
                          {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm leading-tight truncate">{option.name}</p>
                          {option.description && (
                            <p className="text-xs text-slate-400 mt-0.5 leading-tight line-clamp-1">{option.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                          ${isComplete ? 'bg-teal-500/30 text-teal-300' : 'bg-white/10 text-slate-400'}`}>
                          {filledCount}/{problem.criteria.length} filled
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Row 2: AI Auto-Fill bars — one per laptop */}
              <tr className="bg-slate-800 border-b border-slate-700 sticky top-[72px] z-30">
                <td className="px-4 py-3 border-r border-slate-700 sticky left-0 bg-slate-800 z-40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-bold text-slate-300">AI Auto-Fill</span>
                  </div>
                </td>
                {problem.options.map((option) => {
                  const isLoading = aiLoading[option.id] || false;
                  const isSuccess = aiSuccess[option.id] || false;
                  const errorMsg = aiErrors[option.id] || '';
                  return (
                    <td key={option.id} className="px-3 py-3 border-r border-slate-700 last:border-r-0">
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={aiSearches[option.id] ?? option.name}
                            onChange={(e) => setAiSearches(prev => ({ ...prev, [option.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAiAutoFill(option.id, option.name)}
                            disabled={isLoading}
                            placeholder={option.name}
                            className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-slate-700 border border-slate-600
                              rounded-lg text-white placeholder:text-slate-500
                              focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                          />
                          <button
                            onClick={() => handleAiAutoFill(option.id, option.name)}
                            disabled={isLoading}
                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg
                              transition-all active:scale-95 disabled:opacity-40"
                            style={{
                              background: 'linear-gradient(135deg, #1e40af, #1d4ed8)',
                              color: 'white',
                            }}
                          >
                            {isLoading
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <Sparkles className="w-3 h-3" />}
                            {isLoading ? 'Filling…' : 'Fill'}
                          </button>
                        </div>
                        {isSuccess && (
                          <div className="flex items-center gap-1 text-[10px] text-teal-400">
                            <CheckCircle2 className="w-3 h-3" /> Filled by AI
                          </div>
                        )}
                        {errorMsg && (
                          <div className="text-[10px] text-rose-400 leading-tight">{errorMsg}</div>
                        )}
                        {showUrlInput[option.id] && (
                          <div className="flex gap-1">
                            <input
                              type="url"
                              value={urlInputs[option.id] || ''}
                              onChange={(e) => setUrlInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleUrlAutoFill(option.id)}
                              placeholder="Paste URL…"
                              disabled={urlLoading[option.id]}
                              className="flex-1 min-w-0 px-2 py-1 text-[10px] bg-slate-700 border border-slate-600
                                rounded-lg text-white placeholder:text-slate-500
                                focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                            <button
                              onClick={() => handleUrlAutoFill(option.id)}
                              disabled={urlLoading[option.id] || !urlInputs[option.id]?.trim()}
                              className="shrink-0 px-2 py-1 text-[10px] font-bold text-white rounded-lg
                                bg-slate-600 hover:bg-slate-500 disabled:opacity-40 transition-all"
                            >
                              {urlLoading[option.id] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Link2 className="w-2.5 h-2.5" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </thead>

            {/* ── Body: one row per criterion ── */}
            <tbody>
              {problem.criteria.map((criterion, rowIdx) => {
                const isCost = criterion.type === 'cost';
                const isEven = rowIdx % 2 === 0;
                return (
                  <tr key={criterion.id} className={`border-b border-slate-100 last:border-b-0 ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}>

                    {/* Criterion label cell — sticky */}
                    <td className={`px-4 py-3 border-r border-slate-100 sticky left-0 z-10 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isCost
                            ? <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            : <TrendingUp className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                          <span className="text-sm font-semibold text-slate-700 truncate">{criterion.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${weightBadge(criterion.weight)}`}>
                          {criterion.weight}%
                        </span>
                      </div>
                      {isCost && (
                        <p className="text-[10px] text-rose-400 mt-0.5 pl-5">lower is better</p>
                      )}
                    </td>

                    {/* One cell per laptop */}
                    {problem.options.map((option) => {
                      const score = option.scores[criterion.id];
                      const filled = score !== undefined;
                      return (
                        <td key={option.id}
                          className="px-3 py-3 border-r border-slate-100 last:border-r-0 align-top">
                          {renderInput(option.id, criterion.id, score)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Missing hint */}
      {completedScores < totalScores && (
        <p className="text-center text-sm text-slate-400 mb-5">
          <span className="font-semibold text-slate-600">{totalScores - completedScores}</span> spec{totalScores - completedScores > 1 ? 's' : ''} still empty — fill all to unlock analysis
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-500
            hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 px-7 py-3 text-white rounded-xl font-bold text-sm
            disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          style={{
            background: canProceed
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : '#94a3b8',
            boxShadow: canProceed ? '0 6px 20px rgba(59,130,246,0.4)' : 'none',
          }}
        >
          {canProceed ? 'Analyze & Get Results' : `Fill All Specs (${completionPercentage}%)`}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
