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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Laptop Selection Assistant</h1>
                <p className="text-xs text-slate-500">Find the perfect laptop for your needs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {selectedPreset && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {selectedPreset.charAt(0).toUpperCase() + selectedPreset.slice(1).replace('-', ' ')}
                </span>
              )}
              <a
                href="https://github.com/MhdRayanBinSN/Vonnue-Home-Assignment"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Decision Title - only show after preset selection */}
        {currentStep > 0 && (
          <div className="text-center mb-6">
            <input
              type="text"
              value={problem.title}
              onChange={(e) => dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })}
              className="text-2xl font-bold text-slate-800 bg-transparent border-none text-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-4 py-2"
              placeholder="Name your comparison..."
            />
          </div>
        )}

        {/* Step Indicator - only show after preset selection */}
        {currentStep > 0 && <StepIndicator />}

        {/* Current Step Content */}
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
          {renderCurrentStep()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-slate-500">
              <Lightbulb className="w-4 h-4 mr-2" />
              <span>
                Built with <strong>Weighted Sum Model (WSM)</strong> - Multi-Criteria Decision Making
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <a href="#" className="hover:text-primary-600 transition-colors flex items-center">
                <HelpCircle className="w-4 h-4 mr-1" />
                How it works
              </a>
              <span>•</span>
              <span>Decision Companion System v1.0</span>
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
