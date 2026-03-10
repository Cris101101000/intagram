'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

type LoadingVariant = 'standard' | 'new' | 'returning';

interface LoadingMessagesProps {
  variant?: LoadingVariant;
}

const MESSAGE_KEYS: Record<LoadingVariant, string[]> = {
  standard: [
    'audit_loading_msg_1',
    'audit_loading_msg_2',
    'audit_loading_msg_3',
    'audit_loading_msg_4',
  ],
  new: [
    'audit_loading_new_msg_1',
    'audit_loading_new_msg_2',
    'audit_loading_new_msg_3',
    'audit_loading_new_msg_4',
  ],
  returning: [
    'audit_loading_returning_msg_1',
    'audit_loading_returning_msg_2',
    'audit_loading_returning_msg_3',
    'audit_loading_returning_msg_4',
  ],
};

const ROTATION_INTERVAL_MS = 4000;

export function LoadingMessages({ variant = 'standard' }: LoadingMessagesProps) {
  const { t } = useTranslation('audit');
  const [currentIndex, setCurrentIndex] = useState(0);
  const keys = MESSAGE_KEYS[variant];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % keys.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [keys.length]);

  return (
    <div className="mt-bewe-6 h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={`${variant}-${currentIndex}`}
          className="text-body font-inter text-base-oscura text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          {t(keys[currentIndex])}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
