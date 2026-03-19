'use client';

import { useEffect, useRef } from 'react';
import { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { AuroraBackground } from '@/features/audit/ui/_shared/components/AuroraBackground';
import { ScoreBlock } from './ScoreBlock';
import { MetricsBlock } from './MetricsBlock';
import { SectorRanking } from './SectorRanking';
import { CriticalPoints } from './CriticalPoints';
import { LindaSolutions } from './LindaSolutions';
import { ActionPlan } from './ActionPlan';
import { CTAPhoneNotifs } from '@/features/audit/ui/_shared/components/CTAPhoneNotifs';
import { BenchmarkSources } from '@/features/audit/ui/_shared/components/BenchmarkSources';
import { ShareSlide } from '@/features/audit/ui/_shared/components/ShareSlide';
import { BeweFooter } from '@/features/audit/ui/_shared/components/BeweFooter';
import { MoreTools } from '@/features/audit/ui/_shared/components/MoreTools';
import { LEVEL_CONFIG } from '../constants/level-config';

interface DiagnosticoResultsProps {
  auditResult: AuditResult;
  accessToken?: string | null;
  signupUrl?: string | null;
}

function computePercentile(score: number): number {
  if (score <= 40) return Math.round(80 - (score / 40) * 20);
  if (score <= 60) return Math.round(60 - ((score - 40) / 20) * 20);
  if (score <= 80) return Math.round(40 - ((score - 60) / 20) * 20);
  return Math.round(20 - ((score - 80) / 20) * 15);
}

function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 0.08}s`;
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return containerRef;
}

export function DiagnosticoResults({ auditResult, accessToken, signupUrl }: DiagnosticoResultsProps) {
  const {
    username,
    profile,
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
  const containerRef = useScrollReveal();
  const cfg = LEVEL_CONFIG[level];

  return (
    <AuroraBackground containerRef={containerRef}>
      {/* Section 1 — Score hero */}
      <section className="relative" style={{ padding: '64px 0 80px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <ScoreBlock
            username={username}
            score={score}
            level={level}
            sector={sector}
            postsAnalyzed={postsAnalyzed}
            analysisWindow={analysisWindow}
            hasReels={metrics.hasReels}
            profilePicUrl={profile.profilePicUrl}
          />
        </div>
      </section>

      {/* Section 2 — Metrics (with integrated health signals) */}
      <section style={{ padding: '72px 0' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <MetricsBlock
            metrics={metrics}
            normalizedMetrics={normalizedMetrics}
            healthSignals={healthSignals}
            sector={sector}
            score={score}
            followersCount={profile.followersCount}
            postsAnalyzed={postsAnalyzed}
          />
        </div>
      </section>

      {/* Section 3 — Sector Ranking */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <SectorRanking
            score={score}
            percentile={percentile}
            sector={sector}
            level={level}
          />
        </div>
      </section>

      {/* Section 4 — Critical Points */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <CriticalPoints criticalPoints={criticalPoints} level={level} />
        </div>
      </section>

      {/* Section 5 — Linda Solutions */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[1060px] px-6">
          <LindaSolutions
            criticalPoints={criticalPoints}
            username={username}
            profilePicUrl={profile.profilePicUrl}
            fullName={profile.fullName}
            biography={profile.biography}
          />
        </div>
      </section>

      {/* Section 6 — Action Plan */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <ActionPlan level={level} />
        </div>
      </section>

      {/* Section 7 — CTA */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <CTAPhoneNotifs username={username} sector={sector} page="diagnostico" signupUrl={signupUrl} />
        </div>
      </section>

      {/* Section 8 — More Tools */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <MoreTools />
        </div>
      </section>

      {/* Section 9 — Benchmark Sources */}
      <section style={{ padding: '0 0 48px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <BenchmarkSources />
        </div>
      </section>

      {/* Footer */}
      <BeweFooter />

      {/* ShareSlide — triggered by MetricsBlock H2 */}
      <ShareSlide
        username={username}
        profilePicUrl={profile.profilePicUrl}
        score={score}
        level={level}
        sector={sector}
        route={auditResult.route}
        percentile={percentile}
        triggerSelector="[data-share-trigger]"
        accessToken={accessToken}
      />
    </AuroraBackground>
  );
}
