import { NextRequest, NextResponse } from 'next/server';
import { ApifyAdapter } from '@/features/audit/infrastructure/adapters/apify-adapter';
import { SupabaseAdapter } from '@/features/audit/infrastructure/adapters/supabase-adapter';
import { runAudit } from '@/features/audit/application/use-cases/run-audit';
import {
  ProfileNotFoundError,
  PrivateProfileError,
  ScraperTimeoutError,
} from '@/features/audit/infrastructure/adapters/apify-adapter';

// Simple in-memory rate limiting (5 requests per IP per hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// GET /api/audit?t=ACCESS_TOKEN — retrieve cached audit by token (share links)
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('t');
    if (!token) {
      return NextResponse.json(
        { error: 'missing_token', message: 'Token es requerido.' },
        { status: 400 },
      );
    }

    const storagePort = new SupabaseAdapter();
    const audit = await storagePort.getAuditByToken(token);

    if (!audit) {
      return NextResponse.json(
        { error: 'not_found', message: 'No se encontró la auditoría.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: audit, cached: true });
  } catch (error) {
    console.error('Audit GET error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'Algo salió mal.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'invalid_input', message: 'Username es requerido.' },
        { status: 400 },
      );
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();

    if (!cleanUsername || !/^[a-zA-Z0-9._]+$/.test(cleanUsername)) {
      return NextResponse.json(
        {
          error: 'invalid_username',
          message: 'El username no tiene un formato válido.',
        },
        { status: 400 },
      );
    }

    // Check for cached audit from last 24 hours before running a fresh one
    const storagePort = new SupabaseAdapter();
    const cachedAudit = await storagePort.getRecentAudit(cleanUsername, 24);
    if (cachedAudit) {
      const { auditId, accessToken, ...auditData } = cachedAudit;
      return NextResponse.json({ success: true, data: auditData, auditId, accessToken, cached: true });
    }

    // Rate limiting (only for real API calls)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'rate_limit',
          message:
            'Has superado el límite de análisis. Intenta de nuevo más tarde.',
        },
        { status: 429 },
      );
    }

    // Create adapters (dependency injection)
    const instagramPort = new ApifyAdapter();

    // Create session with user agent and locale
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const locale = request.headers.get('accept-language')?.split(',')[0]?.trim() ?? 'es';
    const sessionId = await storagePort.createSession(cleanUsername, userAgent, ip, locale);

    // Run audit
    const result = await runAudit(cleanUsername, instagramPort, storagePort, sessionId);
    const { auditId, accessToken, ...auditData } = result;

    return NextResponse.json({ success: true, data: auditData, auditId, accessToken, sessionId });
  } catch (error) {
    // Handle custom error classes from the Apify adapter
    if (error instanceof PrivateProfileError) {
      return NextResponse.json(
        {
          error: 'profile_private',
          message:
            'No encontramos este perfil o está configurado como privado. Asegúrate de que tu perfil sea público e intenta de nuevo.',
        },
        { status: 422 },
      );
    }

    if (error instanceof ProfileNotFoundError) {
      return NextResponse.json(
        {
          error: 'profile_not_found',
          message:
            'No encontramos este perfil. Verifica que el username sea correcto.',
        },
        { status: 404 },
      );
    }

    if (error instanceof ScraperTimeoutError) {
      return NextResponse.json(
        {
          error: 'timeout',
          message: 'Algo salió mal al analizar el perfil. Intenta de nuevo.',
        },
        { status: 504 },
      );
    }

    // Handle plain Error messages thrown from runAudit use-case
    if (error instanceof Error) {
      switch (error.message) {
        case 'PROFILE_PRIVATE':
          return NextResponse.json(
            {
              error: 'profile_private',
              message:
                'No encontramos este perfil o está configurado como privado. Asegúrate de que tu perfil sea público e intenta de nuevo.',
            },
            { status: 422 },
          );
      }
    }

    console.error('Audit error:', error);
    return NextResponse.json(
      {
        error: 'server_error',
        message: 'Algo salió mal al analizar el perfil.',
      },
      { status: 500 },
    );
  }
}
