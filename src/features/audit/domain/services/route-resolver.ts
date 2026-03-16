import { AuditRoute, PreviousAudit } from '../interfaces/audit';

const MIN_POSTS_FOR_SCORE = 10;
const EVOLUTION_MIN_DAYS = 30;
const INACTIVE_THRESHOLD_DAYS = 90;

export function resolveRoute(
  postsCount: number,
  previousAudit?: PreviousAudit | null,
  daysSinceLastPost?: number
): AuditRoute {
  // 1. Evolution — previous audit ≥ 30 days (no post-count requirement)
  // TODO: add second condition — must be Bewe client for ≥ 30 days
  if (previousAudit) {
    const previousDate = new Date(previousAudit.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= EVOLUTION_MIN_DAYS) {
      return AuditRoute.EVOLUCION;
    }
  }

  // 2. Arranque — too few posts or inactive 90+ days
  if (postsCount < MIN_POSTS_FOR_SCORE) {
    return AuditRoute.ARRANQUE;
  }

  if (daysSinceLastPost != null && daysSinceLastPost >= INACTIVE_THRESHOLD_DAYS) {
    return AuditRoute.ARRANQUE;
  }

  // 3. Diagnóstico — active profile, first time or recent audit
  return AuditRoute.DIAGNOSTICO;
}
