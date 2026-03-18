'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';

// ---------------------------------------------------------------------------
// Score ring
// ---------------------------------------------------------------------------

const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

const LEVEL_COLORS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: '#F87171',
  [ScoreLevel.REGULAR]: '#FBBF24',
  [ScoreLevel.BUENO]: '#38BDF8',
  [ScoreLevel.EXCELENTE]: '#34D399',
};

function useCountUp(target: number, duration: number, delay: number): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

interface ScoreRingProps {
  score: number;
  size: number;
  strokeColor: string;
  isGradient?: boolean;
  label: string;
  delay: number;
  countDuration: number;
  dimmed?: boolean;
}

function ScoreRing({ score, size, strokeColor, isGradient, label, delay, countDuration, dimmed }: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const displayScore = useCountUp(score, countDuration, delay + 800);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const r = 52;
  const viewBox = `0 0 ${size} ${size}`;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={viewBox} className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          {isGradient && (
            <defs>
              <linearGradient id="evo-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
          )}
          <circle cx={center} cy={center} r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
          <circle
            cx={center} cy={center} r={r} fill="none"
            stroke={isGradient ? 'url(#evo-ring-grad)' : strokeColor}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={animated ? offset : CIRCUMFERENCE}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-inter"
            style={{
              fontSize: size > 140 ? 40 : 32,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: dimmed ? '#9CA3AF' : '#0A2540',
              opacity: displayScore > 0 ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            {displayScore}
          </span>
          <span
            className="font-inter"
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: dimmed ? '#D1D5DB' : '#9CA3AF',
              marginTop: 2,
            }}
          >
            Score
          </span>
        </div>
      </div>
      <span className="font-inter text-gray-400" style={{ fontSize: 13, fontWeight: 400 }}>
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

interface EvolutionHeroProps {
  data: EvolutionData;
  profilePicUrl?: string;
}

export function EvolutionHero({ data, profilePicUrl }: EvolutionHeroProps) {
  const { improved, scoreDelta, daysBetween, dateBefore, dateAfter, levelBefore, levelAfter } = data;
  const prevScore = data.previous.score;
  const currScore = data.current.score;
  const levelChanged = levelBefore !== levelAfter;
  const proxiedPic = proxyImageUrl(profilePicUrl);

  return (
    <div className="reveal flex flex-col items-center text-center">
      {/* Profile picture */}
      {proxiedPic && (
        <div className="mb-4">
          <img
            src={proxiedPic}
            alt={`Foto de perfil de @${data.current.profile.username} en Instagram`}
            loading="lazy"
            className="rounded-full object-cover"
            style={{ width: 72, height: 72, border: '3px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          />
        </div>
      )}

      {/* Headline */}
      <h1
        className="font-inter text-base-oscura"
        style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 12 }}
      >
        {improved
          ? 'Tu Instagram creció. Y los datos lo demuestran.'
          : 'Tu score se mantuvo. Veamos qué pasó.'}
      </h1>

      {/* Subtitle */}
      <p
        className="font-inter text-gray-500"
        style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, maxWidth: 560, marginBottom: 40 }}
      >
        {improved
          ? `Hace ${daysBetween} días hiciste tu primera auditoría. Desde entonces, Linda IA ha estado trabajando. Estos son los resultados.`
          : `Hace ${daysBetween} días hiciste tu primera auditoría. Tu score no subió esta vez, pero eso no significa que no haya progreso.`}
      </p>

      {/* Score rings */}
      <div className="flex items-center justify-center gap-6 sm:gap-10" style={{ marginBottom: 32 }}>
        {/* Before */}
        <ScoreRing
          score={prevScore}
          size={120}
          strokeColor="#D1D5DB"
          label={dateBefore}
          delay={200}
          countDuration={1200}
          dimmed
        />

        {/* Arrow + delta */}
        <div className="flex flex-col items-center gap-1">
          <div
            style={{ animation: 'evo-arrow-pulse 2s ease-in-out infinite' }}
          >
            <Icon icon="solar:arrow-right-outline" width={24} height={24} color={improved ? '#34D399' : '#F87171'} />
          </div>
          <span
            className="font-inter"
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: improved ? '#34D399' : scoreDelta === 0 ? '#9CA3AF' : '#F87171',
            }}
          >
            {improved ? '+' : ''}{scoreDelta}
          </span>
        </div>

        {/* After */}
        <ScoreRing
          score={currScore}
          size={160}
          strokeColor="#34D399"
          isGradient
          label={dateAfter}
          delay={400}
          countDuration={1800}
        />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full font-inter"
          style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, backgroundColor: 'rgba(96,165,250,0.08)', color: '#60A5FA' }}
        >
          <Icon icon="solar:buildings-outline" width={14} height={14} />
          Sector: {data.current.sector}
        </span>

        <span
          className="inline-flex items-center gap-1.5 rounded-full font-inter"
          style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, backgroundColor: 'rgba(96,165,250,0.08)', color: '#60A5FA' }}
        >
          <Icon icon="solar:calendar-outline" width={14} height={14} />
          {daysBetween} días de evolución
        </span>

        {levelChanged ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full font-inter"
            style={{
              padding: '6px 14px', fontSize: 13, fontWeight: 600,
              backgroundColor: improved ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
              color: improved ? '#34D399' : '#F87171',
            }}
          >
            <Icon icon={improved ? 'solar:cup-star-outline' : 'solar:info-circle-outline'} width={14} height={14} />
            Nuevo nivel: {levelAfter}
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 rounded-full font-inter"
            style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, backgroundColor: 'rgba(148,163,184,0.08)', color: '#94A3B8' }}
          >
            <Icon icon="solar:chart-2-outline" width={14} height={14} />
            Nivel: {levelAfter} (sin cambio)
          </span>
        )}
      </div>
    </div>
  );
}
