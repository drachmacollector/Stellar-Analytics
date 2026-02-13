import { motion } from 'framer-motion';

export const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-t-accent-cyan border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-accent-purple border-b-transparent border-l-transparent"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <p className="text-accent-cyan font-mono text-sm tracking-wider animate-pulse">
                    ANALYZING STELLAR DATA...
                </p>
            </div>
        </div>
    );
};
