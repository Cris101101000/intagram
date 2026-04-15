'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { SectionLabel } from '@/features/audit/ui/results/components/MetricsBlock';

interface EvolutionRankingProps {
  data: EvolutionData;
}

function computePercentile(score: number): number {
  if (score <= 40) return Math.round(80 - (score / 40) * 20);
  if (score <= 60) return Math.round(60 - ((score - 40) / 20) * 20);
  if (score <= 80) return Math.round(40 - ((score - 60) / 20) * 20);
  return Math.round(20 - ((score - 80) / 20) * 15);
}

export function EvolutionRanking({ data }: EvolutionRankingProps) {
  const { improved, scoreDelta } = data;
  const prevScore = data.previous.score;
  const currScore = data.current.score;
  const sector = data.current.sector;

  const prevPercentile = computePercentile(prevScore);
  const currPercentile = computePercentile(currScore);

  const markerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = markerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const deltaColor = improved ? '#34D399' : scoreDelta === 0 ? '#94A3B8' : '#F87171';
  const deltaSign = scoreDelta > 0 ? '+' : '';

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center">
        <SectionLabel color="blue">Tu posición en el sector</SectionLabel>
        <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {improved
            ? 'Subiste posiciones frente a tu competencia'
            : scoreDelta === 0
              ? 'Tu posición en el sector se mantuvo'
              : 'Tu posición en el sector bajó'}
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560, marginBottom: 32 }}>
          Así cambió tu posición frente a otros negocios de {sector} en Latinoamérica.
        </p>
      </div>

      <div className="reveal rounded-[20px] border border-gray-200 bg-white" style={{ padding: 32 }}>
        {/* Ranking bar */}
        <div ref={markerRef} className="relative mb-8 overflow-visible rounded-full" style={{ height: 48, backgroundColor: '#F8FAFC' }}>
          <div className="absolute inset-0 flex h-full overflow-hidden rounded-full">
            <div className="flex-1 flex items-center justify-center font-inter" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(248,113,113,0.08)', color: '#F87171' }}>Crítico</div>
            <div className="flex-1 flex items-center justify-center font-inter" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(251,191,36,0.06)', color: '#D97706' }}>Regular</div>
            <div className="flex-1 flex items-center justify-center font-inter" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(56,189,248,0.06)', color: '#0284C7' }}>Bueno</div>
            <div className="flex-1 flex items-center justify-center font-inter" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: 'rgba(52,211,153,0.06)', color: '#1D7454' }}>Excelente</div>
          </div>

          {/* Before marker (dimmed) */}
          <div
            className="absolute z-[5]"
            style={{
              top: -4, width: 3, height: 56, backgroundColor: '#0A2540', opacity: 0.2, borderRadius: 4,
              left: animated ? `${prevScore}%` : '0%',
              transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="absolute font-inter whitespace-nowrap"
              style={{
                bottom: -22, left: '50%', transform: 'translateX(-50%)',
                color: '#94A3B8', fontSize: 10, fontWeight: 600,
              }}
            >
              Antes: {prevScore}
            </div>
          </div>

          {/* Current marker */}
          <div
            className="absolute z-10 rounded"
            style={{
              top: -6, width: 5, height: 60, backgroundColor: '#0A2540', borderRadius: 4,
              left: animated ? `${currScore}%` : '0%',
              transition: 'left 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <div
              className="absolute font-inter text-white whitespace-nowrap"
              style={{
                top: -32, left: '50%', transform: 'translateX(-50%)',
                backgroundColor: '#0A2540', padding: '4px 12px', borderRadius: 8,
                fontSize: 12, fontWeight: 700,
              }}
            >
              Ahora: {currScore}
            </div>
          </div>
        </div>

        {/* Stats grid — before vs after */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '12px 8px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: 'rgba(96,165,250,0.1)', marginBottom: 8 }}>
              <Icon icon="solar:chart-2-outline" width={18} height={18} color="#60A5FA" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
              <span className="font-inter text-gray-400" style={{ fontSize: 14, fontWeight: 600, textDecoration: 'line-through' }}>{prevScore}</span>
              <span className="font-inter text-base-oscura whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em' }}>{currScore}</span>
            </div>
            <span className="font-inter text-gray-400" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Tu score</span>
          </div>

          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '12px 8px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: 'rgba(117,201,200,0.1)', marginBottom: 8 }}>
              <Icon icon="solar:ranking-outline" width={18} height={18} color="#75C9C8" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
              <span className="font-inter text-gray-400 whitespace-nowrap" style={{ fontSize: 14, fontWeight: 600, textDecoration: 'line-through' }}>Top {prevPercentile}%</span>
              <span className="font-inter text-base-oscura whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em' }}>Top {currPercentile}%</span>
            </div>
            <span className="font-inter text-gray-400" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Tu posición</span>
          </div>

          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '12px 8px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: `${deltaColor}15`, marginBottom: 8 }}>
              <Icon icon={improved ? 'solar:arrow-up-outline' : 'solar:arrow-down-outline'} width={18} height={18} color={deltaColor} />
            </div>
            <span className="font-inter whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em', color: deltaColor }}>{deltaSign}{scoreDelta}</span>
            <span className="font-inter text-gray-400" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Cambio</span>
          </div>
        </div>

        {/* Verdict */}
        <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.6, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          {improved
            ? `Pasaste del Top ${prevPercentile}% al Top ${currPercentile}% en ${sector}. Cada punto que subes te posiciona mejor frente a los negocios que compiten por los mismos clientes.`
            : scoreDelta === 0
              ? `Te mantienes en el Top ${currPercentile}% de ${sector}. Mantener tu posición es importante, pero hay margen para crecer.`
              : `Bajaste del Top ${prevPercentile}% al Top ${currPercentile}% en ${sector}. No es una caída definitiva — con las acciones correctas puedes recuperar tu posición.`}
        </p>
      </div>
    </div>
  );
}
