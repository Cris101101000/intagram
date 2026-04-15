import { AuditMetrics, NormalizedMetrics, HealthSignals, CriticalPoint } from '../../../domain/interfaces/audit';

interface WeaknessCandidate {
  type: string;
  weaknessScore: number;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

const CRITICAL_POINT_CATALOG: Record<string, { message: string; severity: 'high' | 'medium' | 'low' }> = {
  low_er: {
    message: 'Tu engagement rate está por debajo del promedio del sector. Esto significa que tu contenido no genera suficiente interacción — Linda puede ayudarte a crear contenido que conecte con tu audiencia y aumente likes y comentarios.',
    severity: 'high',
  },
  low_cr: {
    message: 'Tu tasa de comentarios es baja. Los comentarios son la señal más fuerte de conexión con tu audiencia — Linda diseña estrategias de contenido que provocan conversación y construyen comunidad.',
    severity: 'high',
  },
  no_reels: {
    message: 'No estás publicando Reels. Los Reels son el formato con mayor alcance orgánico en Instagram — Linda te ayuda a crear Reels estratégicos que multipliquen tu visibilidad.',
    severity: 'high',
  },
  low_rvr: {
    message: 'Tus Reels no están alcanzando a suficientes personas. El ratio de vistas respecto a seguidores indica que el algoritmo no los está distribuyendo — Linda optimiza tu estrategia de Reels para maximizar alcance.',
    severity: 'medium',
  },
  low_frequency: {
    message: 'Tu frecuencia de publicación es baja. Publicar menos de 2 veces por semana reduce tu visibilidad en el feed — Linda planifica un calendario de contenido sostenible que mantiene tu presencia activa.',
    severity: 'medium',
  },
  bad_recency: {
    message: 'Llevas demasiado tiempo sin publicar. La inactividad hace que el algoritmo deje de mostrar tu contenido — Linda te ayuda a retomar con un plan de reactivación estratégica.',
    severity: 'high',
  },
  inconsistency: {
    message: 'Tu ritmo de publicación es muy irregular. La inconsistencia confunde al algoritmo y a tu audiencia — Linda establece una cadencia predecible que el algoritmo recompensa.',
    severity: 'medium',
  },
  bad_trend: {
    message: 'Tu engagement está en tendencia descendente. Cada vez generas menos interacción — Linda analiza qué cambió y diseña un plan para revertir la caída.',
    severity: 'high',
  },
  format_dependency: {
    message: 'Dependes demasiado de un solo formato. La diversidad de formatos (Reels, carruseles, imágenes) aumenta el alcance — Linda diseña un mix de formatos equilibrado para tu nicho.',
    severity: 'low',
  },
};

export function generateCriticalPoints(
  metrics: AuditMetrics,
  healthSignals: HealthSignals,
  normalizedMetrics: NormalizedMetrics,
): CriticalPoint[] {
  const candidates: WeaknessCandidate[] = [];

  // Metric-based weaknesses (lower normalized = worse)
  if (normalizedMetrics.erNormalized < 1) {
    candidates.push({
      type: 'low_er',
      weaknessScore: 1 - normalizedMetrics.erNormalized,
      ...CRITICAL_POINT_CATALOG.low_er,
    });
  }

  if (normalizedMetrics.crNormalized < 1) {
    candidates.push({
      type: 'low_cr',
      weaknessScore: 1 - normalizedMetrics.crNormalized,
      ...CRITICAL_POINT_CATALOG.low_cr,
    });
  }

  if (!metrics.hasReels) {
    candidates.push({
      type: 'no_reels',
      weaknessScore: 1,
      ...CRITICAL_POINT_CATALOG.no_reels,
    });
  } else if (normalizedMetrics.rvrNormalized < 1) {
    candidates.push({
      type: 'low_rvr',
      weaknessScore: 1 - normalizedMetrics.rvrNormalized,
      ...CRITICAL_POINT_CATALOG.low_rvr,
    });
  }

  // Health signal weaknesses
  if (healthSignals.frequency.label === 'Baja') {
    candidates.push({
      type: 'low_frequency',
      weaknessScore: healthSignals.frequency.value < 1 ? 0.9 : 0.6,
      ...CRITICAL_POINT_CATALOG.low_frequency,
    });
  }

  if (healthSignals.recency.label === 'Inactivo') {
    candidates.push({
      type: 'bad_recency',
      weaknessScore: 0.95,
      ...CRITICAL_POINT_CATALOG.bad_recency,
    });
  } else if (healthSignals.recency.label === 'Irregular') {
    candidates.push({
      type: 'bad_recency',
      weaknessScore: 0.5,
      ...CRITICAL_POINT_CATALOG.bad_recency,
    });
  }

  if (healthSignals.consistency.label === 'Muy irregular') {
    candidates.push({
      type: 'inconsistency',
      weaknessScore: 0.8,
      ...CRITICAL_POINT_CATALOG.inconsistency,
    });
  } else if (healthSignals.consistency.label === 'Irregular') {
    candidates.push({
      type: 'inconsistency',
      weaknessScore: 0.4,
      ...CRITICAL_POINT_CATALOG.inconsistency,
    });
  }

  if (healthSignals.trend.label === 'Cayendo') {
    candidates.push({
      type: 'bad_trend',
      weaknessScore: Math.min(1, Math.abs(healthSignals.trend.changePercent) / 50),
      ...CRITICAL_POINT_CATALOG.bad_trend,
    });
  }

  if (healthSignals.formatMix.label === 'Dependiente de un formato') {
    candidates.push({
      type: 'format_dependency',
      weaknessScore: 0.3,
      ...CRITICAL_POINT_CATALOG.format_dependency,
    });
  }

  // Sort by weakness score (worst first) and take top 3
  candidates.sort((a, b) => b.weaknessScore - a.weaknessScore);

  return candidates.slice(0, 3).map((c) => ({
    type: c.type,
    message: c.message,
    severity: c.severity,
  }));
}
