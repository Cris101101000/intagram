'use client';

import { motion } from 'framer-motion';
import { Chip } from '@heroui/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { getScoreLevel } from '@/features/audit/domain/constants/levels';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface ScoreBlockProps {
  score: number;
  level: ScoreLevel;
  sector: string;
  postsAnalyzed: number;
  analysisWindow: number;
  hasReels: boolean;
}

const LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'Critico',
  [ScoreLevel.REGULAR]: 'Regular',
  [ScoreLevel.BUENO]: 'Bueno',
  [ScoreLevel.EXCELENTE]: 'Excelente',
};

const LEVEL_TRANSLATION_KEYS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'audit_score_critico_label',
  [ScoreLevel.REGULAR]: 'audit_score_regular_label',
  [ScoreLevel.BUENO]: 'audit_score_bueno_label',
  [ScoreLevel.EXCELENTE]: 'audit_score_excelente_label',
};

const LEVEL_MESSAGE_KEYS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'audit_score_critico_headline',
  [ScoreLevel.REGULAR]: 'audit_score_regular_headline',
  [ScoreLevel.BUENO]: 'audit_score_bueno_headline',
  [ScoreLevel.EXCELENTE]: 'audit_score_excelente_headline',
};

export function ScoreBlock({
  score,
  level,
  sector,
  postsAnalyzed,
  analysisWindow,
  hasReels,
}: ScoreBlockProps) {
  const { t } = useTranslation('audit');
  const config = getScoreLevel(score);

  return (
    <motion.section
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center text-center gap-bewe-4"
    >
      {/* Headline */}
      <h2 className="text-h2 font-inter text-base-oscura">
        {t(LEVEL_MESSAGE_KEYS[level])}
      </h2>

      {/* Score number */}
      <span
        className="font-merriweather font-bold select-none"
        style={{ fontSize: '96px', lineHeight: 1.1, color: config.color }}
      >
        {score}
      </span>

      {/* Level pill badge */}
      <Chip
        size="lg"
        classNames={{
          base: 'px-bewe-4 py-bewe-2',
          content: 'font-inter font-semibold text-white text-small',
        }}
        style={{ backgroundColor: config.color }}
      >
        {t(LEVEL_TRANSLATION_KEYS[level], LEVEL_LABELS[level])}
      </Chip>

      {/* Benchmark text */}
      <p className="text-small font-inter text-base-oscura/60">
        Comparado con negocios de <span className="font-semibold">{sector}</span> en
        Latinoam&eacute;rica (benchmark 2025)
      </p>

      {/* Posts analyzed */}
      <p className="text-small font-inter text-base-oscura/50">
        An&aacute;lisis basado en tus &uacute;ltimos {postsAnalyzed} posts ({analysisWindow} d&iacute;as)
      </p>

      {/* No reels warning */}
      {!hasReels && (
        <p className="text-small font-inter text-semantic-warning font-medium">
          Sin Reels detectados &mdash; peso redistribuido entre ER y CR
        </p>
      )}
    </motion.section>
  );
}
