import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Option } from '@/core/types';

interface OptionsStepProps {
    options: Option[];
    setOptions: (options: Option[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const OptionsStep: React.FC<OptionsStepProps> = ({ options, setOptions, onNext, onBack }) => {
    const handleAdd = () => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        setOptions([...options, { id, name: '', ratings: {} }]);
    };

    const handleChange = (id: string, name: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, name } : o));
    };

    const handleDelete = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Add Your Options</h2>
                <p className="text-gray-500">What are the choices you are comparing? (Add at least 2)</p>
            </div>

            <div className="space-y-4">
                {options.map((o, idx) => (
                    <div key={o.id} className="flex items-end gap-4 p-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 animate-fade-in">
                        <div className="flex-1">
                            <Input
                                label={idx === 0 ? "Option Name" : ""}
                                placeholder="e.g. MacBook Pro, Dell XPS..."
                                value={o.name}
                                onChange={e => handleChange(o.id, e.target.value)}
                                autoFocus={idx === options.length - 1}
                                className="bg-black/20 border-white/10 text-white placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500"
                            />
                        </div>
                        <Button variant="danger" onClick={() => handleDelete(o.id)} className="mb-0.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20">✕</Button>
                    </div>
                ))}
                {options.length === 0 && (
                    <div className="text-center py-12 bg-white/5 rounded-xl border-2 border-dashed border-white/10 text-gray-400">
                        No options added. Click below to start.
                    </div>
                )}
            </div>

            <Button onClick={handleAdd} variant="secondary" className="w-full border-dashed border-2 border-white/20 bg-transparent text-gray-300 py-4 hover:border-blue-400 hover:text-blue-400 transition-all">
                + Add Option
            </Button>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                <Button variant="ghost" onClick={onBack}>Back</Button>
                <Button
                    onClick={onNext}
                    disabled={options.length < 2 || options.some(o => !o.name.trim())}
                    title={options.length < 2 ? "Add at least 2 options" : ""}
                >
                    Next: Rate Options &rarr;
                </Button>
            </div>
        </div>
    );
};
