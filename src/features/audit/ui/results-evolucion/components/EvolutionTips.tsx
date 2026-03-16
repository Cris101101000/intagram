'use client';

import { Icon } from '@iconify/react';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { SectionLabel } from '@/features/audit/ui/results/components/MetricsBlock';

interface EvolutionTipsProps {
  data: EvolutionData;
}

export function EvolutionTips({ data }: EvolutionTipsProps) {
  const { tips } = data;

  if (tips.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 40 }}>
        <SectionLabel color="orange">Qué pudo pasar</SectionLabel>
        <h2
          className="font-inter text-base-oscura"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          No todos los meses son iguales. Entender las causas es el primer paso para{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#D97706' }}>
            revertirlo
          </span>
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, maxWidth: 520 }}>
          Un score que no sube no siempre es una caída real. Estas son las causas más probables.
        </p>
      </div>

      {/* Tip cards */}
      <div className="flex flex-col gap-5">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="reveal rounded-[20px] border border-gray-200 bg-white overflow-hidden"
            style={{ borderLeft: '4px solid #FBBF24' }}
          >
            <div style={{ padding: 24 }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex shrink-0 items-center justify-center rounded-full"
                  style={{ width: 44, height: 44, backgroundColor: '#FEF3C7' }}
                >
                  <Icon icon={tip.icon} width={22} height={22} color="#D97706" />
                </div>
                <div className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>
                  {tip.title}
                </div>
              </div>

              {/* Cause */}
              <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12, paddingLeft: 4 }}>
                {tip.cause}
              </p>

              {/* Action */}
              <div
                className="flex items-start gap-2 rounded-[12px]"
                style={{ padding: '12px 14px', backgroundColor: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}
              >
                <Icon icon="solar:arrow-right-outline" width={14} height={14} color="#D97706" className="shrink-0 mt-0.5" />
                <p className="font-inter" style={{ fontSize: 13, lineHeight: 1.5, color: '#D97706' }}>
                  <strong style={{ fontWeight: 600 }}>Acción:</strong> {tip.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
