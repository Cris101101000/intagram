import { CrmPort } from '../../application/ports/crm-port';
import { StoredLead } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export class N8nAdapter implements CrmPort {
  private readonly webhookUrl: string;

  constructor() {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      throw new Error('N8N_WEBHOOK_URL environment variable is not set');
    }
    this.webhookUrl = url;
  }

  async sendLead(lead: StoredLead, audit: AuditResult): Promise<void> {
    const payload = {
      // HubSpot contact properties
      instagram_username: lead.username,
      score_final: audit.score,
      score_nivel: audit.level,
      sector: lead.sector,
      er_value: audit.metrics.engagementRate,
      cr_value: audit.metrics.commentRate,
      rvr_value: audit.metrics.reelsViewRate,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      // Extra context for the workflow
      audit_id: lead.auditId,
      lead_id: lead.id,
      followers_count: audit.profile.followersCount,
      created_at: lead.createdAt,
    };

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
