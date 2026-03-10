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
  it('returns DIAGNOSTICO when ≥10 posts and no previous audit', () => {
    expect(resolveRoute(15)).toBe(AuditRoute.DIAGNOSTICO);
    expect(resolveRoute(15, null)).toBe(AuditRoute.DIAGNOSTICO);
    expect(resolveRoute(15, undefined)).toBe(AuditRoute.DIAGNOSTICO);
  });

  it('returns DIAGNOSTICO when ≥10 posts and previous audit < 30 days ago', () => {
    const recent = makePreviousAudit('a1', daysAgo(10));
    expect(resolveRoute(15, recent)).toBe(AuditRoute.DIAGNOSTICO);
  });

  it('returns EVOLUCION when ≥10 posts and previous audit > 30 days ago', () => {
    const old = makePreviousAudit('a2', daysAgo(45));
    expect(resolveRoute(15, old)).toBe(AuditRoute.EVOLUCION);
  });

  it('returns ARRANQUE when <10 posts and no previous audit', () => {
    expect(resolveRoute(5)).toBe(AuditRoute.ARRANQUE);
  });

  it('returns ARRANQUE when <10 posts even with previous audit > 30 days ago', () => {
    const old = makePreviousAudit('a3', daysAgo(60));
    expect(resolveRoute(5, old)).toBe(AuditRoute.ARRANQUE);
  });

  it('returns ARRANQUE when 0 posts', () => {
    expect(resolveRoute(0)).toBe(AuditRoute.ARRANQUE);
  });

  it('returns DIAGNOSTICO when exactly 10 posts and no previous audit', () => {
    expect(resolveRoute(10)).toBe(AuditRoute.DIAGNOSTICO);
  });
});
