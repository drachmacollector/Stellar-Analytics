import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ErrorBanner } from '@/components/ErrorBanner';
import { predict } from '@/services/api';
import { PredictionResponse } from '@/types/prediction';
import { Activity } from 'lucide-react';

export const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePrediction = async (features: Record<string, number>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await predict(features);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-galaxy-900 text-white font-sans selection:bg-accent-cyan/30 flex flex-col overflow-hidden">
            {/* Global background image */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img src="/bg3.jpg" alt="" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-galaxy-900/60 via-galaxy-900/40 to-galaxy-900/80" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-8 py-5 border-b border-white/10 bg-black/30 backdrop-blur-xl flex items-center justify-between flex-none">
                <div className="flex items-center gap-3">
                    <img src="/3947771.png" alt="Kepler AI" className="h-10 w-10 object-contain" />
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Kepler AI
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                            Exoplanet Classification & Prediction System
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <Activity className="w-3 h-3 text-green-400" />
                        SYSTEM ONLINE
                    </div>
                    <span>v2.4.0-RC1</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 min-h-0 relative z-10">
                {/* Subtle accent glows on top of bg image */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-purple/15 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-accent-cyan/8 blur-[120px]" />
                </div>

                <div className="relative z-10 h-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    {/* Left Panel: Input Form */}
                    <div className="lg:col-span-4 min-h-0 h-full flex flex-col">
                        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-full">
                            <div className="px-5 py-3.5 border-b border-white/5 bg-white/5 flex-none">
                                <h2 className="text-sm font-semibold text-slate-300 tracking-wide">Observation Parameters</h2>
                            </div>
                            <InputForm onSubmit={handlePrediction} isLoading={loading} />
                        </div>
                    </div>

                    {/* Right Panel: Results & Viz */}
                    <div className="lg:col-span-8 min-h-0 flex flex-col overflow-y-auto custom-scrollbar">
                        <ResultsPanel result={result} />
                    </div>
                </div>
            </main>

            {/* Overlays */}
            {loading && <LoadingOverlay />}
            <ErrorBanner message={error || ''} onClose={() => setError(null)} />
        </div>
    );
};
