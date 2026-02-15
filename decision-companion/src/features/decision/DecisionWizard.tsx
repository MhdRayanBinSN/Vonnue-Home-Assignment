"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Criterion, Option } from '@/core/types';
import { CriteriaStep } from './steps/CriteriaStep';
import { OptionsStep } from './steps/OptionsStep';
import { RatingStep } from './steps/RatingStep';
import { ResultsStep } from './steps/ResultsStep';

export default function DecisionWizard() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(0);
    const [topic, setTopic] = useState('');
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (searchParams.get('demo') === 'startup') {
            setTopic("Selecting a Tech Stack for a Startup");
            setCriteria([
                { id: 'c1', name: 'Development Speed', weight: 10 },
                { id: 'c2', name: 'Scalability', weight: 8 },
                { id: 'c3', name: 'Hiring Ease', weight: 7 },
                { id: 'c4', name: 'Ecosystem/Community', weight: 6 }
            ]);
            setOptions([
                {
                    id: 'o1',
                    name: 'Next.js + Vercel',
                    ratings: { 'c1': 9, 'c2': 8, 'c3': 8, 'c4': 9 }
                },
                {
                    id: 'o2',
                    name: 'Rust + Custom Server',
                    ratings: { 'c1': 4, 'c2': 10, 'c3': 3, 'c4': 5 }
                },
                {
                    id: 'o3',
                    name: 'Django + Python',
                    ratings: { 'c1': 8, 'c2': 6, 'c3': 7, 'c4': 8 }
                }
            ]);
            setStep(4); // Jump straight to results
        }
    }, [searchParams]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    const handleReset = () => {
        setStep(0);
        setTopic('');
        setCriteria([]);
        setOptions([]);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">

            {/* Progress Bar */}
            <div className="hidden md:flex justify-between items-center text-sm font-medium text-gray-400">
                <span className={step >= 0 ? 'text-blue-400 font-bold' : ''}>1. Topic</span>
                <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>2. Criteria</span>
                <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>3. Options</span>
                <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>4. Rate</span>
                <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>5. Result</span>
            </div>

            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    style={{ width: `${((step + 1) / 5) * 100}%` }}
                />
            </div>

            <Card className="min-h-[500px] shadow-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl text-white">
                <CardContent className="py-8">
                    {step === 0 && (
                        <div className="space-y-8 animate-fade-in py-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-extrabold text-white tracking-tight">What decision are you making?</h2>
                                <p className="text-xl text-gray-400">Give your decision a name to get started.</p>
                            </div>
                            <Input
                                placeholder="e.g. Buying a new car, Choosing a job..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="text-2xl py-6 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500"
                                autoFocus
                            />
                            <div className="flex justify-end pt-12">
                                <Button
                                    className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                                    disabled={!topic.trim()}
                                    onClick={handleNext}
                                >
                                    Next: Define Criteria &rarr;
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-fade-in">
                            <CriteriaStep
                                criteria={criteria}
                                setCriteria={setCriteria}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <OptionsStep
                                options={options}
                                setOptions={setOptions}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <RatingStep
                                criteria={criteria}
                                options={options}
                                setOptions={setOptions}
                                onNext={handleNext}
                                onBack={handleBack}
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-fade-in">
                            <ResultsStep
                                criteria={criteria}
                                options={options}
                                onBack={handleBack}
                                onReset={handleReset}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
