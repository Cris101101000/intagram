'use client';

import { motion } from 'framer-motion';
import { AuditResult, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { ScoreComparison } from './ScoreComparison';
import { MetricsComparison } from './MetricsComparison';
import { Achievements } from './Achievements';
import { ShareCTA } from './ShareCTA';
import { NextSteps } from './NextSteps';

interface EvolucionResultsProps {
  auditResult: AuditResult;
  evolutionData: EvolutionData;
}

export function EvolucionResults({ auditResult, evolutionData }: EvolucionResultsProps) {
  const { t } = useTranslation('audit');

  // Derive previous level from previous score
  const previousLevel = (() => {
    const s = evolutionData.previous.score;
    if (s >= 80) return ScoreLevel.EXCELENTE;
    if (s >= 60) return ScoreLevel.BUENO;
    if (s >= 40) return ScoreLevel.REGULAR;
    return ScoreLevel.CRITICO;
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col w-full max-w-container mx-auto px-bewe-4 md:px-bewe-6"
    >
      {/* Block 1: Score Comparison */}
      <ScoreComparison
        currentScore={auditResult.score}
        previousScore={evolutionData.previous.score}
        currentLevel={auditResult.level}
        previousLevel={previousLevel}
      />

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Block 2: Metrics Comparison */}
      <MetricsComparison
        currentMetrics={auditResult.metrics}
        previousMetrics={evolutionData.previous.metrics}
        currentSignals={auditResult.healthSignals}
      />

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Block 3: Achievements (only if there are improvements) */}
      <Achievements achievements={evolutionData.achievements} />

      {/* Block 4: Share CTA (no sales pitch for returning users) */}
      <ShareCTA
        username={auditResult.username}
        currentScore={auditResult.score}
        previousScore={evolutionData.previous.score}
      />

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Block 5: Next Steps */}
      <NextSteps
        currentScore={auditResult.score}
        previousScore={evolutionData.previous.score}
        metrics={auditResult.metrics}
        healthSignals={auditResult.healthSignals}
      />
    </motion.div>
  );
}
