'use client';

import React from 'react';
import {
  Laptop,
  Target,
  Code2,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Palette,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { USE_CASE_PRESETS } from '@/lib/laptop-presets';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Gamepad2,
  Briefcase,
  GraduationCap,
  Palette,
  Settings,
};

export function PresetSelector() {
  const { state, setPreset, loadSampleLaptops, nextStep, dispatch } = useApp();
  const { selectedPreset, problem } = state;
  const [budgetLimit, setBudgetLimit] = React.useState<string>('');
  const [showThresholds, setShowThresholds] = React.useState(false);
  const [thresholds, setThresholds] = React.useState<Record<string, string>>({});

  const handlePresetSelect = (presetId: string) => {
    setPreset(presetId);
  };

  const handleContinue = () => {
    // Save budget limit to problem state
    if (budgetLimit && !isNaN(Number(budgetLimit))) {
      dispatch({
        type: 'SET_BUDGET_LIMIT',
        payload: Number(budgetLimit),
      });
    }
    
    // Save thresholds
    Object.entries(thresholds).forEach(([criterionId, value]) => {
      if (value && !isNaN(Number(value))) {
        dispatch({
          type: 'SET_MIN_THRESHOLD',
          payload: { criterionId, value: Number(value) },
        });
      }
    });
    
    nextStep();
  };

  const handleLoadSamples = () => {
    loadSampleLaptops();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Laptop Selection Assistant</h2>
        <p className="text-slate-600 mt-2">
          Choose your primary use case to get optimized criteria weights
        </p>
      </div>

      {/* Use Case Presets */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          What will you primarily use this laptop for?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all hover:shadow-md
                ${selectedPreset === preset.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-slate-200 hover:border-primary-300'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                {(() => {
                  const IconComponent = iconMap[preset.icon];
                  return IconComponent ? (
                    <div className={`p-2 rounded-lg ${selectedPreset === preset.id ? 'bg-primary-200' : 'bg-slate-100'}`}>
                      <IconComponent className={`w-6 h-6 ${selectedPreset === preset.id ? 'text-primary-700' : 'text-slate-600'}`} />
                    </div>
                  ) : null;
                })()}
                <div>
                  <h4 className={`font-semibold ${selectedPreset === preset.id ? 'text-primary-700' : 'text-slate-700'}`}>
                    {preset.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">{preset.description}</p>
                </div>
              </div>
              {selectedPreset === preset.id && (
                <div className="mt-3 pt-3 border-t border-primary-200 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-primary-600 mr-2" />
                  <p className="text-xs text-primary-600 font-medium">Optimized weights applied</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Preview */}
      {selectedPreset && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-4">Criteria Weights Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {problem.criteria.map((criterion) => (
              <div key={criterion.id} className="bg-slate-50 rounded-lg p-3">
                <div className="text-sm text-slate-600">{criterion.name}</div>
                <div className="flex items-center mt-1">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${criterion.weight}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-semibold text-slate-700">{criterion.weight}%</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {criterion.type === 'cost' ? '(Lower is better)' : '(Higher is better)'}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            * You can adjust these weights in the Criteria step
          </p>
        </div>
      )}

      {/* Budget Filter (Optional) */}
      {selectedPreset && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Set Your Budget (Optional)
          </h3>
          <p className="text-sm text-amber-700 mb-4">
            Laptops exceeding this budget will be automatically filtered out before analysis.
          </p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="e.g., 100000"
                  min="20000"
                  max="500000"
                  step="5000"
                  className="w-full pl-8 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            {budgetLimit && !isNaN(Number(budgetLimit)) && (
              <div className="text-sm text-amber-700 font-medium">
                Max: ₹{Number(budgetLimit).toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <p className="text-xs text-amber-600 mt-3">
            💡 Tip: Setting a budget improves accuracy by removing unrealistic options from comparison.
          </p>
        </div>
      )}

      {/* Minimum Thresholds (Optional) */}
      {selectedPreset && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-800 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Set Deal-Breakers (Optional)
            </h3>
            <button
              onClick={() => setShowThresholds(!showThresholds)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {showThresholds ? 'Hide' : 'Show'}
              <svg className={`w-4 h-4 ml-1 transition-transform ${showThresholds ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-blue-700 mb-4">
            Set minimum acceptable values. Laptops not meeting these will be filtered out.
          </p>
          
          {showThresholds && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* RAM Threshold */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Minimum RAM (GB)
                </label>
                <input
                  type="number"
                  value={thresholds['ram'] || ''}
                  onChange={(e) => setThresholds({ ...thresholds, ram: e.target.value })}
                  placeholder="e.g., 16"
                  min="4"
                  max="64"
                  step="4"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Battery Threshold */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Minimum Battery (hours)
                </label>
                <input
                  type="number"
                  value={thresholds['battery'] || ''}
                  onChange={(e) => setThresholds({ ...thresholds, battery: e.target.value })}
                  placeholder="e.g., 8"
                  min="1"
                  max="24"
                  step="1"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* SSD Threshold */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Minimum SSD (GB)
                </label>
                <input
                  type="number"
                  value={thresholds['ssd'] || ''}
                  onChange={(e) => setThresholds({ ...thresholds, ssd: e.target.value })}
                  placeholder="e.g., 512"
                  min="128"
                  max="2000"
                  step="128"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Weight Threshold (max) */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Maximum Weight (kg)
                </label>
                <input
                  type="number"
                  value={thresholds['weight'] || ''}
                  onChange={(e) => setThresholds({ ...thresholds, weight: e.target.value })}
                  placeholder="e.g., 2.0"
                  min="0.5"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          
          <p className="text-xs text-blue-600 mt-3">
            💡 Example: "Must have at least 16GB RAM" or "Battery must be at least 8 hours"
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3">Quick Start Options</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLoadSamples}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Laptop className="w-4 h-4 mr-2" />
            Load Sample Laptops (5 options)
          </button>
          <p className="text-sm text-blue-700 flex items-center">
            or add your own laptops manually in the next step
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedPreset}
          className={`
            inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${selectedPreset
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          Continue to Add Laptops
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
