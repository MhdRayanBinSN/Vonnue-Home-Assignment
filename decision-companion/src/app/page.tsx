'use client';

import React from 'react';
import { AppProvider, useApp } from '@/lib/context';
import { StepIndicator } from '@/components/StepIndicator';
import { PresetSelector } from '@/components/PresetSelector';
import { OptionsStep } from '@/components/OptionsStep';
import { CriteriaStep } from '@/components/CriteriaStep';
import { ScoringStep } from '@/components/ScoringStep';
import { ResultsStep } from '@/components/ResultsStep';
import { Lightbulb, Sparkles, Github, HelpCircle, Laptop } from 'lucide-react';

function DecisionCompanion() {
  const { state, dispatch } = useApp();
  const { currentStep, problem, selectedPreset } = state;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <PresetSelector />;
      case 1:
        return <OptionsStep />;
      case 2:
        return <CriteriaStep />;
      case 3:
        return <ScoringStep />;
      case 4:
        return <ResultsStep />;
      default:
        return <PresetSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <Laptop className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Decision Companion System
                </h1>
                <p className="text-xs text-slate-600">Multi-Criteria Decision Analysis for Laptop Selection</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              {selectedPreset && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold shadow-sm">
                  {selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1).replace('-', ' ')}
                </span>
              )}
              <a
                href="https://github.com/MhdRayanBinSN/Vonnue-Home-Assignment"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="View on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Decision Title - only show after preset selection */}
        {currentStep > 0 && (
          <div className="text-center mb-6">
            <input
              type="text"
              value={problem.title}
              onChange={(e) => dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })}
              className="text-xl font-bold text-slate-800 bg-white/50 backdrop-blur-sm border-2 border-transparent hover:border-blue-200 focus:border-blue-400 text-center focus:outline-none rounded-lg px-4 py-2 transition-all duration-200 shadow-sm"
              placeholder="Name your comparison..."
            />
          </div>
        )}

        {/* Step Indicator - only show after preset selection */}
        {currentStep > 0 && <StepIndicator />}

        {/* Current Step Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 md:p-6 shadow-lg shadow-slate-200/50 border border-white/50">
          {renderCurrentStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/80 backdrop-blur-md mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center text-xs text-slate-600">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              <span>
                Powered by <strong className="text-blue-600">WSM + TOPSIS</strong> algorithms with dual validation
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600">
              <a href="/flowchart" className="hover:text-blue-600 transition-colors flex items-center font-medium">
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                How it works
              </a>
              <span className="text-slate-300">•</span>
              <span className="font-medium">Decision Companion System v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DecisionCompanion />
    </AppProvider>
  );
}
