import { CrmPort } from '../../application/ports/crm-port';
import { StoredLead } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export class N8nAdapter implements CrmPort {
  private readonly webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL ?? '';
  }

  async sendLead(lead: StoredLead, audit: AuditResult): Promise<void> {
    const payload = {
      // ── Lead info ──
      lead_id: lead.id,
      first_name: lead.firstName,
      last_name: lead.lastName,
      email: lead.email,
      phone: `${lead.phone.code}${lead.phone.number}`,
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

    if (!this.webhookUrl) {
      console.warn('[N8nAdapter] N8N_WEBHOOK_URL not configured — skipping CRM sync');
      return;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          `[N8nAdapter] Webhook responded with ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error: unknown) {
      // Log but do NOT re-throw — the lead is already persisted in Supabase,
      // so a CRM failure should not break the user-facing flow.
      console.error(
        '[N8nAdapter] Failed to send lead to n8n webhook:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
