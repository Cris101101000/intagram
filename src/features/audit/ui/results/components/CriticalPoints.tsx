'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { CriticalPoint, ScoreLevel } from '@/features/audit/domain/interfaces/audit';

interface CriticalPointsProps {
  criticalPoints: CriticalPoint[];
  level: ScoreLevel;
}

const TYPE_LABELS: Record<string, string> = {
  low_er: 'Engagement rate bajo',
  low_cr: 'Pocos comentarios',
  no_reels: 'Sin Reels publicados',
  low_rvr: 'Reels con bajo alcance',
  low_frequency: 'Frecuencia de publicación baja',
  bad_recency: 'Inactividad prolongada',
  inconsistency: 'Publicación irregular',
  bad_trend: 'Engagement en caída',
  format_dependency: 'Dependencia de un solo formato',
  engagement_rate: 'Engagement rate bajo',
  comment_rate: 'Pocos comentarios',
  reels_view_rate: 'Reels con bajo alcance',
  posting_consistency: 'Publicación irregular',
  posting_frequency: 'Frecuencia de publicación baja',
  recency: 'Inactividad prolongada',
  trend: 'Engagement en caída',
};

const TYPE_SUBTITLES: Record<string, string> = {
  low_er: 'Engagement Rate por debajo del sector',
  low_cr: 'Comment Rate por debajo del sector',
  no_reels: 'No estás usando el formato con más alcance',
  low_rvr: 'Tus videos funcionan pero podrían llegar a más',
  low_frequency: 'No publicas con la frecuencia que el algoritmo necesita',
  bad_recency: 'Tu perfil lleva demasiado tiempo sin actividad',
  inconsistency: 'Sin cadencia predecible para el algoritmo',
  bad_trend: 'Tu contenido genera menos interacción que antes',
  format_dependency: 'Limitas tu alcance a un solo tipo de audiencia',
  engagement_rate: 'Engagement Rate por debajo del sector',
  comment_rate: 'Comment Rate por debajo del sector',
  reels_view_rate: 'Tus videos funcionan pero podrían llegar a más',
  posting_consistency: 'Sin cadencia predecible para el algoritmo',
  posting_frequency: 'No publicas con la frecuencia que el algoritmo necesita',
  recency: 'Tu perfil lleva demasiado tiempo sin actividad',
  trend: 'Tu contenido genera menos interacción que antes',
};

const TYPE_CONSEQUENCES: Record<string, string> = {
  low_er: 'Cada post que publicas compite con menos ventaja por visibilidad. Menos personas descubren tu negocio cada semana.',
  low_cr: 'Cada post que publicas compite con menos ventaja por visibilidad. Estás perdiendo alcance orgánico que no recuperas con likes.',
  no_reels: 'Tu perfil solo llega a personas que ya te siguen. Cada semana sin Reels es una semana sin llegar a clientes nuevos.',
  low_rvr: 'Tu crecimiento de seguidores depende demasiado de que la gente ya te conozca. Aumentar la proporción de Reels multiplicaría tu exposición.',
  low_frequency: 'Hay semanas en que tu negocio no existe en Instagram. Tus seguidores buscan alternativas que sí publican con regularidad.',
  bad_recency: 'Mientras no publicas, tu competencia sí lo hace. Cada día de inactividad es un día que pierdes relevancia en el algoritmo.',
  inconsistency: 'Hay semanas en que tu negocio no existe en Instagram. Tus seguidores se olvidan de ti y buscan alternativas.',
  bad_trend: 'Si la tendencia continúa, tu alcance seguirá disminuyendo. El algoritmo premia la mejora continua y castiga la caída.',
  format_dependency: 'Estás limitando tu alcance a un solo segmento de audiencia. Diversificar formatos te expondría a nuevos clientes potenciales.',
  engagement_rate: 'Cada post que publicas compite con menos ventaja por visibilidad. Menos personas descubren tu negocio cada semana.',
  comment_rate: 'Cada post que publicas compite con menos ventaja por visibilidad. Estás perdiendo alcance orgánico que no recuperas con likes.',
  reels_view_rate: 'Tu crecimiento depende de que la gente ya te conozca. Más Reels multiplicarían tu exposición a audiencias nuevas.',
  posting_consistency: 'Hay semanas en que tu negocio no existe en Instagram. Tus seguidores se olvidan de ti y buscan alternativas.',
  posting_frequency: 'Hay semanas en que tu negocio no existe en Instagram. Tus seguidores buscan alternativas que sí publican con regularidad.',
  recency: 'Mientras no publicas, tu competencia sí lo hace. Cada día de inactividad es un día que pierdes relevancia.',
  trend: 'Si la tendencia continúa, tu alcance seguirá disminuyendo.',
};

const NUMBER_STYLE = { bg: 'linear-gradient(135deg, #FCA5A5, #F87171)', color: '#fff' };

export function CriticalPoints({ criticalPoints, level }: CriticalPointsProps) {
  const topPoints = criticalPoints.slice(0, 3);
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (topPoints.length === 0) return null;

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? -1 : i);

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center">
        <p className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, maxWidth: 520, marginBottom: 12, letterSpacing: '-0.02em' }}>
          Sabes dónde estás. Ahora veamos{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#F87171' }}>
            qué te frena
          </span>
          .
        </p>
        <p className="font-inter text-gray-500" style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 520, marginBottom: 40 }}>
          Estos son los 3 puntos que más están limitando el crecimiento de tu perfil hoy.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {topPoints.map((point, i) => {
          const isHighSeverity = point.severity === 'high';
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="reveal rounded-[20px] border border-gray-200 bg-white transition-all hover:shadow-lg"
              style={{ padding: 24 }}
            >
              {/* Header: number + title + subtitle + chevron */}
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex items-center gap-3 w-full text-left"
                aria-expanded={isOpen}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-full font-inter"
                  style={{ width: 36, height: 36, background: NUMBER_STYLE.bg, color: NUMBER_STYLE.color, fontSize: 14, fontWeight: 800 }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-inter text-base-oscura" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>
                    {TYPE_LABELS[point.type] ?? point.type}
                  </div>
                  <div className="font-inter text-gray-400" style={{ fontSize: 13 }}>
                    {TYPE_SUBTITLES[point.type] ?? ''}
                  </div>
                </div>
                <Icon
                  icon="solar:alt-arrow-down-outline"
                  width={20} height={20}
                  color="#94A3B8"
                  className="shrink-0 transition-transform duration-300"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Collapsible content */}
              <div
                className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  maxHeight: isOpen ? 500 : 0,
                  opacity: isOpen ? 1 : 0,
                  marginTop: isOpen ? 16 : 0,
                }}
              >
                {/* Explanation */}
                <p className="font-inter text-gray-500 mb-4" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  {point.message}
                </p>

                {/* Consequence box */}
                <div
                  className="flex items-start gap-2.5 rounded-[12px]"
                  style={{
                    padding: '14px 16px',
                    backgroundColor: isHighSeverity ? 'rgba(248,113,113,0.06)' : 'rgba(251,191,36,0.06)',
                    borderLeft: `3px solid ${isHighSeverity ? '#F87171' : '#FBBF24'}`,
                  }}
                >
                  <Icon
                    icon="solar:danger-triangle-outline"
                    width={16} height={16}
                    color={isHighSeverity ? '#F87171' : '#D97706'}
                    className="shrink-0 mt-0.5"
                  />
                  <p className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>
                    {TYPE_CONSEQUENCES[point.type] ?? 'Esto está limitando tu crecimiento orgánico.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
