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
  storagePort: StoragePort,
  sessionId?: string,
): Promise<AuditResult & { auditId: string; accessToken: string }> {
  // 1. Fetch profile and posts
  const { profile, posts } = await instagramPort.fetchProfile(username);

  // 2. Validate profile
  if (profile.isPrivate) throw new Error('PROFILE_PRIVATE');

  // 3. Resolve sector (with keyword fallback for generic categories)
  const sector = resolveSector(profile.businessCategoryName, {
    username: profile.username,
    fullName: profile.fullName,
    biography: profile.biography,
  });

  // 4. Calculate metrics and health signals
  const metrics = calculateMetrics(posts, profile.followersCount);
  const healthSignals = calculateAllHealthSignals(posts, profile.followersCount);

  // 5. Check for previous audit
  const previousAudit = await storagePort.getLastAudit(username);

  // 6. Determine route (inactive profiles → arranque)
  const route = resolveRoute(posts.length, previousAudit, healthSignals.recency.daysSinceLastPost);
  const score = posts.length >= 10 ? calculateFinalScore(metrics, sector, healthSignals) : 0;
  const levelConfig = getScoreLevel(score);
  const normalizedMetrics = calculateNormalizedMetrics(metrics, SECTOR_BENCHMARKS[sector]);

  // 7. Generate critical points (top 3 weakest)
  const criticalPoints = generateCriticalPoints(metrics, healthSignals, normalizedMetrics);

  // 8. Calculate analysis window
  let analysisWindow = 0;
  if (posts.length >= 2) {
    const first = new Date(posts[0].timestamp);
    const last = new Date(posts[posts.length - 1].timestamp);
    analysisWindow = Math.ceil(Math.abs(first.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
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
    postsAnalyzed: posts.length,
    analysisWindow,
    previousAudit: previousAudit ?? undefined,
    createdAt: new Date().toISOString(),
  };

  // 10. Save IG profile snapshot
  const profileId = await storagePort.saveProfile(profile);

  // 11. Save audit to storage
  const { id: auditId, accessToken } = await storagePort.saveAudit(result, sessionId, profileId);

  return { ...result, auditId, accessToken };
}
