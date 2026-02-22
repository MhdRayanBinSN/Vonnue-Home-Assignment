'use client';

import React from 'react';
import { AppProvider, useApp } from '@/lib/context';
import { StepIndicator } from '@/components/StepIndicator';
import { OptionsStep } from '@/components/OptionsStep';
import { CriteriaStep } from '@/components/CriteriaStep';
import { ScoringStep } from '@/components/ScoringStep';
import { ResultsStep } from '@/components/ResultsStep';
import { createSampleProblem } from '@/lib/decision-engine';
import { Lightbulb, Play, Sparkles, Github, HelpCircle } from 'lucide-react';

function DecisionCompanion() {
  const { state, dispatch } = useApp();
  const { currentStep, problem } = state;

  const loadSampleProblem = () => {
    const sample = createSampleProblem();
    dispatch({ type: 'SET_PROBLEM', payload: sample });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <OptionsStep />;
      case 1:
        return <CriteriaStep />;
      case 2:
        return <ScoringStep />;
      case 3:
        return <ResultsStep />;
      default:
        return <OptionsStep />;
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
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Decision Companion</h1>
                <p className="text-xs text-slate-500">Make better decisions with data</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {problem.options.length === 0 && (
                <button
                  onClick={loadSampleProblem}
                  className="inline-flex items-center px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Load Example
                </button>
              )}
              <a
                href="https://github.com"
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
        {/* Decision Title */}
        {problem.options.length > 0 && (
          <div className="text-center mb-6">
            <input
              type="text"
              value={problem.title}
              onChange={(e) => dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })}
              className="text-2xl font-bold text-slate-800 bg-transparent border-none text-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-4 py-2"
              placeholder="Name your decision..."
            />
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator />

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
