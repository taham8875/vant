import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

// Dynamic import to avoid SSR issues with some motion features if needed,
// though 'use client' handles most. kept standard here.

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading: string | ReactNode;
}

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-center justify-center">
        {/* Background Gradients/Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-zinc-900/80" />

        {/* Floating Abstract Shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Logo size="xl" className="text-white mb-8" />
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Master your money,
              <br />
              <span className="text-primary-foreground">Effortlessly.</span>
            </h1>
            <p className="text-lg text-zinc-300 leading-relaxed opacity-90">
              Join thousands of users who have transformed their financial life with Vant&apos;s
              intuitive tracking and powerful insights.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              {heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              {subheading}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
