'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';
import { LEVEL_CONFIG } from '../constants/level-config';

interface ScoreBlockProps {
  username: string;
  score: number;
  level: ScoreLevel;
  sector: string;
  postsAnalyzed: number;
  analysisWindow: number;
  hasReels: boolean;
  profilePicUrl?: string;
}

function useCountUp(target: number, duration: number, delay: number): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafRef.current); };
  }, [target, duration, delay]);

  return value;
}

const LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'Crítico',
  [ScoreLevel.REGULAR]: 'Regular',
  [ScoreLevel.BUENO]: 'Bueno',
  [ScoreLevel.EXCELENTE]: 'Excelente',
};

export function ScoreBlock({ username, score, level, sector, postsAnalyzed, analysisWindow, hasReels, profilePicUrl }: ScoreBlockProps) {
  const [animated, setAnimated] = useState(false);
  const cfg = LEVEL_CONFIG[level];
  const proxiedPic = proxyImageUrl(profilePicUrl);
  const levelColor = cfg.color;
  const displayScore = useCountUp(score, 1800, 800);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="reveal flex flex-col items-center text-center">
      {/* Username */}
      <span className="font-inter text-gray-400" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        @{username}
      </span>

      {/* Score ring with profile pic inside */}
      <div className="relative mb-6" style={{ width: 220, height: 220 }}>
        <svg viewBox="0 0 220 220" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
          <defs>
            <linearGradient id="scoreGradR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(10,37,64,0.08)" strokeWidth="12" />
          <circle
            cx="110" cy="110" r="96" fill="none"
            stroke="url(#scoreGradR)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={animated ? (2 * Math.PI * 96) * (1 - score / 100) : 2 * Math.PI * 96}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Profile pic floating on top of the arc */}
        {proxiedPic && (
          <div
            className="absolute left-1/2 flex items-center justify-center"
            style={{ top: -6, transform: 'translateX(-50%)' }}
          >
            <img
              src={proxiedPic}
              alt={`Foto de perfil de @${username} en Instagram`}
              loading="lazy"
              className="rounded-full object-cover"
              style={{
                width: 56,
                height: 56,
                border: `3px solid ${levelColor}`,
                boxShadow: `0 4px 16px ${levelColor}30`,
              }}
            />
          </div>
        )}

        {/* Score number centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-inter text-base-oscura"
            style={{
              fontSize: 'clamp(40px, 10vw, 56px)', fontWeight: 600, letterSpacing: '-0.04em',
              opacity: displayScore > 0 ? 1 : 0,
              marginTop: proxiedPic ? 16 : 0,
            }}
          >
            {displayScore}
          </span>
          <span className="font-inter text-gray-400" style={{ fontSize: 14, fontWeight: 600 }}>
            de 100
          </span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full font-inter"
        style={{ padding: '8px 20px', fontSize: 14, fontWeight: 700, backgroundColor: cfg.colorBg, color: cfg.colorDark }}
      >
        <span>{cfg.badgeEmoji}</span>
        Nivel: {LEVEL_LABELS[level]}
      </div>

      {/* Headline */}
      <h1
        className="font-inter text-base-oscura"
        style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 520 }}
      >
        {cfg.heroHeadline}
      </h1>

      {/* Subtitle */}
      <p className="font-inter text-gray-500" style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 460, marginBottom: 32 }}>
        {cfg.heroSubtitle}
      </p>

      {/* Credibility chips */}
      <div className="flex flex-wrap justify-center gap-3">
        <CredChip icon="solar:chart-2-outline" iconColor="#60A5FA" text={`Basado en las últimas ${Math.min(postsAnalyzed, 10)} publicaciones`} />
        <CredChip icon="solar:buildings-outline" iconColor="#34D399" text={`Sector: ${sector}`} />
        <CredChip icon="solar:calendar-outline" iconColor="#FBBF24" text={`Basado en los últimos ${analysisWindow} días`} />
      </div>

      {!hasReels && (
        <p className="mt-4 font-inter text-sm text-yellow-600 font-medium">
          Sin Reels detectados — peso redistribuido entre ER y CR
        </p>
      )}
    </div>
  );
}

function CredChip({ icon, iconColor, text }: { icon: string; iconColor: string; text: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border bg-white font-inter text-base-oscura"
      style={{ padding: '8px 18px', fontSize: 14, fontWeight: 600, borderColor: `${iconColor}30`, boxShadow: `0 2px 8px ${iconColor}12` }}
    >
      <Icon icon={icon} width={16} height={16} color={iconColor} />
      {text}
    </div>
  );
}
