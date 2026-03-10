'use client';

import { Card, CardBody, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { CriticalPoint } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface LindaSolutionsProps {
  criticalPoints: CriticalPoint[];
}

const PROBLEM_ICONS: Record<string, string> = {
  default: 'solar:close-circle-outline',
};

const SOLUTION_ICONS: Record<string, string> = {
  default: 'solar:check-circle-outline',
};

/** Map critical point types to "what happens now" descriptions */
function getCurrentSituation(point: CriticalPoint): string {
  return point.message;
}

/** Map critical point types to Linda IA solutions */
const SOLUTION_MAP: Record<string, string> = {
  'Engagement bajo': 'Linda IA analiza qu\u00e9 contenido genera m\u00e1s interacci\u00f3n en tu sector y crea publicaciones optimizadas autom\u00e1ticamente.',
  'Comment Rate bajo': 'Linda IA genera CTAs personalizados y responde comentarios de forma inteligente para fomentar la conversaci\u00f3n.',
  'Sin Reels': 'Linda IA crea guiones para Reels basados en tendencias de tu sector y los programa autom\u00e1ticamente.',
  'Frecuencia baja': 'Linda IA programa publicaciones consistentes y genera contenido variado para mantener tu perfil activo.',
  'Formato dependiente': 'Linda IA diversifica tu contenido con Reels, carruseles e im\u00e1genes optimizadas para cada formato.',
  'Inactividad': 'Linda IA reactiva tu perfil con un calendario de contenido inteligente adaptado a tu negocio.',
  'Inconsistencia': 'Linda IA establece un ritmo de publicaci\u00f3n \u00f3ptimo y genera contenido de forma constante.',
  'Tendencia negativa': 'Linda IA identifica qu\u00e9 est\u00e1 fallando y ajusta la estrategia de contenido en tiempo real.',
};

function getSolution(point: CriticalPoint): string {
  return (
    SOLUTION_MAP[point.type] ??
    'Linda IA dise\u00f1a una estrategia personalizada para resolver este punto y mejorar tu presencia digital.'
  );
}

export function LindaSolutions({ criticalPoints }: LindaSolutionsProps) {
  const { t } = useTranslation('audit');

  const topPoints = criticalPoints.slice(0, 3);

  if (topPoints.length === 0) return null;

  return (
    <section className="flex flex-col gap-bewe-4">
      <h3 className="text-h3 font-inter text-base-oscura">
        {t('audit_linda_intro', 'Basado en tu auditor\u00eda, esto es lo que Linda puede hacer por ti:')}
      </h3>

      <div className="flex flex-col gap-bewe-4">
        {topPoints.map((point, index) => (
          <Card key={index} className="overflow-hidden border border-primary-100">
            <CardBody className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: What happens now (negative) */}
                <div className="flex flex-col gap-bewe-3 p-bewe-5 bg-gray-50">
                  <div className="flex items-center gap-bewe-2">
                    <Icon
                      icon={PROBLEM_ICONS.default}
                      className="text-semantic-error shrink-0"
                      width={20}
                      height={20}
                    />
                    <span className="text-small font-inter font-semibold text-base-oscura/60 uppercase tracking-wide">
                      Lo que pasa ahora
                    </span>
                  </div>
                  <p className="text-body font-inter text-base-oscura/70">
                    {getCurrentSituation(point)}
                  </p>
                </div>

                {/* Divider for mobile, vertical for desktop */}
                <Divider className="md:hidden" />

                {/* Right: How Linda solves it (positive) */}
                <div className="flex flex-col gap-bewe-3 p-bewe-5" style={{ backgroundColor: '#F0FDF4' }}>
                  <div className="flex items-center gap-bewe-2">
                    <Icon
                      icon={SOLUTION_ICONS.default}
                      className="text-semantic-success shrink-0"
                      width={20}
                      height={20}
                    />
                    <span className="text-small font-inter font-semibold text-base-oscura/60 uppercase tracking-wide">
                      C&oacute;mo lo resuelve{' '}
                      <span className="font-merriweather italic normal-case">Linda IA</span>
                    </span>
                  </div>
                  <p className="text-body font-inter text-base-oscura/80">
                    {getSolution(point)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
