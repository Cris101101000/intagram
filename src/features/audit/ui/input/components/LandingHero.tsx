'use client';

import { useTranslation } from '@/shared/ui/hooks/useTranslation';

export function LandingHero() {
  const { t } = useTranslation('audit');

  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      <h1 className="font-inter font-bold text-h1 text-base-oscura leading-tight">
        {t('audit_landing_title')}
      </h1>
      <p className="mt-4 text-body text-gray-500 font-inter">
        {t('audit_landing_subtitle')}
      </p>
    </div>
  );
}
