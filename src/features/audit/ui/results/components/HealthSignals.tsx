'use client';

import { Icon } from '@iconify/react';
import { HealthSignals as HealthSignalsType } from '@/features/audit/domain/interfaces/audit';

interface HealthSignalsProps {
  healthSignals: HealthSignalsType;
  sector: string;
}

type TagLevel = 'alto' | 'medio' | 'bajo' | 'none';

const TAG_COLORS: Record<TagLevel, { bg: string; color: string }> = {
  alto: { bg: 'rgba(52,211,153,0.1)', color: '#1D7454' },
  medio: { bg: 'rgba(251,191,36,0.1)', color: '#D97706' },
  bajo: { bg: 'rgba(248,113,113,0.1)', color: '#F87171' },
  none: { bg: 'transparent', color: 'transparent' },
};

function getFreqTag(value: number): TagLevel {
  if (value > 4) return 'alto';
  if (value >= 2) return 'medio';
  return 'bajo';
}

function getRecencyTag(days: number): TagLevel {
  if (days < 14) return 'alto';
  if (days <= 45) return 'medio';
  return 'bajo';
}

function getTrendTag(pct: number): TagLevel {
  if (pct > 0) return 'alto';
  if (pct === 0) return 'medio';
  return 'bajo';
}

function getMixTag(label: string): TagLevel {
  if (label === 'Variado') return 'alto';
  return 'medio';
}

interface SignalDef {
  icon: string;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  tag: TagLevel;
  tagLabel: string;
  context: string;
}

export function HealthSignals({ healthSignals, sector }: HealthSignalsProps) {
  const { frequency, recency, trend, formatMix } = healthSignals;

  const reelsPct = formatMix.distribution['Clips'] ?? 0;
  const trendSign = trend.changePercent >= 0 ? '+' : '';
  const trendPositive = trend.changePercent >= 0;

  const entries = Object.entries(formatMix.distribution);
  const dominant = entries.sort((a, b) => b[1] - a[1])[0];
  const dominantLabel = dominant ? dominant[0] : 'Foto';
  const dominantPct = dominant ? dominant[1] : 100;
  const formatCount = entries.filter(([, v]) => v > 0).length;

  const signals: SignalDef[] = [
    {
      icon: 'solar:calendar-outline',
      iconColor: '#60A5FA',
      iconBg: 'rgba(96,165,250,0.1)',
      value: `${frequency.value.toFixed(1)}/sem`,
      label: 'Frecuencia',
      tag: getFreqTag(frequency.value),
      tagLabel: frequency.label,
      context: frequency.value >= 3
        ? `Publicas ${frequency.value.toFixed(1)} veces por semana — el algoritmo tiene suficiente contenido tuyo para distribuir de forma consistente.`
        : `El benchmark para ${sector} es 3/sem. Publicar al menos 3 veces por semana es lo que el algoritmo necesita para distribuirte de forma consistente.`,
    },
    {
      icon: 'solar:clock-circle-outline',
      iconColor: '#FBBF24',
      iconBg: 'rgba(251,191,36,0.1)',
      value: `${recency.daysSinceLastPost} días`,
      label: 'Frecuencia',
      tag: getRecencyTag(recency.daysSinceLastPost),
      tagLabel: recency.label,
      context: recency.daysSinceLastPost < 8
        ? `Tu último post fue hace ${recency.daysSinceLastPost} días — tu perfil se ve activo. Publicar al menos cada 7 días mantiene tu relevancia en el algoritmo.`
        : `Llevas ${recency.daysSinceLastPost} días sin publicar. Instagram reduce la prioridad de perfiles inactivos — cada día que pasa tu alcance orgánico se reduce.`,
    },
    {
      icon: trendPositive ? 'solar:graph-up-outline' : 'solar:graph-down-outline',
      iconColor: trendPositive ? '#34D399' : '#F87171',
      iconBg: trendPositive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
      value: `${trendSign}${trend.changePercent.toFixed(1)}%`,
      label: 'Tendencia',
      tag: getTrendTag(trend.changePercent),
      tagLabel: trend.label,
      context: trendPositive
        ? `Tu engagement en los últimos 5 posts subió ${trend.changePercent.toFixed(0)}% vs. los 5 anteriores. Vas en la dirección correcta — lo importante es mantener el ritmo.`
        : `Tu engagement bajó ${Math.abs(trend.changePercent).toFixed(0)}% comparando tus últimos 5 posts con los 5 anteriores. Es importante revertir esta tendencia antes de que el algoritmo lo note.`,
    },
    {
      icon: 'solar:videocamera-record-outline',
      iconColor: '#F87171',
      iconBg: 'rgba(248,113,113,0.08)',
      value: `${reelsPct}%`,
      label: 'Reels en tu mix',
      tag: reelsPct >= 50 ? 'alto' : reelsPct >= 30 ? 'medio' : 'bajo',
      tagLabel: reelsPct >= 50 ? 'Bueno' : reelsPct >= 30 ? 'Mejorable' : 'Bajo',
      context: reelsPct >= 50
        ? `${reelsPct}% de tu contenido son Reels — estás aprovechando bien el formato con mayor distribución orgánica de Instagram.`
        : `${reelsPct}% de tu contenido son Reels. Subir a 50-60% te daría más alcance orgánico — los Reels son el formato que Instagram más distribuye.`,
    },
    {
      icon: 'solar:gallery-minimalistic-outline',
      iconColor: '#75C9C8',
      iconBg: 'rgba(117,201,200,0.1)',
      value: `${formatCount} tipos`,
      label: 'Mix de formatos',
      tag: getMixTag(formatMix.label),
      tagLabel: formatMix.label,
      context: formatMix.label === 'Variado'
        ? `Usas ${formatCount} formatos distintos — eso es bueno. Diversificar expone tu perfil a distintos segmentos de audiencia dentro del algoritmo.`
        : `${dominantPct}% de tu contenido es ${dominantLabel}. Diversificar formatos te expondría a distintos segmentos de audiencia.`,
    },
  ];

  return (
    <div className="reveal">
      {/* Subsection connector — ties visually to the MetricsBlock above */}
      <div className="flex items-center gap-3 mb-5">
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #E2E8F0)' }} />
        <span className="inline-flex items-center gap-1.5 font-inter" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34D399', whiteSpace: 'nowrap' }}>
          <span className="inline-block rounded-full" style={{ width: 16, height: 2, backgroundColor: '#34D399' }} aria-hidden="true" />
          Y los hábitos que suman o restan
          <span className="inline-block rounded-full" style={{ width: 16, height: 2, backgroundColor: '#34D399' }} aria-hidden="true" />
        </span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #E2E8F0, transparent)' }} />
      </div>

      <p className="font-inter text-gray-500 text-center mb-5" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 480, margin: '0 auto 20px' }}>
        Estos hábitos suman o restan puntos directamente a tu score según lo que el algoritmo recompensa.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {signals.map((s, i) => {
          const tagStyle = TAG_COLORS[s.tag];
          return (
            <div
              key={i}
              className="flex flex-col rounded-[14px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ padding: '18px 16px', width: 'calc(33.333% - 8px)', minWidth: 220 }}
            >
              {/* Top row: icon + badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="flex items-center justify-center rounded-[8px]"
                  style={{ width: 34, height: 34, backgroundColor: s.iconBg }}
                >
                  <Icon icon={s.icon} width={17} height={17} color={s.iconColor} />
                </div>
                {s.tag !== 'none' && (
                  <span
                    className="rounded-full font-inter"
                    style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', backgroundColor: tagStyle.bg, color: tagStyle.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    {s.tagLabel}
                  </span>
                )}
              </div>

              {/* Value + label */}
              <span className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{s.value}</span>
              <span className="font-inter text-gray-400 mt-1 mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </span>

              {/* Context */}
              <div className="border-t border-gray-100 pt-3 mt-auto">
                <p className="font-inter text-gray-500" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  {s.context}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
