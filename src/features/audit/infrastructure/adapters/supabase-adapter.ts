import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StoragePort } from '../../application/ports/storage-port';
import { AuditResult, PreviousAudit, InstagramProfile } from '../../domain/interfaces/audit';
import { LeadData, StoredLead } from '../../domain/interfaces/lead';

export class SupabaseAdapter implements StoragePort {
  private readonly client: SupabaseClient;
  private readonly brand: string;

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

    this.brand = process.env.NEXT_PUBLIC_BRAND ?? 'bewe';
  }

  // ── Sessions ──────────────────────────────────────────────────────

  async createSession(
    username: string,
    userAgent?: string,
    ip?: string,
    locale?: string,
  ): Promise<string> {
    // Resolve country from IP (best-effort, non-blocking)
    // ip-api.com: free for server-side (HTTP only, no HTTPS on free tier — fine for server)
    let country: string | null = null;
    const isPrivateIp = !ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('::ffff:127') || ip.startsWith('::ffff:192.168') || ip.startsWith('::ffff:10.');
    try {
      // Without IP param, ip-api.com resolves the caller's public IP (the server)
      const geoUrl = isPrivateIp
        ? 'http://ip-api.com/json/?fields=status,country'
        : `http://ip-api.com/json/${ip}?fields=status,country`;
      const geo = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
      const json = await geo.json();
      if (json.status === 'success' && json.country) country = json.country;
    } catch { /* ignore — country is optional */ }

    const { data, error } = await this.client
      .from('sessions')
      .insert({
        username,
        user_agent: userAgent ?? null,
        ip_address: ip ?? null,
        locale: locale ?? 'es',
        country: country,
        brand: this.brand,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    return data.id as string;
  }

  async completeSession(sessionId: string): Promise<void> {
    const { error } = await this.client
      .from('sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw new Error(`Failed to complete session: ${error.message}`);
  }

  // ── Instagram Profiles ────────────────────────────────────────────

  async saveProfile(profile: InstagramProfile): Promise<string> {
    const { data, error } = await this.client
      .from('instagram_profiles')
      .insert({
        username: profile.username,
        full_name: profile.fullName,
        biography: profile.biography,
        followers: profile.followersCount,
        follows: profile.followsCount,
        posts_count: profile.postsCount,
        profile_pic: profile.profilePicUrl,
        is_verified: profile.isVerified,
        is_private: profile.isPrivate,
        is_business: profile.isBusinessAccount,
        business_category: profile.businessCategoryName ?? null,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to save profile: ${error.message}`);
    return data.id as string;
  }

  // ── Audits ────────────────────────────────────────────────────────

  async saveAudit(
    audit: AuditResult,
    sessionId?: string,
    profileId?: string,
  ): Promise<{ id: string; accessToken: string }> {
    const { data, error } = await this.client
      .from('audits')
      .insert({
        username: audit.username,
        session_id: sessionId ?? null,
        ig_profile_id: profileId ?? null,
        score: audit.score,
        score_level: audit.level,
        route: audit.route,
        metrics: audit.metrics,
        normalized_metrics: audit.normalizedMetrics,
        health_signals: audit.healthSignals,
        critical_points: audit.criticalPoints,
        sector: audit.sector,
        posts_analyzed: audit.postsAnalyzed,
        analysis_window: audit.analysisWindow,
        previous_audit_id: audit.previousAudit?.id ?? null,
        brand: this.brand,
      })
      .select('id, access_token')
      .single();

    if (error) throw new Error(`Failed to save audit: ${error.message}`);
    return { id: data.id as string, accessToken: data.access_token as string };
  }

  async getLastAudit(username: string): Promise<PreviousAudit | null> {
    const { data, error } = await this.client
      .from('audits')
      .select('id, score, metrics, created_at')
      .eq('username', username)
      .eq('brand', this.brand)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to query last audit: ${error.message}`);
    if (!data) return null;

    return {
      id: data.id as string,
      score: Number(data.score ?? 0),
      metrics: data.metrics as PreviousAudit['metrics'],
      createdAt: data.created_at as string,
    };
  }

  async getAuditByToken(accessToken: string): Promise<AuditResult | null> {
    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('access_token', accessToken)
      .maybeSingle();

    if (error) throw new Error(`Failed to query audit by token: ${error.message}`);
    if (!data) return null;

    const profile = data.ig_profile_id
      ? await this.getProfileById(data.ig_profile_id as string)
      : {} as InstagramProfile;

    return {
      username: data.username as string,
      profile,
      score: Number(data.score),
      level: data.score_level,
      route: data.route,
      metrics: data.metrics,
      normalizedMetrics: data.normalized_metrics,
      healthSignals: data.health_signals,
      criticalPoints: data.critical_points,
      sector: data.sector as string,
      postsAnalyzed: Number(data.posts_analyzed),
      analysisWindow: Number(data.analysis_window),
      createdAt: data.created_at as string,
    } as AuditResult;
  }

  async getRecentAudit(
    username: string,
    maxAgeHours: number,
  ): Promise<(AuditResult & { auditId: string; accessToken: string }) | null> {
    const cutoff = new Date(Date.now() - maxAgeHours * 3600000).toISOString();

    const { data, error } = await this.client
      .from('audits')
      .select('*')
      .eq('username', username)
      .eq('brand', this.brand)
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to query recent audit: ${error.message}`);
    if (!data) return null;

    const profile = data.ig_profile_id
      ? await this.getProfileById(data.ig_profile_id as string)
      : {} as InstagramProfile;

    return {
      username: data.username as string,
      profile,
      score: Number(data.score),
      level: data.score_level,
      route: data.route,
      metrics: data.metrics,
      normalizedMetrics: data.normalized_metrics,
      healthSignals: data.health_signals,
      criticalPoints: data.critical_points,
      sector: data.sector as string,
      postsAnalyzed: Number(data.posts_analyzed),
      analysisWindow: Number(data.analysis_window),
      createdAt: data.created_at as string,
      previousAudit: undefined,
      auditId: data.id as string,
      accessToken: data.access_token as string,
    } as AuditResult & { auditId: string; accessToken: string };
  }

  // ── Profile lookup ──────────────────────────────────────────────

  private async getProfileById(profileId: string): Promise<InstagramProfile> {
    const { data, error } = await this.client
      .from('instagram_profiles')
      .select('*')
      .eq('id', profileId)
      .maybeSingle();

    if (error || !data) return {} as InstagramProfile;

    return {
      username: data.username as string,
      fullName: (data.full_name ?? '') as string,
      biography: (data.biography ?? '') as string,
      followersCount: Number(data.followers ?? 0),
      followsCount: Number(data.follows ?? 0),
      postsCount: Number(data.posts_count ?? 0),
      profilePicUrl: (data.profile_pic ?? '') as string,
      isVerified: Boolean(data.is_verified),
      isPrivate: Boolean(data.is_private),
      isBusinessAccount: Boolean(data.is_business),
      businessCategoryName: (data.business_category ?? null) as string | null,
    } as InstagramProfile;
  }

  // ── Leads ─────────────────────────────────────────────────────────

  async saveLead(
    lead: LeadData,
    auditId: string | null,
    score: number,
    scoreLevel: string,
    sector: string,
  ): Promise<StoredLead> {
    const { data, error } = await this.client
      .from('leads')
      .insert({
        first_name: lead.firstName,
        last_name: lead.lastName,
        email: lead.email,
        phone_code: lead.phone.code,
        phone_country: lead.phone.country,
        phone_number: lead.phone.number,
        username: lead.username,
        gdpr_consent: lead.gdprConsent,
        audit_id: auditId ?? null,
        score,
        score_level: scoreLevel,
        sector,
        brand: this.brand,
      })
      .select('*')
      .single();

    if (error) throw new Error(`Failed to save lead: ${error.message}`);
    return this.mapToStoredLead(data);
  }

  async getLeadByEmail(email: string): Promise<StoredLead | null> {
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .eq('email', email)
      .eq('brand', this.brand)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to query lead by email: ${error.message}`);
    if (!data) return null;

    return this.mapToStoredLead(data);
  }

  // ── Helpers ───────────────────────────────────────────────────────

  private mapToStoredLead(row: Record<string, unknown>): StoredLead {
    return {
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string,
      phone: {
        code: row.phone_code as string,
        country: row.phone_country as string,
        number: row.phone_number as string,
      },
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
