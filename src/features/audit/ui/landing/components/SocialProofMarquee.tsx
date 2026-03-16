'use client';

import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface MarqueeItem {
  value: string;
  label: string;
}

export function SocialProofMarquee() {
  const { t } = useTranslation('audit');

  const items: MarqueeItem[] = [
    { value: t('audit_landing_marquee_profiles'), label: t('audit_landing_marquee_profiles_label') },
    { value: t('audit_landing_marquee_blind_spots'), label: t('audit_landing_marquee_blind_spots_label') },
    { value: t('audit_landing_marquee_time'), label: t('audit_landing_marquee_time_label') },
    { value: t('audit_landing_marquee_rating'), label: t('audit_landing_marquee_rating_label') },
    { value: t('audit_landing_marquee_privacy'), label: t('audit_landing_marquee_privacy_label') },
  ];

  const track = [...items, ...items];

  return (
    <section className="overflow-hidden border-y border-gray-200 py-8">
      <div className="animate-marquee flex w-max items-center gap-0">
        {track.map((item, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-3 px-8">
              <span className="text-h2 text-base-oscura font-inter whitespace-nowrap">
                {item.value}
              </span>
              <span className="text-small text-gray-400 font-inter whitespace-nowrap">
                {item.label}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
