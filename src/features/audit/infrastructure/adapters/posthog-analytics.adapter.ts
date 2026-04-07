import { AnalyticsEvent } from '@/features/audit/domain/enums';
import { analyticsService } from '@/shared/analytics';

export class PostHogAnalyticsAdapter {
  private readonly groupType = 'funnel';
  private readonly groupId = 'instagram_audit';

  trackSessionStarted(properties?: Record<string, unknown>): void {
    analyticsService?.trackEvent({
      event: AnalyticsEvent.IG_SESSION_STARTED,
      properties,
      groupType: this.groupType,
      groupId: this.groupId,
    });

    analyticsService?.trackEvent({
      event: AnalyticsEvent.IG_EVENT_SESSION_START,
      properties,
      groupType: this.groupType,
      groupId: this.groupId,
    });
  }

  trackCopiedUrl(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_COPIED_URL, properties);
  }

  trackClickTrial(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_CLICK_TRIAL, properties);
  }

  trackLeadCaptured(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_LEAD_CAPTURED, properties);
  }

  trackAuditCompleted(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_AUDIT_COMPLETED, properties);
  }

  trackSharedWhatsApp(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_SHARED_WHATSAPP, properties);
  }

  trackSharedInstagram(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_SHARED_INSTAGRAM, properties);
  }

  trackDownloadedReport(properties?: Record<string, unknown>): void {
    this.track(AnalyticsEvent.IG_DOWNLOADED_REPORT, properties);
  }

  private track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
    analyticsService?.trackEvent({
      event,
      properties,
      groupType: this.groupType,
      groupId: this.groupId,
    });
  }
}
