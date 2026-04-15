import posthog from 'posthog-js';

type PostHogProperties = Record<string, unknown>;

export interface TrackEventPayload {
  userId?: string;
  event: string;
  properties?: PostHogProperties;
  groupId?: string;
  groupType?: string;
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const isPostHogEnabled = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true';
const isPostHogDebugEnabled = process.env.NEXT_PUBLIC_POSTHOG_DEBUG === 'true';

const isPostHogConfigured = Boolean(posthogKey && isPostHogEnabled);
let isPostHogInitialized = false;

export function initPostHog(): void {
  if (!isPostHogConfigured || isPostHogInitialized) {
    return;
  }

  posthog.init(posthogKey!, {
    api_host: posthogHost,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    loaded: sdk => {
      if (isPostHogDebugEnabled) {
        sdk.debug();
      }
    },
  });

  isPostHogInitialized = true;
}

export function trackPostHogEventWithContext(payload: TrackEventPayload): void {
  if (!isPostHogConfigured || !isPostHogInitialized) {
    return;
  }

  if (payload.userId) {
    posthog.identify(payload.userId);
  }

  const eventProperties: PostHogProperties = {
    ...(payload.properties ?? {}),
  };

  if (payload.groupType && payload.groupId) {
    eventProperties.$groups = {
      [payload.groupType]: payload.groupId,
    };
  }

  posthog.capture(payload.event, eventProperties);
}
