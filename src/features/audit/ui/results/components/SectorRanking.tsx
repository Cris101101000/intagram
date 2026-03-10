'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface SectorRankingProps {
  percentile: number;
  sector: string;
  level: ScoreLevel;
}

const CONSEQUENCE_PHRASES: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]:
    'Cada d\u00eda sin mejorar es un d\u00eda que tus competidores te superan. Necesitas actuar ahora.',
  [ScoreLevel.REGULAR]:
    'Est\u00e1s cerca del promedio, pero "promedio" no atrae clientes. Es momento de diferenciarte.',
  [ScoreLevel.BUENO]:
    '\u00a1Vas por buen camino! Con ajustes estrat\u00e9gicos puedes entrar al top 20% de tu sector.',
  [ScoreLevel.EXCELENTE]:
    '\u00a1Incre\u00edble! Tu perfil ya es referencia en tu sector. Mant\u00e9n el ritmo y sigue innovando.',
};

export function SectorRanking({ percentile, sector, level }: SectorRankingProps) {
  const { t } = useTranslation('audit');

  const isUrgent = level === ScoreLevel.CRITICO || level === ScoreLevel.REGULAR;

  return (
    <section>
      <Card className="border-0 shadow-none" style={{ backgroundColor: '#DFEDFE' }}>
        <CardBody className="flex flex-col items-center text-center gap-bewe-4 p-bewe-6 md:p-bewe-7">
          <Icon
            icon={isUrgent ? 'solar:ranking-outline' : 'solar:cup-star-outline'}
            className="text-primary-500"
            width={40}
            height={40}
          />

          <h2 className="text-h2 font-inter text-base-oscura">
            Tu perfil est&aacute; en el top{' '}
            <span className="text-primary-500 font-bold">{percentile}%</span>{' '}
            de {sector} en Latinoam&eacute;rica
          </h2>

          <p className="text-body font-inter text-base-oscura/70 max-w-lg">
            {CONSEQUENCE_PHRASES[level]}
          </p>
        </CardBody>
      </Card>
    </section>
  );
}
