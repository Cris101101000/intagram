import { trackPostHogEventWithContext, type TrackEventPayload } from '@/shared/lib/posthog-client';

export interface AnalyticsService {
  trackEvent(payload: TrackEventPayload): void;
}

class PostHogAnalyticsService implements AnalyticsService {
  trackEvent(payload: TrackEventPayload): void {
    trackPostHogEventWithContext(payload);
  }
}

const isAnalyticsEnabled =
  process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true' &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export const analyticsService: AnalyticsService | null = isAnalyticsEnabled
  ? new PostHogAnalyticsService()
  : null;
