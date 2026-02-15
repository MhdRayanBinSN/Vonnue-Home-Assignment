import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Criterion, Option } from '@/core/types';
import { DecisionEngine } from '@/core/DecisionEngine';

interface ResultsStepProps {
    criteria: Criterion[];
    options: Option[];
    onBack: () => void;
    onReset: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ criteria, options, onBack, onReset }) => {
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    const engine = useMemo(() => {
        const e = new DecisionEngine();
        e.setCriteria(criteria);
        e.setOptions(options);
        return e;
    }, [criteria, options]);

    const results = engine.evaluate();
    const explanation = selectedOptionId ? engine.explain(selectedOptionId) : null;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Decision Analysis</h2>
                <p className="text-gray-500">Based on your criteria, here is the recommendation.</p>
            </div>

            <div className="grid gap-4">
                {results.map((result, idx) => {
                    const option = options.find(o => o.id === result.optionId)!;
                    const isWinner = idx === 0;

                    return (
                        <Card
                            key={result.optionId}
                            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${selectedOptionId === result.optionId ? 'ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'hover:bg-white/10'
                                } ${isWinner ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/50' : 'bg-white/5 border-white/10'}`}
                            onClick={() => setSelectedOptionId(result.optionId)}
                        >
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl shadow-lg ${isWinner ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-orange-500/30' : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    #{result.rank}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${isWinner ? 'text-white' : 'text-gray-200'}`}>{option.name}</h3>
                                    {isWinner && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 mt-1">
                                            🏆 Top Recommendation
                                        </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className={`text-3xl font-black ${isWinner ? 'text-blue-300' : 'text-gray-400'}`}>{result.score}</div>
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Score</div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {selectedOptionId && explanation && (
                <Card className="animate-fade-in-up bg-black/20 border-white/10 shadow-inner">
                    <CardContent className="p-6 space-y-4">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <span>💡</span> Why this result?
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-mono text-sm bg-black/40 p-4 rounded-lg border border-white/5 shadow-sm overflow-auto max-h-60">
                            {explanation}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>Change Ratings</Button>
                <Button onClick={onReset} variant="secondary">Start New Decision</Button>
            </div>
        </div>
    );
};
