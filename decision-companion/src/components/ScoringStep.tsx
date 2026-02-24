'use client';

import React, { useMemo, useState } from 'react';
import { ClipboardList, TrendingUp, TrendingDown, CheckCircle2, Sparkles, Loader2, Link2 } from 'lucide-react';
import { useApp } from '@/lib/context';
import { CRITERION_INPUTS } from '@/lib/laptop-presets';

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

  const renderInput = (optionId: string, criterionId: string, currentScore: number | undefined) => {
    const inputConfig = CRITERION_INPUTS[criterionId];
    const hasScore = currentScore !== undefined;

    if (inputConfig?.type === 'select' && inputConfig.options) {
      return (
        <div className="relative">
          <select
            value={hasScore ? currentScore : ''}
            onChange={(e) => handleScoreChange(optionId, criterionId, e.target.value)}
            className={`
              w-full max-w-44 mx-auto px-2 py-2 text-sm border rounded-lg
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all
              appearance-none bg-no-repeat bg-right pr-8 cursor-pointer
              ${hasScore
                ? 'border-green-300 bg-green-50 text-slate-800'
                : 'border-slate-300 bg-white text-slate-500'
              }
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="" disabled>Select...</option>
            {inputConfig.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasScore && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
      );
    }

    // Number input with unit
    const unit = inputConfig?.unit || '';
    return (
      <div className="relative">
        <div className="flex items-center gap-1 justify-center">
          {unit && criterionId === 'price' && (
            <span className="text-xs text-slate-500 font-medium">{unit}</span>
          )}
          <input
            type="number"
            value={hasScore ? currentScore : ''}
            onChange={(e) => handleScoreChange(optionId, criterionId, e.target.value)}
            placeholder={inputConfig?.placeholder || 'Value'}
            min={inputConfig?.min}
            max={inputConfig?.max}
            step={inputConfig?.step || 'any'}
            className={`
              w-full max-w-28 px-3 py-2 text-center text-sm border rounded-lg
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all
              ${hasScore
                ? 'border-green-300 bg-green-50'
                : 'border-slate-300 bg-white'
              }
            `}
          />
          {unit && criterionId !== 'price' && (
            <span className="text-xs text-slate-500 font-medium">{unit}</span>
          )}
        </div>
        {hasScore && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Enter Laptop Specs</h2>
        <p className="text-slate-600 mt-2">
          Fill in specifications manually, or use <span className="font-semibold text-primary-600">AI Auto-Fill</span> to look up specs instantly.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Scoring Progress</span>
          <span className="text-sm text-slate-600">{completedScores} / {totalScores} specs filled</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 progress-bar"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Info box */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-sm text-violet-800">
            <p className="font-medium mb-1">AI Auto-Fill Available ✨</p>
            <p>Type a laptop model name (e.g., &quot;ASUS ROG Strix G16 2024&quot;) and click the <strong>Auto-Fill</strong> button. AI will look up all specs automatically!</p>
          </div>
        </div>
      </div>

      {/* Scoring matrix — one card per laptop */}
      <div className="space-y-6 mb-6">
        {problem.options.map((option, optionIndex) => {
          const filledCount = problem.criteria.filter(c => option.scores[c.id] !== undefined).length;
          const isComplete = filledCount === problem.criteria.length;
          const isLoading = aiLoading[option.id] || false;
          const errorMsg = aiErrors[option.id] || '';
          const isSuccess = aiSuccess[option.id] || false;

          return (
            <div
              key={option.id}
              className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${isComplete ? 'border-green-300' : 'border-slate-200'
                }`}
            >
              {/* Laptop header */}
              <div className={`px-6 py-4 flex items-center justify-between ${isComplete ? 'bg-green-50' : 'bg-slate-50'
                } border-b border-slate-200`}>
                <div className="flex items-center">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-3 ${isComplete ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-700'
                    }`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : optionIndex + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-800">{option.name}</h3>
                    {option.description && (
                      <p className="text-xs text-slate-500">{option.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-500">
                  {filledCount}/{problem.criteria.length} filled
                </span>
              </div>

              {/* AI Auto-Fill bar */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                    <input
                      type="text"
                      value={aiSearches[option.id] || option.name}
                      onChange={(e) => setAiSearches(prev => ({ ...prev, [option.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiAutoFill(option.id, option.name)}
                      placeholder="Type laptop model to auto-fill..."
                      disabled={isLoading}
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-violet-200 rounded-lg bg-violet-50/50 
                        focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white
                        placeholder:text-violet-300 transition-all disabled:opacity-60"
                    />
                  </div>
                  <button
                    onClick={() => handleAiAutoFill(option.id, option.name)}
                    disabled={isLoading || !getSearchQuery(option.id, option.name)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                      bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg
                      hover:from-violet-600 hover:to-purple-700 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Looking up...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Auto-Fill
                      </>
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {isSuccess && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    Specs filled by AI! Review and adjust if needed.
                  </div>
                )}
                {errorMsg && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* URL fallback input */}
                {showUrlInput[option.id] && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-2">
                      📎 Can&apos;t find it? Paste the product URL from Amazon, Flipkart, or the manufacturer&apos;s website:
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                        <input
                          type="url"
                          value={urlInputs[option.id] || ''}
                          onChange={(e) => setUrlInputs(prev => ({ ...prev, [option.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleUrlAutoFill(option.id)}
                          placeholder="https://www.amazon.in/dp/... or https://www.flipkart.com/..."
                          disabled={urlLoading[option.id]}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-blue-200 rounded-lg bg-white
                            focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                            placeholder:text-blue-300 transition-all disabled:opacity-60"
                        />
                      </div>
                      <button
                        onClick={() => handleUrlAutoFill(option.id)}
                        disabled={urlLoading[option.id] || !urlInputs[option.id]?.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                          bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg
                          hover:from-blue-600 hover:to-cyan-700
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all shadow-sm hover:shadow-md"
                      >
                        {urlLoading[option.id] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Link2 className="w-4 h-4" />
                            Extract Specs
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Specs grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {problem.criteria.map((criterion) => {
                    const currentScore = option.scores[criterion.id];

                    return (
                      <div key={criterion.id} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-sm font-medium text-slate-700 flex items-center">
                            {criterion.name}
                            {criterion.type === 'cost' ? (
                              <TrendingDown className="w-3 h-3 text-red-500 ml-1" />
                            ) : (
                              <TrendingUp className="w-3 h-3 text-green-500 ml-1" />
                            )}
                          </label>
                          <span className="text-xs text-slate-400">{criterion.weight}%</span>
                        </div>
                        {renderInput(option.id, criterion.id, currentScore)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick fill suggestions */}
      {completedScores < totalScores && (
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 mb-2">
            Missing {totalScores - completedScores} spec{totalScores - completedScores > 1 ? 's' : ''} —
            fill all specs to see results
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {canProceed ? 'Analyze & Get Results' : `Complete All Specs (${completionPercentage}%)`}
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
