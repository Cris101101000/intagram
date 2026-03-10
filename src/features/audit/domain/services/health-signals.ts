import {
  PostData,
  FrequencyLabel,
  FormatMixLabel,
  RecencyLabel,
  ConsistencyLabel,
  TrendLabel,
  HealthSignals,
} from '../interfaces/audit';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / MS_PER_DAY;
}

function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateFrequency(
  posts: PostData[],
): { value: number; label: FrequencyLabel } {
  if (posts.length === 0) {
    return { value: 0, label: 'Baja' };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * MS_PER_DAY);

  const recentPosts = posts.filter(
    (p) => new Date(p.timestamp) >= thirtyDaysAgo,
  );

  const postsPerWeek = parseFloat(((recentPosts.length / 30) * 7).toFixed(2));

  let label: FrequencyLabel;
  if (postsPerWeek < 1.5) {
    label = 'Baja';
  } else if (postsPerWeek <= 3) {
    label = 'Media';
  } else {
    label = 'Alta';
  }

  return { value: postsPerWeek, label };
}

export function calculateFormatMix(
  posts: PostData[],
): { distribution: Record<string, number>; label: FormatMixLabel } {
  const last20 = posts.slice(0, 20);

  if (last20.length === 0) {
    return { distribution: {}, label: 'Dependiente de un formato' };
  }

  const counts: Record<string, number> = {};
  for (const post of last20) {
    counts[post.type] = (counts[post.type] || 0) + 1;
  }

  const distribution: Record<string, number> = {};
  for (const [type, count] of Object.entries(counts)) {
    distribution[type] = parseFloat(
      ((count / last20.length) * 100).toFixed(1),
    );
  }

  const maxPercent = Math.max(...Object.values(distribution));
  const label: FormatMixLabel =
    maxPercent > 70 ? 'Dependiente de un formato' : 'Variado';

  return { distribution, label };
}

export function calculateRecency(
  posts: PostData[],
): { daysSinceLastPost: number; label: RecencyLabel } {
  if (posts.length === 0) {
    return { daysSinceLastPost: Infinity, label: 'Inactivo' };
  }

  const now = new Date();
  const lastPostDate = new Date(posts[0].timestamp);
  const daysSinceLastPost = parseFloat(
    daysBetween(now, lastPostDate).toFixed(1),
  );

  let label: RecencyLabel;
  if (daysSinceLastPost < 14) {
    label = 'Activo';
  } else if (daysSinceLastPost <= 45) {
    label = 'Irregular';
  } else {
    label = 'Inactivo';
  }

  return { daysSinceLastPost, label };
}

export function calculateConsistency(
  posts: PostData[],
): { stddev: number; label: ConsistencyLabel } {
  const last15 = posts.slice(0, 15);

  if (last15.length < 2) {
    return { stddev: 0, label: 'Muy irregular' };
  }

  const intervals: number[] = [];
  for (let i = 0; i < last15.length - 1; i++) {
    const current = new Date(last15[i].timestamp);
    const next = new Date(last15[i + 1].timestamp);
    intervals.push(daysBetween(current, next));
  }

  const stddev = parseFloat(standardDeviation(intervals).toFixed(2));

  let label: ConsistencyLabel;
  if (stddev < 2) {
    label = 'Consistente';
  } else if (stddev <= 5) {
    label = 'Irregular';
  } else {
    label = 'Muy irregular';
  }

  return { stddev, label };
}

export function calculateTrend(
  posts: PostData[],
  followers: number,
): { changePercent: number; label: TrendLabel } {
  if (posts.length < 10 || followers === 0) {
    return { changePercent: 0, label: 'Estable' };
  }

  const recentFive = posts.slice(0, 5);
  const previousFive = posts.slice(5, 10);

  const erForPost = (p: PostData) =>
    ((p.likesCount + p.commentsCount) / followers) * 100;

  const recentER =
    recentFive.reduce((sum, p) => sum + erForPost(p), 0) / recentFive.length;
  const previousER =
    previousFive.reduce((sum, p) => sum + erForPost(p), 0) /
    previousFive.length;

  if (previousER === 0) {
    return { changePercent: 0, label: 'Estable' };
  }

  const changePercent = parseFloat(
    (((recentER - previousER) / previousER) * 100).toFixed(2),
  );

  let label: TrendLabel;
  if (changePercent > 10) {
    label = 'Mejorando';
  } else if (changePercent < -10) {
    label = 'Cayendo';
  } else {
    label = 'Estable';
  }

  return { changePercent, label };
}

export function calculateAllHealthSignals(
  posts: PostData[],
  followers: number,
): HealthSignals {
  return {
    frequency: calculateFrequency(posts),
    formatMix: calculateFormatMix(posts),
    recency: calculateRecency(posts),
    consistency: calculateConsistency(posts),
    trend: calculateTrend(posts, followers),
  };
}
