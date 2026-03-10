'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AuditMetrics, HealthSignals } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface NextStepsProps {
  currentScore: number;
  previousScore: number;
  metrics: AuditMetrics;
  healthSignals: HealthSignals;
}

interface Tip {
  title: string;
  description: string;
}

function getImprovementTips(metrics: AuditMetrics, signals: HealthSignals): Tip[] {
  const tips: Tip[] = [];

  if (metrics.engagementRate < 3) {
    tips.push({
      title: 'Aumenta la interaccion en tus posts',
      description:
        'Usa llamados a la accion en tus captions. Preguntas, encuestas y contenido que invite a comentar aumentan tu engagement rate.',
    });
  }

  if (metrics.commentRate < 0.5) {
    tips.push({
      title: 'Genera mas conversacion',
      description:
        'Responde cada comentario que recibas y haz preguntas en tus captions. La conversacion bidireccional es clave para el algoritmo.',
    });
  }

  if (metrics.reelsViewRate < 5 || !metrics.hasReels) {
    tips.push({
      title: 'Potencia tu estrategia de Reels',
      description:
        'Los Reels son la principal fuente de alcance organico. Publica al menos 2-3 Reels por semana con hooks en los primeros 3 segundos.',
    });
  }

  if (signals.frequency.label === 'Baja') {
    tips.push({
      title: 'Aumenta tu frecuencia de publicacion',
      description:
        'Publicar de forma consistente es clave. Apunta a al menos 3-4 publicaciones por semana para mantener visibilidad.',
    });
  }

  if (signals.recency.label === 'Irregular' || signals.recency.label === 'Inactivo') {
    tips.push({
      title: 'Mantente activo',
      description:
        'Instagram favorece cuentas activas. Publica regularmente y usa Stories para mantener presencia diaria.',
    });
  }

  if (signals.trend.label === 'Cayendo') {
    tips.push({
      title: 'Revierte la tendencia negativa',
      description:
        'Tus metricas muestran una tendencia a la baja. Experimenta con nuevos formatos de contenido y analiza que publicaciones generan mejor respuesta.',
    });
  }

  return tips.slice(0, 3);
}

function getDeclineTips(metrics: AuditMetrics, signals: HealthSignals): Tip[] {
  const tips: Tip[] = [];

  tips.push({
    title: 'Es normal que las metricas fluctuen',
    description:
      'Los cambios en el algoritmo de Instagram, la estacionalidad y la competencia pueden afectar tus metricas. Lo importante es la tendencia a largo plazo.',
  });

  if (signals.frequency.label === 'Baja') {
    tips.push({
      title: 'La consistencia es clave',
      description:
        'Una posible razon de la bajada es la frecuencia irregular de publicacion. Intenta mantener un calendario de contenido consistente.',
    });
  }

  if (!metrics.hasReels) {
    tips.push({
      title: 'Incorpora Reels a tu estrategia',
      description:
        'Instagram esta priorizando video. Si no estas usando Reels, estas perdiendo la mayor fuente de alcance organico.',
    });
  }

  if (signals.trend.label === 'Cayendo') {
    tips.push({
      title: 'Experimenta con nuevos formatos',
      description:
        'Si lo que hacias antes ya no funciona, prueba algo nuevo: carruseles educativos, Reels cortos, colaboraciones o contenido generado por usuarios.',
    });
  }

  return tips.slice(0, 3);
}

export function NextSteps({
  currentScore,
  previousScore,
  metrics,
  healthSignals,
}: NextStepsProps) {
  const { t } = useTranslation('audit');
  const improved = currentScore > previousScore;

  const tips = useMemo(() => {
    return improved
      ? getImprovementTips(metrics, healthSignals)
      : getDeclineTips(metrics, healthSignals);
  }, [improved, metrics, healthSignals]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="flex flex-col gap-bewe-4 py-bewe-5"
    >
      {/* Header — variant A or B */}
      <div className="flex flex-col gap-bewe-2">
        <h3 className="text-h3 font-inter font-semibold text-base-oscura">
          {improved
            ? 'Vas bien. Aqui hay cosas que pueden llevarte mas lejos.'
            : 'No pasa nada. Aqui esta por que puede estar pasando esto.'}
        </h3>

        <p className="text-body font-inter text-base-superficie">
          {improved
            ? 'Tu score mejoro, pero todavia hay oportunidades para crecer.'
            : 'Tu score no subio esta vez, pero eso no significa que vayas mal. Aqui tienes acciones concretas.'}
        </p>
      </div>

      {/* Tips cards */}
      <div className="flex flex-col gap-bewe-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1 + 0.15 * index }}
            className="flex gap-bewe-3 p-bewe-4 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            {/* Number indicator */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-small font-inter font-semibold ${
                improved
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'bg-primary-100 text-primary-700'
              }`}
            >
              {index + 1}
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-body font-inter font-semibold text-base-oscura">
                {tip.title}
              </h4>
              <p className="text-small font-inter text-base-superficie">
                {tip.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
