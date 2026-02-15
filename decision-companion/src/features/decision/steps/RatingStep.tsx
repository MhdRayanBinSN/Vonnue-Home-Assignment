import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Criterion, Option } from '@/core/types';

interface RatingStepProps {
    criteria: Criterion[];
    options: Option[];
    setOptions: (options: Option[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const RatingStep: React.FC<RatingStepProps> = ({ criteria, options, setOptions, onNext, onBack }) => {
    const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);

    const currentCriterion = criteria[currentCriterionIndex];
    const isFirst = currentCriterionIndex === 0;
    const isLast = currentCriterionIndex === criteria.length - 1;

    const handleRatingChange = (optionId: string, rating: number) => {
        setOptions(options.map(o => {
            if (o.id === optionId) {
                return {
                    ...o,
                    ratings: { ...o.ratings, [currentCriterion.id]: rating }
                };
            }
            return o;
        }));
    };

    const handleNextCriterion = () => {
        if (isLast) {
            onNext();
        } else {
            setCurrentCriterionIndex(i => i + 1);
        }
    };

    const handlePrevCriterion = () => {
        if (isFirst) {
            onBack();
        } else {
            setCurrentCriterionIndex(i => i - 1);
        }
    };

    if (!currentCriterion) return null;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Rate Options: <span className="text-blue-600">{currentCriterion.name}</span></h2>
                <p className="text-gray-500">
                    How do the options perform on this criterion? (Importance: {currentCriterion.weight}/10)
                </p>
            </div>

            <div className="space-y-4">
                {options.map(option => {
                    const rating = option.ratings[currentCriterion.id] || 5;
                    return (
                        <div key={option.id} className="p-5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm space-y-3 transition-shadow hover:bg-white/10 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <label className="font-semibold text-lg text-white">{option.name}</label>
                                <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg font-bold text-lg min-w-[3rem] text-center">
                                    {rating}
                                </div>
                            </div>
                            <input
                                type="range"
                                min="1" max="10"
                                value={rating}
                                onChange={e => handleRatingChange(option.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wide">
                                <span>Poor (1)</span>
                                <span>Excellent (10)</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={handlePrevCriterion}>
                    {isFirst ? 'Back' : '← Previous'}
                </Button>
                <Button onClick={handleNextCriterion}>
                    {isLast ? 'View Results' : 'Next Criterion →'}
                </Button>
            </div>

            <div className="flex justify-center">
                <div className="flex gap-1.5">
                    {criteria.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentCriterionIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
