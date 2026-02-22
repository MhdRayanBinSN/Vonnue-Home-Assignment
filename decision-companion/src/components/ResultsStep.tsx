'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, AlertTriangle, CheckCircle, XCircle, BarChart3, ArrowLeft, RefreshCw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '@/lib/context';
import { DecisionEngine } from '@/lib/decision-engine';
import { DecisionResult } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';

const methodDescriptions = {
  wsm: {
    name: 'Weighted Sum Model',
    desc: 'Simple and intuitive - multiplies scores by weights and sums them up',
  },
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function ResultsStep() {
  const { state, dispatch, prevStep } = useApp();
  const { problem, selectedMethod } = state;
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSensitivity, setShowSensitivity] = useState(false);

  useEffect(() => {
    runAnalysis();
  }, [selectedMethod]);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate analysis time for UX
      setTimeout(() => {
        const engine = new DecisionEngine(problem, { method: selectedMethod });
        const analysisResult = engine.analyze();
        setResult(analysisResult);
        dispatch({ type: 'SET_RESULT', payload: analysisResult });
        setIsAnalyzing(false);
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
    }
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = {
      problem: {
        title: problem.title,
        description: problem.description,
        options: problem.options.map(o => ({ name: o.name, description: o.description })),
        criteria: problem.criteria.map(c => ({ name: c.name, weight: c.weight, type: c.type })),
      },
      analysis: {
        method: result.method,
        timestamp: result.timestamp,
        recommendation: result.recommendation,
        rankings: result.results.map(r => ({
          rank: r.rank,
          option: r.optionName,
          score: r.normalizedScore.toFixed(2),
          strengths: r.strengths,
          weaknesses: r.weaknesses,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
          <BarChart3 className="w-8 h-8 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mt-6">Analyzing your decision...</h3>
        <p className="text-slate-600 mt-2">Running {methodDescriptions[selectedMethod].name} algorithm</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">Analysis Failed</h3>
        <p className="text-slate-600 mt-2">{error}</p>
        <button
          onClick={runAnalysis}
          className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (!result) return null;

  const winner = result.results[0];
  const chartData = result.results.map((r, i) => ({
    name: r.optionName,
    score: Math.round(r.normalizedScore * 10) / 10,
    fill: COLORS[i % COLORS.length],
  }));

  const radarData = problem.criteria.map(criterion => {
    const dataPoint: Record<string, string | number> = { criterion: criterion.name };
    result.results.forEach(r => {
      const cs = r.criteriaScores.find(cs => cs.criterionId === criterion.id);
      dataPoint[r.optionName] = cs ? Math.round(cs.normalizedScore * 100) : 0;
    });
    return dataPoint;
  });

  return (
    <div className="animate-fade-in">
      {/* Winner Banner */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-primary-100 text-sm font-medium uppercase tracking-wide">Recommended Choice</p>
              <h2 className="text-3xl font-bold mt-1">{winner.optionName}</h2>
              <div className="flex items-center mt-2">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${result.recommendation.confidence === 'high' ? 'bg-green-500/30 text-green-100' :
                    result.recommendation.confidence === 'medium' ? 'bg-yellow-500/30 text-yellow-100' :
                    'bg-red-500/30 text-red-100'}
                `}>
                  {result.recommendation.confidence.charAt(0).toUpperCase() + result.recommendation.confidence.slice(1)} Confidence
                </span>
                <span className="ml-3 text-primary-200">
                  Score: {winner.normalizedScore.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={exportResults}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
        <p className="mt-4 text-primary-100 max-w-2xl">{result.recommendation.summary}</p>
      </div>

      {/* Method Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Analysis Method</h3>
        <div className="p-4 rounded-lg border-2 border-primary-500 bg-primary-50">
          <span className="font-medium text-primary-700">
            {methodDescriptions.wsm.name}
          </span>
          <p className="text-sm text-slate-500 mt-1">{methodDescriptions.wsm.desc}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Overall Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b' }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Criteria Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="criterion" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
              {result.results.slice(0, 4).map((r, i) => (
                <Radar
                  key={r.optionId}
                  name={r.optionName}
                  dataKey={r.optionName}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rankings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Complete Rankings</h3>
        <div className="space-y-4">
          {result.results.map((r, index) => (
            <div
              key={r.optionId}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${index === 0 ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-50'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-4
                    ${index === 0 ? 'bg-primary-600 text-white' : 
                      index === 1 ? 'bg-slate-400 text-white' : 
                      index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}
                  `}>
                    {index === 0 ? <Trophy className="w-5 h-5" /> : `#${r.rank}`}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{r.optionName}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {r.strengths.slice(0, 2).map((strength, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {strength}
                        </span>
                      ))}
                      {r.weaknesses.slice(0, 1).map((weakness, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-800">{r.normalizedScore.toFixed(1)}%</span>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${r.normalizedScore}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Reasons */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4">Why "{winner.optionName}"?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Key Reasons
            </h4>
            <ul className="space-y-2">
              {result.recommendation.keyReasons.map((reason, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium mr-2 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-600 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
              Trade-offs to Consider
            </h4>
            <ul className="space-y-2">
              {result.recommendation.tradeoffs.length > 0 ? (
                result.recommendation.tradeoffs.map((tradeoff, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium mr-2 shrink-0 mt-0.5">
                      !
                    </span>
                    {tradeoff}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500 italic">No significant trade-offs identified</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Method Explanation (collapsible) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full p-6 flex items-center justify-between text-left"
        >
          <h3 className="font-semibold text-slate-700">How This Works</h3>
          {showExplanation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showExplanation && (
          <div className="px-6 pb-6 border-t border-slate-200 pt-4">
            <p className="text-slate-600 mb-4">{result.explanation.methodDescription}</p>
            <h4 className="font-medium text-slate-700 mb-3">Step-by-Step Process:</h4>
            <div className="space-y-3">
              {result.explanation.stepByStep.map((step) => (
                <div key={step.step} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium mr-3 shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h5 className="font-medium text-slate-700">{step.title}</h5>
                    <p className="text-sm text-slate-600">{step.description}</p>
                    {step.formula && (
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-1 inline-block font-mono">
                        {step.formula}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Assumptions</h4>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                  {result.explanation.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Limitations</h4>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                  {result.explanation.limitations.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sensitivity Analysis (collapsible) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <button
          onClick={() => setShowSensitivity(!showSensitivity)}
          className="w-full p-6 flex items-center justify-between text-left"
        >
          <div className="flex items-center">
            <h3 className="font-semibold text-slate-700">Sensitivity Analysis</h3>
            <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${
              result.sensitivity.isRobust ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {result.sensitivity.isRobust ? 'Robust Decision' : 'May Change with Different Weights'}
            </span>
          </div>
          {showSensitivity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showSensitivity && (
          <div className="px-6 pb-6 border-t border-slate-200 pt-4">
            {result.sensitivity.criticalCriteria.length > 0 ? (
              <div className="mb-4">
                <p className="text-slate-600 mb-2">
                  The following criteria are critical - changing their weights significantly may change the recommendation:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.sensitivity.criticalCriteria.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-green-600 mb-4">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                The recommendation is robust - moderate changes in weights don't affect the outcome.
              </p>
            )}
            <h4 className="font-medium text-slate-700 mb-3">What-If Scenarios:</h4>
            <div className="space-y-2">
              {result.sensitivity.scenarios.slice(0, 5).map((scenario, i) => (
                <div key={i} className={`p-3 rounded-lg ${scenario.rankingChanged ? 'bg-amber-50' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{scenario.description}</span>
                    <span className={`text-sm font-medium ${scenario.rankingChanged ? 'text-amber-700' : 'text-green-700'}`}>
                      {scenario.rankingChanged ? 'Ranking changed' : 'No change'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Scoring
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Start New Decision
        </button>
      </div>
    </div>
  );
}
