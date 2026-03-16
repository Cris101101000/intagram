'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface FeatureCard {
  titleKey: string;
  descKey: string;
  tagKey: string;
  iconBg: string;
  iconName: string;
  iconColor: string;
}

const CARDS: FeatureCard[] = [
  {
    titleKey: 'audit_landing_features_card1_title',
    descKey: 'audit_landing_features_card1_desc',
    tagKey: 'audit_landing_features_card1_tag',
    iconBg: 'bg-primary-100',
    iconName: 'solar:chart-square-outline',
    iconColor: '#60A5FA',
  },
  {
    titleKey: 'audit_landing_features_card2_title',
    descKey: 'audit_landing_features_card2_desc',
    tagKey: 'audit_landing_features_card2_tag',
    iconBg: 'bg-secondary-100',
    iconName: 'solar:ranking-outline',
    iconColor: '#34D399',
  },
  {
    titleKey: 'audit_landing_features_card3_title',
    descKey: 'audit_landing_features_card3_desc',
    tagKey: 'audit_landing_features_card3_tag',
    iconBg: 'bg-linda',
    iconName: 'solar:clipboard-check-outline',
    iconColor: '#FBBF24',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function FeaturesSection() {
  const { t } = useTranslation('audit');
  const { ref, visible } = useInView();

  return (
    <section className="py-24 px-6 sm:px-12" ref={ref}>
      <div className="mx-auto" style={{ maxWidth: 1152 }}>
        {/* Header */}
        <div className="mb-16 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-5 bg-primary-400" aria-hidden="true" />
            <span className="text-small font-inter font-bold uppercase tracking-[0.08em] text-primary-500">
              {t('audit_landing_features_label')}
            </span>
            <div className="h-px w-5 bg-primary-400" aria-hidden="true" />
          </div>
          <h2 className="font-inter text-base-oscura mb-4" style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}>
            {t('audit_landing_features_title')}
          </h2>
          <p className="text-body text-gray-500 font-inter max-w-xl">
            {t('audit_landing_features_subtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-[20px] border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary-200 overflow-hidden"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
              }}
            >
              {/* Gradient top line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #60A5FA, #34D399)' }}
                aria-hidden="true"
              />

              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon icon={card.iconName} width={24} height={24} color={card.iconColor} aria-hidden="true" />
              </div>

              <h3 className="text-h3 font-inter text-base-oscura mb-3">
                {t(card.titleKey)}
              </h3>

              <p className="text-body text-gray-500 font-inter mb-5 flex-1">
                {t(card.descKey)}
              </p>

              <span className="mt-auto inline-block self-start rounded-full bg-primary-100 px-3 py-1 text-small font-inter text-primary-500">
                {t(card.tagKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
