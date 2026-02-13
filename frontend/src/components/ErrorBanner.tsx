import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorBannerProps {
    message: string;
    onClose: () => void;
}

export const ErrorBanner = ({ message, onClose }: ErrorBannerProps) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 right-6 z-50 max-w-md w-full"
                >
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-900/20 backdrop-blur-xl border border-red-500/30 text-red-200 shadow-lg shadow-red-900/20">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                        <p className="flex-1 text-sm font-medium">{message}</p>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
