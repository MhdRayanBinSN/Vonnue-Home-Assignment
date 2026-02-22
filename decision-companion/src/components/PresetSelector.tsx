'use client';

import React from 'react';
import { Laptop, Target } from 'lucide-react';
import { useApp } from '@/lib/context';
import { USE_CASE_PRESETS } from '@/lib/laptop-presets';

export function PresetSelector() {
  const { state, setPreset, loadSampleLaptops, nextStep } = useApp();
  const { selectedPreset, problem } = state;

  const handlePresetSelect = (presetId: string) => {
    setPreset(presetId);
  };

  const handleContinue = () => {
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
                <span className="text-2xl">{preset.icon}</span>
                <div>
                  <h4 className={`font-semibold ${selectedPreset === preset.id ? 'text-primary-700' : 'text-slate-700'}`}>
                    {preset.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">{preset.description}</p>
                </div>
              </div>
              {selectedPreset === preset.id && (
                <div className="mt-3 pt-3 border-t border-primary-200">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
