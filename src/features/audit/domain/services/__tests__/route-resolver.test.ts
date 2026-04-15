import { resolveRoute } from '../route-resolver';
import { AuditRoute, PreviousAudit } from '../../interfaces/audit';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const dummyMetrics = { engagementRate: 2, commentRate: 0.03, reelsViewRate: 50, hasReels: true };

function makePreviousAudit(id: string, createdAt: string): PreviousAudit {
  return { id, score: 50, metrics: dummyMetrics, createdAt };
}

describe('resolveRoute', () => {
  // --- EVOLUCION (checked first, no post-count requirement) ---

  it('returns EVOLUCION when previous audit ≥ 30 days ago, regardless of post count', () => {
    const old = makePreviousAudit('a1', daysAgo(45));
    expect(resolveRoute(15, old)).toBe(AuditRoute.EVOLUCION);
    expect(resolveRoute(5, old)).toBe(AuditRoute.EVOLUCION);
    expect(resolveRoute(0, old)).toBe(AuditRoute.EVOLUCION);
  });

  it('does NOT return EVOLUCION when previous audit < 30 days ago', () => {
    const recent = makePreviousAudit('a2', daysAgo(10));
    expect(resolveRoute(15, recent)).toBe(AuditRoute.DIAGNOSTICO);
  });

  // --- ARRANQUE ---

  it('returns ARRANQUE when < 10 posts and no previous audit', () => {
    expect(resolveRoute(5)).toBe(AuditRoute.ARRANQUE);
    expect(resolveRoute(0)).toBe(AuditRoute.ARRANQUE);
  });

  it('returns ARRANQUE when ≥ 10 posts but inactive 90+ days (no previous audit)', () => {
    expect(resolveRoute(15, null, 90)).toBe(AuditRoute.ARRANQUE);
    expect(resolveRoute(15, null, 120)).toBe(AuditRoute.ARRANQUE);
  });

  // --- DIAGNOSTICO ---

  it('returns DIAGNOSTICO when ≥ 10 posts, active, no previous audit', () => {
    expect(resolveRoute(15)).toBe(AuditRoute.DIAGNOSTICO);
    expect(resolveRoute(15, null)).toBe(AuditRoute.DIAGNOSTICO);
    expect(resolveRoute(10, null, 30)).toBe(AuditRoute.DIAGNOSTICO);
    expect(resolveRoute(15, null, 89)).toBe(AuditRoute.DIAGNOSTICO);
  });

  it('returns DIAGNOSTICO when ≥ 10 posts and previous audit < 30 days ago', () => {
    const recent = makePreviousAudit('a3', daysAgo(10));
    expect(resolveRoute(15, recent)).toBe(AuditRoute.DIAGNOSTICO);
  });
});
