import { AuditRoute, PreviousAudit } from '../interfaces/audit';

const MIN_POSTS_FOR_SCORE = 10;
const EVOLUTION_MIN_DAYS = 30;

export function resolveRoute(
  postsCount: number,
  previousAudit?: PreviousAudit | null
): AuditRoute {
  if (postsCount < MIN_POSTS_FOR_SCORE) {
    return AuditRoute.ARRANQUE;
  }

  if (previousAudit) {
    const previousDate = new Date(previousAudit.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= EVOLUTION_MIN_DAYS) {
      return AuditRoute.EVOLUCION;
    }
  }

  return AuditRoute.DIAGNOSTICO;
}
