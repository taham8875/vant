'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

interface LoadingScreenProps {
  /** Show the "Vant" text next to the logo */
  showText?: boolean;
  /** Size of the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Delay in ms before showing animated content (prevents flash on fast connections) */
  delay?: number;
}

export function LoadingScreen({ showText = true, size = 'xl', delay = 400 }: LoadingScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-950 overflow-hidden relative">
      <AnimatePresence>
        {showContent && (
          <>
            {/* Grid overlay */}
            <motion.div
              className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 0.5 }}
            />

            {/* Gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-black-900/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Floating blur orbs */}
            <motion.div
              className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/15 rounded-full blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.15, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: [1.1, 1, 1.1],
                x: [0, -25, 0],
                y: [0, 25, 0],
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
                x: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Centered logo with pulsing glow */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Pulsing glow ring */}
              <motion.div
                className="absolute inset-0 -m-8 bg-primary/20 rounded-full blur-2xl"
                initial={{ opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Logo entrance animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              >
                <Logo size={size} showText={showText} className="text-white" />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
