'use client';

import { useEffect, useRef } from 'react';
import { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { AuroraBackground } from '@/features/audit/ui/_shared/components/AuroraBackground';
import { EvolutionHero } from './EvolutionHero';
import { EvolutionMetrics } from './EvolutionMetrics';
import { EvolutionRanking } from './EvolutionRanking';
import { EvolutionAchievements } from './EvolutionAchievements';
import { EvolutionTips } from './EvolutionTips';
import { EvolutionCTA } from './EvolutionCTA';
import { BeweFooter } from '@/features/audit/ui/_shared/components/BeweFooter';
import { MoreTools } from '@/features/audit/ui/_shared/components/MoreTools';

interface EvolucionResultsProps {
  auditResult: AuditResult;
  evolutionData: EvolutionData;
  accessToken?: string | null;
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

export function EvolucionResults({ auditResult, evolutionData, accessToken }: EvolucionResultsProps) {
  const containerRef = useScrollReveal();
  const { improved } = evolutionData;

  return (
    <AuroraBackground variant={improved ? 'default' : 'warm'} containerRef={containerRef}>
      {/* Section 1 — Hero */}
      <section className="relative" style={{ padding: '64px 0 80px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <EvolutionHero data={evolutionData} profilePicUrl={auditResult.profile.profilePicUrl} />
        </div>
      </section>

      {/* Section 2 — Metrics */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <EvolutionMetrics data={evolutionData} />
        </div>
      </section>

      {/* Section 3 — Sector Ranking comparison */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <EvolutionRanking data={evolutionData} />
        </div>
      </section>

      {/* Section 4 — Achievements or Tips */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          {improved ? (
            <EvolutionAchievements data={evolutionData} />
          ) : (
            <EvolutionTips data={evolutionData} />
          )}
        </div>
      </section>

      {/* Section 4 — CTA */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <EvolutionCTA data={evolutionData} />
        </div>
      </section>

      {/* More Tools */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <MoreTools />
        </div>
      </section>

      {/* Footer */}
      <BeweFooter />
    </AuroraBackground>
  );
}
