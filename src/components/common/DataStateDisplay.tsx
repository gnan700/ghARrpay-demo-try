"use client";

import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, Inbox } from 'lucide-react';

interface DataStateDisplayProps {
    isLoading: boolean;
    isEmpty: boolean;
    emptyMessage?: string;
    onRefresh: () => void;
    children: React.ReactNode;
}

export default function DataStateDisplay({
    isLoading,
    isEmpty,
    emptyMessage = "No data found",
    onRefresh,
    children
}: DataStateDisplayProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="h-12 w-12 rounded-2xl bg-[#1E1E1E] mb-4 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-slate-800 animate-spin" />
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Fetching latest data...</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
                <div className="h-20 w-20 rounded-[32px] bg-[#1E1E1E] border border-[#2E2E2E] flex items-center justify-center text-slate-500 mb-6 shadow-2xl">
                    <Inbox className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{emptyMessage}</h3>
                <p className="text-slate-500 text-sm max-w-xs mb-8">
                    We couldn't find any records matching your current criteria.
                </p>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4ADE80] hover:bg-[#22C55E] text-[#121212] font-black text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)] active:scale-95"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                </button>
            </motion.div>
        );
    }

    return <>{children}</>;
}
