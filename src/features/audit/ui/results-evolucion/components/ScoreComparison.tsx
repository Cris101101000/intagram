'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface ScoreComparisonProps {
  currentScore: number;
  previousScore: number;
  currentLevel: ScoreLevel;
  previousLevel: ScoreLevel;
}

function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

function getScoreColor(level: ScoreLevel): string {
  switch (level) {
    case ScoreLevel.CRITICO:
      return 'text-semantic-error';
    case ScoreLevel.REGULAR:
      return 'text-semantic-warning';
    case ScoreLevel.BUENO:
      return 'text-primary-500';
    case ScoreLevel.EXCELENTE:
      return 'text-semantic-success';
    default:
      return 'text-base-oscura';
  }
}

function getScoreBorderColor(level: ScoreLevel): string {
  switch (level) {
    case ScoreLevel.CRITICO:
      return 'border-semantic-error';
    case ScoreLevel.REGULAR:
      return 'border-semantic-warning';
    case ScoreLevel.BUENO:
      return 'border-primary-500';
    case ScoreLevel.EXCELENTE:
      return 'border-semantic-success';
    default:
      return 'border-gray-300';
  }
}

export function ScoreComparison({
  currentScore,
  previousScore,
  currentLevel,
  previousLevel,
}: ScoreComparisonProps) {
  const { t } = useTranslation('audit');
  const animatedPrevious = useCountUp(previousScore, 1200);
  const animatedCurrent = useCountUp(currentScore, 1800);
  const delta = currentScore - previousScore;
  const improved = delta > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-bewe-5 py-bewe-6"
    >
      <h2 className="text-h2 font-inter font-semibold text-base-oscura text-center">
        Tu evolución de Instagram
      </h2>

      <div className="flex items-center gap-bewe-5">
        {/* Previous Score Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-50`}
        >
          <span className="text-small font-inter text-gray-400">Tu Score Antes</span>
          <span className="font-merriweather font-bold text-3xl text-gray-400">
            {animatedPrevious}
          </span>
        </motion.div>

        {/* Arrow + Delta */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col items-center gap-bewe-1"
        >
          <span className={`text-2xl ${improved ? 'text-semantic-success' : 'text-semantic-error'}`}>
            {improved ? '\u2192' : '\u2192'}
          </span>
          <span
            className={`text-button font-inter font-semibold ${
              improved ? 'text-semantic-success' : delta === 0 ? 'text-gray-400' : 'text-semantic-error'
            }`}
          >
            {improved ? '+' : ''}
            {delta} puntos
          </span>
        </motion.div>

        {/* Current Score Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 ${getScoreBorderColor(currentLevel)} bg-white shadow-lg`}
        >
          <span className="text-small font-inter text-base-oscura">Tu Score Ahora</span>
          <span className={`font-merriweather font-bold text-5xl ${getScoreColor(currentLevel)}`}>
            {animatedCurrent}
          </span>
        </motion.div>
      </div>

      {/* Level change text */}
      {previousLevel !== currentLevel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-body font-inter text-base-oscura text-center"
        >
          Pasaste de{' '}
          <span className="font-semibold text-gray-400">
            {t(`audit_score_${previousLevel.toLowerCase()}_label`, previousLevel)}
          </span>{' '}
          a{' '}
          <span className={`font-semibold ${getScoreColor(currentLevel)}`}>
            {t(`audit_score_${currentLevel.toLowerCase()}_label`, currentLevel)}
          </span>
        </motion.p>
      )}
    </motion.section>
  );
}
