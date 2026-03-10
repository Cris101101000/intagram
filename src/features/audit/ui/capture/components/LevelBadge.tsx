'use client';

import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { getScoreLevel } from '@/features/audit/domain/constants/levels';

interface LevelBadgeProps {
  score: number;
  level: ScoreLevel;
  route: AuditRoute;
  postsCount?: number;
}

const LEVEL_LABELS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'Crítico',
  [ScoreLevel.REGULAR]: 'Regular',
  [ScoreLevel.BUENO]: 'Bueno',
  [ScoreLevel.EXCELENTE]: 'Excelente',
};

export function LevelBadge({ score, level, route, postsCount }: LevelBadgeProps) {
  const isArranque = route === AuditRoute.ARRANQUE;
  const isLowPosts = postsCount !== undefined && postsCount < 10;

  const config = getScoreLevel(score);

  // For profiles with <10 posts, show neutral "growing" badge
  if (isLowPosts) {
    return (
      <span
        className="inline-block rounded-full px-4 py-1.5 text-small font-inter font-semibold text-base-oscura"
        style={{ backgroundColor: '#E5E7EB' }}
      >
        Perfil en crecimiento
      </span>
    );
  }

  // For arranque route, show a neutral teal badge
  if (isArranque) {
    return (
      <span
        className="inline-block rounded-full px-4 py-1.5 text-small font-inter font-semibold text-white"
        style={{ backgroundColor: '#75C9C8' }}
      >
        Perfil en crecimiento
      </span>
    );
  }

  return (
    <span
      className="inline-block rounded-full px-4 py-1.5 text-small font-inter font-semibold text-white"
      style={{ backgroundColor: config.color }}
    >
      {LEVEL_LABELS[level]}
    </span>
  );
}
