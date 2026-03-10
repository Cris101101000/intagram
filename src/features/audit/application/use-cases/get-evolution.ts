import { AuditResult, PreviousAudit } from '../../domain/interfaces/audit';

export interface EvolutionData {
  current: AuditResult;
  previous: PreviousAudit;
  scoreDelta: number;
  scorePercentChange: number;
  erDelta: number;
  crDelta: number;
  rvrDelta: number;
  achievements: Achievement[];
}

export interface Achievement {
  title: string;
  description: string;
  metricName: string;
  improvement: number; // percentage
}

export function getEvolution(current: AuditResult): EvolutionData | null {
  if (!current.previousAudit) return null;

  const prev = current.previousAudit;
  const scoreDelta = current.score - prev.score;
  const scorePercentChange = prev.score > 0 ? ((scoreDelta / prev.score) * 100) : 0;

  const erDelta = current.metrics.engagementRate - prev.metrics.engagementRate;
  const crDelta = current.metrics.commentRate - prev.metrics.commentRate;
  const rvrDelta = current.metrics.reelsViewRate - prev.metrics.reelsViewRate;

  // Generate achievements (top 3 improvements)
  const improvements = [
    { metric: 'Engagement Rate', delta: erDelta, prev: prev.metrics.engagementRate },
    { metric: 'Comment Rate', delta: crDelta, prev: prev.metrics.commentRate },
    { metric: 'Reels View Rate', delta: rvrDelta, prev: prev.metrics.reelsViewRate },
  ]
    .filter(i => i.delta > 0)
    .sort((a, b) => {
      const aPct = a.prev > 0 ? (a.delta / a.prev) * 100 : 0;
      const bPct = b.prev > 0 ? (b.delta / b.prev) * 100 : 0;
      return bPct - aPct;
    })
    .slice(0, 3)
    .map(i => ({
      title: `${i.metric} mejoró`,
      description: getAchievementDescription(i.metric, i.delta, i.prev),
      metricName: i.metric,
      improvement: i.prev > 0 ? Math.round((i.delta / i.prev) * 100) : 0,
    }));

  return {
    current,
    previous: prev,
    scoreDelta,
    scorePercentChange: Math.round(scorePercentChange),
    erDelta,
    crDelta,
    rvrDelta,
    achievements: improvements,
  };
}

function getAchievementDescription(metric: string, delta: number, prev: number): string {
  const pct = prev > 0 ? Math.round((delta / prev) * 100) : 0;
  switch (metric) {
    case 'Engagement Rate':
      return `Tu engagement subió un ${pct}%. Tu contenido está generando más reacción que antes.`;
    case 'Comment Rate':
      return `Tus comentarios aumentaron un ${pct}%. La conversación con tu audiencia está creciendo.`;
    case 'Reels View Rate':
      return `Tus Reels ahora llegan a un ${pct}% más de personas. La estrategia de video de Linda está funcionando.`;
    default:
      return `Mejora del ${pct}% en ${metric}.`;
  }
}
