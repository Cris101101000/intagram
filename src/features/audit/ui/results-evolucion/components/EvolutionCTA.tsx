'use client';

import { Icon } from '@iconify/react';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { trackSharedInstagram } from '@/features/audit/infrastructure/analytics/audit-analytics';

// ---------------------------------------------------------------------------
// Particles (floating background dots)
// ---------------------------------------------------------------------------

const PARTICLES = [
  { left: '10%', size: 5, color: '#0EA5E9', delay: '0s', duration: '7s' },
  { left: '25%', size: 7, color: '#38BDF8', delay: '1.2s', duration: '6s' },
  { left: '45%', size: 4, color: '#67E8F9', delay: '0.5s', duration: '8s' },
  { left: '65%', size: 8, color: '#34D399', delay: '2s', duration: '6.5s' },
  { left: '80%', size: 5, color: '#38BDF8', delay: '0.8s', duration: '7.5s' },
  { left: '90%', size: 6, color: '#0EA5E9', delay: '2.5s', duration: '6s' },
];

function Particles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: p.color,
            animation: `share-particle ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Phone Mockup with Ocean Depth Story
// ---------------------------------------------------------------------------

function PhoneMockup({
  username,
  scoreBefore,
  scoreAfter,
  scoreDelta,
}: {
  username: string;
  scoreBefore: number;
  scoreAfter: number;
  scoreDelta: number;
}) {
  const circumference = 2 * Math.PI * 54; // ~339.29
  const offset = circumference - (scoreAfter / 100) * circumference;

  return (
    <div
      className="relative inline-block"
      style={{
        marginBottom: 36,
        animation: 'share-phone-float 4s ease-in-out infinite',
      }}
    >
      {/* Glow behind phone */}
      <div
        className="absolute"
        style={{
          width: 280,
          height: 280,
          top: '50%',
          left: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(56,189,248,0.1) 40%, transparent 70%)',
          animation: 'share-glow-pulse 3s ease-in-out infinite',
          zIndex: -1,
        }}
        aria-hidden="true"
      />

      {/* Phone frame */}
      <div
        className="relative sm:w-[210px] sm:h-[420px] w-[180px] h-[360px]"
        style={{
          borderRadius: 30,
          background: '#000',
          padding: 7,
          boxShadow:
            '0 0 0 2px rgba(255,255,255,0.08), 0 20px 60px rgba(10,37,64,0.2), 0 0 80px rgba(14,165,233,0.12), 0 0 120px rgba(56,189,248,0.08)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 7,
            width: 70,
            height: 22,
            background: '#000',
            borderRadius: '0 0 12px 12px',
            zIndex: 10,
          }}
          aria-hidden="true"
        />

        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: 23 }}
        >
          {/* Ocean Depth background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(160deg, #0C1222 0%, #0E4166 35%, #0284C7 65%, #38BDF8 100%)',
            }}
          />

          {/* Radial glows */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 25% 70%, rgba(56,189,248,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 30%, rgba(52,211,153,0.15) 0%, transparent 50%)',
            }}
            aria-hidden="true"
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              animation: 'share-grid-shift 20s linear infinite',
            }}
            aria-hidden="true"
          />

          {/* Story content */}
          <div
            className="relative z-[2] flex flex-col items-center text-white h-full"
            style={{ padding: '30px 18px 22px' }}
          >
            {/* Logo */}
            <span
              className="font-inter"
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.4,
              }}
            >
              BeweOS · IG Audit
            </span>

            {/* Username */}
            <span
              className="font-inter"
              style={{
                fontSize: 11,
                fontWeight: 600,
                opacity: 0.6,
                marginBottom: 12,
                marginTop: 4,
              }}
            >
              @{username}
            </span>

            {/* Score anterior */}
            <span
              className="font-inter"
              style={{
                fontSize: 7,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                opacity: 0.35,
              }}
            >
              Score anterior
            </span>
            <span
              className="font-inter"
              style={{
                fontSize: 24,
                fontWeight: 700,
                opacity: 0.3,
                letterSpacing: '-0.03em',
                marginBottom: 6,
                lineHeight: 1.1,
              }}
            >
              {scoreBefore}
            </span>

            {/* Score arc */}
            <div className="relative" style={{ width: 120, height: 120, marginBottom: 6 }}>
              {/* Hidden SVG for gradient definition */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="gOcean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>
                </defs>
              </svg>

              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                style={{ transform: 'rotate(-90deg)' }}
              >
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="7"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#gOcean)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-inter"
                  style={{
                    fontSize: 'clamp(32px, 8vw, 42px)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #fff, #67E8F9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {scoreAfter}
                </span>
                <span
                  className="font-inter"
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    opacity: 0.5,
                  }}
                >
                  Ahora
                </span>
              </div>
            </div>

            {/* Delta */}
            <span
              className="font-inter"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 4,
                background: 'linear-gradient(135deg, #67E8F9, #34D399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              +{scoreDelta} puntos
            </span>

            {/* Message */}
            <span
              className="font-inter text-center"
              style={{
                fontSize: 9,
                fontWeight: 600,
                opacity: 0.45,
                maxWidth: 140,
                marginBottom: 'auto',
              }}
            >
              Mi Instagram crecio con Linda IA
            </span>

            {/* Footer */}
            <div className="flex flex-col items-center gap-1.5 mt-auto">
              <span
                className="font-inter"
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  padding: '4px 12px',
                  borderRadius: 99,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                Haz tu auditoria gratis
              </span>
              <span
                className="font-inter"
                style={{ fontSize: 6, fontWeight: 600, opacity: 0.2 }}
              >
                bewe.io/audit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface EvolutionCTAProps {
  data: EvolutionData;
}

export function EvolutionCTA({ data }: EvolutionCTAProps) {
  const { improved } = data;
  const username = data.current.username;
  const scoreBefore = data.previous.score;
  const scoreAfter = data.current.score;
  const scoreDelta = data.scoreDelta;

  const handleShare = () => {
    trackSharedInstagram(username, { source: 'evolution_cta' });

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Mi Instagram Score',
          text: `Mi Instagram Score subio ${scoreDelta > 0 ? '+' : ''}${scoreDelta} puntos. De ${scoreBefore} a ${scoreAfter}.`,
          url: typeof window !== 'undefined' ? window.location.href : '',
        })
        .catch(() => {});
    }
  };

  const handleGoToPanel = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="reveal">
      <div className="relative overflow-x-clip" style={{ padding: '0 0 16px' }}>
        {/* Floating particles */}
        <Particles />

        {/* Content */}
        <div className="relative z-10 mx-auto flex flex-col items-center text-center" style={{ maxWidth: 520 }}>
          {/* Phone mockup — Variant A only */}
          {improved && (
            <PhoneMockup
              username={username}
              scoreBefore={scoreBefore}
              scoreAfter={scoreAfter}
              scoreDelta={scoreDelta}
            />
          )}

          {/* Title */}
          <h2
            className="font-inter text-base-oscura"
            style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            {improved ? (
              <>
                Tu Instagram crecio.
                <br />
                <span
                  className="font-merriweather italic"
                  style={{ fontWeight: 500, background: 'linear-gradient(135deg, #34D399, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Muestraselo al mundo.
                </span>
              </>
            ) : (
              <>
                Tu siguiente paso{' '}
                <span
                  className="font-merriweather italic"
                  style={{ fontWeight: 500, color: '#D97706' }}
                >
                  esta claro.
                </span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p
            className="font-inter text-gray-500"
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 420,
              marginBottom: 32,
            }}
          >
            {improved
              ? 'Comparte tu resultado en Stories y deja que tu red vea tu progreso. Cada persona que lo vea puede hacer su propia auditoria gratis.'
              : 'Revisa las acciones sugeridas arriba y activalas desde BeweOS. En 30 dias podras volver a medir.'}
          </p>

          {/* Single CTA button */}
          <button
            type="button"
            onClick={improved ? handleShare : handleGoToPanel}
            className="cta-shimmer relative overflow-hidden flex items-center justify-center gap-2 rounded-full font-inter text-white transition-all hover:-translate-y-0.5"
            style={{
              height: 48,
              padding: '0 36px',
              fontSize: 16,
              fontWeight: 600,
              background: improved
                ? 'linear-gradient(135deg, #34D399, #10B981)'
                : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
              boxShadow: improved
                ? '0 4px 16px rgba(52,211,153,0.30)'
                : '0 4px 16px rgba(251,191,36,0.30)',
            }}
          >
            {improved ? (
              <>
                <Icon icon="solar:upload-outline" width={18} height={18} />
                Compartir mi resultado
              </>
            ) : (
              <>
                Ir a mi panel BeweOS
                <Icon icon="solar:arrow-right-outline" width={18} height={18} />
              </>
            )}
          </button>

          {/* Note */}
          <p className="font-inter text-gray-400" style={{ fontSize: 12, marginTop: 16 }}>
            {improved
              ? 'Se genera una imagen optimizada para tus Stories de Instagram.'
              : 'Desde tu panel puedes activar las acciones recomendadas.'}
          </p>
        </div>
      </div>
    </div>
  );
}
