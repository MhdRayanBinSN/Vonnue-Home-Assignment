'use client';

import React from 'react';
import { Scale, TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react';
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
    // Reset all weights to equal distribution
    const equalWeight = Math.round(100 / problem.criteria.length);
    problem.criteria.forEach((c, index) => {
      // Last one gets the remainder to ensure total is 100
      const isLast = index === problem.criteria.length - 1;
      const weight = isLast ? 100 - (equalWeight * (problem.criteria.length - 1)) : equalWeight;
      updateCriterion({ ...c, weight });
    });
  };

  const getCriteriaDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      'Price': 'Total cost of the laptop (lower is better)',
      'Performance': 'CPU, GPU, and overall processing power',
      'Battery Life': 'Hours of usage on a single charge',
      'Display Quality': 'Resolution, color accuracy, brightness',
      'Build Quality': 'Materials, durability, keyboard/trackpad',
      'Portability': 'Weight and dimensions for carrying',
      'Storage': 'SSD capacity and speed',
    };
    return descriptions[name] || '';
  };

  const canProceed = problem.criteria.length >= 1;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Adjust Criteria Weights</h2>
        <p className="text-slate-600 mt-2">
          Fine-tune how important each factor is in your laptop decision.
          {selectedPreset && selectedPreset !== 'custom' && (
            <span className="block text-primary-600 mt-1">
              Weights pre-set for {selectedPreset.replace('-', ' ')} use case
            </span>
          )}
        </p>
      </div>

      {/* Info box about benefit/cost */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Weights Work</p>
            <p>
              Higher weights mean the criterion has more influence on the final recommendation.
              The system automatically normalizes weights to 100%.
            </p>
          </div>
        </div>
      </div>

      {/* Criteria weights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-700">
            Laptop Evaluation Criteria
          </h3>
          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${Math.abs(totalWeight - 100) < 1 ? 'text-green-600' : 'text-amber-600'}`}>
              Total: {totalWeight}%
            </span>
            {Math.abs(totalWeight - 100) > 1 && (
              <button
                onClick={normalizeWeights}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Normalize to 100%
              </button>
            )}
            <button
              onClick={resetToPresetWeights}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center"
              title="Reset to equal weights"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {problem.criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-3 ${
                      criterion.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {criterion.type === 'benefit' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {criterion.type === 'benefit' ? 'Higher = Better' : 'Lower = Better'}
                    </span>
                    <span className="font-semibold text-slate-800">{criterion.name}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{getCriteriaDescription(criterion.name)}</p>
                </div>
                <span className="text-lg font-bold text-primary-600 ml-4">{criterion.weight}%</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-400 w-8">0%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criterion.weight}
                  onChange={(e) => handleWeightChange(criterion.id, Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="text-xs text-slate-400 w-10">100%</span>
              </div>
              
              {/* Visual weight bar */}
              <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    criterion.type === 'benefit' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${criterion.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight distribution visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Weight Distribution</h3>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {problem.criteria.map((criterion, index) => {
            const colors = [
              'bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 
              'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500'
            ];
            return (
              <div
                key={criterion.id}
                className={`${colors[index % colors.length]} transition-all duration-300 flex items-center justify-center`}
                style={{ width: `${(criterion.weight / totalWeight) * 100}%` }}
                title={`${criterion.name}: ${criterion.weight}%`}
              >
                {criterion.weight >= 10 && (
                  <span className="text-white text-xs font-medium truncate px-1">
                    {criterion.name.split(' ')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {problem.criteria.map((criterion, index) => {
            const colors = [
              'bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 
              'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500'
            ];
            return (
              <span key={criterion.id} className="inline-flex items-center text-xs text-slate-600">
                <span className={`w-3 h-3 rounded-sm ${colors[index % colors.length]} mr-1`} />
                {criterion.name} ({criterion.weight}%)
              </span>
            );
          })}
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
        <p className="text-sm text-slate-500">
          ✓ Weights configured
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
