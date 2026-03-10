'use client';

import { Divider } from '@heroui/react';
import { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { ScoreBlock } from './ScoreBlock';
import { MetricsBlock } from './MetricsBlock';
import { HealthSignals } from './HealthSignals';
import { SectorRanking } from './SectorRanking';
import { CriticalPoints } from './CriticalPoints';
import { LindaSolutions } from './LindaSolutions';
import { ActionPlan } from './ActionPlan';
import { TrialCTA } from './TrialCTA';

interface DiagnosticoResultsProps {
  auditResult: AuditResult;
}

/**
 * Sector benchmarks for ER, CR, and RVR.
 * In production these would come from an API or config based on sector.
 */
const DEFAULT_BENCHMARKS = {
  engagementRate: 3.5,
  commentRate: 0.8,
  reelsViewRate: 15.0,
};

/**
 * Compute a rough percentile from the score.
 * 0-40 => top 80-60%, 41-60 => top 60-40%, 61-80 => top 40-20%, 81-100 => top 20-5%
 */
function computePercentile(score: number): number {
  if (score <= 40) return Math.round(80 - (score / 40) * 20);
  if (score <= 60) return Math.round(60 - ((score - 40) / 20) * 20);
  if (score <= 80) return Math.round(40 - ((score - 60) / 20) * 20);
  return Math.round(20 - ((score - 80) / 20) * 15);
}

export function DiagnosticoResults({ auditResult }: DiagnosticoResultsProps) {
  const {
    score,
    level,
    sector,
    postsAnalyzed,
    analysisWindow,
    metrics,
    normalizedMetrics,
    healthSignals,
    criticalPoints,
  } = auditResult;

  const percentile = computePercentile(score);

  return (
    <div className="flex flex-col gap-bewe-7 w-full max-w-container mx-auto px-bewe-4 py-bewe-7">
      {/* Block 1 - Score + Context */}
      <ScoreBlock
        score={score}
        level={level}
        sector={sector}
        postsAnalyzed={postsAnalyzed}
        analysisWindow={analysisWindow}
        hasReels={metrics.hasReels}
      />

      <Divider />

      {/* Block 2a - Metrics */}
      <MetricsBlock
        metrics={metrics}
        normalizedMetrics={normalizedMetrics}
        sector={sector}
        benchmarks={DEFAULT_BENCHMARKS}
      />

      {/* Block 2b - Health Signals */}
      <HealthSignals healthSignals={healthSignals} />

      <Divider />

      {/* Block 3 - Sector Ranking */}
      <SectorRanking
        percentile={percentile}
        sector={sector}
        level={level}
      />

      <Divider />

      {/* Block 4 - Critical Points */}
      <CriticalPoints criticalPoints={criticalPoints} />

      {/* Block 5 - Linda Solutions */}
      <LindaSolutions criticalPoints={criticalPoints} />

      <Divider />

      {/* Block 6a - Action Plan */}
      <ActionPlan level={level} />

      {/* Block 6b - Trial CTA */}
      <TrialCTA />
    </div>
  );
}
