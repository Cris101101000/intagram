'use client';

import { motion } from 'framer-motion';
import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { BlurredScore } from './BlurredScore';
import { LevelBadge } from './LevelBadge';
import { UnlockForm, type CaptureFormData } from './UnlockForm';

interface CaptureScreenProps {
  score: number;
  level: ScoreLevel;
  route: AuditRoute;
  postsCount?: number;
  onSubmit: (data: CaptureFormData) => void;
  isLoading?: boolean;
}

export function CaptureScreen({
  score,
  level,
  route,
  postsCount,
  onSubmit,
  isLoading,
}: CaptureScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center bg-soft-aqua px-bewe-4 py-bewe-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-bewe-5">
        <BlurredScore score={score} route={route} />

        <LevelBadge score={score} level={level} route={route} postsCount={postsCount} />

        <UnlockForm route={route} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
