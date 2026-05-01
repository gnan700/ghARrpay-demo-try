"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if splash has already been shown this session
        const hasShown = sessionStorage.getItem('splash_shown');

        if (!hasShown) {
            setIsVisible(true);
            sessionStorage.setItem('splash_shown', 'true');

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2000); // Show for 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mb-8"
                        >
                            <span className="text-5xl font-black italic tracking-tighter text-[#4ADE80]">
                                GHARPAYY
                            </span>
                        </motion.div>

                        <div className="relative h-1.5 w-64 bg-[#1E1E1E] rounded-full overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-[#4ADE80]"
                                initial={{ left: "-100%" }}
                                animate={{ left: "0%" }}
                                transition={{
                                    duration: 1.8,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-[100px] pointer-events-none"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
