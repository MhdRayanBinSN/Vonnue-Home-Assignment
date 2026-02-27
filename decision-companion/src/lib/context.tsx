'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  DecisionProblem, 
  Option, 
  Criterion, 
  DecisionResult,
  DecisionMethod,
} from './types';
import { generateId, createEmptyProblem } from './decision-engine';
import { LAPTOP_CRITERIA, USE_CASE_PRESETS, SAMPLE_LAPTOPS, applyPreset } from './laptop-presets';

/**
 * Application State
 */
interface AppState {
  problem: DecisionProblem;
  result: DecisionResult | null;
  selectedMethod: DecisionMethod;
  selectedPreset: string | null;
  currentStep: number; // 0: Options, 1: Criteria, 2: Scoring, 3: Results
  isAnalyzing: boolean;
  error: string | null;
}

/**
 * Action Types
 */
type AppAction =
  | { type: 'SET_PROBLEM'; payload: DecisionProblem }
  | { type: 'UPDATE_TITLE'; payload: string }
  | { type: 'UPDATE_DESCRIPTION'; payload: string }
  | { type: 'ADD_OPTION'; payload: Option }
  | { type: 'UPDATE_OPTION'; payload: Option }
  | { type: 'DELETE_OPTION'; payload: string }
  | { type: 'ADD_CRITERION'; payload: Criterion }
  | { type: 'UPDATE_CRITERION'; payload: Criterion }
  | { type: 'DELETE_CRITERION'; payload: string }
  | { type: 'SET_CRITERIA'; payload: Criterion[] }
  | { type: 'UPDATE_SCORE'; payload: { optionId: string; criterionId: string; score: number } }
  | { type: 'SET_METHOD'; payload: DecisionMethod }
  | { type: 'SET_PRESET'; payload: string }
  | { type: 'LOAD_SAMPLE_LAPTOPS' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_RESULT'; payload: DecisionResult }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BUDGET_LIMIT'; payload: number | undefined }
  | { type: 'SET_MIN_THRESHOLD'; payload: { criterionId: string; value: number | undefined } }
  | { type: 'RESET' };

/**
 * Create initial problem with laptop criteria
 */
function createLaptopProblem(): DecisionProblem {
  return {
    id: generateId(),
    title: 'Laptop Comparison',
    description: 'Choose the best laptop based on your needs',
    options: [],
    criteria: [...LAPTOP_CRITERIA],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Initial State
 */
const initialState: AppState = {
  problem: createLaptopProblem(),
  result: null,
  selectedMethod: 'wsm',
  selectedPreset: null,
  currentStep: 0,
  isAnalyzing: false,
  error: null,
};

/**
 * Reducer
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROBLEM':
      return { ...state, problem: action.payload, result: null };

    case 'UPDATE_TITLE':
      return {
        ...state,
        problem: { ...state.problem, title: action.payload, updatedAt: new Date() },
      };

    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        problem: { ...state.problem, description: action.payload, updatedAt: new Date() },
      };

    case 'ADD_OPTION':
      return {
        ...state,
        problem: {
          ...state.problem,
          options: [...state.problem.options, action.payload],
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'UPDATE_OPTION':
      return {
        ...state,
        problem: {
          ...state.problem,
          options: state.problem.options.map(o =>
            o.id === action.payload.id ? action.payload : o
          ),
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'DELETE_OPTION':
      return {
        ...state,
        problem: {
          ...state.problem,
          options: state.problem.options.filter(o => o.id !== action.payload),
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'ADD_CRITERION':
      return {
        ...state,
        problem: {
          ...state.problem,
          criteria: [...state.problem.criteria, action.payload],
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'UPDATE_CRITERION':
      return {
        ...state,
        problem: {
          ...state.problem,
          criteria: state.problem.criteria.map(c =>
            c.id === action.payload.id ? action.payload : c
          ),
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'DELETE_CRITERION':
      return {
        ...state,
        problem: {
          ...state.problem,
          criteria: state.problem.criteria.filter(c => c.id !== action.payload),
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'UPDATE_SCORE':
      return {
        ...state,
        problem: {
          ...state.problem,
          options: state.problem.options.map(o =>
            o.id === action.payload.optionId
              ? {
                  ...o,
                  scores: { ...o.scores, [action.payload.criterionId]: action.payload.score },
                }
              : o
          ),
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'SET_METHOD':
      return { ...state, selectedMethod: action.payload, result: null };

    case 'SET_PRESET': {
      const newCriteria = applyPreset(action.payload);
      return {
        ...state,
        selectedPreset: action.payload,
        problem: {
          ...state.problem,
          criteria: newCriteria,
          updatedAt: new Date(),
        },
        result: null,
      };
    }

    case 'SET_CRITERIA':
      return {
        ...state,
        problem: {
          ...state.problem,
          criteria: action.payload,
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'LOAD_SAMPLE_LAPTOPS': {
      const sampleOptions: Option[] = SAMPLE_LAPTOPS.map(laptop => ({
        id: generateId(),
        name: laptop.name,
        description: laptop.description,
        scores: { ...laptop.scores },
      }));
      return {
        ...state,
        problem: {
          ...state.problem,
          options: sampleOptions,
          updatedAt: new Date(),
        },
        result: null,
      };
    }

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_RESULT':
      return { ...state, result: action.payload };

    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_BUDGET_LIMIT':
      return {
        ...state,
        problem: {
          ...state.problem,
          budgetLimit: action.payload,
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'SET_MIN_THRESHOLD':
      const newThresholds = { ...state.problem.minThresholds };
      if (action.payload.value === undefined) {
        delete newThresholds[action.payload.criterionId];
      } else {
        newThresholds[action.payload.criterionId] = action.payload.value;
      }
      return {
        ...state,
        problem: {
          ...state.problem,
          minThresholds: Object.keys(newThresholds).length > 0 ? newThresholds : undefined,
          updatedAt: new Date(),
        },
        result: null,
      };

    case 'RESET':
      return { ...initialState, problem: createLaptopProblem() };

    default:
      return state;
  }
}

/**
 * Context
 */
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addOption: (name: string, description?: string) => void;
  updateOption: (option: Option) => void;
  deleteOption: (id: string) => void;
  addCriterion: (name: string, weight: number, type: 'benefit' | 'cost') => void;
  updateCriterion: (criterion: Criterion) => void;
  deleteCriterion: (id: string) => void;
  updateScore: (optionId: string, criterionId: string, score: number) => void;
  setPreset: (presetId: string) => void;
  loadSampleLaptops: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Provider Component
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addOption = (name: string, description?: string) => {
    const newOption: Option = {
      id: generateId(),
      name,
      description,
      scores: {},
    };
    dispatch({ type: 'ADD_OPTION', payload: newOption });
  };

  const updateOption = (option: Option) => {
    dispatch({ type: 'UPDATE_OPTION', payload: option });
  };

  const deleteOption = (id: string) => {
    dispatch({ type: 'DELETE_OPTION', payload: id });
  };

  const addCriterion = (name: string, weight: number, type: 'benefit' | 'cost') => {
    const newCriterion: Criterion = {
      id: generateId(),
      name,
      weight,
      type,
    };
    dispatch({ type: 'ADD_CRITERION', payload: newCriterion });
  };

  const updateCriterion = (criterion: Criterion) => {
    dispatch({ type: 'UPDATE_CRITERION', payload: criterion });
  };

  const deleteCriterion = (id: string) => {
    dispatch({ type: 'DELETE_CRITERION', payload: id });
  };

  const updateScore = (optionId: string, criterionId: string, score: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { optionId, criterionId, score } });
  };

  const setPreset = (presetId: string) => {
    dispatch({ type: 'SET_PRESET', payload: presetId });
  };

  const loadSampleLaptops = () => {
    dispatch({ type: 'LOAD_SAMPLE_LAPTOPS' });
  };

  const nextStep = () => {
    if (state.currentStep < 4) {
      let next = state.currentStep + 1;
      // Skip Weights step (2) if preset is not 'custom'
      if (next === 2 && state.selectedPreset && state.selectedPreset !== 'custom') {
        next = 3;
      }
      dispatch({ type: 'SET_STEP', payload: next });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      let prev = state.currentStep - 1;
      // Skip Weights step (2) if preset is not 'custom'
      if (prev === 2 && state.selectedPreset && state.selectedPreset !== 'custom') {
        prev = 1;
      }
      dispatch({ type: 'SET_STEP', payload: prev });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 4) {
      // Block going to Weights step (2) if preset is not 'custom'
      if (step === 2 && state.selectedPreset && state.selectedPreset !== 'custom') {
        return;
      }
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addOption,
        updateOption,
        deleteOption,
        addCriterion,
        updateCriterion,
        deleteCriterion,
        updateScore,
        setPreset,
        loadSampleLaptops,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to use the app context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
