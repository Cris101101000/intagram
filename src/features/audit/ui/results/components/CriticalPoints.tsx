'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CriticalPoint } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface CriticalPointsProps {
  criticalPoints: CriticalPoint[];
}

const SEVERITY_CONSEQUENCES: Record<string, string> = {
  high: 'Esto est\u00e1 afectando directamente tu capacidad de atraer clientes.',
  medium: 'Si no se corrige, este punto seguir\u00e1 limitando tu crecimiento.',
  low: 'Mejorar esto puede darte una ventaja competitiva notable.',
};

export function CriticalPoints({ criticalPoints }: CriticalPointsProps) {
  const { t } = useTranslation('audit');

  // Show max 3 critical points
  const topPoints = criticalPoints.slice(0, 3);

  if (topPoints.length === 0) return null;

  return (
    <section className="flex flex-col gap-bewe-4">
      <h3 className="text-h3 font-inter text-base-oscura">
        Puntos cr&iacute;ticos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-bewe-4">
        {topPoints.map((point, index) => (
          <Card
            key={index}
            className="border-l-4"
            style={{ borderLeftColor: '#F87171' }}
          >
            <CardBody className="flex flex-col gap-bewe-3 p-bewe-5">
              {/* Warning icon + problem name */}
              <div className="flex items-start gap-bewe-2">
                <Icon
                  icon="solar:danger-triangle-outline"
                  className="text-semantic-error shrink-0 mt-0.5"
                  width={20}
                  height={20}
                />
                <span className="text-body font-inter font-bold text-base-oscura">
                  {point.type}
                </span>
              </div>

              {/* Business meaning */}
              <p className="text-body font-inter text-base-oscura/70">
                {point.message}
              </p>

              {/* Consequence */}
              <p className="text-small font-inter italic text-base-oscura/80">
                {SEVERITY_CONSEQUENCES[point.severity] ?? SEVERITY_CONSEQUENCES.medium}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
