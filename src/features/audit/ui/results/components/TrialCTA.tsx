'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

export function TrialCTA() {
  const { t } = useTranslation('audit');

  return (
    <section
      className="rounded-2xl px-bewe-6 py-bewe-7 md:px-bewe-7 md:py-bewe-7 flex flex-col items-center text-center gap-bewe-5"
      style={{ backgroundColor: '#0A2540' }}
    >
      {/* Icon */}
      <Icon
        icon="solar:rocket-2-outline"
        className="text-primary-400"
        width={48}
        height={48}
      />

      {/* Title */}
      <h1 className="text-h1 font-inter text-white">
        {t('audit_cta_diagnostico_title', '\u00bfListo para mejorar tu score?')}
      </h1>

      {/* Subtitle */}
      <p className="text-body font-inter text-white/70 max-w-md">
        {t(
          'audit_cta_diagnostico_subtitle',
          'Prueba Bewe gratis por 15 d\u00edas y deja que Linda IA transforme tu Instagram.'
        )}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-bewe-3">
        <Button
          size="lg"
          radius="full"
          className="bg-primary-400 text-white font-inter font-semibold text-button px-bewe-7"
        >
          Comenzar mi prueba gratis
        </Button>

        <Button
          size="lg"
          radius="full"
          variant="bordered"
          className="border-white/30 text-white font-inter font-semibold text-button px-bewe-7"
        >
          Ya tengo cuenta BeweOS
        </Button>
      </div>

      {/* Sub-text */}
      <p className="text-small font-inter text-white/50">
        Sin tarjeta de cr&eacute;dito. Cancela cuando quieras.
      </p>
    </section>
  );
}
