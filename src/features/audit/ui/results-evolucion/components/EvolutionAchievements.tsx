'use client';

import { Icon } from '@iconify/react';
import { EvolutionData, Achievement } from '@/features/audit/application/use-cases/get-evolution';
import { SectionLabel } from '@/features/audit/ui/results/components/MetricsBlock';

// ---------------------------------------------------------------------------
// Static icon components (inline SVG to avoid async loading issues)
// ---------------------------------------------------------------------------

function GraphUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D7454" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 7l-7.5 7.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

function ChatDotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D7454" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21a9 9 0 1 0-7.97-4.8L3 21l4.8-1.03A8.96 8.96 0 0 0 12 21z" />
      <circle cx="8" cy="12" r="0.5" fill="#1D7454" />
      <circle cx="12" cy="12" r="0.5" fill="#1D7454" />
      <circle cx="16" cy="12" r="0.5" fill="#1D7454" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D7454" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="14" height="14" rx="2" />
      <path d="M16 10l4.5-2.5v9L16 14" />
      <circle cx="9" cy="12" r="2" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D7454" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function resolveIcon(metric: string): () => JSX.Element {
  if (metric.startsWith('Tasa de interacción')) return GraphUpIcon;
  if (metric.startsWith('Tasa de comentarios')) return ChatDotsIcon;
  if (metric.startsWith('Alcance de Reels')) return VideoIcon;
  return GraphUpIcon;
}

// ---------------------------------------------------------------------------
// Achievement card
// ---------------------------------------------------------------------------

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const IconComponent = resolveIcon(achievement.metric);

  return (
    <div
      className="reveal rounded-[20px] border border-gray-200 bg-white overflow-hidden"
    >
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: 'rgba(52,211,153,0.1)' }}
          >
            <IconComponent />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>
              {achievement.title}
            </span>
            <div className="font-inter text-gray-400" style={{ fontSize: 13 }}>
              {achievement.metric}
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Before bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Antes
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: achievement.barBefore.width, backgroundColor: '#D1D5DB', transition: 'width 1s ease' }}
              />
            </div>
            <span className="font-inter text-gray-400" style={{ fontSize: 12, marginTop: 2, display: 'block' }}>
              {achievement.barBefore.label}
            </span>
          </div>

          {/* After bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ahora
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: achievement.barAfter.width, backgroundColor: '#34D399', transition: 'width 1s ease 0.3s' }}
              />
            </div>
            <span className="font-inter text-base-oscura" style={{ fontSize: 12, fontWeight: 600, marginTop: 2, display: 'block' }}>
              {achievement.barAfter.label}
            </span>
          </div>
        </div>

        {/* Linda credit */}
        <div
          className="flex items-start gap-2 rounded-[12px]"
          style={{ padding: '12px 14px', backgroundColor: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <Icon icon="solar:star-outline" width={14} height={14} color="#34D399" className="shrink-0 mt-0.5" />
          <p className="font-inter text-gray-600" style={{ fontSize: 13, lineHeight: 1.5 }}>
            {achievement.lindaCredit}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leads card
// ---------------------------------------------------------------------------

function LeadsCard({ count }: { count: number }) {
  return (
    <div
      className="reveal rounded-[20px] border border-gray-200 bg-white overflow-hidden"
    >
      <div style={{ padding: 24 }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: 'rgba(52,211,153,0.1)' }}
          >
            <ClipboardIcon />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>
              {count} leads nuevos desde Instagram
            </span>
            <div className="font-inter text-gray-400" style={{ fontSize: 13 }}>
              Capturados automáticamente en el CRM
            </div>
          </div>
        </div>

        {/* Avatar row */}
        <div className="flex items-center mb-4" style={{ paddingLeft: 4 }}>
          {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-full border-2 border-white"
              style={{
                width: 28, height: 28,
                backgroundColor: '#D6F6EB',
                marginLeft: i > 0 ? -6 : 0,
                zIndex: 10 - i,
              }}
            >
              <Icon icon="solar:user-outline" width={14} height={14} color="#34D399" />
            </div>
          ))}
          {count > 8 && (
            <div
              className="flex items-center justify-center rounded-full border-2 border-white font-inter"
              style={{ width: 28, height: 28, backgroundColor: '#F3F4F6', marginLeft: -6, fontSize: 10, fontWeight: 600, color: '#64748B' }}
            >
              +{count - 8}
            </div>
          )}
        </div>

        <div
          className="flex items-start gap-2 rounded-[12px]"
          style={{ padding: '12px 14px', backgroundColor: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}
        >
          <Icon icon="solar:star-outline" width={14} height={14} color="#34D399" className="shrink-0 mt-0.5" />
          <p className="font-inter text-gray-600" style={{ fontSize: 13, lineHeight: 1.5 }}>
            Linda los registró y etiquetó automáticamente en el CRM
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface EvolutionAchievementsProps {
  data: EvolutionData;
}

export function EvolutionAchievements({ data }: EvolutionAchievementsProps) {
  const { achievements, daysBetween, leadsCount } = data;

  if (achievements.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 40 }}>
        <SectionLabel color="green">Logros desbloqueados</SectionLabel>
        <h2
          className="font-inter text-base-oscura"
          style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          Estos números no pasaron solos. Esto logró{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, background: 'linear-gradient(135deg, #34D399, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Linda
          </span>
          {' '}en {daysBetween} días
        </h2>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.5, maxWidth: 520 }}>
          Cada logro está conectado con algo que Linda hizo por tu negocio.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-5">
        {achievements.map((achievement, i) => (
          <AchievementCard key={i} achievement={achievement} index={i} />
        ))}
        {leadsCount != null && leadsCount > 0 && <LeadsCard count={leadsCount} />}
      </div>
    </div>
  );
}
