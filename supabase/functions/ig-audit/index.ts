import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Sector, AuditRoute } from './lib/types.ts';
import { VALID_SECTORS, SECTOR_BENCHMARKS } from './lib/sector-benchmarks.ts';
import { detectSector } from './lib/sector-detector.ts';
import {
  scrapeInstagramProfile,
  ProfileNotFoundError,
  PrivateProfileError,
  ScraperTimeoutError,
} from './lib/apify-scraper.ts';
import { calculateMetrics, calculateNormalizedMetrics, getWeights } from './lib/metrics-calculator.ts';
import { calculateAllHealthSignals } from './lib/health-signals.ts';
import { calculateFinalScore, getScoreLevel, buildMetricsResponse } from './lib/score-calculator.ts';
import { resolveRoute } from './lib/route-resolver.ts';
import { generateCriticalPoints } from './lib/critical-points.ts';

// ── CORS headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-api-key',
};

// ── Rate limiting en memoria (por IP, 5 req/hora) ───────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function errorResponse(
  error: string,
  message: string,
  status: number,
): Response {
  return jsonResponse({ success: false, error, message }, status);
}

// ── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Solo POST
  if (req.method !== 'POST') {
    return errorResponse(
      'method_not_allowed',
      'Solo se acepta el método POST.',
      405,
    );
  }

  // Autenticación con API key
  const apiKey = req.headers.get('x-api-key');
  const expectedKey = Deno.env.get('IG_AUDIT_API_KEY');

  if (!expectedKey) {
    return errorResponse(
      'config_error',
      'IG_AUDIT_API_KEY no está configurado en los secrets del servidor.',
      500,
    );
  }

  if (!apiKey) {
    return errorResponse(
      'unauthorized',
      'Falta el header x-api-key. Incluye tu API key para autenticarte.',
      401,
    );
  }

  if (apiKey !== expectedKey) {
    return errorResponse(
      'unauthorized',
      'API key inválida.',
      401,
    );
  }

  // Rate limit por IP
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(clientIp)) {
    return errorResponse(
      'rate_limit',
      'Demasiadas auditorías desde esta IP. Máximo 5 por hora.',
      429,
    );
  }

  try {
    // ── 1. Parsear y validar input ─────────────────────────────────────────
    const body = await req.json().catch(() => null);

    if (!body || typeof body.username !== 'string' || !body.username.trim()) {
      return errorResponse(
        'invalid_input',
        'El campo "username" es obligatorio.',
        400,
      );
    }

    const username = body.username
      .trim()
      .toLowerCase()
      .replace(/^@/, '');

    // Validar sector si se envió
    let forcedSector: Sector | null = null;
    if (body.sector) {
      const sectorLower = String(body.sector).toLowerCase() as Sector;
      if (!VALID_SECTORS.includes(sectorLower) && sectorLower !== 'general') {
        return errorResponse(
          'invalid_input',
          `Sector "${body.sector}" no reconocido. Valores válidos: ${VALID_SECTORS.join(', ')}.`,
          400,
        );
      }
      forcedSector = sectorLower;
    }

    // ── 2. Inicializar Supabase ──────────────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const publicUrlBase =
      Deno.env.get('IG_AUDIT_PUBLIC_URL') ?? 'https://instagramaudit.beweos.io';

    // ── 3. Cache: ¿existe auditoría reciente (24h)? ──────────────────────
    const cacheHours = 24;
    const cutoff = new Date(Date.now() - cacheHours * 3600000).toISOString();

    const { data: cachedAudit } = await supabase
      .from('audits')
      .select('*, ig_profile_id')
      .eq('username', username)
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cachedAudit) {
      // Normalizar métricas: audits viejas pueden tener formato {er:{value}, cr:{value}, rvr:{value}}
      // en vez del formato esperado {engagementRate, commentRate, reelsViewRate, hasReels}
      let cachedMetrics = cachedAudit.metrics;
      if (cachedMetrics && typeof cachedMetrics === 'object' && 'er' in cachedMetrics && !('engagementRate' in cachedMetrics)) {
        cachedMetrics = {
          engagementRate: cachedMetrics.er?.value ?? 0,
          commentRate: cachedMetrics.cr?.value ?? 0,
          reelsViewRate: cachedMetrics.rvr?.value ?? 0,
          hasReels: (cachedMetrics.rvr?.value ?? 0) > 0,
        };
      }

      // Obtener perfil del snapshot
      let profile = null;
      if (cachedAudit.ig_profile_id) {
        const { data: profileData } = await supabase
          .from('instagram_profiles')
          .select('*')
          .eq('id', cachedAudit.ig_profile_id)
          .maybeSingle();
        if (profileData) {
          profile = {
            username: profileData.username,
            fullName: profileData.full_name ?? '',
            biography: profileData.biography ?? '',
            followers: profileData.followers ?? 0,
            postsCount: profileData.posts_count ?? 0,
            profilePicUrl: profileData.profile_pic ?? '',
            isVerified: profileData.is_verified ?? false,
            isBusiness: profileData.is_business ?? false,
            businessCategory: profileData.business_category ?? undefined,
          };
        }
      }

      return jsonResponse({
        success: true,
        auditId: cachedAudit.id,
        accessToken: cachedAudit.access_token,
        publicUrl: `${publicUrlBase}/audit/${username}?t=${cachedAudit.access_token}`,
        cached: true,
        route: cachedAudit.route,
        profile,
        score: cachedAudit.score != null ? Number(cachedAudit.score) : null,
        scoreLevel: cachedAudit.score_level,
        sector: cachedAudit.sector,
        postsAnalyzed: cachedAudit.posts_analyzed,
        analysisWindowDays: cachedAudit.analysis_window,
        metrics: cachedMetrics,
        weights: cachedAudit.normalized_metrics
          ? {
              er: cachedAudit.normalized_metrics.erWeight,
              cr: cachedAudit.normalized_metrics.crWeight,
              rvr: cachedAudit.normalized_metrics.rvrWeight,
            }
          : null,
        healthSignals: cachedAudit.health_signals,
        criticalPoints: cachedAudit.critical_points,
        previousAudit: null,
        timestamp: cachedAudit.created_at,
      });
    }

    // ── 4. Scraping con Apify ────────────────────────────────────────────
    const apifyToken = Deno.env.get('APIFY_API_TOKEN');
    if (!apifyToken) {
      return errorResponse(
        'config_error',
        'APIFY_API_TOKEN no está configurado en los secrets.',
        500,
      );
    }

    const { profile, posts } = await scrapeInstagramProfile(username, apifyToken);

    // ── 5. Detectar sector ───────────────────────────────────────────────
    const sector: Sector = forcedSector ?? detectSector({
      username: profile.username,
      fullName: profile.fullName,
      biography: profile.biography,
    });

    // ── 6. Calcular métricas ─────────────────────────────────────────────
    const metrics = calculateMetrics(posts, profile.followers);
    const benchmark = SECTOR_BENCHMARKS[sector];
    const normalizedMetrics = calculateNormalizedMetrics(metrics, benchmark);
    const weights = getWeights(metrics.hasReels);

    // ── 7. Health signals (solo si ≥10 posts) ────────────────────────────
    const healthSignals = posts.length >= 10
      ? calculateAllHealthSignals(posts, profile.followers)
      : null;

    // ── 8. Buscar auditoría previa (para ruta EVOLUCION) ─────────────────
    const { data: prevAuditData } = await supabase
      .from('audits')
      .select('id, score, metrics, created_at')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const previousAudit = prevAuditData
      ? {
          id: prevAuditData.id as string,
          score: Number(prevAuditData.score ?? 0),
          metrics: prevAuditData.metrics,
          createdAt: prevAuditData.created_at as string,
        }
      : null;

    // ── 9. Resolver ruta ─────────────────────────────────────────────────
    const daysSinceLastPost = healthSignals?.recency.daysSinceLastPost
      ?? (posts.length > 0
        ? (Date.now() - new Date(posts[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)
        : Infinity);

    const route = resolveRoute(profile.postsCount, previousAudit, daysSinceLastPost);

    // ── 10. Calcular score (solo DIAGNOSTICO y EVOLUCION) ────────────────
    let score: number | null = null;
    let scoreLevel = null;

    if (route !== AuditRoute.ARRANQUE && posts.length >= 10) {
      score = calculateFinalScore(metrics, sector, healthSignals ?? undefined);
      scoreLevel = getScoreLevel(score).level;
    }

    // ── 11. Puntos críticos ──────────────────────────────────────────────
    const criticalPoints = healthSignals
      ? generateCriticalPoints(metrics, healthSignals, normalizedMetrics)
      : [];

    // ── 12. Ventana de análisis ──────────────────────────────────────────
    let analysisWindowDays = 0;
    if (posts.length >= 2) {
      const first = new Date(posts[0].timestamp);
      const last = new Date(posts[posts.length - 1].timestamp);
      analysisWindowDays = Math.ceil(
        Math.abs(first.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
      );
    }

    // ── 13. Guardar perfil snapshot en instagram_profiles ─────────────────
    const { data: savedProfile, error: profileError } = await supabase
      .from('instagram_profiles')
      .insert({
        username: profile.username,
        full_name: profile.fullName,
        biography: profile.biography,
        followers: profile.followers,
        follows: 0,
        posts_count: profile.postsCount,
        profile_pic: profile.profilePicUrl,
        is_verified: profile.isVerified,
        is_private: false,
        is_business: profile.isBusiness,
        business_category: profile.businessCategory ?? null,
      })
      .select('id')
      .single();

    if (profileError) {
      console.error('Error al guardar perfil:', JSON.stringify(profileError));
    }

    // ── 14. Guardar auditoría ────────────────────────────────────────────
    const metricsResponse = buildMetricsResponse(metrics, normalizedMetrics, sector);

    // Guardar métricas en formato AuditMetrics (engagementRate, commentRate, etc.)
    // para compatibilidad con el frontend cuando se recupera de cache
    const metricsForStorage = {
      engagementRate: metrics.engagementRate,
      commentRate: metrics.commentRate,
      reelsViewRate: metrics.reelsViewRate,
      hasReels: metrics.hasReels,
    };

    // Transformar healthSignals al formato que espera el frontend
    const healthSignalsForStorage = healthSignals ? {
      frequency: { value: healthSignals.frequency.value, label: healthSignals.frequency.label },
      formatMix: {
        distribution: {
          Image: healthSignals.formatMix.photos ?? 0,
          Clips: healthSignals.formatMix.reels ?? 0,
          Sidecar: healthSignals.formatMix.carousels ?? 0,
        },
        label: healthSignals.formatMix.label === 'Dependiente'
          ? 'Dependiente de un formato'
          : healthSignals.formatMix.label,
      },
      recency: { daysSinceLastPost: healthSignals.recency.daysSinceLastPost, label: healthSignals.recency.label },
      consistency: { stddev: 0, label: healthSignals.consistency.label },
      trend: { changePercent: healthSignals.trend.erDelta, label: healthSignals.trend.label },
    } : {};

    const { data: savedAudit, error: auditError } = await supabase
      .from('audits')
      .insert({
        username,
        ig_profile_id: savedProfile?.id ?? null,
        score: score ?? 0,
        score_level: scoreLevel ?? 'ARRANQUE',
        route,
        sector,
        metrics: metricsForStorage,
        normalized_metrics: normalizedMetrics,
        health_signals: healthSignalsForStorage,
        critical_points: criticalPoints,
        posts_analyzed: posts.length,
        analysis_window: analysisWindowDays,
        previous_audit_id: previousAudit?.id ?? null,
        source: 'linda_prospector',
        brand: 'bewe',
      })
      .select('id, access_token')
      .single();

    if (auditError) {
      console.error('Error al guardar auditoría:', JSON.stringify(auditError));
      return errorResponse(
        'storage_error',
        `No se pudo guardar la auditoría: ${auditError.message}`,
        500,
      );
    }

    const auditId = savedAudit.id;
    const accessToken = savedAudit.access_token;
    const publicUrl = `${publicUrlBase}/audit/${username}?t=${accessToken}`;

    // ── 15. Response ─────────────────────────────────────────────────────
    return jsonResponse({
      success: true,
      auditId,
      accessToken,
      publicUrl,
      cached: false,
      route,
      profile: {
        username: profile.username,
        fullName: profile.fullName,
        biography: profile.biography,
        followers: profile.followers,
        postsCount: profile.postsCount,
        profilePicUrl: profile.profilePicUrl,
        isVerified: profile.isVerified,
        isBusiness: profile.isBusiness,
        businessCategory: profile.businessCategory ?? null,
      },
      score,
      scoreLevel,
      sector,
      postsAnalyzed: posts.length,
      analysisWindowDays,
      metrics: metricsResponse,
      weights: { er: weights.er, cr: weights.cr, rvr: weights.rvr },
      healthSignals,
      criticalPoints,
      previousAudit,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('ig-audit error:', error);

    if (error instanceof ProfileNotFoundError) {
      return errorResponse(
        'profile_not_found',
        `El perfil @${error.username} no existe en Instagram.`,
        404,
      );
    }

    if (error instanceof PrivateProfileError) {
      return errorResponse(
        'profile_private',
        `El perfil @${error.username} es privado. Solo se pueden auditar perfiles públicos.`,
        403,
      );
    }

    if (error instanceof ScraperTimeoutError) {
      return errorResponse(
        'timeout',
        `Apify tardó más de 45 segundos en responder. Reintente en unos minutos.`,
        500,
      );
    }

    return errorResponse(
      'internal_error',
      error instanceof Error ? error.message : 'Error interno del servidor.',
      500,
    );
  }
});
