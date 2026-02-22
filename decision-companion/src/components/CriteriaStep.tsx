'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Scale, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useApp } from '@/lib/context';
import { Criterion } from '@/lib/types';

export function CriteriaStep() {
  const { state, addCriterion, updateCriterion, deleteCriterion, nextStep, prevStep } = useApp();
  const { problem } = state;

  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState(25);
  const [newType, setNewType] = useState<'benefit' | 'cost'>('benefit');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState(25);
  const [editType, setEditType] = useState<'benefit' | 'cost'>('benefit');

  const totalWeight = problem.criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleAddCriterion = () => {
    if (newName.trim()) {
      addCriterion(newName.trim(), newWeight, newType);
      setNewName('');
      setNewWeight(25);
      setNewType('benefit');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCriterion();
    }
  };

  const startEditing = (criterion: Criterion) => {
    setEditingId(criterion.id);
    setEditName(criterion.name);
    setEditWeight(criterion.weight);
    setEditType(criterion.type);
  };

  const saveEdit = (id: string) => {
    const criterion = problem.criteria.find(c => c.id === id);
    if (criterion && editName.trim()) {
      updateCriterion({
        ...criterion,
        name: editName.trim(),
        weight: editWeight,
        type: editType,
      });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const normalizeWeights = () => {
    const total = problem.criteria.reduce((s, c) => s + c.weight, 0);
    if (total > 0) {
      problem.criteria.forEach(c => {
        const normalizedWeight = Math.round((c.weight / total) * 100);
        updateCriterion({ ...c, weight: normalizedWeight });
      });
    }
  };

  const canProceed = problem.criteria.length >= 1;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">What criteria matter to you?</h2>
        <p className="text-slate-600 mt-2">
          Define the factors you'll use to evaluate your options. Assign weights to show relative importance.
        </p>
      </div>

      {/* Info box about benefit/cost */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Benefit vs Cost Criteria</p>
            <p>
              <strong>Benefit criteria</strong> (like Performance, Quality): Higher scores are better.
              <br />
              <strong>Cost criteria</strong> (like Price, Time): Lower scores are better.
            </p>
          </div>
        </div>
      </div>

      {/* Add new criterion form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Add New Criterion</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Criterion Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Price, Quality, Speed..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Weight (Importance): {newWeight}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Less important</span>
              <span>More important</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setNewType('benefit')}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-colors ${
                  newType === 'benefit'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Benefit
              </button>
              <button
                type="button"
                onClick={() => setNewType('cost')}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-colors ${
                  newType === 'cost'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Cost
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleAddCriterion}
          disabled={!newName.trim()}
          className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Criterion
        </button>
      </div>

      {/* Criteria list */}
      {problem.criteria.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">
              Your Criteria ({problem.criteria.length})
            </h3>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${Math.abs(totalWeight - 100) < 1 ? 'text-green-600' : 'text-amber-600'}`}>
                Total Weight: {totalWeight}%
              </span>
              {Math.abs(totalWeight - 100) > 1 && (
                <button
                  onClick={normalizeWeights}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Normalize to 100%
                </button>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {problem.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 card-hover"
              >
                {editingId === criterion.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 mr-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={editWeight}
                        onChange={(e) => setEditWeight(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                      <span className="text-sm font-medium w-12">{editWeight}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditType('benefit')}
                        className={`flex-1 flex items-center justify-center px-2 py-1 rounded border text-sm ${
                          editType === 'benefit' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Benefit
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditType('cost')}
                        className={`flex-1 flex items-center justify-center px-2 py-1 rounded border text-sm ${
                          editType === 'cost' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200'
                        }`}
                      >
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Cost
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between mr-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mr-3 ${
                        criterion.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {criterion.type === 'benefit' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {criterion.type}
                      </span>
                      <span className="font-medium text-slate-800">{criterion.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-slate-200 rounded-full mr-3 overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: `${criterion.weight}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600 w-12">{criterion.weight}%</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {editingId === criterion.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(criterion.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(criterion)}
                        className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCriterion(criterion.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        <p className="text-sm text-slate-500">
          {problem.criteria.length < 1 ? 'Add at least 1 criterion to continue' : '✓ Ready to proceed'}
        </p>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Scoring
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
