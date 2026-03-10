import { InstagramPort, FetchProfileResult } from '../../application/ports/instagram-port';
import { InstagramProfile, PostData } from '../../domain/interfaces/audit';

const APIFY_BASE_URL =
  'https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items';
const TIMEOUT_MS = 45_000;

export class ApifyAdapter implements InstagramPort {
  private readonly token: string;

  constructor() {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
      throw new Error('APIFY_API_TOKEN environment variable is not set');
    }
    this.token = token;
  }

  async fetchProfile(username: string): Promise<FetchProfileResult> {
    const url = `${APIFY_BASE_URL}?token=${encodeURIComponent(this.token)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username] }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Apify API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new ProfileNotFoundError(username);
      }

      const raw = data[0];

      if (raw.private === true || raw.isPrivate === true) {
        throw new PrivateProfileError(username);
      }

      const profile = this.mapToProfile(raw, username);
      const posts = this.mapToPosts(raw);
      return { profile, posts };
    } catch (error: unknown) {
      if (error instanceof ProfileNotFoundError || error instanceof PrivateProfileError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ScraperTimeoutError(username);
      }

      throw new Error(
        `Failed to fetch Instagram profile @${username}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private mapToProfile(raw: Record<string, unknown>, username: string): InstagramProfile {
    return {
      username: (raw.username as string) ?? username,
      fullName: (raw.fullName as string) ?? '',
      biography: (raw.biography as string) ?? '',
      followersCount: Number(raw.followersCount ?? raw.subscribersCount ?? 0),
      followsCount: Number(raw.followsCount ?? raw.subscribedCount ?? 0),
      postsCount: Number(raw.postsCount ?? 0),
      profilePicUrl: (raw.profilePicUrl as string) ?? (raw.profilePicUrlHD as string) ?? '',
      isVerified: Boolean(raw.verified ?? raw.isVerified ?? false),
      isPrivate: Boolean(raw.private ?? raw.isPrivate ?? false),
      isBusinessAccount: Boolean(raw.isBusinessAccount ?? false),
      businessCategoryName: (raw.businessCategoryName as string) ?? undefined,
    };
  }

  private mapToPosts(raw: Record<string, unknown>): PostData[] {
    const latestPosts = raw.latestPosts as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(latestPosts)) return [];

    return latestPosts.slice(0, 20).map((post) => ({
      id: (post.id as string) ?? (post.shortCode as string) ?? '',
      type: this.resolvePostType(post),
      likesCount: Number(post.likesCount ?? 0),
      commentsCount: Number(post.commentsCount ?? 0),
      videoViewCount: post.videoViewCount != null ? Number(post.videoViewCount) : undefined,
      timestamp: (post.timestamp as string) ?? new Date().toISOString(),
    }));
  }

  private resolvePostType(post: Record<string, unknown>): PostData['type'] {
    const type = (post.type as string) ?? '';
    if (type === 'Video' || type === 'Clips') return type;
    if (type === 'Sidecar') return 'Sidecar';
    if (post.isVideo === true || post.videoUrl) return 'Video';
    return 'Image';
  }
}

// ── Custom error classes ────────────────────────────────────────────

export class ProfileNotFoundError extends Error {
  constructor(username: string) {
    super(`Instagram profile @${username} not found`);
    this.name = 'ProfileNotFoundError';
  }
}

export class PrivateProfileError extends Error {
  constructor(username: string) {
    super(`Instagram profile @${username} is private`);
    this.name = 'PrivateProfileError';
  }
}

export class ScraperTimeoutError extends Error {
  constructor(username: string) {
    super(`Timeout fetching Instagram profile @${username} (${TIMEOUT_MS / 1000}s)`);
    this.name = 'ScraperTimeoutError';
  }
}
