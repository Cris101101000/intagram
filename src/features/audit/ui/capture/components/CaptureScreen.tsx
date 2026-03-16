'use client';

import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { BlurredScore } from './BlurredScore';
import { LevelBadge } from './LevelBadge';
import { FindingCards } from './FindingCards';
import { RocketVisual } from './RocketVisual';
import { UnlockForm, type CaptureFormData } from './UnlockForm';
import { UsernamePill } from './UsernamePill';
import { LEVEL_CONFIG } from '@/features/audit/ui/results/constants/level-config';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CaptureScreenProps {
  username: string;
  fullName?: string;
  score: number;
  level: ScoreLevel;
  route: AuditRoute;
  postsCount?: number;
  criticalCount: number;
  profilePicUrl?: string;
  daysSinceLastPost?: number;
  onSubmit: (data: CaptureFormData) => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveLevelLabel(level: ScoreLevel): 'bajo' | 'intermedio' | 'avanzado' {
  switch (level) {
    case ScoreLevel.CRITICO:
      return 'bajo';
    case ScoreLevel.REGULAR:
    case ScoreLevel.BUENO:
      return 'intermedio';
    case ScoreLevel.EXCELENTE:
      return 'avanzado';
  }
}

function resolveHeadline(route: AuditRoute, level: ScoreLevel, postsCount?: number, daysSinceLastPost?: number): string {
  if (route === AuditRoute.ARRANQUE) {
    const days = daysSinceLastPost ?? 0;
    const posts = postsCount ?? 0;
    const isPaused = days >= 90 || (posts > 3 && posts <= 10 && days > 7);
    return isPaused
      ? 'Tu negocio sigue activo. Tu Instagram se quedó atrás.'
      : 'Tu negocio ya existe. Tu Instagram aún no lo refleja.';
  }
  return LEVEL_CONFIG[level].heroHeadline;
}

function resolveSubtitle(route: AuditRoute, criticalCount: number): string {
  if (route === AuditRoute.ARRANQUE) {
    return 'Identificamos oportunidades concretas para impulsar tu crecimiento.';
  }
  return `Analizamos tu perfil y encontramos ${criticalCount} punto${criticalCount !== 1 ? 's' : ''} que puedes mejorar.`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CaptureScreen({
  username,
  fullName,
  score,
  level,
  route,
  postsCount,
  criticalCount,
  profilePicUrl,
  daysSinceLastPost,
  onSubmit,
  isLoading,
}: CaptureScreenProps) {
  const levelLabel = resolveLevelLabel(level);
  const isArranque = route === AuditRoute.ARRANQUE;
  const headline = resolveHeadline(route, level, postsCount, daysSinceLastPost);
  const subtitle = resolveSubtitle(route, criticalCount);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #EEF6FF 0%, #F0FDF9 40%, #FEFCE8 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Orbs */}
      <div
        className="absolute animate-pulse-orb rounded-full"
        style={{ top: '-20%', right: '-15%', width: 600, height: 600, background: isArranque ? 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute animate-pulse-orb rounded-full"
        style={{ bottom: '-25%', left: '-10%', width: 500, height: 500, background: isArranque ? 'radial-gradient(circle, rgba(94,234,212,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', animationDelay: '-3s' }}
        aria-hidden="true"
      />
      <div
        className="absolute animate-pulse-orb rounded-full"
        style={{ top: '40%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(103,232,249,0.12) 0%, transparent 70%)', animationDelay: '-6s' }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0A2540 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-[440px] sm:max-w-[520px] flex-col items-center">
        {/* Username pill */}
        <div style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <UsernamePill username={username} fullName={fullName} profilePicUrl={profilePicUrl} />
        </div>

        {/* Level badge */}
        <div style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.05s' }}>
          <LevelBadge level={level} route={route} postsCount={postsCount} />
        </div>

        {/* Hero visual — Blurred Score or Rocket */}
        <div style={{ animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.08s' }}>
          {isArranque ? <RocketVisual /> : <BlurredScore score={score} route={route} />}
        </div>

        {/* Headline */}
        <div
          className="mb-2 text-center"
          style={{ animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.1s' }}
        >
          <h2
            className="font-inter text-base-oscura"
            style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}
          >
            {headline}
          </h2>
          <p className="font-inter text-gray-500" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>

        {/* Finding cards */}
        <div className="w-full" style={{ animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.14s' }}>
          <FindingCards
            route={route}
            level={level}
            criticalCount={criticalCount}
            postsCount={postsCount}
          />
        </div>

        {/* Form card */}
        <div className="w-full" style={{ animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both', animationDelay: '0.2s' }}>
          <UnlockForm
            route={route}
            levelLabel={levelLabel}
            criticalCount={criticalCount}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
