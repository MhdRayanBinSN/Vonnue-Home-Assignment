'use client';

import React, { useMemo } from 'react';
import { ClipboardList, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '@/lib/context';

export function ScoringStep() {
  const { state, updateScore, nextStep, prevStep } = useApp();
  const { problem } = state;

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

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Rate Your Laptops</h2>
        <p className="text-slate-600 mt-2">
          Score each laptop against every criterion. Use a scale of 1-10 or enter actual values.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Scoring Progress</span>
          <span className="text-sm text-slate-600">{completedScores} / {totalScores} scores</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 progress-bar"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Scoring Tips</p>
            <ul className="list-disc list-inside space-y-1">
              <li>For <strong>Benefit criteria</strong> (higher is better): Higher scores = Better option</li>
              <li>For <strong>Cost criteria</strong> (lower is better): Enter actual values (e.g., price in ₹)</li>
              <li>Be consistent with your scoring scale across all options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scoring matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 sticky left-0 bg-slate-50">
                  Laptops
                </th>
                {problem.criteria.map((criterion) => (
                  <th 
                    key={criterion.id}
                    className="px-4 py-4 text-center min-w-35"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-slate-700">{criterion.name}</span>
                      <span className={`inline-flex items-center text-xs mt-1 ${
                        criterion.type === 'benefit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {criterion.type === 'benefit' ? (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Higher is better
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Lower is better
                          </>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">({criterion.weight}% weight)</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problem.options.map((option, optionIndex) => (
                <tr 
                  key={option.id}
                  className={`border-b border-slate-100 ${optionIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <td className="px-6 py-4 sticky left-0 bg-inherit">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-sm font-medium mr-3">
                        {optionIndex + 1}
                      </span>
                      <div>
                        <span className="font-medium text-slate-800">{option.name}</span>
                        {option.description && (
                          <p className="text-xs text-slate-500 mt-0.5 max-w-50 truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  {problem.criteria.map((criterion) => {
                    const currentScore = option.scores[criterion.id];
                    const hasScore = currentScore !== undefined;
                    
                    return (
                      <td key={criterion.id} className="px-4 py-4 text-center">
                        <div className="relative">
                          <input
                            type="number"
                            value={hasScore ? currentScore : ''}
                            onChange={(e) => handleScoreChange(option.id, criterion.id, e.target.value)}
                            placeholder={criterion.type === 'cost' ? 'Value' : '1-10'}
                            className={`
                              w-full max-w-25 mx-auto px-3 py-2 text-center border rounded-lg
                              focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all
                              ${hasScore 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-slate-300 bg-white'
                              }
                            `}
                            step="any"
                          />
                          {hasScore && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick fill suggestions */}
      {completedScores < totalScores && (
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500 mb-2">
            Missing {totalScores - completedScores} score{totalScores - completedScores > 1 ? 's' : ''} - 
            fill all scores to see results
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
          {canProceed ? 'Analyze & Get Results' : `Complete All Scores (${completionPercentage}%)`}
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
