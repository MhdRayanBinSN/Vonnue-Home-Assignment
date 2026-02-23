'use client';

import React from 'react';
import { Scale, TrendingUp, TrendingDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/context';

export function CriteriaStep() {
  const { state, updateCriterion, nextStep, prevStep } = useApp();
  const { problem, selectedPreset } = state;

  const totalWeight = problem.criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleWeightChange = (id: string, newWeight: number) => {
    const criterion = problem.criteria.find(c => c.id === id);
    if (criterion) {
      updateCriterion({ ...criterion, weight: newWeight });
    }
  };

  const normalizeWeights = () => {
    const total = problem.criteria.reduce((s, c) => s + c.weight, 0);
    if (total > 0) {
      problem.criteria.forEach(c => {
        const normalizedWeight = Math.round((c.weight / total) * 100);
        updateCriterion({ ...c, weight: normalizedWeight });
      });
    }
  };

  const resetToPresetWeights = () => {
    const equalWeight = Math.round(100 / problem.criteria.length);
    problem.criteria.forEach((c, index) => {
      const isLast = index === problem.criteria.length - 1;
      const weight = isLast ? 100 - (equalWeight * (problem.criteria.length - 1)) : equalWeight;
      updateCriterion({ ...c, weight });
    });
  };

  const canProceed = problem.criteria.length >= 1;
  const colors = ['bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500'];

  return (
    <div className="animate-fade-in">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Scale className="w-6 h-6 text-primary-600 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Adjust Weights</h2>
            {selectedPreset && selectedPreset !== 'custom' && (
              <p className="text-sm text-primary-600">Pre-set for {selectedPreset.replace('-', ' ')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium px-2 py-1 rounded ${Math.abs(totalWeight - 100) < 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            Total: {totalWeight}%
          </span>
          {Math.abs(totalWeight - 100) > 1 && (
            <button onClick={normalizeWeights} className="text-xs text-primary-600 hover:underline">
              Normalize
            </button>
          )}
          <button onClick={resetToPresetWeights} className="text-slate-400 hover:text-slate-600" title="Reset">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Criteria Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Criterion</th>
              <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3 w-24">Type</th>
              <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Weight</th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3 w-16">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {problem.criteria.map((criterion, index) => (
              <tr key={criterion.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${colors[index % colors.length]} mr-3`} />
                    <span className="font-medium text-slate-700">{criterion.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    criterion.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {criterion.type === 'benefit' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={criterion.weight}
                    onChange={(e) => handleWeightChange(criterion.id, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold text-primary-600">{criterion.weight}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weight Distribution Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex h-6 rounded-lg overflow-hidden">
          {problem.criteria.map((criterion, index) => (
            <div
              key={criterion.id}
              className={`${colors[index % colors.length]} transition-all duration-300 flex items-center justify-center`}
              style={{ width: `${(criterion.weight / Math.max(totalWeight, 1)) * 100}%` }}
              title={`${criterion.name}: ${criterion.weight}%`}
            >
              {criterion.weight >= 12 && (
                <span className="text-white text-xs font-medium truncate px-1">
                  {criterion.name.split(' ')[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <p className="text-sm text-slate-500 flex items-center">
          <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Weights configured
        </p>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Score Laptops
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
