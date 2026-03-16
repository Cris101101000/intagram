'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

const FLOATING_EMOJIS = [
  { emoji: '📸', top: '8%', left: '8%', size: 28, delay: '0s', duration: '6s' },
  { emoji: '💬', top: '15%', right: '12%', size: 24, delay: '1s', duration: '7s' },
  { emoji: '📈', bottom: '20%', left: '5%', size: 22, delay: '0.5s', duration: '5.5s' },
  { emoji: '🎯', top: '55%', right: '6%', size: 26, delay: '2s', duration: '6.5s' },
  { emoji: '⭐', bottom: '10%', right: '18%', size: 20, delay: '1.5s', duration: '5s' },
  { emoji: '🚀', top: '5%', left: '45%', size: 22, delay: '0.8s', duration: '7.5s' },
  { emoji: '❤️', bottom: '8%', left: '20%', size: 24, delay: '2.5s', duration: '6s' },
  { emoji: '👀', top: '40%', left: '3%', size: 20, delay: '1.2s', duration: '5.8s' },
];

export function ArranqueCTA() {
  const { t } = useTranslation('audit');

  return (
    <div className="reveal">
      <div
        className="relative z-10 mx-auto flex flex-col items-center text-center overflow-hidden rounded-3xl border border-gray-200"
        style={{
          maxWidth: 680,
          padding: '64px 40px',
          boxShadow: '0 24px 80px rgba(10,37,64,0.08)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.9) 100%)',
        }}
      >
        {/* Floating emojis */}
        {FLOATING_EMOJIS.map((item, i) => (
          <span
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              fontSize: item.size,
              lineHeight: 1,
              opacity: 0.6,
              filter: 'drop-shadow(0 2px 4px rgba(10,37,64,0.08))',
              animation: `cta-float ${item.duration} ease-in-out infinite ${item.delay}`,
            }}
            aria-hidden="true"
          >
            {item.emoji}
          </span>
        ))}

        {/* Soft glow behind button */}
        <div
          className="absolute rounded-full"
          style={{
            width: 320, height: 320,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Title */}
        <h2
          className="relative font-inter text-base-oscura"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          {t('audit_arranque_cta_title_new')}
        </h2>

        {/* Subtitle */}
        <p
          className="relative font-inter text-gray-500"
          style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 36, maxWidth: 440 }}
        >
          {t('audit_arranque_cta_subtitle_new')}
        </p>

        {/* CTA Button */}
        <button
          type="button"
          className="cta-shimmer relative mb-4 inline-flex items-center gap-2.5 rounded-full font-inter text-white transition-all hover:-translate-y-1 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #34D399, #60A5FA)',
            fontSize: 17,
            fontWeight: 700,
            padding: '20px 52px',
            boxShadow: '0 8px 32px rgba(52,211,153,0.35)',
            animation: 'cta-pulse 2.5s ease-in-out infinite',
          }}
        >
          <span className="relative z-10 inline-flex items-center gap-2.5">
            {t('audit_arranque_cta_button_primary')}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="cta-arrow">
              <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Trust note */}
        <div className="relative flex items-center gap-4 font-inter text-gray-400" style={{ fontSize: 13 }}>
          <span className="flex items-center gap-1">
            <Icon icon="solar:shield-check-outline" width={14} height={14} color="#34D399" />
            30 días gratis
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="solar:card-outline" width={14} height={14} color="#34D399" />
            Sin tarjeta
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="solar:close-circle-outline" width={14} height={14} color="#34D399" />
            Cancela cuando quieras
          </span>
        </div>
      </div>
    </div>
  );
}
