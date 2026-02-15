import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Criterion } from '@/core/types';

interface CriteriaStepProps {
    criteria: Criterion[];
    setCriteria: (criteria: Criterion[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const CriteriaStep: React.FC<CriteriaStepProps> = ({ criteria, setCriteria, onNext, onBack }) => {
    const handleAdd = () => {
        // Basic ID generation if crypto.randomUUID is not available (e.g. older envs)
        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        setCriteria([...criteria, { id, name: '', weight: 5 }]);
    };

    const handleChange = (id: string, field: keyof Criterion, value: string | number) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleDelete = (id: string) => {
        setCriteria(criteria.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Define Your Criteria</h2>
                <p className="text-gray-500">What factors are important for this decision? (Weight 1-10)</p>
            </div>

            <div className="space-y-4">
                {criteria.map((c, idx) => (
                    <div key={c.id} className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10">
                        <div className="flex-1 w-full">
                            <Input
                                label={idx === 0 ? "Criterion Name" : ""}
                                placeholder="e.g. Price, Durability..."
                                value={c.name}
                                onChange={e => handleChange(c.id, 'name', e.target.value)}
                                autoFocus={idx === criteria.length - 1}
                                className="bg-black/20 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-1/3 space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-gray-300">Importance</label>
                                <span className="text-sm font-bold text-blue-400">{c.weight}/10</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="10"
                                value={c.weight}
                                onChange={e => handleChange(c.id, 'weight', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(c.id)}
                            className="md:mb-0.5 w-full md:w-auto bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                            title="Remove"
                        >
                            ✕
                        </Button>
                    </div>
                ))}
                {criteria.length === 0 && (
                    <div className="text-center py-12 bg-white/5 rounded-xl border-2 border-dashed border-white/10 text-gray-400">
                        No criteria added yet.
                    </div>
                )}
            </div>

            <Button onClick={handleAdd} variant="secondary" className="w-full border-dashed border-2 border-white/20 bg-transparent text-gray-300 py-4 hover:border-blue-400 hover:text-blue-400 transition-all">
                + Add Criterion
            </Button>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>Back</Button>
                <Button
                    onClick={onNext}
                    disabled={criteria.length === 0 || criteria.some(c => !c.name.trim())}
                >
                    Next: Add Options &rarr;
                </Button>
            </div>
        </div>
    );
};
