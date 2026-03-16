'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { EvolutionData, MetricEvolution } from '@/features/audit/application/use-cases/get-evolution';
import { SectionLabel } from '@/features/audit/ui/results/components/MetricsBlock';
import { SECTOR_BENCHMARKS } from '@/features/audit/ui/results/constants/level-config';

// ---------------------------------------------------------------------------
// Metric card
// ---------------------------------------------------------------------------

interface HabitChip {
  icon: string;
  iconColor: string;
  label: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
}

interface MetricCardProps {
  icon: string;
  name: string;
  description: string;
  suffix: string;
  format: (v: number) => string;
  metric: MetricEvolution;
  beforeContext: string;
  afterContext: string;
  fillBefore: number;
  fillAfter: number;
  verdict: string;
  habits?: HabitChip[];
}

function getAccentColor(delta: number): string {
  if (delta > 0) return '#34D399';
  if (delta < 0) return '#F87171';
  return '#FBBF24';
}

function MetricCard({ icon, name, description, suffix, format, metric, beforeContext, afterContext, fillBefore, fillAfter, verdict, habits }: MetricCardProps) {
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

  const improved = metric.delta > 0;
  const declined = metric.delta < 0;
  const accent = getAccentColor(metric.delta);
  const deltaSign = metric.delta > 0 ? '+' : '';

  return (
    <div
      className="reveal rounded-[20px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ padding: 24 }}
    >
      {/* Header: icon + title + delta badge + description */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div
          className="flex shrink-0 items-center justify-center rounded-full"
          style={{ width: 36, height: 36, backgroundColor: `${accent}10` }}
        >
          <Icon icon={icon} width={18} height={18} color={accent} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-inter text-base-oscura" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 600, lineHeight: 1.4 }}>
              {name}
            </span>
            <span
              className="rounded-full font-inter shrink-0"
              style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', backgroundColor: `${accent}18`, color: accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {deltaSign}{metric.delta}%
            </span>
          </div>
          <p className="font-inter text-gray-400" style={{ fontSize: 13, lineHeight: 1.4, marginTop: 2 }}>
            {description}
          </p>
        </div>
      </div>

      {/* Value row: before (struck) → after (large colored) */}
      <div className="mb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-inter text-gray-300" style={{ fontSize: 22, fontWeight: 600, textDecoration: 'line-through', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {format(metric.before)}{suffix}
          </span>
          <Icon icon="solar:arrow-right-outline" width={16} height={16} color="#D1D5DB" className="shrink-0" style={{ marginBottom: 2 }} />
          <span className="font-inter" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {format(metric.after)}{suffix}
          </span>
          <span className="hidden sm:inline font-inter text-gray-400" style={{ fontSize: 13 }}>
            {afterContext}
          </span>
        </div>
        <p className="sm:hidden font-inter text-gray-400" style={{ fontSize: 13, marginTop: 6 }}>
          {afterContext}
        </p>
      </div>

      {/* Dual progress bar */}
      <div ref={barRef} className="relative mb-2" style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 99 }}>
        {/* Before bar (dimmed) */}
        <div
          className="absolute h-full rounded-full"
          style={{
            width: visible ? `${fillBefore}%` : '0%',
            backgroundColor: '#D1D5DB',
            borderRadius: 99,
            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: 0.5,
          }}
        />
        {/* After bar (colored, on top) */}
        <div
          className="absolute h-full rounded-full"
          style={{
            width: visible ? `${fillAfter}%` : '0%',
            backgroundColor: accent,
            borderRadius: 99,
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-0">
        <p className="font-inter text-gray-400" style={{ fontSize: 12 }}>
          Antes: {beforeContext}
        </p>
        <p className="font-inter text-gray-400" style={{ fontSize: 12 }}>
          Ahora: {afterContext}
        </p>
      </div>

      {/* Verdict */}
      <div
        className="rounded-[12px] mt-4"
        style={{
          padding: '12px 16px',
          borderLeft: `3px solid ${accent}`,
          backgroundColor: `${accent}08`,
        }}
      >
        <p className="font-inter text-gray-600" style={{ fontSize: 13, lineHeight: 1.5 }}>
          {verdict}
        </p>
      </div>

      {/* Habit chips */}
      {habits && habits.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          {habits.map((h, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 rounded-[10px]"
              style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <Icon icon={h.icon} width={14} height={14} color={h.iconColor} className="shrink-0" />
              <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>
                {h.label}
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
// Main
// ---------------------------------------------------------------------------

interface EvolutionMetricsProps {
  data: EvolutionData;
}

export function EvolutionMetrics({ data }: EvolutionMetricsProps) {
  const { improved, metrics, signals } = data;
  const followers = data.current.profile.followersCount;
  const sector = data.current.sector;
  const benchmarks = SECTOR_BENCHMARKS[sector.toLowerCase()] ?? SECTOR_BENCHMARKS.general;
  const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  // Verdicts
  const erVerdict = metrics.er.delta > 0
    ? `Pasaste de ${metrics.er.before.toFixed(1)}% a ${metrics.er.after.toFixed(1)}%. Tus posts le dicen al algoritmo que merecen más distribución.`
    : metrics.er.delta < 0
      ? `Tu ER bajó de ${metrics.er.before.toFixed(1)}% a ${metrics.er.after.toFixed(1)}%. Puede deberse a contenido que no conectó o menos publicaciones.`
      : `Tu ER se mantuvo estable en ${metrics.er.after.toFixed(1)}%. Mantener consistencia es clave.`;

  const crVerdict = metrics.cr.delta > 0
    ? `Tu conversación creció: de ${(metrics.cr.before * 100).toFixed(1)}% a ${(metrics.cr.after * 100).toFixed(1)}%. Más comentarios = más señales positivas al algoritmo.`
    : metrics.cr.delta < 0
      ? `Tu CR bajó de ${(metrics.cr.before * 100).toFixed(1)}% a ${(metrics.cr.after * 100).toFixed(1)}%. Los posts necesitan más CTAs que inviten a comentar.`
      : `Tu CR se mantuvo en ${(metrics.cr.after * 100).toFixed(1)}%. Mantener la conversación activa es importante.`;

  const rvrVerdict = metrics.rvr.delta > 0
    ? `Tus Reels pasaron de ${metrics.rvr.before.toFixed(1)}% a ${metrics.rvr.after.toFixed(1)}% de alcance. La estrategia de video está funcionando.`
    : metrics.rvr.delta < 0
      ? `El alcance de tus Reels bajó de ${metrics.rvr.before.toFixed(1)}% a ${metrics.rvr.after.toFixed(1)}%. Experimenta con nuevos formatos de Reels.`
      : `Tu RVR se mantuvo en ${metrics.rvr.after.toFixed(1)}%. Consistencia en video es clave para crecer.`;

  // Signal helpers
  const freqAfter = signals.frequency.after.toFixed(1);
  const freqDelta = signals.frequency.after - signals.frequency.before;
  const recActive = signals.recency.after < 8;
  const trendUp = signals.trend.after > signals.trend.before;
  const trendAfterStr = `${signals.trend.after > 0 ? '+' : ''}${Math.round(signals.trend.after)}%`;

  // Build habit chips per metric (same mapping as diagnostico)
  const erHabits: HabitChip[] = [{
    icon: trendUp ? 'solar:graph-up-outline' : 'solar:graph-down-outline',
    iconColor: trendUp ? '#34D399' : '#F87171',
    label: trendUp
      ? `Tu interacción viene creciendo un ${trendAfterStr}`
      : `Tu interacción viene cayendo un ${trendAfterStr}`,
    statusLabel: trendUp ? 'Subiendo' : 'Cayendo',
    statusColor: trendUp ? '#1D7454' : '#F87171',
    statusBg: trendUp ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
  }];

  const crHabits: HabitChip[] = [
    {
      icon: 'solar:calendar-outline',
      iconColor: '#60A5FA',
      label: `Publicas ${freqAfter} veces por semana`,
      statusLabel: freqDelta >= 0 ? (signals.frequency.after >= 3 ? 'Alta' : 'Media') : 'Baja',
      statusColor: freqDelta >= 0 ? (signals.frequency.after >= 3 ? '#1D7454' : '#D97706') : '#F87171',
      statusBg: freqDelta >= 0 ? (signals.frequency.after >= 3 ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)') : 'rgba(248,113,113,0.1)',
    },
    {
      icon: 'solar:clock-circle-outline',
      iconColor: '#FBBF24',
      label: `Tu último post fue hace ${Math.round(signals.recency.after)} días`,
      statusLabel: recActive ? 'Activo' : 'Inactivo',
      statusColor: recActive ? '#1D7454' : '#F87171',
      statusBg: recActive ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
    },
  ];

  // RVR habits — reels percentage & format mix
  const healthSignals = data.current.healthSignals;
  const reelsPct = healthSignals.formatMix.distribution['Clips'] ?? 0;
  const formatCount = Object.entries(healthSignals.formatMix.distribution).filter(([, v]) => v > 0).length;

  const rvrHabits: HabitChip[] = [
    {
      icon: 'solar:clapperboard-open-play-outline',
      iconColor: '#A78BFA',
      label: `El ${reelsPct}% de tu contenido son Reels`,
      statusLabel: reelsPct >= 50 ? 'Bueno' : reelsPct >= 30 ? 'Mejorable' : 'Bajo',
      statusColor: reelsPct >= 50 ? '#1D7454' : reelsPct >= 30 ? '#D97706' : '#F87171',
      statusBg: reelsPct >= 50 ? 'rgba(52,211,153,0.1)' : reelsPct >= 30 ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)',
    },
    {
      icon: 'solar:layers-outline',
      iconColor: '#60A5FA',
      label: `Usas ${formatCount} tipo${formatCount !== 1 ? 's' : ''} de formato`,
      statusLabel: healthSignals.formatMix.label === 'Variado' ? 'Variado' : 'Dependiente',
      statusColor: healthSignals.formatMix.label === 'Variado' ? '#1D7454' : '#D97706',
      statusBg: healthSignals.formatMix.label === 'Variado' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 40 }}>
        <SectionLabel color="blue">Tu progreso en números</SectionLabel>
        <h2
          className="font-inter text-base-oscura"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          {improved ? 'Así cambiaron tus métricas' : 'Así se movieron tus métricas'}
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, maxWidth: 520 }}>
          {improved
            ? 'Cada métrica muestra los datos reales de tu perfil: antes y ahora.'
            : 'Algunas métricas subieron, otras no. Entender el porqué es más importante que el número.'}
        </p>
      </div>

      {/* Metric cards */}
      <div className="flex flex-col gap-5">
        {/* ER */}
        <MetricCard
          icon="solar:chart-2-outline"
          name="Tasa de interacción (ER)"
          description="Likes + comentarios en relación a tus seguidores."
          suffix="%"
          format={(v) => v.toFixed(1)}
          metric={metrics.er}
          beforeContext={`~${fmtK(metrics.er.interactionsBefore)} interacciones promedio por publicación`}
          afterContext={`~${fmtK(metrics.er.interactionsAfter)} interacciones promedio por publicación`}
          fillBefore={Math.min((metrics.er.before / benchmarks.er) * 100, 100)}
          fillAfter={Math.min((metrics.er.after / benchmarks.er) * 100, 100)}
          verdict={erVerdict}
          habits={erHabits}
        />

        {/* CR */}
        <MetricCard
          icon="solar:chat-round-dots-outline"
          name="Tasa de comentarios (CR)"
          description="Comentarios en relación a likes. La interacción más valiosa."
          suffix="%"
          format={(v) => (v * 100).toFixed(1)}
          metric={metrics.cr}
          beforeContext={`${(metrics.cr.before * 100).toFixed(1)}% de quienes dan like también comentan`}
          afterContext={`${(metrics.cr.after * 100).toFixed(1)}% de quienes dan like también comentan`}
          fillBefore={Math.min((metrics.cr.before / benchmarks.cr) * 100, 100)}
          fillAfter={Math.min((metrics.cr.after / benchmarks.cr) * 100, 100)}
          verdict={crVerdict}
          habits={crHabits}
        />

        {/* RVR */}
        {metrics.rvr.hasReels && (
          <MetricCard
            icon="solar:videocamera-record-outline"
            name="Alcance de Reels (RVR)"
            description="Vistas de Reels en relación a seguidores."
            suffix="%"
            format={(v) => v.toFixed(1)}
            metric={metrics.rvr}
            beforeContext={`~${fmtK(metrics.rvr.viewsBefore)} vistas promedio por Reel`}
            afterContext={`~${fmtK(metrics.rvr.viewsAfter)} vistas promedio por Reel`}
            fillBefore={Math.min((metrics.rvr.before / benchmarks.rvr) * 100, 100)}
            fillAfter={Math.min((metrics.rvr.after / benchmarks.rvr) * 100, 100)}
            verdict={rvrVerdict}
            habits={rvrHabits}
          />
        )}
      </div>
    </div>
  );
}
