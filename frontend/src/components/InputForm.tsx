import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, FileJson, FileText } from 'lucide-react';
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
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [inputMode, setInputMode] = useState<'form' | 'json'>('form');

    const coreFeatures = useMemo(() =>
        featureConfig.filter(f => f.category === 'core'),
        []);

    const advancedFeatures = useMemo(() =>
        featureConfig.filter(f => f.category === 'advanced'),
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

    const handleJsonChange = (newValues: Record<string, number | ''>) => {
        setValues(newValues);
        setInputMode('form');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full relative overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
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
                    <JsonInput value={values} onChange={handleJsonChange} />
                ) : (
                    <>
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                <Sparkles className="w-4 h-4 text-accent-cyan" />
                                Core Parameters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {coreFeatures.map(config => (
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

                        <div className="border-t border-white/5 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full justify-between p-2 rounded-lg hover:bg-white/5"
                            >
                                <span>Advanced Configuration</span>
                                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-2">
                                            {advancedFeatures.map(config => (
                                                <FeatureInput
                                                    key={config.id}
                                                    config={config}
                                                    value={values[config.id] ?? ''}
                                                    onChange={(val) => handleChange(config.id, val)}
                                                    error={errors[config.id]}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl z-10 box-border">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-accent-cyan to-blue-600 hover:from-accent-cyan/90 hover:to-blue-600/90 text-white font-bold tracking-wide shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ANALYZING...
                        </div>
                    ) : (
                        'ANALYZE CANDIDATE'
                    )}
                </button>
            </div>
        </form>
    );
};
