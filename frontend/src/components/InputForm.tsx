import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { featureConfig } from '@/config/featureConfig';
import { FeatureInput } from '@/components/FeatureInput';
import { FeatureKey } from '@/types/prediction';

interface InputFormProps {
    onSubmit: (data: Record<string, number>) => void;
    isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
    const [values, setValues] = useState<Record<string, number | ''>>({});
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
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

            <div className="border-t border-white/10 pt-4">
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Advanced Configuration
                </button>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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

            <div className="mt-auto pt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-accent-cyan/80 to-blue-600/80 hover:from-accent-cyan hover:to-blue-600 text-white font-semibold tracking-wide shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isLoading ? 'CLASSIFYING EXOPLANET...' : 'ANALYZE CANDIDATE'}
                </button>
            </div>
        </form>
    );
};
