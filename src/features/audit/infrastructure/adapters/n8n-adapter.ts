import { CrmPort } from '../../application/ports/crm-port';
import { StoredLead } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export class N8nAdapter implements CrmPort {
  private readonly hubspotWebhookUrl: string;
  private readonly magicLinkWebhookUrl: string;

  constructor() {
    this.hubspotWebhookUrl = process.env.N8N_WEBHOOK_URL ?? 'https://tecnologiabewe.app.n8n.cloud/webhook/35e3fab9-0f1d-40b2-8bce-c6b5c64a7046';
    this.magicLinkWebhookUrl = process.env.N8N_MAGIC_LINK_WEBHOOK_URL ?? 'https://tecnologiabewe.app.n8n.cloud/webhook/c289df50-c2f4-49e8-a432-aa0281e4ea90';
  }

  private buildPayload(lead: StoredLead, audit: AuditResult, sessionId?: string) {
    return {
      // ── Session ──
      session_id: sessionId ?? null,

      // ── Lead info ──
      lead_id: lead.id,
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: lead.phone.number,
      phone_code: lead.phone.code,
      phone_country: lead.phone.country,
      phone_number: lead.phone.number,

      // ── Profile info ──
      instagram_username: lead.username,
      full_name: audit.profile.fullName,
      biography: audit.profile.biography,
      followers_count: audit.profile.followersCount,
      follows_count: audit.profile.followsCount,
      posts_count: audit.profile.postsCount,
      is_verified: audit.profile.isVerified,
      is_business_account: audit.profile.isBusinessAccount,
      business_category: audit.profile.businessCategoryName ?? null,

      // ── Audit results ──
      audit_id: lead.auditId,
      route: audit.route,
      score_final: audit.score,
      score_nivel: audit.level,
      sector: lead.sector,
      posts_analyzed: audit.postsAnalyzed,
      analysis_window_days: audit.analysisWindow,

      // ── Metrics ──
      er_value: audit.metrics.engagementRate,
      cr_value: audit.metrics.commentRate,
      rvr_value: audit.metrics.reelsViewRate,
      has_reels: audit.metrics.hasReels,

      // ── Normalized metrics ──
      er_normalized: audit.normalizedMetrics.erNormalized,
      cr_normalized: audit.normalizedMetrics.crNormalized,
      rvr_normalized: audit.normalizedMetrics.rvrNormalized,

      // ── Health signals ──
      frequency_value: audit.healthSignals.frequency.value,
      frequency_label: audit.healthSignals.frequency.label,
      recency_days: audit.healthSignals.recency.daysSinceLastPost,
      recency_label: audit.healthSignals.recency.label,
      consistency_stddev: audit.healthSignals.consistency.stddev,
      consistency_label: audit.healthSignals.consistency.label,
      trend_change_percent: audit.healthSignals.trend.changePercent,
      trend_label: audit.healthSignals.trend.label,
      format_mix_label: audit.healthSignals.formatMix.label,
      format_mix_distribution: audit.healthSignals.formatMix.distribution,

      // ── Critical points ──
      critical_points: audit.criticalPoints.map((cp) => ({
        type: cp.type,
        message: cp.message,
        severity: cp.severity,
      })),
      critical_count: audit.criticalPoints.length,

      // ── Meta ──
      created_at: lead.createdAt,
    };
  }

  async sendLead(lead: StoredLead, audit: AuditResult, sessionId?: string): Promise<string | null> {
    const payload = this.buildPayload(lead, audit, sessionId);

    // 1. HubSpot webhook (non-blocking)
    if (this.hubspotWebhookUrl) {
      try {
        const response = await fetch(this.hubspotWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          console.error(`[N8nAdapter] HubSpot webhook responded with ${response.status}: ${response.statusText}`);
        }
      } catch (error: unknown) {
        console.error('[N8nAdapter] HubSpot webhook failed:', error instanceof Error ? error.message : String(error));
      }
    }

    // 2. Magic link webhook — returns signupUrl
    let signupUrl: string | null = null;
    if (this.magicLinkWebhookUrl) {
      try {
        const response = await fetch(this.magicLinkWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, agencyId: '242e5da7-f65d-47b8-968a-d5d066c237aa' }),
        });
        if (response.ok) {
          const data = await response.json();
          signupUrl = data.signupUrl ?? null;
        } else {
          console.error(`[N8nAdapter] Magic link webhook responded with ${response.status}: ${response.statusText}`);
        }
      } catch (error: unknown) {
        console.error('[N8nAdapter] Magic link webhook failed:', error instanceof Error ? error.message : String(error));
      }
    }

    return signupUrl;
  }
}
