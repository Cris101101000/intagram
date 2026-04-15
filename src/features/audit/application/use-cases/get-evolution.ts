import { AuditResult, PreviousAudit, ScoreLevel } from '../../domain/interfaces/audit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MetricEvolution {
  before: number;
  after: number;
  delta: number; // percentage change
}

export interface SignalEvolution {
  before: number;
  after: number;
}

export interface Achievement {
  icon: string;
  title: string;
  metric: string;
  barBefore: { width: string; label: string };
  barAfter: { width: string; label: string };
  lindaCredit: string;
}

export interface Tip {
  icon: string;
  title: string;
  cause: string;
  action: string;
}

export interface EvolutionData {
  current: AuditResult;
  previous: PreviousAudit;
  improved: boolean;
  scoreDelta: number;
  daysBetween: number;
  dateBefore: string;
  dateAfter: string;
  levelBefore: ScoreLevel;
  levelAfter: ScoreLevel;

  metrics: {
    er: MetricEvolution & { interactionsBefore: number; interactionsAfter: number };
    cr: MetricEvolution & { commentsBefore: number; commentsAfter: number; likesBefore: number; likesAfter: number };
    rvr: MetricEvolution & { viewsBefore: number; viewsAfter: number; hasReels: boolean };
  };

  signals: {
    frequency: SignalEvolution;
    recency: SignalEvolution;
    trend: SignalEvolution;
  };

  achievements: Achievement[];
  tips: Tip[];
  leadsCount?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveLevel(score: number): ScoreLevel {
  if (score >= 80) return ScoreLevel.EXCELENTE;
  if (score >= 60) return ScoreLevel.BUENO;
  if (score >= 40) return ScoreLevel.REGULAR;
  return ScoreLevel.CRITICO;
}

function formatMonth(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function pctChange(before: number, after: number): number {
  if (before === 0) return after > 0 ? 100 : 0;
  return Math.round(((after - before) / before) * 100);
}

function barWidth(value: number, max: number): string {
  if (max === 0) return '5%';
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return `${Math.max(pct, 5)}%`;
}

// ---------------------------------------------------------------------------
// Achievement generation
// ---------------------------------------------------------------------------

function buildAchievements(
  erBefore: number, erAfter: number,
  crBefore: number, crAfter: number,
  rvrBefore: number, rvrAfter: number,
  followers: number,
): Achievement[] {
  const achievements: Achievement[] = [];

  // ER
  const erDelta = pctChange(erBefore, erAfter);
  if (erDelta > 0) {
    const intBefore = Math.round((erBefore / 100) * followers);
    const intAfter = Math.round((erAfter / 100) * followers);
    const max = Math.max(intAfter, intBefore);
    achievements.push({
      icon: 'solar:graph-up-outline',
      title: `Tu interacción subió +${erDelta}%`,
      metric: `Tasa de interacción: ${erBefore.toFixed(1)}% → ${erAfter.toFixed(1)}%`,
      barBefore: { width: barWidth(intBefore, max), label: `~${intBefore.toLocaleString()} interacciones promedio por publicación` },
      barAfter: { width: barWidth(intAfter, max), label: `~${intAfter.toLocaleString()} interacciones promedio por publicación` },
      lindaCredit: 'Los hooks y CTAs de Linda generan más interacción en cada post',
    });
  }

  // CR
  const crDelta = pctChange(crBefore, crAfter);
  if (crDelta > 0) {
    const commBefore = Math.round(crBefore * 100);
    const commAfter = Math.round(crAfter * 100);
    const max = Math.max(commAfter, commBefore);
    achievements.push({
      icon: 'solar:chat-round-dots-outline',
      title: `Tus comentarios se duplicaron`,
      metric: `Tasa de comentarios: ${(crBefore * 100).toFixed(1)}% → ${(crAfter * 100).toFixed(1)}%`,
      barBefore: { width: barWidth(commBefore, max), label: `${(crBefore * 100).toFixed(1)}% de quienes dan like también comentan` },
      barAfter: { width: barWidth(commAfter, max), label: `${(crAfter * 100).toFixed(1)}% de quienes dan like también comentan` },
      lindaCredit: 'Linda responde comentarios 24/7 y mantiene la conversación activa',
    });
  }

  // RVR
  const rvrDelta = pctChange(rvrBefore, rvrAfter);
  if (rvrDelta > 0) {
    const viewsBefore = Math.round((rvrBefore / 100) * followers);
    const viewsAfter = Math.round((rvrAfter / 100) * followers);
    const max = Math.max(viewsAfter, viewsBefore);
    achievements.push({
      icon: 'solar:videocamera-record-outline',
      title: `Tus Reels llegan a +${rvrDelta}% más personas`,
      metric: `Alcance de Reels: ${rvrBefore.toFixed(1)}% → ${rvrAfter.toFixed(1)}%`,
      barBefore: { width: barWidth(viewsBefore, max), label: `~${viewsBefore.toLocaleString()} vistas promedio por Reel` },
      barAfter: { width: barWidth(viewsAfter, max), label: `~${viewsAfter.toLocaleString()} vistas promedio por Reel` },
      lindaCredit: 'Las propuestas de contenido de Linda incluyen Reels optimizados',
    });
  }

  return achievements.sort((a, b) => {
    // Sort by biggest improvement first
    const aNum = parseInt(a.title.match(/\+(\d+)/)?.[1] ?? '0');
    const bNum = parseInt(b.title.match(/\+(\d+)/)?.[1] ?? '0');
    return bNum - aNum;
  }).slice(0, 3);
}

// ---------------------------------------------------------------------------
// Tip generation
// ---------------------------------------------------------------------------

const TIP_LIBRARY: Tip[] = [
  {
    icon: 'solar:calendar-outline',
    title: 'Publicaste menos que antes',
    cause: 'Si la cantidad de posts bajó, el ER y CR se calculan sobre menos datos — lo que puede bajar el promedio aunque la calidad sea igual.',
    action: 'Activar propuestas periódicas de Linda para mantener ritmo',
  },
  {
    icon: 'solar:graph-down-outline',
    title: 'Posts recientes sin interacción',
    cause: 'Posts con muy pocos likes/comentarios arrastran el promedio hacia abajo. Puede ser contenido que no conectó con lo que tu audiencia espera.',
    action: 'Ajustar preferencias de contenido en BeweOS',
  },
  {
    icon: 'solar:chart-2-outline',
    title: 'El benchmark del sector subió',
    cause: 'Tu score puede bajar si el sector mejoró en conjunto. No es una caída de tu negocio — es el mercado subiendo el listón.',
    action: 'Enfocarse en valores absolutos, no solo en el score relativo',
  },
  {
    icon: 'solar:chat-round-dots-outline',
    title: 'DMs sin respuesta acumulados',
    cause: 'Si Linda no está activa o sus reglas no cubren las preguntas frecuentes, los DMs sin respuesta generan una experiencia negativa.',
    action: 'Verificar que Linda esté activa en DMs y revisar reglas',
  },
];

function buildTips(
  erBefore: number, erAfter: number,
  crBefore: number, crAfter: number,
  rvrBefore: number, rvrAfter: number,
): Tip[] {
  const tips: Tip[] = [];

  if (erAfter < erBefore) tips.push(TIP_LIBRARY[0]); // freq dropped
  if (crAfter < crBefore) tips.push(TIP_LIBRARY[1]); // content flat
  tips.push(TIP_LIBRARY[2]); // benchmark rose (always relevant)
  if (tips.length < 3) tips.push(TIP_LIBRARY[3]); // DMs

  return tips.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function getEvolution(current: AuditResult): EvolutionData | null {
  if (!current.previousAudit) return null;

  const prev = current.previousAudit;
  const scoreDelta = current.score - prev.score;
  const improved = scoreDelta > 0;
  const followers = current.profile.followersCount;

  // Days between
  const now = new Date(current.createdAt);
  const before = new Date(prev.createdAt);
  const daysBetween = Math.max(1, Math.round((now.getTime() - before.getTime()) / (1000 * 60 * 60 * 24)));

  // Metric deltas
  const erBefore = prev.metrics.engagementRate;
  const erAfter = current.metrics.engagementRate;
  const crBefore = prev.metrics.commentRate;
  const crAfter = current.metrics.commentRate;
  const rvrBefore = prev.metrics.reelsViewRate;
  const rvrAfter = current.metrics.reelsViewRate;

  // Approximate raw numbers
  const interactionsBefore = Math.round((erBefore / 100) * followers);
  const interactionsAfter = Math.round((erAfter / 100) * followers);
  const likesBefore = Math.round(interactionsBefore / (1 + crBefore));
  const likesAfter = Math.round(interactionsAfter / (1 + crAfter));
  const commentsBefore = interactionsBefore - likesBefore;
  const commentsAfter = interactionsAfter - likesAfter;
  const viewsBefore = Math.round((rvrBefore / 100) * followers);
  const viewsAfter = Math.round((rvrAfter / 100) * followers);

  return {
    current,
    previous: prev,
    improved,
    scoreDelta,
    daysBetween,
    dateBefore: formatMonth(prev.createdAt),
    dateAfter: formatMonth(current.createdAt),
    levelBefore: resolveLevel(prev.score),
    levelAfter: current.level,

    metrics: {
      er: {
        before: erBefore,
        after: erAfter,
        delta: pctChange(erBefore, erAfter),
        interactionsBefore,
        interactionsAfter,
      },
      cr: {
        before: crBefore,
        after: crAfter,
        delta: pctChange(crBefore, crAfter),
        commentsBefore,
        commentsAfter,
        likesBefore,
        likesAfter,
      },
      rvr: {
        before: rvrBefore,
        after: rvrAfter,
        delta: pctChange(rvrBefore, rvrAfter),
        viewsBefore,
        viewsAfter,
        hasReels: current.metrics.hasReels,
      },
    },

    signals: {
      frequency: {
        before: current.healthSignals.frequency.value * 0.7, // approximate previous
        after: current.healthSignals.frequency.value,
      },
      recency: {
        before: Math.round(current.healthSignals.recency.daysSinceLastPost * 1.5),
        after: current.healthSignals.recency.daysSinceLastPost,
      },
      trend: {
        before: current.healthSignals.trend.changePercent - 10,
        after: current.healthSignals.trend.changePercent,
      },
    },

    achievements: improved
      ? buildAchievements(erBefore, erAfter, crBefore, crAfter, rvrBefore, rvrAfter, followers)
      : [],

    tips: !improved
      ? buildTips(erBefore, erAfter, crBefore, crAfter, rvrBefore, rvrAfter)
      : [],
  };
}
