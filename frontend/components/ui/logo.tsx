'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', animated = true, showText = true }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const containerSizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`relative ${containerSizes[size]} aspect-square flex items-center justify-center`}
      >
        <svg
          className={`text-primary ${sizes[size]}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Geometric Background Shape */}
          {animated ? (
            <motion.rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: 1,
                pathOffset: [0, 0, 0, 1],
              }}
              transition={{
                duration: 3,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                times: [0, 0.4, 0.6, 1],
              }}
            />
          ) : (
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Stylized 'V' */}
          {animated ? (
            <motion.path
              d="M7 8L12 17L17 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                type: 'spring',
                stiffness: 120,
              }}
            />
          ) : (
            <path
              d="M7 8L12 17L17 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
      {showText && <span className={`font-bold tracking-tight text-foreground ${textSize[size]}`}>Vant</span>}
    </div>
  );
}
