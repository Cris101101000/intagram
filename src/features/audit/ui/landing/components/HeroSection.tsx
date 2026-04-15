'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface HeroSectionProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
  apiError?: string;
}

/* ---- Floating particles (positioned on edges) ---- */
const PARTICLES = ['❤️', '💬', '🔥', '👀', '📈', '⭐', '🎯', '💡'];
const PARTICLE_POSITIONS = [3, 8, 92, 87, 5, 95, 10, 90]; // % from left

function EngagementParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((emoji, i) => (
        <span
          key={i}
          className="absolute text-lg select-none"
          style={{
            left: `${PARTICLE_POSITIONS[i]}%`,
            bottom: '-24px',
            animation: `float-up 6s ease-out infinite`,
            animationDelay: `${i * 0.75}s`,
            opacity: 0,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/* ---- Mini bar chart decoration ---- */
function ChartDecoration() {
  const bars = [40, 60, 80, 55, 90];
  const colors = ['#BFD9FD', '#9FC0FA', '#60A5FA', '#6EE7B7', '#34D399'];
  return (
    <div
      className="absolute hidden sm:block"
      style={{ bottom: '14%', left: '6%', opacity: 0.8, animation: 'float 6s ease-in-out infinite 2s' }}
      aria-hidden="true"
    >
      <div className="flex items-end gap-1.5 rounded-xl bg-white p-4 shadow-lg" style={{ height: 80 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm origin-bottom"
            style={{
              height: `${h}%`,
              backgroundColor: colors[i],
              animation: `bar-pulse 3s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---- Trust Avatars ---- */
const AVATAR_INITIALS = ['M', 'A', 'C', 'L', 'S'];
const AVATAR_COLORS = [
  'linear-gradient(135deg, #60A5FA, #3B82F6)',
  'linear-gradient(135deg, #34D399, #10B981)',
  'linear-gradient(135deg, #67E8F9, #60A5FA)',
  'linear-gradient(135deg, #FAD19E, #FBBF24)',
  'linear-gradient(135deg, #A7F3D0, #34D399)',
];

function TrustBar({ text }: { text: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="flex -space-x-2">
        {AVATAR_INITIALS.map((letter, i) => (
          <div
            key={i}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
            style={{ background: AVATAR_COLORS[i] }}
          >
            {letter}
          </div>
        ))}
      </div>
      <p className="text-small text-gray-500 font-inter text-center sm:text-left">
        <strong className="text-base-oscura">{text.split(' ')[0]}</strong>{' '}
        {text.split(' ').slice(1).join(' ')}
      </p>
    </div>
  );
}

/* ---- Instagram SVG icon ---- */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="#9CA3AF" stroke="none" />
    </svg>
  );
}

/* ---- Main Hero ---- */
export function HeroSection({ onSubmit, isLoading, apiError }: HeroSectionProps) {
  const { t } = useTranslation('audit');
  const { t: tc } = useTranslation('common');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const displayError = error || apiError || '';

  const handleSubmit = () => {
    const clean = username.replace(/^@/, '').trim();
    if (!clean) { setError(tc('validation_required')); return; }
    if (!/^[a-zA-Z0-9._]+$/.test(clean)) { setError(tc('validation_username')); return; }
    setError('');
    onSubmit(clean);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background is inherited from main */}

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0A2540 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* Orbs */}
      <div className="absolute animate-pulse-orb rounded-full" style={{ top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(96,165,250,0.20) 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="absolute animate-pulse-orb rounded-full" style={{ bottom: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)', animationDelay: '2s' }} aria-hidden="true" />
      <div className="absolute animate-pulse-orb rounded-full" style={{ top: '30%', left: '40%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(103,232,249,0.15) 0%, transparent 70%)', animationDelay: '4s' }} aria-hidden="true" />

      <EngagementParticles />
      <ChartDecoration />

      {/* Content */}
      <div className="relative z-10 mx-auto flex flex-col items-center text-center px-6 sm:px-12" style={{ maxWidth: 700 }}>
        {/* Eyebrow */}
        <div
          className="animate-fade-up mb-6 inline-flex items-center gap-2.5 rounded-full bg-white whitespace-nowrap"
          style={{ animationDelay: '0s', padding: '8px 16px', fontSize: 'clamp(11px, 3vw, 14px)', border: '2px solid rgba(96,165,250,0.2)', boxShadow: '0 2px 12px rgba(96,165,250,0.08)' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary-400" />
          </span>
          <span className="font-inter text-primary-500" style={{ fontWeight: 500 }}>{t('audit_landing_hero_eyebrow')}</span>
        </div>

        {/* H1 */}
        <h1
          className="animate-fade-up font-inter text-base-oscura"
          style={{ animationDelay: '0.1s', fontSize: 'clamp(28px, 7vw, 56px)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          <span className="block sm:whitespace-nowrap">Tu{' '}
            <span className="font-merriweather italic bg-clip-text text-transparent" style={{ fontWeight: 700, backgroundImage: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
              Instagram
            </span>
            {' '}tiene una historia.
          </span>
          <span className="block">Descubre qué dice</span>
          <span className="block">de{' '}
            <span className="font-merriweather italic bg-gradient-to-r from-secondary-400 to-soft-cian bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
              tu negocio.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up mt-5 max-w-[500px] text-body text-gray-500 font-inter"
          style={{ animationDelay: '0.2s' }}
        >
          {t('audit_landing_hero_subtitle')}
        </p>

        {/* Input group */}
        <div className="animate-fade-up mt-8 w-full max-w-[480px]" style={{ animationDelay: '0.3s' }}>
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-[20px] sm:rounded-full p-1.5 transition-all duration-200 ${
              displayError
                ? 'border-2 border-semantic-error ring-4 ring-semantic-error/10'
                : 'border border-white/80 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-400/10'
            }`}
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <div className="flex flex-1 items-center gap-2 px-4 py-2 sm:py-0">
              <InstagramIcon />
              <span className="text-gray-400 text-small font-inter">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={t('audit_landing_hero_input_placeholder')}
                className="flex-1 bg-transparent text-body font-inter text-base-oscura placeholder:text-gray-400 outline-none"
                aria-label={tc('field_username')}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-button font-inter text-white transition-all duration-200 hover:scale-[1.03] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', boxShadow: '0 4px 12px rgba(96,165,250,0.30)' }}
            >
              {isLoading ? tc('status_analyzing') : t('audit_landing_hero_button')}
              {!isLoading && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          {displayError && <p className="mt-2 text-small text-semantic-error font-inter text-center">{displayError}</p>}
        </div>

        {/* Trust bar */}
        <div className="animate-fade-up mt-8" style={{ animationDelay: '0.4s' }}>
          <TrustBar text={t('audit_landing_hero_trust')} />
        </div>
      </div>
    </section>
  );
}
