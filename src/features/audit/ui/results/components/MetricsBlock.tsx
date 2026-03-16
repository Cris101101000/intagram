'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { AuditMetrics, NormalizedMetrics, HealthSignals } from '@/features/audit/domain/interfaces/audit';
import { METRIC_CONSEQUENCES, SECTOR_BENCHMARKS } from '../constants/level-config';

interface MetricsBlockProps {
  metrics: AuditMetrics;
  normalizedMetrics: NormalizedMetrics;
  healthSignals: HealthSignals;
  sector: string;
  score: number;
  followersCount: number;
  postsAnalyzed: number;
}

type MetricLevel = 'good' | 'mid' | 'low';

// ---------------------------------------------------------------------------
// Habit mini-card definition
// ---------------------------------------------------------------------------

interface HabitDef {
  icon: string;
  iconColor: string;
  name: string;
  value: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  detail: string;
}

// ---------------------------------------------------------------------------
// Metric story definition
// ---------------------------------------------------------------------------

interface MetricStoryDef {
  key: 'er' | 'cr' | 'rvr';
  icon: string;
  name: string;
  nameShort: string;
  description: string;
  displayValue: string;
  profileContext: string;
  benchmarkValue: string;
  benchmarkLabel: string;
  benchmarkContext: string;
  fillPct: number;
  metricLevel: MetricLevel;
  gapText: string;
  impact: string;
  tagLabel: string;
  noData?: boolean;
  weight: number;
  habits: HabitDef[];
}

const TAG_STYLES: Record<MetricLevel, { bg: string; color: string; label: string }> = {
  good: { bg: 'rgba(52,211,153,0.1)', color: '#1D7454', label: 'Alto' },
  mid: { bg: 'rgba(251,191,36,0.1)', color: '#D97706', label: 'Medio' },
  low: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'Bajo' },
};

const BAR_COLORS: Record<MetricLevel, string> = { good: '#34D399', mid: '#FBBF24', low: '#F87171' };

function getMetricLevel(value: number, benchmark: number): MetricLevel {
  if (value >= benchmark) return 'good';
  if (value >= benchmark * 0.6) return 'mid';
  return 'low';
}

// ---------------------------------------------------------------------------
// Impact text builders
// ---------------------------------------------------------------------------

function buildErImpact(value: number, benchmark: number, level: MetricLevel): string {
  const per100 = Math.round(value);
  if (level === 'good') return `De cada 100 seguidores, ${per100} interactúan con tu contenido — por encima de lo esperado. Instagram premia esto con más distribución orgánica.`;
  if (level === 'mid') return `De cada 100 seguidores, menos de ${per100} interactúan. Instagram usa esta señal para decidir cuánta distribución darte — un ER bajo significa menos personas descubriendo tu negocio.`;
  return `De cada 100 seguidores, menos de ${per100} interactúan con tu contenido. El algoritmo interpreta esto como falta de relevancia y reduce tu alcance orgánico cada semana.`;
}

function buildCrImpact(value: number, benchmark: number, level: MetricLevel): string {
  const pct = (value * 100).toFixed(1);
  if (level === 'good') return `El ${pct}% de quienes dan like también comentan. Los comentarios son la señal más fuerte para el algoritmo — estás generando conversación real.`;
  if (level === 'mid') return `Solo el ${pct}% de quienes dan like comentan. Los comentarios pesan más que los likes en el algoritmo. Hay margen claro de mejora.`;
  return `Solo el ${pct}% de quienes dan like comentan. Sin conversación real, el algoritmo interpreta que tu contenido no genera suficiente interés.`;
}

function buildRvrImpact(value: number, benchmark: number, level: MetricLevel, hasReels: boolean): string {
  if (!hasReels) return 'Sin Reels, tu perfil solo llega a personas que ya te siguen. Los Reels son el único formato que Instagram distribuye orgánicamente a audiencias nuevas.';
  if (level === 'good') return `Tus Reels llegan a casi 1 de cada 4 seguidores — y cuando supera el 100%, Instagram los muestra a personas que ni te siguen. Es tu canal más fuerte para atraer clientes nuevos.`;
  if (level === 'mid') return `Tus Reels llegan a tu audiencia pero sin el alcance extra que Instagram da a los videos que realmente conectan. Un pequeño empujón puede significar cientos de vistas nuevas cada semana.`;
  return `Tus Reels tienen bajo alcance. Estás publicando video pero no estás aprovechando la mayor herramienta de crecimiento orgánico de Instagram.`;
}

// ---------------------------------------------------------------------------
// Habit builders
// ---------------------------------------------------------------------------

function getHabitStatusStyle(label: string): { color: string; bg: string } {
  const map: Record<string, { color: string; bg: string }> = {
    'Alta': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Activo': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Mejorando': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Consistente': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Variado': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Bueno': { color: '#1D7454', bg: 'rgba(52,211,153,0.1)' },
    'Media': { color: '#D97706', bg: 'rgba(251,191,36,0.1)' },
    'Estable': { color: '#D97706', bg: 'rgba(251,191,36,0.1)' },
    'Irregular': { color: '#D97706', bg: 'rgba(251,191,36,0.1)' },
    'Mejorable': { color: '#D97706', bg: 'rgba(251,191,36,0.1)' },
    'Baja': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
    'Inactivo': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
    'Cayendo': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
    'Muy irregular': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
    'Dependiente de un formato': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
    'Bajo': { color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  };
  return map[label] ?? { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' };
}

function buildHabits(healthSignals: HealthSignals, key: 'er' | 'cr' | 'rvr'): HabitDef[] {
  const { frequency, recency, trend, formatMix } = healthSignals;

  const trendPositive = trend.changePercent >= 0;
  const trendSign = trend.changePercent >= 0 ? '+' : '';
  const reelsPct = formatMix.distribution['Clips'] ?? 0;
  const formatCount = Object.entries(formatMix.distribution).filter(([, v]) => v > 0).length;

  if (key === 'er') {
    const style = getHabitStatusStyle(trend.label);
    return [{
      icon: trendPositive ? 'solar:graph-up-outline' : 'solar:graph-down-outline',
      iconColor: trendPositive ? '#34D399' : '#F87171',
      name: trendPositive
        ? `Tu interacción viene creciendo un ${trendSign}${trend.changePercent.toFixed(1)}%`
        : `Tu interacción viene cayendo un ${trend.changePercent.toFixed(1)}%`,
      value: '',
      statusLabel: trend.label,
      statusColor: style.color,
      statusBg: style.bg,
      detail: trendPositive
        ? 'Tu engagement está subiendo — el algoritmo lo nota y te da más distribución.'
        : 'Tu engagement está cayendo. Si la tendencia continúa, tu alcance se reduce.',
    }];
  }

  if (key === 'cr') {
    const freqStyle = getHabitStatusStyle(frequency.label);
    const recStyle = getHabitStatusStyle(recency.label);
    return [
      {
        icon: 'solar:calendar-outline',
        iconColor: '#60A5FA',
        name: `Publicas ${frequency.value.toFixed(1)} veces por semana`,
        value: '',
        statusLabel: frequency.label,
        statusColor: freqStyle.color,
        statusBg: freqStyle.bg,
        detail: frequency.value >= 3
          ? 'Publicas lo suficiente para que el algoritmo te mantenga activo.'
          : 'Publicar al menos 3 veces/semana es lo que el algoritmo necesita.',
      },
      {
        icon: 'solar:clock-circle-outline',
        iconColor: '#FBBF24',
        name: `Tu último post fue hace ${recency.daysSinceLastPost} días`,
        value: '',
        statusLabel: recency.label,
        statusColor: recStyle.color,
        statusBg: recStyle.bg,
        detail: recency.daysSinceLastPost < 8
          ? 'Tu perfil se ve activo. Publicar al menos cada 7 días mantiene tu relevancia.'
          : 'Llevas demasiado tiempo sin publicar. Instagram reduce tu alcance.',
      },
    ];
  }

  // RVR habits
  const reelsStyle = getHabitStatusStyle(reelsPct >= 50 ? 'Bueno' : reelsPct >= 30 ? 'Mejorable' : 'Bajo');
  const mixStyle = getHabitStatusStyle(formatMix.label);
  return [
    {
      icon: 'solar:videocamera-record-outline',
      iconColor: '#F87171',
      name: `El ${reelsPct}% de tu contenido son Reels`,
      value: '',
      statusLabel: reelsPct >= 50 ? 'Bueno' : reelsPct >= 30 ? 'Mejorable' : 'Bajo',
      statusColor: reelsStyle.color,
      statusBg: reelsStyle.bg,
      detail: reelsPct >= 50
        ? 'Estás aprovechando bien el formato con más distribución orgánica.'
        : 'Subir a 50-60% de Reels te daría más alcance orgánico.',
    },
    {
      icon: 'solar:gallery-minimalistic-outline',
      iconColor: '#75C9C8',
      name: `Usas ${formatCount} tipo${formatCount !== 1 ? 's' : ''} de formato`,
      value: '',
      statusLabel: formatMix.label === 'Variado' ? 'Variado' : 'Dependiente',
      statusColor: mixStyle.color,
      statusBg: mixStyle.bg,
      detail: formatMix.label === 'Variado'
        ? 'Diversificar formatos te expone a distintos segmentos de audiencia.'
        : 'Diversificar formatos te expondría a nuevos segmentos de audiencia.',
    },
  ];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MetricsBlock({ metrics, normalizedMetrics, healthSignals, sector, score, followersCount, postsAnalyzed }: MetricsBlockProps) {
  const benchmarks = SECTOR_BENCHMARKS[sector.toLowerCase()] ?? SECTOR_BENCHMARKS.general;

  const erLevel = getMetricLevel(metrics.engagementRate, benchmarks.er);
  const crLevel = getMetricLevel(metrics.commentRate, benchmarks.cr);
  const rvrLevel = metrics.hasReels ? getMetricLevel(metrics.reelsViewRate, benchmarks.rvr) : 'low';

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : `${n}`;
  const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  const totalInteractions = Math.round(followersCount * metrics.engagementRate / 100);
  const avgInteractions = Math.round(totalInteractions / postsAnalyzed);
  const avgReelViews = metrics.hasReels ? Math.round(followersCount * metrics.reelsViewRate / 100) : 0;

  const erGap = Math.abs(metrics.engagementRate - benchmarks.er);
  const erGapInteractions = Math.round(followersCount * erGap / 100 / postsAnalyzed);
  const crGap = Math.abs(metrics.commentRate - benchmarks.cr);
  const rvrGap = metrics.hasReels ? Math.abs(metrics.reelsViewRate - benchmarks.rvr) : benchmarks.rvr;

  // Weights
  const hasReels = metrics.hasReels;
  const weights = hasReels ? { er: 40, cr: 35, rvr: 25 } : { er: 57, cr: 43, rvr: 0 };

  function buildGapText(value: number, benchmark: number, unit: string, extraContext: string): string {
    const diff = Math.abs(value - benchmark);
    if (value >= benchmark) {
      if (diff < 0.05) return 'Alcanzado ✓ — estás justo en el benchmark de tu sector';
      return `Alcanzado ✓ — estás ${diff.toFixed(1)}${unit} por encima del benchmark`;
    }
    if (diff < 0.05) return 'Muy cerca del benchmark — un pequeño ajuste y lo alcanzas';
    return `Te falta un ${diff.toFixed(1)}${unit} para alcanzar el benchmark — ${extraContext}`;
  }

  const defs: MetricStoryDef[] = [
    {
      key: 'er',
      icon: 'solar:chart-2-outline',
      name: 'Tasa de interacción (ER)',
      nameShort: 'ER',
      description: `Likes + comentarios en relación a tus seguidores. La señal principal de distribución.`,
      displayValue: `${metrics.engagementRate.toFixed(1)}%`,
      profileContext: `~${fmt(avgInteractions)} interacciones por post sobre ${fmtK(followersCount)} seguidores`,
      benchmarkValue: `${benchmarks.er.toFixed(1)}%`,
      benchmarkLabel: `Benchmark ${sector}`,
      benchmarkContext: `Lo que logran negocios de ${sector.toLowerCase()} con buen rendimiento`,
      fillPct: Math.min((metrics.engagementRate / benchmarks.er) * 100, 100),
      metricLevel: erLevel,
      gapText: buildGapText(metrics.engagementRate, benchmarks.er, '%', `eso son ~${erGapInteractions} interacciones más por post`),
      impact: buildErImpact(metrics.engagementRate, benchmarks.er, erLevel),
      tagLabel: TAG_STYLES[erLevel].label,
      weight: weights.er,
      habits: buildHabits(healthSignals, 'er'),
    },
    {
      key: 'cr',
      icon: 'solar:chat-round-dots-outline',
      name: 'Tasa de comentarios (CR)',
      nameShort: 'CR',
      description: `Comentarios en relación a likes. La interacción más valiosa para el algoritmo.`,
      displayValue: `${(metrics.commentRate * 100).toFixed(1)}%`,
      profileContext: `${(metrics.commentRate * 100).toFixed(1)}% de quienes dan like también comentan`,
      benchmarkValue: benchmarks.cr.toFixed(2),
      benchmarkLabel: `Benchmark ${sector}`,
      benchmarkContext: `El ratio de conversación esperado en ${sector.toLowerCase()}`,
      fillPct: Math.min((metrics.commentRate / benchmarks.cr) * 100, 100),
      metricLevel: crLevel,
      gapText: buildGapText(metrics.commentRate, benchmarks.cr, '', `eso significa ~${Math.round(crGap * 100)} comentarios más por cada 100 interacciones`),
      impact: buildCrImpact(metrics.commentRate, benchmarks.cr, crLevel),
      tagLabel: TAG_STYLES[crLevel].label,
      weight: weights.cr,
      habits: buildHabits(healthSignals, 'cr'),
    },
    {
      key: 'rvr',
      icon: 'solar:videocamera-record-outline',
      name: 'Alcance de Reels (RVR)',
      nameShort: 'RVR',
      description: hasReels
        ? `Vistas de Reels en relación a seguidores. El formato con mayor alcance orgánico.`
        : `Sin Reels publicados. Es el único formato que llega a personas que no te siguen.`,
      displayValue: hasReels ? `${metrics.reelsViewRate.toFixed(0)}%` : '0%',
      profileContext: hasReels ? `~${fmtK(avgReelViews)} vistas promedio por Reel` : 'Sin datos de Reels',
      benchmarkValue: `${benchmarks.rvr}%`,
      benchmarkLabel: `Benchmark ${sector}`,
      benchmarkContext: `El alcance esperado de Reels en ${sector.toLowerCase()}`,
      fillPct: hasReels ? Math.min((metrics.reelsViewRate / benchmarks.rvr) * 100, 100) : 0,
      metricLevel: rvrLevel,
      gapText: hasReels
        ? buildGapText(metrics.reelsViewRate, benchmarks.rvr, '%', `eso son ~${fmtK(Math.round(followersCount * rvrGap / 100))} vistas más por Reel`)
        : 'Sin Reels no puedes alcanzar audiencias nuevas de forma orgánica',
      impact: buildRvrImpact(metrics.reelsViewRate, benchmarks.rvr, rvrLevel, hasReels),
      tagLabel: hasReels ? TAG_STYLES[rvrLevel].label : 'Sin datos',
      noData: !hasReels,
      weight: weights.rvr,
      habits: buildHabits(healthSignals, 'rvr'),
    },
  ];

  return (
    <div>
      {/* Section header */}
      <div className="reveal text-center flex flex-col items-center">
        <SectionLabel color="blue">Tu diagnóstico</SectionLabel>
        <h2 data-share-trigger className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Qué hay detrás de tu score de {score}
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560, marginBottom: 40 }}>
          Tu score nace de 3 métricas clave y los hábitos que las rodean. Juntos, definen cómo Instagram decide cuánto distribuir tu contenido.
        </p>
      </div>

      {/* Metric story cards */}
      <div className="flex flex-col gap-5">
        {defs.map((m) => (
          <MetricStoryCard key={m.key} metric={m} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric story card
// ---------------------------------------------------------------------------

function MetricStoryCard({ metric }: { metric: MetricStoryDef }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const tag = TAG_STYLES[metric.metricLevel];
  const barColor = BAR_COLORS[metric.metricLevel];

  return (
    <div
      className="reveal rounded-[20px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ padding: 24 }}
    >
      {/* Header: icon + title + badge + description */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{ width: 36, height: 36, backgroundColor: `${barColor}10` }}
        >
          <Icon icon={metric.icon} width={18} height={18} color={barColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>
              {metric.name}
            </span>
            <span
              className="rounded-full font-inter shrink-0"
              style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', backgroundColor: metric.noData ? 'rgba(248,113,113,0.1)' : tag.bg, color: metric.noData ? '#F87171' : tag.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {metric.tagLabel}
            </span>
          </div>
          <p className="font-inter text-gray-400" style={{ fontSize: 13, lineHeight: 1.4, marginTop: 2 }}>
            {metric.description}
          </p>
        </div>
      </div>

      {/* Value + benchmark in one row */}
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-inter" style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 700, color: barColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {metric.displayValue}
          </span>
          <span className="font-inter text-gray-400" style={{ fontSize: 13 }}>
            {metric.profileContext}
          </span>
        </div>
        <span className="font-inter text-gray-500" style={{ fontSize: 14, fontWeight: 600 }}>
          Sector: {metric.benchmarkValue}
        </span>
      </div>

      {/* Progress bar */}
      <div ref={barRef} className="relative mb-2" style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 99 }}>
        <div
          className="h-full rounded-full"
          style={{
            width: visible ? `${metric.fillPct}%` : '0%',
            backgroundColor: barColor,
            borderRadius: 99,
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <div className="absolute" style={{ left: '100%', top: -3, bottom: -3, width: 2, backgroundColor: '#0A2540', opacity: 0.15, borderRadius: 1 }} />
      </div>
      <p className="font-inter text-gray-500" style={{ fontSize: 12, lineHeight: 1.4 }}>
        {metric.gapText}
      </p>

      {/* Habits — compact inline chips */}
      {metric.habits.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          {metric.habits.map((h, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 rounded-[10px]"
              style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <Icon icon={h.icon} width={14} height={14} color={h.iconColor} className="shrink-0" />
              <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>
                {h.name}
              </span>
              <span
                className="rounded-full font-inter shrink-0"
                style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', backgroundColor: h.statusBg, color: h.statusColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                {h.statusLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section label (shared)
// ---------------------------------------------------------------------------

function SectionLabel({ color, children }: { color: 'blue' | 'green' | 'red' | 'orange'; children: React.ReactNode }) {
  const colors = {
    blue: { text: '#5694E1', bar: '#60A5FA' },
    green: { text: '#2FBE8A', bar: '#34D399' },
    red: { text: '#F87171', bar: '#F87171' },
    orange: { text: '#D97706', bar: '#FBBF24' },
  };
  const c = colors[color];

  return (
    <div className="mb-3 inline-flex items-center gap-1.5 font-inter" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.text }}>
      <span className="inline-block rounded-full" style={{ width: 16, height: 2, backgroundColor: c.bar }} aria-hidden="true" />
      {children}
    </div>
  );
}

export { SectionLabel };
