import { PostData } from '../../interfaces/audit';
import {
  calculateFrequency,
  calculateFormatMix,
  calculateRecency,
  calculateConsistency,
  calculateTrend,
  calculateAllHealthSignals,
} from '../health-signals';

function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'Image',
    likesCount: 100,
    commentsCount: 10,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe('calculateFrequency', () => {
  it('should return "Media" for 12 posts in 30 days (~2.8/week)', () => {
    const posts: PostData[] = [];
    for (let i = 0; i < 12; i++) {
      posts.push(makePost({ timestamp: daysAgo(i * 2.5) }));
    }

    const result = calculateFrequency(posts);
    expect(result.value).toBeGreaterThanOrEqual(1.5);
    expect(result.value).toBeLessThanOrEqual(3);
    expect(result.label).toBe('Media');
  });

  it('should return "Baja" for 2 posts in 30 days (~0.47/week)', () => {
    const posts: PostData[] = [
      makePost({ timestamp: daysAgo(5) }),
      makePost({ timestamp: daysAgo(20) }),
    ];

    const result = calculateFrequency(posts);
    expect(result.value).toBeLessThan(1.5);
    expect(result.label).toBe('Baja');
  });

  it('should return 0 and "Baja" for empty posts', () => {
    const result = calculateFrequency([]);
    expect(result.value).toBe(0);
    expect(result.label).toBe('Baja');
  });
});

describe('calculateFormatMix', () => {
  it('should return "Variado" when no single type exceeds 70%', () => {
    const posts: PostData[] = [
      ...Array.from({ length: 10 }, () => makePost({ type: 'Image' })),
      ...Array.from({ length: 5 }, () => makePost({ type: 'Video' })),
      ...Array.from({ length: 5 }, () => makePost({ type: 'Sidecar' })),
    ];

    const result = calculateFormatMix(posts);
    expect(result.label).toBe('Variado');
    expect(result.distribution['Image']).toBe(50);
    expect(result.distribution['Video']).toBe(25);
    expect(result.distribution['Sidecar']).toBe(25);
  });

  it('should return "Dependiente de un formato" when one type exceeds 70%', () => {
    const posts: PostData[] = [
      ...Array.from({ length: 18 }, () => makePost({ type: 'Image' })),
      ...Array.from({ length: 2 }, () => makePost({ type: 'Video' })),
    ];

    const result = calculateFormatMix(posts);
    expect(result.label).toBe('Dependiente de un formato');
    expect(result.distribution['Image']).toBe(90);
  });
});

describe('calculateRecency', () => {
  it('should return "Activo" when last post was 5 days ago', () => {
    const posts: PostData[] = [
      makePost({ timestamp: daysAgo(5) }),
      makePost({ timestamp: daysAgo(10) }),
    ];

    const result = calculateRecency(posts);
    expect(result.daysSinceLastPost).toBeCloseTo(5, 0);
    expect(result.label).toBe('Activo');
  });

  it('should return "Irregular" when last post was 25 days ago', () => {
    const posts: PostData[] = [
      makePost({ timestamp: daysAgo(25) }),
      makePost({ timestamp: daysAgo(40) }),
    ];

    const result = calculateRecency(posts);
    expect(result.daysSinceLastPost).toBeCloseTo(25, 0);
    expect(result.label).toBe('Irregular');
  });

  it('should return "Inactivo" when last post was 60 days ago', () => {
    const posts: PostData[] = [
      makePost({ timestamp: daysAgo(60) }),
    ];

    const result = calculateRecency(posts);
    expect(result.daysSinceLastPost).toBeCloseTo(60, 0);
    expect(result.label).toBe('Inactivo');
  });

  it('should return "Inactivo" when there are no posts', () => {
    const result = calculateRecency([]);
    expect(result.daysSinceLastPost).toBe(Infinity);
    expect(result.label).toBe('Inactivo');
  });
});

describe('calculateConsistency', () => {
  it('should return "Consistente" for regular intervals (stddev < 2)', () => {
    // Posts every 3 days — stddev = 0
    const posts: PostData[] = Array.from({ length: 15 }, (_, i) =>
      makePost({ timestamp: daysAgo(i * 3) }),
    );

    const result = calculateConsistency(posts);
    expect(result.stddev).toBeLessThan(2);
    expect(result.label).toBe('Consistente');
  });

  it('should return "Irregular" for moderate variability (stddev 2-5)', () => {
    // Alternating intervals of 1 and 7 days -> mean=4, stddev=3
    const posts: PostData[] = [];
    let day = 0;
    for (let i = 0; i < 15; i++) {
      posts.push(makePost({ timestamp: daysAgo(day) }));
      day += i % 2 === 0 ? 1 : 7;
    }

    const result = calculateConsistency(posts);
    expect(result.stddev).toBeGreaterThanOrEqual(2);
    expect(result.stddev).toBeLessThanOrEqual(5);
    expect(result.label).toBe('Irregular');
  });

  it('should return "Muy irregular" for high variability (stddev > 5)', () => {
    // Extremely irregular: some 1 day, some 20 days apart
    const timestamps = [0, 1, 21, 22, 42, 43, 63, 64, 84, 85, 105, 106, 126, 127, 147];
    const posts: PostData[] = timestamps.map((d) =>
      makePost({ timestamp: daysAgo(d) }),
    );

    const result = calculateConsistency(posts);
    expect(result.stddev).toBeGreaterThan(5);
    expect(result.label).toBe('Muy irregular');
  });
});

describe('calculateTrend', () => {
  const followers = 10000;

  it('should return "Mejorando" when recent ER is significantly higher', () => {
    const recentPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i),
        likesCount: 500,
        commentsCount: 50,
      }),
    );
    const previousPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i + 10),
        likesCount: 200,
        commentsCount: 20,
      }),
    );

    const posts = [...recentPosts, ...previousPosts];
    const result = calculateTrend(posts, followers);
    expect(result.changePercent).toBeGreaterThan(10);
    expect(result.label).toBe('Mejorando');
  });

  it('should return "Estable" when ER is similar', () => {
    const recentPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i),
        likesCount: 300,
        commentsCount: 30,
      }),
    );
    const previousPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i + 10),
        likesCount: 290,
        commentsCount: 29,
      }),
    );

    const posts = [...recentPosts, ...previousPosts];
    const result = calculateTrend(posts, followers);
    expect(result.changePercent).toBeGreaterThanOrEqual(-10);
    expect(result.changePercent).toBeLessThanOrEqual(10);
    expect(result.label).toBe('Estable');
  });

  it('should return "Cayendo" when recent ER is significantly lower', () => {
    const recentPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i),
        likesCount: 100,
        commentsCount: 10,
      }),
    );
    const previousPosts = Array.from({ length: 5 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i + 10),
        likesCount: 500,
        commentsCount: 50,
      }),
    );

    const posts = [...recentPosts, ...previousPosts];
    const result = calculateTrend(posts, followers);
    expect(result.changePercent).toBeLessThan(-10);
    expect(result.label).toBe('Cayendo');
  });
});

describe('calculateAllHealthSignals', () => {
  it('should return a complete HealthSignals object', () => {
    const posts: PostData[] = Array.from({ length: 20 }, (_, i) =>
      makePost({
        timestamp: daysAgo(i * 2),
        type: i % 3 === 0 ? 'Video' : 'Image',
        likesCount: 200 + i * 10,
        commentsCount: 20 + i,
      }),
    );

    const result = calculateAllHealthSignals(posts, 10000);

    expect(result).toHaveProperty('frequency');
    expect(result).toHaveProperty('formatMix');
    expect(result).toHaveProperty('recency');
    expect(result).toHaveProperty('consistency');
    expect(result).toHaveProperty('trend');

    expect(result.frequency).toHaveProperty('value');
    expect(result.frequency).toHaveProperty('label');
    expect(result.formatMix).toHaveProperty('distribution');
    expect(result.formatMix).toHaveProperty('label');
    expect(result.recency).toHaveProperty('daysSinceLastPost');
    expect(result.recency).toHaveProperty('label');
    expect(result.consistency).toHaveProperty('stddev');
    expect(result.consistency).toHaveProperty('label');
    expect(result.trend).toHaveProperty('changePercent');
    expect(result.trend).toHaveProperty('label');
  });
});
