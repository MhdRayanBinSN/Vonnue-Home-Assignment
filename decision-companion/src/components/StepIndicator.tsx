'use client';

import React, { useMemo } from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/context';

// All possible steps (step 0 is preset selection, handled separately)
const allSteps = [
  { id: 1, name: 'Add Laptops', description: 'Enter laptop options' },
  { id: 2, name: 'Weights', description: 'Adjust importance' },
  { id: 3, name: 'Scoring', description: 'Rate each laptop' },
  { id: 4, name: 'Results', description: 'See recommendation' },
];

export function StepIndicator() {
  const { state, goToStep } = useApp();
  const { currentStep, selectedPreset } = state;

  // Filter out Weights step if using a preset (not custom)
  const steps = useMemo(() => {
    if (selectedPreset && selectedPreset !== 'custom') {
      return allSteps.filter(s => s.id !== 2);
    }
    return allSteps;
  }, [selectedPreset]);

  const canNavigateTo = (stepId: number): boolean => {
    // Can always go back
    if (stepId < currentStep) return true;
    
    // Special handling when weights step is skipped
    const skipWeights = selectedPreset && selectedPreset !== 'custom';
    
    // Can go to next step only if current step is complete
    if (currentStep === 1 && state.problem.options.length >= 2) {
      // From Laptops, can go to Weights (2) or Scoring (3) depending on preset
      if (skipWeights && stepId === 3) return true;
      if (!skipWeights && stepId === 2) return true;
    }
    if (currentStep === 2 && state.problem.criteria.length >= 1 && stepId === 3) {
      return true;
    }
    if (currentStep === 3 && stepId === 4) {
      // Check if all scores are filled
      for (const option of state.problem.options) {
        for (const criterion of state.problem.criteria) {
          if (option.scores[criterion.id] === undefined) return false;
        }
      }
      return true;
    }
    
    return stepId <= currentStep;
  };

  // Determine if a step is completed - account for skipped weights step
  const isStepCompleted = (stepId: number): boolean => {
    const skipWeights = selectedPreset && selectedPreset !== 'custom';
    if (skipWeights && stepId === 1) {
      // Step 1 is complete if we're on step 3 or 4 (skipped step 2)
      return currentStep >= 3;
    }
    return currentStep > stepId;
  };

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.id);
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
                    <span className="text-sm font-medium">{index + 1}</span>
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
