'use client';

import { motion } from 'framer-motion';

export function GradientLoader() {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #60A5FA, #34D399, #60A5FA)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[3px] rounded-full bg-soft-aqua" />
    </div>
  );
}
