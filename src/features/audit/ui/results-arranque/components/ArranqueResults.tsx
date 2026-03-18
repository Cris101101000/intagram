'use client';

import { useEffect, useRef } from 'react';
import { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { AuroraBackground } from '@/features/audit/ui/_shared/components/AuroraBackground';
import { ArranqueHero } from './ArranqueHero';
import { InsightsSection } from './InsightsSection';
import { LindaFeatures } from './LindaFeatures';
import { StartupPlan } from './StartupPlan';
import { CTAPhoneNotifs } from '@/features/audit/ui/_shared/components/CTAPhoneNotifs';
import { ShareSlide } from '@/features/audit/ui/_shared/components/ShareSlide';
import { BeweFooter } from '@/features/audit/ui/_shared/components/BeweFooter';
import { MoreTools } from '@/features/audit/ui/_shared/components/MoreTools';

function computePercentile(score: number): number {
  if (score <= 40) return Math.round(80 - (score / 40) * 20);
  if (score <= 60) return Math.round(60 - ((score - 40) / 20) * 20);
  if (score <= 80) return Math.round(40 - ((score - 60) / 20) * 20);
  return Math.round(20 - ((score - 80) / 20) * 15);
}

interface ArranqueResultsProps {
  auditResult: AuditResult;
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

export function ArranqueResults({ auditResult, accessToken }: ArranqueResultsProps) {
  const { t } = useTranslation('audit');
  const { username, profile, healthSignals, metrics } = auditResult;
  const containerRef = useScrollReveal();

  const daysSinceLastPost = healthSignals.recency.daysSinceLastPost;
  const reelsPct = metrics.hasReels ? (healthSignals.formatMix.distribution['Clips'] ?? 0) : 0;
  const isPaused = daysSinceLastPost >= 90 || (profile.postsCount > 3 && profile.postsCount <= 10 && daysSinceLastPost > 7);

  return (
    <AuroraBackground containerRef={containerRef}>
      {/* Section 1 — Hero */}
      <section className="relative" style={{ padding: '64px 0 80px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <ArranqueHero
            username={username}
            followersCount={profile.followersCount}
            postsCount={profile.postsCount}
            daysSinceLastPost={daysSinceLastPost}
            reelsCount={reelsPct > 0 ? Math.round((reelsPct / 100) * profile.postsCount) : 0}
            isPaused={isPaused}
            profilePicUrl={profile.profilePicUrl}
          />
        </div>
      </section>

      {/* Section 2 — Insights */}
      <section style={{ padding: '72px 0' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <InsightsSection daysSinceLastPost={daysSinceLastPost} isPaused={isPaused} />
        </div>
      </section>

      {/* Narrative bridge 1 */}
      <section className="reveal pb-10 sm:pb-[72px]">
        <div className="mx-auto max-w-[1060px] px-6 text-center flex flex-col items-center">
          <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {t('audit_arranque_bridge_1_pre')}
          </h2>
          <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 16 }}>
            <span className="font-merriweather italic" style={{ fontWeight: 500, background: 'linear-gradient(135deg, #34D399, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Linda{' '}
            </span>
            {t('audit_arranque_bridge_1_post')}
          </h2>
          <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}>
            {t('audit_arranque_linda_subtitle')}
          </p>
        </div>
      </section>

      {/* Section 3 — Linda Features */}
      <section className="py-10 sm:py-[72px]">
        <div className="mx-auto max-w-[1060px] px-6">
          <LindaFeatures username={username} profilePicUrl={profile.profilePicUrl} fullName={profile.fullName} biography={profile.biography} />
        </div>
      </section>

      {/* Section 4 — Startup Plan */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 48 }}>
            <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 16 }}>
              ¿Cómo se ve todo esto en acción? Así es{' '}
              <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#2FBE8A' }}>
                tu primer mes
              </span>
              {' '}con Linda.
            </h2>
            <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 520 }}>
              {t('audit_arranque_plan_subtitle_new')}
            </p>
          </div>
          <StartupPlan />
        </div>
      </section>

      {/* Section 5 — CTA */}
      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <CTAPhoneNotifs username={username} sector={auditResult.sector} page="arranque" />
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

      {/* ShareSlide — triggered by InsightsSection H2 */}
      <ShareSlide
        username={username}
        profilePicUrl={profile.profilePicUrl}
        score={auditResult.score}
        level={auditResult.level}
        sector={auditResult.sector}
        route={auditResult.route}
        percentile={computePercentile(auditResult.score)}
        triggerSelector="[data-share-trigger]"
        accessToken={accessToken}
      />
    </AuroraBackground>
  );
}
