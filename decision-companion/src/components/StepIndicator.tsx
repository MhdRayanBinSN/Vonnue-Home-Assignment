'use client';

import React from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/context';

const steps = [
  { id: 0, name: 'Options', description: 'Add your choices' },
  { id: 1, name: 'Criteria', description: 'Define what matters' },
  { id: 2, name: 'Scoring', description: 'Rate each option' },
  { id: 3, name: 'Results', description: 'See recommendations' },
];

export function StepIndicator() {
  const { state, goToStep } = useApp();
  const { currentStep } = state;

  const canNavigateTo = (stepId: number): boolean => {
    // Can always go back
    if (stepId < currentStep) return true;
    
    // Can go to next step only if current step is complete
    if (stepId === currentStep + 1) {
      if (currentStep === 0) return state.problem.options.length >= 2;
      if (currentStep === 1) return state.problem.criteria.length >= 1;
      if (currentStep === 2) {
        // Check if all scores are filled
        for (const option of state.problem.options) {
          for (const criterion of state.problem.criteria) {
            if (option.scores[criterion.id] === undefined) return false;
          }
        }
        return true;
      }
    }
    
    return stepId <= currentStep;
  };

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const canNavigate = canNavigateTo(step.id);

          return (
            <li key={step.id} className="flex items-center">
              <button
                onClick={() => canNavigate && goToStep(step.id)}
                disabled={!canNavigate}
                className={`
                  flex items-center group transition-all duration-200
                  ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${isCompleted 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : isCurrent 
                        ? 'border-primary-600 bg-primary-50 text-primary-600' 
                        : 'border-slate-300 bg-white text-slate-400'
                    }
                    ${canNavigate && !isCurrent ? 'group-hover:border-primary-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id + 1}</span>
                  )}
                </span>
                <span className="ml-3 hidden sm:block">
                  <span
                    className={`
                      text-sm font-medium block
                      ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}
                    `}
                  >
                    {step.name}
                  </span>
                  <span className="text-xs text-slate-500">{step.description}</span>
                </span>
              </button>
              {index < steps.length - 1 && (
                <ArrowRight className={`w-5 h-5 mx-4 ${index < currentStep ? 'text-primary-600' : 'text-slate-300'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
