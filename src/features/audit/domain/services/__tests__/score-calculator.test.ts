import { PostData, AuditMetrics } from '../../interfaces/audit';
import {
  calculateER,
  calculateCR,
  calculateRVR,
  normalizeMetric,
  calculateFinalScore,
} from '../score-calculator';

// Helper to create a post quickly
function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: overrides.id ?? '1',
    type: overrides.type ?? 'Image',
    likesCount: overrides.likesCount ?? 0,
    commentsCount: overrides.commentsCount ?? 0,
    videoViewCount: overrides.videoViewCount,
    timestamp: overrides.timestamp ?? '2026-01-01T00:00:00Z',
  };
}

// ---------------------------------------------------------------------------
// calculateER
// ---------------------------------------------------------------------------
describe('calculateER', () => {
  it('should calculate ER correctly with normal data', () => {
    // 10 posts, 5000 followers, total likes=800, total comments=60
    // ER = (800+60)/5000 * 100 = 17.2%
    const posts: PostData[] = Array.from({ length: 10 }, (_, i) =>
      makePost({ id: String(i), likesCount: 80, commentsCount: 6 })
    );
    const result = calculateER(posts, 5000);
    expect(result).toBeCloseTo(17.2, 1);
  });

  it('should return 0 when followers is 0', () => {
    const posts = [makePost({ likesCount: 100, commentsCount: 10 })];
    expect(calculateER(posts, 0)).toBe(0);
  });

  it('should use all available posts when fewer than 10', () => {
    // 3 posts: total interactions = (100+10)*3 = 330
    // ER = 330/1000 * 100 = 33
    const posts = Array.from({ length: 3 }, (_, i) =>
      makePost({ id: String(i), likesCount: 100, commentsCount: 10 })
    );
    const result = calculateER(posts, 1000);
    expect(result).toBeCloseTo(33, 1);
  });

  it('should return 0 when posts array is empty', () => {
    expect(calculateER([], 5000)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateCR
// ---------------------------------------------------------------------------
describe('calculateCR', () => {
  it('should calculate CR correctly with normal data', () => {
    // Post1: 10/200=0.05, Post2: 15/180≈0.0833
    // avg = (0.05+0.0833)/2 ≈ 0.0667
    const posts = [
      makePost({ id: '1', likesCount: 200, commentsCount: 10 }),
      makePost({ id: '2', likesCount: 180, commentsCount: 15 }),
    ];
    const result = calculateCR(posts);
    expect(result).toBeCloseTo(0.0667, 3);
  });

  it('should exclude posts with 0 likes', () => {
    const posts = [
      makePost({ id: '1', likesCount: 200, commentsCount: 10 }),
      makePost({ id: '2', likesCount: 0, commentsCount: 5 }),
    ];
    // Only post1 counts: 10/200 = 0.05
    const result = calculateCR(posts);
    expect(result).toBeCloseTo(0.05, 3);
  });

  it('should return 0 when all posts have 0 likes', () => {
    const posts = [
      makePost({ id: '1', likesCount: 0, commentsCount: 5 }),
      makePost({ id: '2', likesCount: 0, commentsCount: 3 }),
    ];
    expect(calculateCR(posts)).toBe(0);
  });

  it('should return 0 for empty posts array', () => {
    expect(calculateCR([])).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateRVR
// ---------------------------------------------------------------------------
describe('calculateRVR', () => {
  it('should calculate RVR correctly with reels', () => {
    // 5000 followers, 3 reels with 2000+3500+1800 = 7300 views
    // RVR = 7300/5000 * 100 = 146%
    const posts = [
      makePost({ id: '1', type: 'Video', videoViewCount: 2000 }),
      makePost({ id: '2', type: 'Clips', videoViewCount: 3500 }),
      makePost({ id: '3', type: 'Video', videoViewCount: 1800 }),
    ];
    const result = calculateRVR(posts, 5000);
    expect(result).toBeCloseTo(146, 1);
  });

  it('should return 0 when there are no reels', () => {
    const posts = [
      makePost({ id: '1', type: 'Image', likesCount: 100 }),
      makePost({ id: '2', type: 'Sidecar', likesCount: 200 }),
    ];
    expect(calculateRVR(posts, 5000)).toBe(0);
  });

  it('should return 0 when followers is 0', () => {
    const posts = [makePost({ id: '1', type: 'Video', videoViewCount: 2000 })];
    expect(calculateRVR(posts, 0)).toBe(0);
  });

  it('should treat undefined videoViewCount as 0', () => {
    const posts = [makePost({ id: '1', type: 'Video' })];
    const result = calculateRVR(posts, 5000);
    expect(result).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// normalizeMetric
// ---------------------------------------------------------------------------
describe('normalizeMetric', () => {
  it('should cap at 1 when value exceeds benchmark', () => {
    // 17.2 / 3.5 = 4.91 → capped at 1.0
    expect(normalizeMetric(17.2, 3.5)).toBe(1);
  });

  it('should return proportional value when below benchmark', () => {
    // 1.0 / 3.5 ≈ 0.2857
    const result = normalizeMetric(1.0, 3.5);
    expect(result).toBeCloseTo(0.2857, 3);
  });

  it('should return 0 when benchmark is 0', () => {
    expect(normalizeMetric(5, 0)).toBe(0);
  });

  it('should return 1 when value equals benchmark', () => {
    expect(normalizeMetric(3.5, 3.5)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// calculateFinalScore
// ---------------------------------------------------------------------------
describe('calculateFinalScore', () => {
  it('should return 100 for the spec example (high metrics, Belleza sector)', () => {
    // ER=17.2% → normalized=1 (17.2/3.5>1), weight=0.40
    // CR=0.067 → normalized=1 (0.067/0.05>1), weight=0.35
    // RVR=146% → normalized=1 (146/120>1), weight=0.25
    // raw = 0.40+0.35+0.25 = 1.0 → score=100
    const metrics: AuditMetrics = {
      engagementRate: 17.2,
      commentRate: 0.067,
      reelsViewRate: 146,
      hasReels: true,
    };
    expect(calculateFinalScore(metrics, 'Belleza')).toBe(100);
  });

  it('should return a low score (Critico range) with low metrics', () => {
    const metrics: AuditMetrics = {
      engagementRate: 0.3,
      commentRate: 0.005,
      reelsViewRate: 10,
      hasReels: true,
    };
    // Belleza benchmarks: ER=3.5, CR=0.05, RVR=120
    // erNorm = 0.3/3.5 ≈ 0.0857, crNorm = 0.005/0.05 = 0.1, rvrNorm = 10/120 ≈ 0.0833
    // raw = 0.0857*0.40 + 0.1*0.35 + 0.0833*0.25
    //     = 0.03428 + 0.035 + 0.02083 = 0.09011
    // score = round(0.09011*100) = 9
    const score = calculateFinalScore(metrics, 'Belleza');
    expect(score).toBeLessThanOrEqual(20);
    expect(score).toBeGreaterThanOrEqual(1);
  });

  it('should redistribute weights when there are no reels', () => {
    // No reels: ER weight=0.57, CR weight=0.43, RVR weight=0
    const metrics: AuditMetrics = {
      engagementRate: 3.5,
      commentRate: 0.05,
      reelsViewRate: 0,
      hasReels: false,
    };
    // Belleza: ER benchmark=3.5, CR benchmark=0.05
    // erNorm = 3.5/3.5 = 1, crNorm = 0.05/0.05 = 1
    // raw = 1*0.57 + 1*0.43 + 0*0 = 1.0
    // score = 100
    expect(calculateFinalScore(metrics, 'Belleza')).toBe(100);
  });

  it('should clamp score to minimum of 1', () => {
    const metrics: AuditMetrics = {
      engagementRate: 0,
      commentRate: 0,
      reelsViewRate: 0,
      hasReels: true,
    };
    // All normalized = 0, raw = 0, round(0) = 0, clamped to 1
    expect(calculateFinalScore(metrics, 'Belleza')).toBe(1);
  });
});
