'use client';

import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface LevelBadgeProps {
  level: ScoreLevel;
  route: AuditRoute;
  postsCount?: number;
  daysSinceLastPost?: number;
}

type LevelVariant = 'bajo' | 'intermedio' | 'avanzado' | 'crecimiento' | 'inactivo';

const VARIANT_STYLES: Record<LevelVariant, { bg: string; text: string; dot: string }> = {
  bajo: { bg: 'rgba(248,113,113,0.10)', text: '#F87171', dot: '#F87171' },
  intermedio: { bg: 'rgba(251,191,36,0.10)', text: '#D97706', dot: '#FBBF24' },
  avanzado: { bg: 'rgba(52,211,153,0.10)', text: '#059669', dot: '#34D399' },
  crecimiento: { bg: 'rgba(117,201,200,0.10)', text: '#0D9488', dot: '#75C9C8' },
  inactivo: { bg: 'rgba(251,191,36,0.10)', text: '#D97706', dot: '#FBBF24' },
};

function resolveVariant(level: ScoreLevel, route: AuditRoute, postsCount?: number, daysSinceLastPost?: number): LevelVariant {
  if (route === AuditRoute.ARRANQUE) {
    const isInactive = (daysSinceLastPost != null && daysSinceLastPost >= 90) || (postsCount != null && postsCount >= 10 && daysSinceLastPost != null && daysSinceLastPost >= 90);
    return isInactive ? 'inactivo' : 'crecimiento';
  }
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

export function LevelBadge({ level, route, postsCount, daysSinceLastPost }: LevelBadgeProps) {
  const { t } = useTranslation('audit');
  const variant = resolveVariant(level, route, postsCount, daysSinceLastPost);
  const styles = VARIANT_STYLES[variant];

  const label = variant === 'crecimiento'
    ? t('audit_capture_level_crecimiento')
    : variant === 'inactivo'
    ? 'Perfil inactivo'
    : t('audit_capture_level_prefix') + ' ' + t(`audit_capture_level_${variant}`);

  return (
    <div
      className="mb-4 inline-flex items-center gap-2.5 rounded-full font-inter"
      style={{
        padding: '8px 20px',
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: styles.bg,
        color: styles.text,
      }}
    >
      {/* Pulsing dot */}
      <span
        className="inline-block rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: styles.dot,
          animation: 'capture-dot-pulse 2s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      {label}
    </div>
  );
}
