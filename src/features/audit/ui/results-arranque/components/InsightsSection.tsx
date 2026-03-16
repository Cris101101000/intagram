'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface InsightsSectionProps {
  daysSinceLastPost: number;
  isPaused: boolean;
}

interface InsightCard {
  icon: string;
  titleKey: string;
  descKey: string;
  statValue: string;
  statColor: string;
  statDescKey: string;
}

export function InsightsSection({ daysSinceLastPost, isPaused }: InsightsSectionProps) {
  const { t } = useTranslation('audit');
  const variant = isPaused ? 'paused' : 'new';

  const cards: InsightCard[] = [
    {
      icon: 'solar:magnifer-outline',
      titleKey: `audit_arranque_insight_1_title_${variant}`,
      descKey: `audit_arranque_insight_1_desc_${variant}`,
      statValue: '7 de 10',
      statColor: '#60A5FA',
      statDescKey: `audit_arranque_insight_1_stat_${variant}`,
    },
    {
      icon: isPaused ? 'solar:ghost-outline' : 'solar:shield-warning-outline',
      titleKey: `audit_arranque_insight_2_title_${variant}`,
      descKey: `audit_arranque_insight_2_desc_${variant}`,
      statValue: isPaused ? `${daysSinceLastPost} ${t('audit_arranque_hero_days')}` : '48h',
      statColor: '#F87171',
      statDescKey: `audit_arranque_insight_2_stat_${variant}`,
    },
    {
      icon: 'solar:chat-round-dots-outline',
      titleKey: `audit_arranque_insight_3_title_${variant}`,
      descKey: `audit_arranque_insight_3_desc_${variant}`,
      statValue: '<1h',
      statColor: '#D97706',
      statDescKey: `audit_arranque_insight_3_stat_${variant}`,
    },
  ];

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center">
        <SectionLabel color="orange">{t('audit_arranque_insights_label')}</SectionLabel>
        <h2 data-share-trigger className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12 }}>
          {t(`audit_arranque_insights_title_${variant}`)}
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560, marginBottom: 40 }}>
          {t(`audit_arranque_insights_subtitle_${variant}`)}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="reveal rounded-[20px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ padding: 24 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div
                className="flex shrink-0 items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: `${card.statColor}10` }}
              >
                <Icon icon={card.icon} width={20} height={20} color={card.statColor} />
              </div>
              <div className="flex-1">
                <div className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>
                  {t(card.titleKey)}
                </div>
                <p className="font-inter text-gray-500" style={{ fontSize: 15, lineHeight: 1.5 }}>
                  {t(card.descKey)}
                </p>
              </div>
            </div>

            {/* Stat bar */}
            <div
              className="flex items-center gap-3 rounded-[12px]"
              style={{ padding: '14px 16px', marginTop: 16, backgroundColor: `${card.statColor}08` }}
            >
              <span className="font-inter" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, color: card.statColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {card.statValue}
              </span>
              <span className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5 }}>
                {t(card.statDescKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ color, children }: { color: 'orange' | 'green' | 'blue'; children: React.ReactNode }) {
  const colors = {
    orange: { text: '#D97706', bar: '#FBBF24' },
    green: { text: '#2FBE8A', bar: '#34D399' },
    blue: { text: '#5694E1', bar: '#60A5FA' },
  };
  const c = colors[color];

  return (
    <div className="mb-3 inline-flex items-center gap-1.5 font-inter" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.text }}>
      <span className="inline-block rounded-full" style={{ width: 16, height: 2, backgroundColor: c.bar }} aria-hidden="true" />
      {children}
    </div>
  );
}

export { SectionLabel };
