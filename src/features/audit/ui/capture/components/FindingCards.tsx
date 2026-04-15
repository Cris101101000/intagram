'use client';

import { Icon } from '@iconify/react';
import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';

interface Finding {
  icon: string;
  text: string;
  highlight?: string;
}

interface FindingCardsProps {
  route: AuditRoute;
  level: ScoreLevel;
  criticalCount: number;
  postsCount?: number;
}

function getDiagnosticoFindings(level: ScoreLevel, criticalCount: number): Finding[] {
  const levelLabels: Record<ScoreLevel, string> = {
    [ScoreLevel.CRITICO]: 'Crítico',
    [ScoreLevel.REGULAR]: 'Regular',
    [ScoreLevel.BUENO]: 'Bueno',
    [ScoreLevel.EXCELENTE]: 'Excelente',
  };
  const levelColors: Record<ScoreLevel, string> = {
    [ScoreLevel.CRITICO]: '#F87171',
    [ScoreLevel.REGULAR]: '#FBBF24',
    [ScoreLevel.BUENO]: '#38BDF8',
    [ScoreLevel.EXCELENTE]: '#34D399',
  };

  return [
    {
      icon: 'solar:chart-2-outline',
      text: 'Score calculado — nivel ',
      highlight: levelLabels[level],
    },
    {
      icon: 'solar:danger-triangle-outline',
      text: `${criticalCount} punto${criticalCount !== 1 ? 's' : ''} crítico${criticalCount !== 1 ? 's' : ''} detectado${criticalCount !== 1 ? 's' : ''}`,
    },
    {
      icon: 'solar:clipboard-list-outline',
      text: 'Plan de acción listo para ti',
    },
  ];
}

function getArranqueFindings(postsCount?: number): Finding[] {
  return [
    {
      icon: 'solar:graph-up-outline',
      text: `${postsCount ?? 0} publicacion${(postsCount ?? 0) !== 1 ? 'es' : ''} analizada${(postsCount ?? 0) !== 1 ? 's' : ''}`,
    },
    {
      icon: 'solar:lightbulb-outline',
      text: 'Oportunidades de crecimiento identificadas',
    },
    {
      icon: 'solar:rocket-2-outline',
      text: 'Plan de arranque personalizado listo',
    },
  ];
}

export function FindingCards({ route, level, criticalCount, postsCount }: FindingCardsProps) {
  const isArranque = route === AuditRoute.ARRANQUE;
  const findings = isArranque
    ? getArranqueFindings(postsCount)
    : getDiagnosticoFindings(level, criticalCount);

  const levelColors: Record<ScoreLevel, string> = {
    [ScoreLevel.CRITICO]: '#F87171',
    [ScoreLevel.REGULAR]: '#FBBF24',
    [ScoreLevel.BUENO]: '#38BDF8',
    [ScoreLevel.EXCELENTE]: '#34D399',
  };

  return (
    <div className="mb-6 flex w-full flex-col gap-2.5">
      {findings.map((finding, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-[14px] border border-gray-200 bg-white"
          style={{
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(10,37,64,0.04)',
            animation: `fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both`,
            animationDelay: `${0.1 + i * 0.06}s`,
          }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-[10px]"
            style={{
              width: 36,
              height: 36,
              backgroundColor: isArranque ? 'rgba(52,211,153,0.08)' : 'rgba(96,165,250,0.08)',
            }}
          >
            <Icon
              icon={finding.icon}
              width={18}
              height={18}
              color={isArranque ? '#34D399' : '#60A5FA'}
            />
          </div>
          <p className="font-inter text-gray-600" style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.5 }}>
            {finding.text}
            {finding.highlight && (
              <span style={{ color: levelColors[level], fontWeight: 600 }}>
                {finding.highlight}
              </span>
            )}
          </p>
          <div className="ml-auto shrink-0">
            <Icon icon="solar:check-circle-bold" width={18} height={18} color={isArranque ? '#34D399' : '#60A5FA'} />
          </div>
        </div>
      ))}
    </div>
  );
}
