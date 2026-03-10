'use client';

import { motion } from 'framer-motion';
import type { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { ProfileStatus } from './ProfileStatus';
import { GrowthMetrics } from './GrowthMetrics';
import { StartupPlan } from './StartupPlan';
import { TrialCTA } from '@/features/audit/ui/results/components/TrialCTA';

interface ArranqueResultsProps {
  auditResult: AuditResult;
}

export function ArranqueResults({ auditResult }: ArranqueResultsProps) {
  return (
    <motion.div
      className="min-h-screen bg-soft-aqua px-bewe-4 py-bewe-7"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-container mx-auto flex flex-col gap-bewe-7">
        {/* Block 1 — Profile status */}
        <ProfileStatus
          profile={auditResult.profile}
          healthSignals={auditResult.healthSignals}
        />

        {/* Block 2 — Growth metrics education */}
        <GrowthMetrics />

        {/* Block 3 — 30-day startup plan */}
        <StartupPlan />

        {/* CTA — Trial */}
        <TrialCTA />
      </div>
    </motion.div>
  );
}
