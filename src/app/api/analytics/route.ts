import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase client (server-side only, service role key)
// ---------------------------------------------------------------------------

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase env vars');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseDevice(ua: string | null): string {
  if (!ua) return 'Desconocido';
  const lower = ua.toLowerCase();
  if (/bot|crawler|spider|crawling/i.test(lower)) return 'Bot';
  if (/iphone|ipad|ipod/i.test(lower)) return 'Mobile iOS';
  if (/android/i.test(lower)) return 'Mobile Android';
  return 'Desktop';
}

// ---------------------------------------------------------------------------
// GET /api/analytics?start=YYYY-MM-DD&end=YYYY-MM-DD
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 30);

    const start = startParam
      ? new Date(startParam + 'T00:00:00Z').toISOString()
      : defaultStart.toISOString();
    const end = endParam
      ? new Date(endParam + 'T23:59:59Z').toISOString()
      : now.toISOString();

    const sb = getSupabase();

    // Parallel queries
    // Note: sessions table has no created_at column, so we fetch audits/leads
    // by date range and then fetch related sessions by session_id
    const [auditsRes, leadsRes, eventsRes] = await Promise.all([
      sb
        .from('audits')
        .select('id, username, session_id, score, score_level, route, sector, created_at')
        .gte('created_at', start)
        .lte('created_at', end)
        .limit(10000),
      sb
        .from('leads')
        .select('id, username, email, score, score_level, sector, created_at, audit_id')
        .gte('created_at', start)
        .lte('created_at', end)
        .limit(10000),
      sb
        .from('events')
        .select('id, username, event_type, created_at')
        .gte('created_at', start)
        .lte('created_at', end)
        .limit(10000),
    ]);

    if (auditsRes.error) throw new Error(`audits: ${auditsRes.error.message}`);
    if (leadsRes.error) throw new Error(`leads: ${leadsRes.error.message}`);
    if (eventsRes.error) throw new Error(`events: ${eventsRes.error.message}`);

    const audits = auditsRes.data ?? [];
    const leads = leadsRes.data ?? [];
    const events = eventsRes.data ?? [];

    // Fetch sessions related to audits in this date range
    const sessionIds = [...new Set(audits.map((a) => a.session_id).filter(Boolean))];
    let sessions: { id: string; username: string; user_agent: string | null; ip_address: string | null; locale: string | null; country: string | null; completed_at: string | null }[] = [];

    if (sessionIds.length > 0) {
      // Supabase .in() has a limit, batch if needed
      const batchSize = 500;
      for (let i = 0; i < sessionIds.length; i += batchSize) {
        const batch = sessionIds.slice(i, i + batchSize);
        const sessionsRes = await sb
          .from('sessions')
          .select('id, username, user_agent, ip_address, locale, country, completed_at')
          .in('id', batch);
        if (sessionsRes.error) throw new Error(`sessions: ${sessionsRes.error.message}`);
        sessions = sessions.concat(sessionsRes.data ?? []);
      }
    }

    // sessions, audits, leads already defined above

    // ── Funnel ──────────────────────────────────────────────────────
    // Use max(sessions fetched, unique session_ids in audits, audits count) as session count
    // since some audits may not have session_id linked
    const uniqueSessionIds = new Set(audits.map((a) => a.session_id).filter(Boolean));
    const totalSessions = Math.max(sessions.length, uniqueSessionIds.size, audits.length);
    const totalAudits = audits.length;
    const totalLeads = leads.length;
    const conversionRate = totalSessions > 0
      ? Math.round((totalLeads / totalSessions) * 10000) / 100
      : 0;

    // ── Score distribution ──────────────────────────────────────────
    const scoreLevels = ['CRITICO', 'REGULAR', 'BUENO', 'EXCELENTE'];
    const scoreColors: Record<string, string> = {
      CRITICO: '#F87171',
      REGULAR: '#FBBF24',
      BUENO: '#38BDF8',
      EXCELENTE: '#4ADE80',
    };
    const scoreDistribution = scoreLevels.map((level) => ({
      level,
      count: audits.filter((a) => a.score_level === level).length,
      color: scoreColors[level] ?? '#94A3B8',
    }));

    const averageScore = audits.length > 0
      ? Math.round((audits.reduce((sum, a) => sum + (a.score ?? 0), 0) / audits.length) * 10) / 10
      : 0;

    // ── Score by sector ─────────────────────────────────────────────
    const sectorMap = new Map<string, { total: number; count: number }>();
    for (const a of audits) {
      const s = a.sector ?? 'general';
      const entry = sectorMap.get(s) ?? { total: 0, count: 0 };
      entry.total += a.score ?? 0;
      entry.count += 1;
      sectorMap.set(s, entry);
    }
    const scoreBySector = Array.from(sectorMap.entries()).map(([sector, v]) => ({
      sector,
      avgScore: Math.round((v.total / v.count) * 10) / 10,
      count: v.count,
    }));

    // ── Route distribution ──────────────────────────────────────────
    const allRoutes = ['DIAGNOSTICO', 'ARRANQUE', 'EVOLUCION'];
    const routeMap = new Map<string, number>(allRoutes.map((r) => [r, 0]));
    for (const a of audits) {
      const r = a.route ?? 'DIAGNOSTICO';
      routeMap.set(r, (routeMap.get(r) ?? 0) + 1);
    }
    const routeDistribution = allRoutes.map((route) => ({
      route,
      count: routeMap.get(route) ?? 0,
    }));

    // ── Daily trends ────────────────────────────────────────────────
    // Sessions table has no created_at, so we use audits as proxy for sessions
    // (each audit = 1 user session). Unique usernames per day = unique sessions.
    const dailyMap = new Map<string, { usernames: Set<string>; audits: number; leads: number; freeTrials: number }>();
    for (const a of audits) {
      const d = a.created_at?.slice(0, 10) ?? '';
      if (!d) continue;
      const entry = dailyMap.get(d) ?? { usernames: new Set<string>(), audits: 0, leads: 0, freeTrials: 0 };
      entry.audits += 1;
      entry.usernames.add(a.username);
      dailyMap.set(d, entry);
    }
    for (const l of leads) {
      const d = l.created_at?.slice(0, 10) ?? '';
      if (!d) continue;
      const entry = dailyMap.get(d) ?? { usernames: new Set<string>(), audits: 0, leads: 0, freeTrials: 0 };
      entry.leads += 1;
      dailyMap.set(d, entry);
    }
    for (const e of events) {
      if (e.event_type !== 'cta_free_trial') continue;
      const d = e.created_at?.slice(0, 10) ?? '';
      if (!d) continue;
      const entry = dailyMap.get(d) ?? { usernames: new Set<string>(), audits: 0, leads: 0, freeTrials: 0 };
      entry.freeTrials += 1;
      dailyMap.set(d, entry);
    }
    const dailyData = Array.from(dailyMap.entries())
      .map(([date, v]) => ({
        date,
        sessions: v.usernames.size,
        audits: v.audits,
        leads: v.leads,
        freeTrials: v.freeTrials,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ── Lead quality ────────────────────────────────────────────────
    const leadsByScoreLevel = scoreLevels.map((level) => ({
      level,
      count: leads.filter((l) => l.score_level === level).length,
    }));

    const leadSectorMap = new Map<string, number>();
    for (const l of leads) {
      const s = l.sector ?? 'general';
      leadSectorMap.set(s, (leadSectorMap.get(s) ?? 0) + 1);
    }
    const leadsBySector = Array.from(leadSectorMap.entries()).map(([sector, count]) => ({
      sector,
      count,
    }));

    // ── Traffic ─────────────────────────────────────────────────────
    const deviceMap = new Map<string, number>();
    for (const s of sessions) {
      const d = parseDevice(s.user_agent);
      deviceMap.set(d, (deviceMap.get(d) ?? 0) + 1);
    }
    const byDevice = Array.from(deviceMap.entries())
      .map(([device, count]) => ({
        device,
        count,
        pct: totalSessions > 0 ? Math.round((count / totalSessions) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const localeMap = new Map<string, number>();
    for (const s of sessions) {
      const loc = s.locale ?? 'es';
      localeMap.set(loc, (localeMap.get(loc) ?? 0) + 1);
    }
    const byLocale = Array.from(localeMap.entries())
      .map(([locale, count]) => ({ locale, count }))
      .sort((a, b) => b.count - a.count);

    const countryMap = new Map<string, number>();
    for (const s of sessions) {
      const c = s.country ?? 'Desconocido';
      countryMap.set(c, (countryMap.get(c) ?? 0) + 1);
    }
    const byCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({
        country,
        count,
        pct: totalSessions > 0 ? Math.round((count / totalSessions) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // ── Top profiles ────────────────────────────────────────────────
    const usernameAuditMap = new Map<string, { count: number; lastScore: number }>();
    for (const a of audits) {
      const u = a.username;
      const entry = usernameAuditMap.get(u) ?? { count: 0, lastScore: 0 };
      entry.count += 1;
      entry.lastScore = a.score ?? 0;
      usernameAuditMap.set(u, entry);
    }
    const topAuditedUsernames = Array.from(usernameAuditMap.entries())
      .map(([username, v]) => ({ username, auditCount: v.count, lastScore: v.lastScore }))
      .sort((a, b) => b.auditCount - a.auditCount)
      .slice(0, 10);

    const sortedByScore = [...audits].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const highestScores = sortedByScore.slice(0, 10).map((a) => ({
      username: a.username,
      score: a.score ?? 0,
      sector: a.sector ?? 'general',
    }));
    const lowestScores = sortedByScore
      .slice(-10)
      .reverse()
      .map((a) => ({
        username: a.username,
        score: a.score ?? 0,
        sector: a.sector ?? 'general',
      }));

    // ── Post-audit actions (events) ─────────────────────────────────
    const allEventTypes = ['share_whatsapp', 'share_instagram', 'share_download', 'share_copy_url', 'cta_free_trial'];
    const eventCounts: Record<string, number> = {};
    for (const et of allEventTypes) {
      eventCounts[et] = events.filter((e) => e.event_type === et).length;
    }

    // ── Response ────────────────────────────────────────────────────
    return NextResponse.json({
      totalSessions,
      totalAudits,
      totalLeads,
      conversionRate,
      scoreDistribution,
      averageScore,
      scoreBySector,
      routeDistribution,
      dailyData,
      leadsByScoreLevel,
      leadsBySector,
      byDevice,
      byLocale,
      byCountry,
      topAuditedUsernames,
      highestScores,
      lowestScores,
      eventCounts,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Analytics API]', msg, err);
    return NextResponse.json(
      { error: `Error fetching analytics data: ${msg}` },
      { status: 500 },
    );
  }
}
