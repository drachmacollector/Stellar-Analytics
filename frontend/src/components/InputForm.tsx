import { useState, useMemo } from 'react';
import { Globe, Star, FileJson, FileText, Telescope, Loader2 } from 'lucide-react';
import { featureConfig } from '@/config/featureConfig';
import { FeatureInput } from '@/components/FeatureInput';
import { JsonInput } from '@/components/JsonInput';
import { FeatureKey } from '@/types/prediction';

interface InputFormProps {
    onSubmit: (data: Record<string, number>) => void;
    isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
    const [values, setValues] = useState<Record<string, number | ''>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [inputMode, setInputMode] = useState<'form' | 'json'>('form');

    const planetFeatures = useMemo(() =>
        featureConfig.filter(f => f.section === 'planet'),
        []);

    const stellarFeatures = useMemo(() =>
        featureConfig.filter(f => f.section === 'stellar'),
        []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        featureConfig.forEach(config => {
            const val = values[config.id];
            if (config.required && (val === '' || val === undefined)) {
                newErrors[config.id] = 'Required';
                isValid = false;
            } else if (typeof val === 'number') {
                if (val < config.min || val > config.max) {
                    newErrors[config.id] = `Range: ${config.min} - ${config.max}`;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Cast values to number, we validated they are not empty string if required
            const submissionData = Object.entries(values).reduce((acc, [key, val]) => {
                if (val !== '') acc[key] = val as number;
                return acc;
            }, {} as Record<string, number>);

            onSubmit(submissionData);
        }
    };

    const handleChange = (id: FeatureKey, val: number | '') => {
        setValues(prev => ({ ...prev, [id]: val }));
        // Clear error on change
        if (errors[id]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    const [isJsonDirty, setIsJsonDirty] = useState(false);

    const handleJsonChange = (newValues: Record<string, number | ''>) => {
        setValues(newValues);
        setInputMode('form');
        setIsJsonDirty(false); // Reset dirty state on successful apply
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-transparent">
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-6">
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                    <button
                        type="button"
                        onClick={() => setInputMode('form')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${inputMode === 'form'
                            ? 'bg-accent-cyan/20 text-accent-cyan shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Form
                    </button>
                    <button
                        type="button"
                        onClick={() => setInputMode('json')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${inputMode === 'json'
                            ? 'bg-accent-cyan/20 text-accent-cyan shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <FileJson className="w-4 h-4" />
                        JSON
                    </button>
                </div>

                {inputMode === 'json' ? (
                    <JsonInput 
                        value={values} 
                        onChange={handleJsonChange} 
                        onDirtyChange={setIsJsonDirty} 
                    />
                ) : (
                    <>
                        {/* ── Planet Features ── */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                                <Globe className="w-4 h-4 text-accent-cyan" />
                                Planet Features
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {planetFeatures.map(config => (
                                    <FeatureInput
                                        key={config.id}
                                        config={config}
                                        value={values[config.id] ?? ''}
                                        onChange={(val) => handleChange(config.id, val)}
                                        error={errors[config.id]}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── Stellar Features ── */}
                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                                <Star className="w-4 h-4 text-yellow-400" />
                                Stellar Features
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stellarFeatures.map(config => (
                                    <FeatureInput
                                        key={config.id}
                                        config={config}
                                        value={values[config.id] ?? ''}
                                        onChange={(val) => handleChange(config.id, val)}
                                        error={errors[config.id]}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex-none px-4 py-3 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <button
                    type="submit"
                    disabled={isLoading || (inputMode === 'json' && isJsonDirty)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
                        bg-gradient-to-r from-accent-cyan/90 to-blue-500/90 hover:from-accent-cyan hover:to-blue-500
                        text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
                        border border-white/10"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : inputMode === 'json' && isJsonDirty ? (
                        'Apply Changes First'
                    ) : (
                        <>
                            <Telescope className="w-4 h-4" />
                            Analyze Candidate
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
