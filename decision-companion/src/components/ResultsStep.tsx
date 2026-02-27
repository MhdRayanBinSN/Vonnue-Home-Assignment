'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, AlertTriangle, CheckCircle, XCircle, BarChart3, ArrowLeft, RefreshCw, Download, ChevronDown, ChevronUp, Target, Lightbulb, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '@/lib/context';
import { DecisionEngine } from '@/lib/decision-engine';
import { DecisionResult, TopsisResult } from '@/lib/types';
import { PracticalAdvisor, PracticalAdvice } from '@/lib/practical-advisor';
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
  topsis: {
    name: 'TOPSIS',
    desc: 'Ranks by closeness to ideal best and furthest from ideal worst',
  },
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export function ResultsStep() {
  const { state, dispatch, prevStep } = useApp();
  const { problem, selectedMethod } = state;
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [topsisResult, setTopsisResult] = useState<TopsisResult | null>(null);
  const [practicalAdvice, setPracticalAdvice] = useState<PracticalAdvice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'wsm' | 'topsis'>('wsm');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSensitivity, setShowSensitivity] = useState(false);
  const [showAdvice, setShowAdvice] = useState(true);

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
        // Run TOPSIS in parallel using the same engine
        const topsis = engine.runTOPSIS(analysisResult.results);
        
        // Run Practical Advisor
        const advisor = new PracticalAdvisor(problem, analysisResult, topsis);
        const advice = advisor.advise();
        
        setResult(analysisResult);
        setTopsisResult(topsis);
        setPracticalAdvice(advice);
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
      {/* Filtered Options Info */}
      {result.filteredOutCount && result.filteredOutCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800">
                {result.filteredOutCount} option(s) filtered out
              </h4>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                {result.filteredOutReasons?.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                These options were excluded before analysis to improve accuracy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Winner Banner — tab-aware */}
      {activeView === 'wsm' ? (
        <div className="bg-linear-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-primary-100 text-sm font-medium uppercase tracking-wide">WSM Recommendation</p>
                <h2 className="text-3xl font-bold mt-1">{result.results[0].optionName}</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.recommendation.confidence === 'high' ? 'bg-green-500/30 text-green-100' :
                      result.recommendation.confidence === 'medium' ? 'bg-yellow-500/30 text-yellow-100' :
                        'bg-red-500/30 text-red-100'
                    }`}>
                    {result.recommendation.confidence.charAt(0).toUpperCase() + result.recommendation.confidence.slice(1)} Confidence
                  </span>
                  <span className="ml-3 text-primary-200">
                    Score: {result.results[0].normalizedScore.toFixed(1)}%
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
      ) : (
        <div className="bg-linear-to-r from-violet-600 to-violet-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-violet-100 text-sm font-medium uppercase tracking-wide">TOPSIS Recommendation</p>
                <h2 className="text-3xl font-bold mt-1">
                  {topsisResult?.winner ?? result.results[0].optionName}
                </h2>
                <div className="flex items-center mt-2 gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                    CC: {((topsisResult?.results[0].closenessCoefficient ?? 0) * 100).toFixed(1)}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${topsisResult?.winnerAgreement ? 'bg-green-500/30 text-green-100' : 'bg-amber-500/30 text-amber-100'
                    }`}>
                    {topsisResult?.winnerAgreement ? '✓ Agrees with WSM' : '⚠ Disagrees with WSM'}
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
          <p className="mt-4 text-violet-100 max-w-2xl">
            TOPSIS independently recommends this option using geometric distance analysis. It measures closeness to an ideal solution across all {problem.criteria.length} criteria.
          </p>
        </div>
      )}

      {/* Method Tab Switcher */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-6 flex gap-2">
        <button
          onClick={() => setActiveView('wsm')}
          className={`flex-1 flex flex-col items-center py-3 px-4 rounded-lg transition-all ${activeView === 'wsm'
            ? 'bg-primary-600 text-white shadow'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <span className="text-sm font-bold">WSM</span>
          <span className={`text-xs mt-0.5 ${activeView === 'wsm' ? 'text-primary-100' : 'text-slate-400'}`}>
            Weighted Sum Model
          </span>
        </button>
        <button
          onClick={() => setActiveView('topsis')}
          className={`flex-1 flex flex-col items-center py-3 px-4 rounded-lg transition-all ${activeView === 'topsis'
            ? 'bg-violet-600 text-white shadow'
            : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          <span className="text-sm font-bold">TOPSIS</span>
          <span className={`text-xs mt-0.5 ${activeView === 'topsis' ? 'text-violet-100' : 'text-slate-400'}`}>
            Closeness to Ideal
          </span>
        </button>
      </div>

      {/* Confidence Indicator */}
      {result.recommendation.confidence === 'low' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 text-lg">
                ⚠️ Low Confidence - Too Close to Call
              </h4>
              <p className="text-amber-800 mt-2">
                The top options have very similar scores (difference &lt;5%). Consider reviewing both options carefully.
              </p>
              <div className="mt-3 space-y-2">
                {result.results.slice(0, 2).map((opt, i) => (
                  <div key={opt.optionId} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium text-slate-800">
                      #{i + 1} {opt.optionName}
                    </span>
                    <span className="text-amber-700 font-semibold">
                      {opt.normalizedScore.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {result.recommendation.confidence === 'medium' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900">
                Moderate Confidence
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                The winner has a moderate advantage (5-20% difference). The recommendation is reliable.
              </p>
            </div>
          </div>
        </div>
      )}

      {result.recommendation.confidence === 'high' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900">
                High Confidence ✓
              </h4>
              <p className="text-sm text-green-700 mt-1">
                The winner has a clear advantage (&gt;20% difference). This is a strong recommendation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── WSM VIEW ────────────────────────────────────────────────────── */}
      {activeView === 'wsm' && (
        <>

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

          {/* Improved Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* 1. Overall Scores - Horizontal Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                Overall Scores
              </h3>
              <p className="text-xs text-slate-500 mb-4">Weighted sum of all criteria</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} width={120} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 2. Top 3 Head-to-Head Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-amber-600" />
                Top 3 Comparison
              </h3>
              <p className="text-xs text-slate-500 mb-4">Key criteria breakdown</p>
              <div className="space-y-4">
                {/* Show top 5 weighted criteria */}
                {problem.criteria
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, 5)
                  .map((criterion) => {
                    const top3 = result.results.slice(0, 3);
                    const maxScore = Math.max(...top3.map(r => {
                      const cs = r.criteriaScores.find(c => c.criterionId === criterion.id);
                      return cs?.normalizedScore || 0;
                    }));
                    
                    return (
                      <div key={criterion.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{criterion.name}</span>
                          <span className="text-xs text-slate-500">{criterion.weight}% weight</span>
                        </div>
                        <div className="space-y-1">
                          {top3.map((opt, idx) => {
                            const cs = opt.criteriaScores.find(c => c.criterionId === criterion.id);
                            const score = cs?.normalizedScore || 0;
                            const isMax = score === maxScore;
                            
                            return (
                              <div key={opt.optionId} className="flex items-center gap-2">
                                <span className="text-xs text-slate-600 w-24 truncate">{opt.optionName}</span>
                                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                                  <div
                                    className={`h-full rounded-full transition-all ${isMax ? 'bg-green-500' : 'bg-slate-400'}`}
                                    style={{ width: `${score * 100}%` }}
                                  />
                                  {isMax && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-slate-700 w-12 text-right">
                                  {(score * 100).toFixed(0)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* 3. Winner's Strengths & Weaknesses Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Winner's Performance Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strengths
                </h4>
                <div className="space-y-2">
                  {winner.criteriaScores
                    .filter(cs => cs.normalizedScore >= 0.7)
                    .sort((a, b) => b.normalizedScore - a.normalizedScore)
                    .slice(0, 5)
                    .map(cs => (
                      <div key={cs.criterionId} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-700">{cs.criterionName}</span>
                            <span className="text-xs font-bold text-green-600">
                              {(cs.normalizedScore * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${cs.normalizedScore * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="text-sm font-semibold text-amber-700 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {winner.criteriaScores
                    .filter(cs => cs.normalizedScore < 0.7)
                    .sort((a, b) => a.normalizedScore - b.normalizedScore)
                    .slice(0, 5)
                    .map(cs => (
                      <div key={cs.criterionId} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-700">{cs.criterionName}</span>
                            <span className="text-xs font-bold text-amber-600">
                              {(cs.normalizedScore * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${cs.normalizedScore * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Radar Chart - Keep but improve */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
              Multi-Dimensional Comparison
            </h3>
            <p className="text-xs text-slate-500 mb-4">All criteria across top {Math.min(3, result.results.length)} options</p>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="criterion" 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                />
                <PolarRadiusAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  angle={90}
                />
                {result.results.slice(0, 3).map((r, i) => (
                  <Radar
                    key={r.optionId}
                    name={r.optionName}
                    dataKey={r.optionName}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => `${value.toFixed(0)}%`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Reasons — WSM only */}
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
                <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${result.sensitivity.isRobust ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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

        </> /* end WSM view */
      )
      }

      {/* ─── TOPSIS VIEW ───────────────────────────────────────────────── */}
      {
        activeView === 'topsis' && topsisResult && (
          <div className="space-y-4 mb-6">

            {/* Winner agreement banner */}
            <div className={`rounded-xl p-5 flex items-center gap-4 ${topsisResult.winnerAgreement
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
              }`}>
              <span className="text-2xl">{topsisResult.winnerAgreement ? '✅' : '⚠️'}</span>
              <div>
                <p className={`font-semibold ${topsisResult.winnerAgreement ? 'text-green-800' : 'text-amber-800'
                  }`}>
                  {topsisResult.winnerAgreement
                    ? `Both algorithms agree: ${topsisResult.winner} is the best choice`
                    : `Algorithms disagree — WSM picks ${result?.recommendation.optionName}, TOPSIS picks ${topsisResult.winner}`}
                </p>
                <p className="text-xs text-slate-500 mt-1">{topsisResult.rankAgreement.interpretation}</p>
              </div>
            </div>

            {/* Kendall's Tau agreement badge */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700">Rank Agreement with WSM</h4>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${topsisResult.rankAgreement.level === 'full' ? 'bg-green-100 text-green-700' :
                  topsisResult.rankAgreement.level === 'high' ? 'bg-blue-100 text-blue-700' :
                    topsisResult.rankAgreement.level === 'moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  Kendall&apos;s τ = {topsisResult.rankAgreement.kendallTau} &nbsp;({topsisResult.rankAgreement.level})
                </span>
              </div>
              <p className="text-sm text-slate-500">{topsisResult.rankAgreement.interpretation}</p>
            </div>

            {/* Per-option TOPSIS rankings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-700 mb-4">TOPSIS Rankings — Closeness Coefficients</h4>
              <div className="space-y-4">
                {topsisResult.results.map((r, i) => (
                  <div
                    key={r.optionId}
                    className={`p-4 rounded-lg border-2 ${i === 0 ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${i === 0 ? 'bg-violet-600' : i === 1 ? 'bg-slate-400' : 'bg-slate-300'
                          }`}>
                          {i === 0 ? <Trophy className="w-4 h-4" /> : `#${r.rank}`}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{r.optionName}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">WSM #{r.wsmRank}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${r.rankAgreement ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {r.rankAgreement ? '✓ ranks match' : '↑↓ ranks differ'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-violet-700">
                        {(r.closenessCoefficient * 100).toFixed(1)}%
                      </span>
                    </div>
                    {/* CC bar */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-slate-500 w-32 shrink-0">Closeness (CC)</span>
                      <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-700"
                          style={{ width: `${r.closenessCoefficient * 100}%` }}
                        />
                      </div>
                    </div>
                    {/* D+ D- */}
                    <div className="flex gap-6 text-xs text-slate-500">
                      <span>D⁺ from best = <strong className="text-slate-700">{r.distanceFromBest}</strong></span>
                      <span>D⁻ from worst = <strong className="text-slate-700">{r.distanceFromWorst}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend card */}
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 text-xs text-violet-800 space-y-1">
              <p className="font-semibold mb-2">How to read TOPSIS:</p>
              <p>→ <strong>CC (Closeness Coefficient)</strong>: 100% = perfectly close to ideal laptop, 0% = worst possible</p>
              <p>→ <strong>D⁺</strong>: Distance from ideal best — lower = more similar to perfect</p>
              <p>→ <strong>D⁻</strong>: Distance from ideal worst — higher = further from worst</p>
              <p>→ <strong>Kendall&apos;s τ</strong>: Rank correlation with WSM (τ=1.0 = algorithms fully agree)</p>
            </div>

            {/* TOPSIS Graphs - Same structure as WSM but with TOPSIS data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* 1. Closeness Coefficient Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
                  Closeness Coefficients
                </h3>
                <p className="text-xs text-slate-500 mb-4">Distance from ideal solution (higher is better)</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={topsisResult.results.map((r, i) => ({
                      name: r.optionName,
                      score: Math.round(r.closenessCoefficient * 1000) / 10,
                      fill: COLORS[i % COLORS.length],
                    }))} 
                    layout="vertical" 
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} width={120} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'CC']}
                    />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                      {topsisResult.results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 2. Distance Comparison */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-violet-600" />
                  Distance Analysis
                </h3>
                <p className="text-xs text-slate-500 mb-4">Distance from best (D+) vs worst (D-)</p>
                <div className="space-y-4">
                  {topsisResult.results.slice(0, 3).map((opt, idx) => (
                    <div key={opt.optionId}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{opt.optionName}</span>
                        <span className="text-xs text-slate-500">Rank #{opt.rank}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-20">From Best:</span>
                          <div className="flex-1 h-4 bg-red-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${(opt.distanceFromBest / Math.max(...topsisResult.results.map(r => r.distanceFromBest))) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700 w-12 text-right">
                            {opt.distanceFromBest.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-20">From Worst:</span>
                          <div className="flex-1 h-4 bg-green-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${(opt.distanceFromWorst / Math.max(...topsisResult.results.map(r => r.distanceFromWorst))) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-700 w-12 text-right">
                            {opt.distanceFromWorst.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Ideal Points Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-violet-600" />
                Ideal vs Anti-Ideal Solutions
              </h3>
              <p className="text-xs text-slate-500 mb-4">TOPSIS calculates theoretical best (A+) and worst (A-) for each criterion</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topsisResult.idealPoints.slice(0, 6).map((point) => (
                  <div key={point.criterionId} className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">{point.criterionName}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-700">Ideal Best (A+):</span>
                        <span className="text-sm font-bold text-green-700">{point.idealBest.toFixed(3)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-700">Ideal Worst (A-):</span>
                        <span className="text-sm font-bold text-red-700">{point.idealWorst.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Radar Chart - Same as WSM */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
                Multi-Dimensional Comparison
              </h3>
              <p className="text-xs text-slate-500 mb-4">All criteria across top {Math.min(3, topsisResult.results.length)} options</p>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="criterion" 
                    tick={{ fill: '#64748b', fontSize: 11 }} 
                  />
                  <PolarRadiusAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }} 
                    angle={90}
                  />
                  {topsisResult.results.slice(0, 3).map((r, i) => {
                    const optName = r.optionName;
                    return (
                      <Radar
                        key={r.optionId}
                        name={optName}
                        dataKey={optName}
                        stroke={COLORS[i % COLORS.length]}
                        fill={COLORS[i % COLORS.length]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    );
                  })}
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: number) => `${value.toFixed(0)}%`}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )
      }

      {/* Algorithm Agreement Analysis - Show for both views */}
      {topsisResult && (
        <div className={`rounded-xl p-5 mb-6 ${
          topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
            ? 'bg-green-50 border-2 border-green-300'
            : topsisResult.rankAgreement.level === 'moderate'
              ? 'bg-blue-50 border-2 border-blue-300'
              : 'bg-amber-50 border-2 border-amber-300'
        }`}>
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
                ? 'bg-green-200'
                : topsisResult.rankAgreement.level === 'moderate'
                  ? 'bg-blue-200'
                  : 'bg-amber-200'
            }`}>
              <BarChart3 className={`w-5 h-5 ${
                topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
                  ? 'text-green-700'
                  : topsisResult.rankAgreement.level === 'moderate'
                    ? 'text-blue-700'
                    : 'text-amber-700'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold text-lg ${
                topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
                  ? 'text-green-900'
                  : topsisResult.rankAgreement.level === 'moderate'
                    ? 'text-blue-900'
                    : 'text-amber-900'
              }`}>
                Algorithm Agreement: {topsisResult.rankAgreement.level.charAt(0).toUpperCase() + topsisResult.rankAgreement.level.slice(1)}
              </h4>
              <p className={`mt-2 text-sm ${
                topsisResult.rankAgreement.level === 'full' || topsisResult.rankAgreement.level === 'high'
                  ? 'text-green-800'
                  : topsisResult.rankAgreement.level === 'moderate'
                    ? 'text-blue-800'
                    : 'text-amber-800'
              }`}>
                {topsisResult.rankAgreement.interpretation}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Kendall&apos;s Tau:</span>
                  <span className="ml-2 font-bold">{topsisResult.rankAgreement.kendallTau.toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Exact Matches:</span>
                  <span className="ml-2 font-bold">{topsisResult.rankAgreement.agreementCount}/{result.results.length}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3">
                💡 Both WSM and TOPSIS are independent algorithms. High agreement indicates your decision is robust regardless of methodology.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Practical AI Advice Section */}
      {practicalAdvice && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <button
            onClick={() => setShowAdvice(!showAdvice)}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              {practicalAdvice.shouldBuy ? (
                <ThumbsUp className="w-5 h-5 mr-3 text-green-600" />
              ) : (
                <ThumbsDown className="w-5 h-5 mr-3 text-amber-600" />
              )}
              <div>
                <h3 className="font-semibold text-slate-700">Should You Buy This?</h3>
                <p className="text-sm text-slate-600 mt-1">{practicalAdvice.summary}</p>
              </div>
            </div>
            {showAdvice ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showAdvice && (
            <div className="px-6 pb-6 border-t border-slate-200 pt-4">
              
              {/* Use Case Fit */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3">Use Case Fit</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(practicalAdvice.useCaseFit).map(([useCase, rating]) => (
                    <div key={useCase} className="text-center">
                      <div className={`text-2xl mb-1 ${
                        rating === 'excellent' ? 'text-green-600' :
                        rating === 'good' ? 'text-blue-600' :
                        rating === 'fair' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {rating === 'excellent' ? '🌟' :
                         rating === 'good' ? '👍' :
                         rating === 'fair' ? '👌' : '👎'}
                      </div>
                      <div className="text-xs font-medium text-slate-700 capitalize">{useCase}</div>
                      <div className={`text-xs capitalize ${
                        rating === 'excellent' ? 'text-green-700' :
                        rating === 'good' ? 'text-blue-700' :
                        rating === 'fair' ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Suggestions */}
              {practicalAdvice.suggestions.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-slate-800">Things to Consider</h4>
                  {practicalAdvice.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        suggestion.category === 'deal-breaker'
                          ? 'bg-red-50 border-red-500'
                          : suggestion.category === 'consideration'
                            ? 'bg-amber-50 border-amber-500'
                            : suggestion.category === 'alternative'
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-green-50 border-green-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{suggestion.icon}</span>
                        <div className="flex-1">
                          <h5 className={`font-semibold mb-1 ${
                            suggestion.category === 'deal-breaker' ? 'text-red-900' :
                            suggestion.category === 'consideration' ? 'text-amber-900' :
                            suggestion.category === 'alternative' ? 'text-blue-900' :
                            'text-green-900'
                          }`}>
                            {suggestion.title}
                          </h5>
                          <p className="text-sm text-slate-700 mb-2">{suggestion.message}</p>
                          {suggestion.action && (
                            <div className="mt-2 p-2 bg-white rounded border border-slate-200">
                              <p className="text-xs font-medium text-slate-600">💡 {suggestion.action}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Alternatives */}
              {practicalAdvice.alternatives && practicalAdvice.alternatives.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Worth Considering
                  </h4>
                  <div className="space-y-2">
                    {practicalAdvice.alternatives.map((alt, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        <div>
                          <span className="font-medium text-blue-900">{alt.optionName}</span>
                          <span className="text-sm text-blue-700 ml-2">— {alt.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}


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
    </div >
  );
}
