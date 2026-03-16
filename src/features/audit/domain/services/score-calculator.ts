import { PostData, AuditMetrics, NormalizedMetrics, HealthSignals } from '../interfaces/audit';
import { Sector, SectorBenchmark } from '../interfaces/benchmark';
import { SECTOR_BENCHMARKS } from '../constants/benchmarks';

export function calculateER(posts: PostData[], followers: number): number {
  if (followers === 0 || posts.length === 0) return 0;
  const last10 = posts.slice(0, 10);
  const totalInteractions = last10.reduce((sum, p) => sum + p.likesCount + p.commentsCount, 0);
  return (totalInteractions / followers) * 100;
}

export function calculateCR(posts: PostData[]): number {
  const last10 = posts.slice(0, 10);
  const validPosts = last10.filter((p) => p.likesCount > 0);
  if (validPosts.length === 0) return 0;
  const totalRatio = validPosts.reduce((sum, p) => sum + p.commentsCount / p.likesCount, 0);
  return totalRatio / validPosts.length;
}

export function calculateRVR(posts: PostData[], followers: number): number {
  if (followers === 0) return 0;
  const videoPosts = posts.filter((p) => p.type === 'Video' || p.type === 'Clips');
  if (videoPosts.length === 0) return 0;
  const totalViews = videoPosts.reduce((sum, p) => sum + (p.videoViewCount ?? 0), 0);
  return (totalViews / followers) * 100;
}

export function normalizeMetric(value: number, benchmark: number): number {
  if (benchmark === 0) return 0;
  return Math.min(1, value / benchmark);
}

export function getWeights(hasReels: boolean): { er: number; cr: number; rvr: number } {
  if (!hasReels) return { er: 0.57, cr: 0.43, rvr: 0 };
  return { er: 0.40, cr: 0.35, rvr: 0.25 };
}

export function calculateMetrics(posts: PostData[], followers: number): AuditMetrics {
  const er = calculateER(posts, followers);
  const cr = calculateCR(posts);
  const rvr = calculateRVR(posts, followers);
  const hasReels = posts.some((p) => p.type === 'Video' || p.type === 'Clips');
  return { engagementRate: er, commentRate: cr, reelsViewRate: rvr, hasReels };
}

export function calculateNormalizedMetrics(
  metrics: AuditMetrics,
  benchmark: SectorBenchmark
): NormalizedMetrics {
  const weights = getWeights(metrics.hasReels);
  return {
    erNormalized: normalizeMetric(metrics.engagementRate, benchmark.engagementRate),
    crNormalized: normalizeMetric(metrics.commentRate, benchmark.commentRate),
    rvrNormalized: normalizeMetric(metrics.reelsViewRate, benchmark.reelsViewRate),
    erWeight: weights.er,
    crWeight: weights.cr,
    rvrWeight: weights.rvr,
  };
}

// ---------------------------------------------------------------------------
// Health signal modifier
// ---------------------------------------------------------------------------

function calculateHealthModifier(signals: HealthSignals): number {
  let modifier = 0;

  // Frequency: how often they post
  switch (signals.frequency.label) {
    case 'Alta': modifier += 5; break;
    case 'Media': break; // neutral
    case 'Baja': modifier -= 10; break;
  }

  // Recency: how recently they posted
  switch (signals.recency.label) {
    case 'Activo': modifier += 5; break;
    case 'Irregular': modifier -= 5; break;
    case 'Inactivo': modifier -= 15; break;
  }

  // Consistency: regularity of posting schedule
  switch (signals.consistency.label) {
    case 'Consistente': modifier += 5; break;
    case 'Irregular': modifier -= 3; break;
    case 'Muy irregular': modifier -= 8; break;
  }

  // Trend: is engagement improving or declining
  switch (signals.trend.label) {
    case 'Mejorando': modifier += 5; break;
    case 'Estable': break; // neutral
    case 'Cayendo': modifier -= 8; break;
  }

  // Format mix: variety of content types
  switch (signals.formatMix.label) {
    case 'Variado': modifier += 3; break;
    case 'Dependiente de un formato': modifier -= 5; break;
  }

  return modifier;
}

// ---------------------------------------------------------------------------
// Final score
// ---------------------------------------------------------------------------

export function calculateFinalScore(
  metrics: AuditMetrics,
  sector: Sector,
  healthSignals?: HealthSignals,
): number {
  const benchmark = SECTOR_BENCHMARKS[sector];
  const normalized = calculateNormalizedMetrics(metrics, benchmark);
  const raw =
    normalized.erNormalized * normalized.erWeight +
    normalized.crNormalized * normalized.crWeight +
    normalized.rvrNormalized * normalized.rvrWeight;

  let score = Math.round(raw * 100);

  // Apply health signal modifier if available
  if (healthSignals) {
    score += calculateHealthModifier(healthSignals);
  }

  return Math.max(1, Math.min(100, score));
}
