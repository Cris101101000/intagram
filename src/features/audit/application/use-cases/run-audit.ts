import { InstagramPort } from '../ports/instagram-port';
import { StoragePort } from '../ports/storage-port';
import { AuditResult } from '../../domain/interfaces/audit';
import { calculateMetrics, calculateFinalScore, calculateNormalizedMetrics } from '../../domain/services/score-calculator';
import { calculateAllHealthSignals } from '../../domain/services/health-signals';
import { resolveRoute } from '../../domain/services/route-resolver';
import { resolveSector, SECTOR_BENCHMARKS } from '../../domain/constants/benchmarks';
import { getScoreLevel } from '../../domain/constants/levels';
import { generateCriticalPoints } from './helpers/critical-points';

export async function runAudit(
  username: string,
  instagramPort: InstagramPort,
  storagePort: StoragePort
): Promise<AuditResult> {
  // 1. Fetch profile and posts
  const { profile, posts } = await instagramPort.fetchProfile(username);

  // 2. Validate profile
  if (profile.isPrivate) throw new Error('PROFILE_PRIVATE');
  if (profile.postsCount === 0 && posts.length === 0) throw new Error('PROFILE_EMPTY');

  // 3. Resolve sector
  const sector = resolveSector(profile.businessCategoryName);

  // 4. Check for previous audit
  const previousAudit = await storagePort.getLastAudit(username);

  // 5. Determine route
  const route = resolveRoute(posts.length, previousAudit);

  // 6. Calculate metrics (only if enough posts)
  const metrics = calculateMetrics(posts, profile.followersCount);
  const score = posts.length >= 10 ? calculateFinalScore(metrics, sector) : 0;
  const levelConfig = getScoreLevel(score);
  const normalizedMetrics = calculateNormalizedMetrics(metrics, SECTOR_BENCHMARKS[sector]);
  const healthSignals = calculateAllHealthSignals(posts, profile.followersCount);

  // 7. Generate critical points (top 3 weakest)
  const criticalPoints = generateCriticalPoints(metrics, healthSignals, normalizedMetrics);

  // 8. Calculate analysis window
  let analysisWindow = 0;
  if (posts.length >= 2) {
    const newest = new Date(posts[0].timestamp);
    const oldest = new Date(posts[posts.length - 1].timestamp);
    analysisWindow = Math.ceil((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24));
  }

  // 9. Build result
  const result: AuditResult = {
    username,
    profile,
    score,
    level: levelConfig.level,
    route,
    metrics,
    normalizedMetrics,
    healthSignals,
    criticalPoints,
    sector,
    postsAnalyzed: Math.min(posts.length, 10),
    analysisWindow,
    previousAudit: previousAudit ?? undefined,
    createdAt: new Date().toISOString(),
  };

  // 10. Save to storage
  await storagePort.saveAudit(result);

  return result;
}
