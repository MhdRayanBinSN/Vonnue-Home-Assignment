'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Laptop, ChevronLeft, ChevronDown, ChevronUp, Settings, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/context';
import { Option } from '@/lib/types';

export function OptionsStep() {
  const { state, addOption, updateOption, deleteOption, nextStep, prevStep, loadSampleLaptops, updateCriterion, goToStep } = useApp();
  const { problem, selectedPreset } = state;

  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionDesc, setNewOptionDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showWeights, setShowWeights] = useState(false);

  const handleAddOption = () => {
    if (newOptionName.trim()) {
      addOption(newOptionName.trim(), newOptionDesc.trim() || undefined);
      setNewOptionName('');
      setNewOptionDesc('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddOption();
    }
  };

  const startEditing = (option: Option) => {
    setEditingId(option.id);
    setEditName(option.name);
    setEditDesc(option.description || '');
  };

  const saveEdit = (id: string) => {
    const option = problem.options.find(o => o.id === id);
    if (option && editName.trim()) {
      updateOption({
        ...option,
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const canProceed = problem.options.length >= 2;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Add Laptops to Compare</h2>
        <p className="text-slate-600 mt-2">
          Add at least 2 laptops you're considering. Include model names and key specs if helpful.
        </p>
      </div>

      {/* Quick action - load sample laptops */}
      {problem.options.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-medium">Quick Start</p>
            <p className="text-amber-700 text-sm">Load 5 sample laptops to see how the comparison works</p>
          </div>
          <button
            onClick={loadSampleLaptops}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
          >
            Load Samples
          </button>
        </div>
      )}

      {/* Add new option form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Add a Laptop</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="optionName" className="block text-sm font-medium text-slate-700 mb-1">
              Laptop Name *
            </label>
            <input
              id="optionName"
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., MacBook Pro 14, Dell XPS 15, ThinkPad X1..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="optionDesc" className="block text-sm font-medium text-slate-700 mb-1">
              Key Specs (optional)
            </label>
            <textarea
              id="optionDesc"
              value={newOptionDesc}
              onChange={(e) => setNewOptionDesc(e.target.value)}
              placeholder="e.g., M3 Pro, 18GB RAM, 512GB SSD, 14&quot; display..."
              rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
            />
          </div>
          <button
            onClick={handleAddOption}
            disabled={!newOptionName.trim()}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Laptop
          </button>
        </div>
      </div>

      {/* Options list */}
      {problem.options.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-4">
            Your Laptops ({problem.options.length})
          </h3>
          <div className="space-y-3">
            {problem.options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 card-hover"
              >
                {editingId === option.id ? (
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Key specs (optional)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-medium text-slate-800">{option.name}</span>
                        {option.description && (
                          <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {editingId === option.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(option.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(option)}
                        className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOption(option.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weights preview/customize (for preset users) */}
      {selectedPreset && selectedPreset !== 'custom' && problem.options.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <button
            onClick={() => setShowWeights(!showWeights)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-slate-500 mr-3" />
              <div className="text-left">
                <span className="font-medium text-slate-700">Current Weights</span>
                <span className="text-sm text-slate-500 ml-2">
                  ({selectedPreset.replace('-', ' ')} preset)
                </span>
              </div>
            </div>
            {showWeights ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {showWeights && (
            <div className="px-4 pb-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mt-3 mb-4">
                Fine-tune weights if needed. These are optimized for {selectedPreset.replace('-', ' ')} use.
              </p>
              <div className="space-y-3">
                {problem.criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center space-x-3">
                    <span className="text-sm text-slate-600 w-28 truncate">{criterion.name}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={criterion.weight}
                      onChange={(e) => updateCriterion({ ...criterion, weight: Number(e.target.value) })}
                      className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <span className="text-sm font-medium text-slate-700 w-10">{criterion.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress indicator and navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Change Preset
        </button>
        <p className="text-sm text-slate-500 flex items-center">
          {problem.options.length < 2
            ? `Add ${2 - problem.options.length} more laptop${2 - problem.options.length > 1 ? 's' : ''} to continue`
            : <><CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Ready to proceed</>}
        </p>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.selectedPreset && state.selectedPreset !== 'custom' ? 'Score Laptops' : 'Adjust Weights'}
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
