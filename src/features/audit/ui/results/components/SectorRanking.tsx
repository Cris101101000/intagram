'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { LEVEL_CONFIG } from '../constants/level-config';
import { SectionLabel } from './MetricsBlock';

interface SectorRankingProps {
  score: number;
  percentile: number;
  sector: string;
  level: ScoreLevel;
}

export function SectorRanking({ score, percentile, sector, level }: SectorRankingProps) {
  const cfg = LEVEL_CONFIG[level];
  const markerRef = useRef<HTMLDivElement>(null);
  const [markerPos, setMarkerPos] = useState(0);
  const [avgPos, setAvgPos] = useState(0);

  const sectorAvg = Math.round(score - (50 - percentile) * 0.5);

  useEffect(() => {
    const el = markerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMarkerPos(score);
          setAvgPos(sectorAvg);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [score, sectorAvg]);

  const pct = level === ScoreLevel.BUENO ? percentile : 100 - percentile;
  const consequenceText = `El ${pct}% ${cfg.rankingConsequence.replace('{{sector}}', sector)}`;
  const consequenceTextShort = `El ${pct}% ${cfg.rankingConsequenceShort.replace('{{sector}}', sector)}`;

  const diff = score - sectorAvg;
  const diffSign = diff >= 0 ? '+' : '';
  const diffColor = diff >= 0 ? '#34D399' : '#F87171';

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center">
        <SectionLabel color="blue">Tu posición</SectionLabel>
        <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {cfg.rankingTitle}
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560, marginBottom: 32 }}>
          Así se compara tu perfil con otros negocios de {sector} en Latinoamérica.
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

          {/* Sector average marker */}
          <div
            className="absolute z-[5]"
            style={{
              top: -4, width: 3, height: 56, backgroundColor: '#0A2540', opacity: 0.2, borderRadius: 4,
              left: `${avgPos}%`, transition: 'left 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <div
              className="absolute font-inter whitespace-nowrap"
              style={{
                bottom: -22, left: '50%', transform: 'translateX(-50%)',
                color: '#64748B', fontSize: 10, fontWeight: 600,
              }}
            >
              Sector: {sectorAvg}
            </div>
          </div>

          {/* Your score marker */}
          <div
            className="absolute z-10 rounded"
            style={{
              top: -6, width: 5, height: 60, backgroundColor: '#0A2540', borderRadius: 4,
              left: `${markerPos}%`, transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
              Tú: {score}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '16px 12px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: 'rgba(96,165,250,0.1)', marginBottom: 8 }}>
              <Icon icon="solar:chart-2-outline" width={18} height={18} color="#60A5FA" />
            </div>
            <span className="font-inter text-base-oscura whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em' }}>{score}</span>
            <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Tu score</span>
          </div>

          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '16px 12px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: 'rgba(117,201,200,0.1)', marginBottom: 8 }}>
              <Icon icon="solar:buildings-outline" width={18} height={18} color="#75C9C8" />
            </div>
            <span className="font-inter text-base-oscura whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em' }}>{sectorAvg}</span>
            <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Promedio sector</span>
          </div>

          <div className="flex flex-col items-center text-center rounded-[14px] border border-gray-100" style={{ padding: '16px 12px', backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, backgroundColor: 'rgba(251,191,36,0.1)', marginBottom: 8 }}>
              <Icon icon="solar:ranking-outline" width={18} height={18} color="#FBBF24" />
            </div>
            <span className="font-inter text-base-oscura whitespace-nowrap" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 600, letterSpacing: '-0.02em' }}>Top {percentile}%</span>
            <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>Tu posición</span>
          </div>
        </div>

        {/* Difference chip */}
        <div className="flex justify-center mb-4">
          <div
            className="inline-flex items-center gap-2 rounded-full font-inter"
            style={{ padding: '6px 16px', fontSize: 13, fontWeight: 700, backgroundColor: `${diffColor}12`, color: diffColor }}
          >
            <Icon icon={diff >= 0 ? 'solar:arrow-up-outline' : 'solar:arrow-down-outline'} width={14} height={14} />
            {diffSign}{diff} puntos vs. promedio del sector
          </div>
        </div>

        {/* Consequence text inside card */}
        <p className="hidden sm:block font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.6, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          {consequenceText}
        </p>
        <p className="sm:hidden font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.6, textAlign: 'center', margin: '0 auto' }}>
          {consequenceTextShort}
        </p>
      </div>
    </div>
  );
}
