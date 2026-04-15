'use client';

import { AnalyticsTrackingEvent } from '@/features/audit/domain/enums';
import { PostHogAnalyticsAdapter } from '@/features/audit/infrastructure/adapters/posthog-analytics.adapter';

const adapter = new PostHogAnalyticsAdapter();

function trackLegacyEvent(
  username: string,
  eventType: AnalyticsTrackingEvent,
  metadata?: Record<string, unknown>,
): void {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, eventType, metadata }),
  }).catch(() => {});
}

export function trackSessionStarted(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackSessionStarted({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.SESSION_START, properties);
}

export function trackCopiedUrl(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackCopiedUrl({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.SHARE_COPY_URL, properties);
}

export function trackClickTrial(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackClickTrial({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.CTA_FREE_TRIAL, properties);
}

export function trackLeadCaptured(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackLeadCaptured({ username, ...properties });
}

export function trackAuditCompleted(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackAuditCompleted({ username, ...properties });
}

export function trackSharedWhatsapp(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackSharedWhatsApp({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.SHARE_WHATSAPP, properties);
}

export function trackSharedInstagram(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackSharedInstagram({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.SHARE_INSTAGRAM, properties);
}

export function trackDownloadedReport(
  username: string,
  properties?: Record<string, unknown>,
): void {
  adapter.trackDownloadedReport({ username, ...properties });
  trackLegacyEvent(username, AnalyticsTrackingEvent.SHARE_DOWNLOAD, properties);
}
