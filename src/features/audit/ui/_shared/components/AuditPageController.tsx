'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { AuditResult, AuditRoute } from '@/features/audit/domain/interfaces/audit';
import { getEvolution, type EvolutionData } from '@/features/audit/application/use-cases/get-evolution';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { LoadingScreen } from '@/features/audit/ui/loading/components';
import { CaptureScreen, type CaptureFormData } from '@/features/audit/ui/capture/components';
import { DiagnosticoResults } from '@/features/audit/ui/results/components';
import { ArranqueResults } from '@/features/audit/ui/results-arranque/components';
import { EvolucionResults } from '@/features/audit/ui/results-evolucion/components';
import { Navbar } from '@/features/audit/ui/landing/components/Navbar';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuditPhase = 'LOADING' | 'CAPTURE' | 'RESULTS' | 'ERROR';

type LoadingVariant = 'standard' | 'new' | 'returning';

interface ErrorInfo {
  title: string;
  message: string;
}

interface AuditPageControllerProps {
  username: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveLoadingVariant(route?: AuditRoute): LoadingVariant {
  if (!route) return 'standard';
  if (route === AuditRoute.ARRANQUE) return 'new';
  if (route === AuditRoute.EVOLUCION) return 'returning';
  return 'standard';
}

const ERROR_MESSAGES: Record<string, string> = {
  profile_not_found: 'No encontramos este perfil. Asegúrate de ingresar un usuario válido y público.',
  profile_private: 'Este perfil es privado o no existe. Asegúrate de que sea público e intenta de nuevo.',
  rate_limit: 'Has superado el límite de análisis. Intenta de nuevo más tarde.',
  timeout: 'El análisis tardó demasiado. Intenta de nuevo.',
};

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    for (const [code, message] of Object.entries(ERROR_MESSAGES)) {
      if (msg.includes(code)) return message;
    }
    // Keyword fallbacks
    if (msg.includes('private')) return ERROR_MESSAGES.profile_private;
    if (msg.includes('not found') || msg.includes('404')) return ERROR_MESSAGES.profile_not_found;
  }
  return 'Algo salió mal al analizar tu perfil. Intenta de nuevo.';
}

function resolveErrorInfo(
  error: unknown,
  t: (key: string, fallback?: string) => string,
  username: string,
): ErrorInfo {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('profile_private') || msg.includes('private')) {
      return {
        title: t('audit_error_private_title'),
        message: t('audit_error_private_message'),
      };
    }
    if (msg.includes('profile_not_found') || msg.includes('not_found') || msg.includes('not found') || msg.includes('404')) {
      return {
        title: t('audit_error_not_found_title'),
        message: t('audit_error_not_found_message').replace('{{username}}', username),
      };
    }
    if (msg.includes('timeout')) {
      return {
        title: t('audit_error_timeout_title'),
        message: t('audit_error_timeout_message'),
      };
    }
  }

  return {
    title: t('audit_error_generic_title'),
    message: t('audit_error_generic_message'),
  };
}

// ---------------------------------------------------------------------------
// Transition wrapper
// ---------------------------------------------------------------------------

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AuditPageController({ username }: AuditPageControllerProps) {
  const { t } = useTranslation('audit');
  const router = useRouter();
  const searchParams = useSearchParams();

  // State machine
  const [phase, setPhase] = useState<AuditPhase>('LOADING');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [signupUrl, setSignupUrl] = useState<string | null>(null);
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [captureLoading, setCaptureLoading] = useState(false);

  // -----------------------------------------------------------------------
  // Phase 1 — LOADING: run the audit
  // -----------------------------------------------------------------------

  const processAuditResult = useCallback((json: Record<string, unknown>) => {
    const audit: AuditResult = (json.data as AuditResult) ?? (json as unknown as AuditResult);
    setAuditResult(audit);
    if (json.auditId) setAuditId(json.auditId as string);

    // Pre-compute evolution data if needed
    if (audit.route === AuditRoute.EVOLUCION) {
      const evo = getEvolution(audit);
      setEvolutionData(evo);
    }

    // Evolucion skips lead capture — go straight to results
    setPhase(audit.route === AuditRoute.EVOLUCION ? 'RESULTS' : 'CAPTURE');
  }, []);

  const loadCachedByToken = useCallback(async (token: string) => {
    setPhase('LOADING');
    setErrorInfo(null);

    try {
      const res = await fetch(`/api/audit?t=${encodeURIComponent(token)}`);
      if (!res.ok) {
        // Token invalid or audit not found — fall back to fresh audit
        return false;
      }

      const json = await res.json();
      const audit: AuditResult = json.data ?? json;

      setAuditResult(audit);
      setAccessToken(token);
      if (json.auditId) setAuditId(json.auditId);

      if (audit.route === AuditRoute.EVOLUCION) {
        setEvolutionData(getEvolution(audit));
      }

      // Brief loading for UX, then straight to results (skip capture)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhase('RESULTS');
      return true;
    } catch {
      return false;
    }
  }, []);

  const runAudit = useCallback(async () => {
    setPhase('LOADING');
    setErrorInfo(null);

    // Clear any previous cache for this username
    try { sessionStorage.removeItem(`audit_${username}`); } catch { /* ignore */ }

    const SHOW_PHOTO_MS = 3000; // Time with photo before transitioning (progress fills during this)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorCode = body.error ?? '';
        const errorMessage = body.message ?? `Request failed with status ${res.status}`;
        const err = new Error(errorCode || errorMessage);
        (err as Error & { status?: number }).status = res.status;
        throw err;
      }

      const json = await res.json();
      const audit: AuditResult = json.data ?? json;
      const isCached = Boolean(json.cached);

      // Set audit data so the loading screen can show the profile pic
      setAuditResult(audit);
      if (json.auditId) setAuditId(json.auditId);
      if (json.accessToken) setAccessToken(json.accessToken);
      if (json.sessionId) setSessionId(json.sessionId);

      if (audit.route === AuditRoute.EVOLUCION) {
        const evo = getEvolution(audit);
        setEvolutionData(evo);
      }

      // Wait 3s so user sees their profile pic in the loading animation
      await new Promise(resolve => setTimeout(resolve, isCached ? 1500 : SHOW_PHOTO_MS));

      // Cached results → skip capture (user already submitted lead before)
      if (isCached) {
        setPhase('RESULTS');
      } else {
        setPhase(audit.route === AuditRoute.EVOLUCION ? 'RESULTS' : 'CAPTURE');
      }
    } catch (err) {
      // Redirect back to landing with error message
      const message = encodeURIComponent(resolveErrorMessage(err));
      router.replace(`/?error=${message}`);
      return;
    }
  }, [username, t, router, processAuditResult]);

  const hasStarted = useRef(false);
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Check for share token in URL → load cached results directly
    const token = searchParams.get('t');
    if (token) {
      loadCachedByToken(token).then((ok) => {
        if (!ok) runAudit(); // fallback to fresh audit if token is invalid
      });
    } else {
      runAudit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Phase 2 — CAPTURE: submit lead data
  // -----------------------------------------------------------------------

  const handleCaptureSubmit = useCallback(
    async (formData: CaptureFormData) => {
      if (!auditResult) return;
      setCaptureLoading(true);

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            gdprConsent: formData.gdprConsent,
            username: auditResult.username,
            auditId,
            auditResult,
            sessionId,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? 'Lead submission failed');
        }

        const resBody = await res.json();
        if (resBody.signupUrl) setSignupUrl(resBody.signupUrl);

        setPhase('RESULTS');
      } catch {
        // Stay in CAPTURE — the form will remain visible so the user can retry
        // A more granular per-form error could be added here if needed
      } finally {
        setCaptureLoading(false);
      }
    },
    [auditResult, auditId, sessionId],
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <AnimatePresence mode="wait">
      {/* -------- LOADING -------- */}
      {phase === 'LOADING' && (
        <motion.div key="loading" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="min-h-screen">
          <LoadingScreen
            username={username}
            variant={auditResult ? resolveLoadingVariant(auditResult.route) : 'standard'}
            profilePicUrl={auditResult?.profile.profilePicUrl}
            dataReady={auditResult !== null}
          />
        </motion.div>
      )}

      {/* -------- CAPTURE -------- */}
      {phase === 'CAPTURE' && auditResult && (
        <motion.div key="capture" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="min-h-screen">
          <CaptureScreen
            username={auditResult.username}
            fullName={auditResult.profile.fullName}
            score={auditResult.score}
            level={auditResult.level}
            route={auditResult.route}
            postsCount={auditResult.profile.postsCount}
            criticalCount={auditResult.criticalPoints.length}
            profilePicUrl={auditResult.profile.profilePicUrl}
            daysSinceLastPost={auditResult.healthSignals?.recency?.daysSinceLastPost}
            onSubmit={handleCaptureSubmit}
            isLoading={captureLoading}
          />
        </motion.div>
      )}

      {/* -------- RESULTS -------- */}
      {phase === 'RESULTS' && auditResult && (
        <motion.div key="results" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="min-h-screen">
          <Navbar />
          {auditResult.route === AuditRoute.DIAGNOSTICO && (
            <DiagnosticoResults auditResult={auditResult} accessToken={accessToken} signupUrl={signupUrl} />
          )}
          {auditResult.route === AuditRoute.ARRANQUE && (
            <ArranqueResults auditResult={auditResult} accessToken={accessToken} signupUrl={signupUrl} />
          )}
          {auditResult.route === AuditRoute.EVOLUCION && evolutionData && (
            <EvolucionResults
              auditResult={auditResult}
              evolutionData={evolutionData}
              accessToken={accessToken}
              signupUrl={signupUrl}
            />
          )}
        </motion.div>
      )}

      {/* -------- ERROR -------- */}
      {phase === 'ERROR' && errorInfo && (
        <motion.div key="error" {...pageTransition}>
          <div className="flex min-h-screen items-center justify-center bg-soft-aqua px-bewe-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center flex flex-col items-center gap-bewe-4">
              <div className="w-14 h-14 rounded-full bg-semantic-error/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-semantic-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-h2 font-inter font-semibold text-base-oscura">
                {errorInfo.title}
              </h2>

              <p className="text-body font-inter text-gray-600">
                {errorInfo.message}
              </p>

              <Button
                color="primary"
                size="lg"
                radius="full"
                className="w-full bg-primary-400 font-inter font-semibold text-button mt-bewe-2"
                onPress={() => runAudit()}
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
