import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StoragePort } from '../../application/ports/storage-port';
import { AuditResult, PreviousAudit } from '../../domain/interfaces/audit';
import { LeadData, StoredLead } from '../../domain/interfaces/lead';

export class SupabaseAdapter implements StoragePort {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set',
      );
    }

    this.client = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  // ── Audits ──────────────────────────────────────────────────────

  async saveAudit(audit: AuditResult): Promise<string> {
    const { data, error } = await this.client
      .from('audits')
      .insert({
        username: audit.username,
        profile: audit.profile,
        metrics: audit.metrics,
        normalized_metrics: audit.normalizedMetrics,
        health_signals: audit.healthSignals,
        critical_points: audit.criticalPoints,
        score: audit.score,
        score_level: audit.level,
        route: audit.route,
        sector: audit.sector,
        posts_analyzed: audit.postsAnalyzed,
        analysis_window: audit.analysisWindow,
        previous_audit_id: audit.previousAudit?.id ?? null,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to save audit: ${error.message}`);
    }

    return data.id as string;
  }

  async getLastAudit(username: string): Promise<PreviousAudit | null> {
    const { data, error } = await this.client
      .from('audits')
      .select('id, score, metrics, created_at')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to query last audit: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id as string,
      score: Number(data.score ?? 0),
      metrics: data.metrics as PreviousAudit['metrics'],
      createdAt: data.created_at as string,
    };
  }

  // ── Leads ───────────────────────────────────────────────────────

  async saveLead(
    lead: LeadData,
    auditId: string,
    score: number,
    scoreLevel: string,
    sector: string,
  ): Promise<StoredLead> {
    const { data, error } = await this.client
      .from('leads')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        username: lead.username,
        gdpr_consent: lead.gdprConsent,
        audit_id: auditId,
        score,
        score_level: scoreLevel,
        sector,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to save lead: ${error.message}`);
    }

    return this.mapToStoredLead(data);
  }

  async getLeadByEmail(email: string): Promise<StoredLead | null> {
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to query lead by email: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapToStoredLead(data);
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private mapToStoredLead(row: Record<string, unknown>): StoredLead {
    return {
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      phone: row.phone as string,
      username: row.username as string,
      gdprConsent: Boolean(row.gdpr_consent),
      auditId: row.audit_id as string,
      score: Number(row.score),
      scoreLevel: row.score_level as string,
      sector: row.sector as string,
      createdAt: row.created_at as string,
    };
  }
}
