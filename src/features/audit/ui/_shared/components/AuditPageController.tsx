'use client';

import { useState, useEffect, useCallback } from 'react';
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

function resolveErrorInfo(
  error: unknown,
  t: (key: string, fallback?: string) => string,
  username: string,
): ErrorInfo {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('private')) {
      return {
        title: t('audit_error_private_title'),
        message: t('audit_error_private_message'),
      };
    }
    if (msg.includes('not found') || msg.includes('404')) {
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

  // State machine
  const [phase, setPhase] = useState<AuditPhase>('LOADING');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [captureLoading, setCaptureLoading] = useState(false);

  // -----------------------------------------------------------------------
  // Phase 1 — LOADING: run the audit
  // -----------------------------------------------------------------------

  const runAudit = useCallback(async () => {
    setPhase('LOADING');
    setErrorInfo(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with status ${res.status}`);
      }

      const data: AuditResult = await res.json();
      setAuditResult(data);

      // Pre-compute evolution data if needed
      if (data.route === AuditRoute.EVOLUCION) {
        const evo = getEvolution(data);
        setEvolutionData(evo);
      }

      setPhase('CAPTURE');
    } catch (err) {
      setErrorInfo(resolveErrorInfo(err, t, username));
      setPhase('ERROR');
    }
  }, [username, t]);

  useEffect(() => {
    runAudit();
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
            ...formData,
            username: auditResult.username,
            score: auditResult.score,
            level: auditResult.level,
            route: auditResult.route,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? 'Lead submission failed');
        }

        setPhase('RESULTS');
      } catch {
        // Stay in CAPTURE — the form will remain visible so the user can retry
        // A more granular per-form error could be added here if needed
      } finally {
        setCaptureLoading(false);
      }
    },
    [auditResult],
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <AnimatePresence mode="wait">
      {/* -------- LOADING -------- */}
      {phase === 'LOADING' && (
        <motion.div key="loading" {...pageTransition}>
          <LoadingScreen
            username={username}
            variant={auditResult ? resolveLoadingVariant(auditResult.route) : 'standard'}
          />
        </motion.div>
      )}

      {/* -------- CAPTURE -------- */}
      {phase === 'CAPTURE' && auditResult && (
        <motion.div key="capture" {...pageTransition}>
          <CaptureScreen
            score={auditResult.score}
            level={auditResult.level}
            route={auditResult.route}
            postsCount={auditResult.profile.postsCount}
            onSubmit={handleCaptureSubmit}
            isLoading={captureLoading}
          />
        </motion.div>
      )}

      {/* -------- RESULTS -------- */}
      {phase === 'RESULTS' && auditResult && (
        <motion.div key="results" {...pageTransition}>
          {auditResult.route === AuditRoute.DIAGNOSTICO && (
            <DiagnosticoResults auditResult={auditResult} />
          )}
          {auditResult.route === AuditRoute.ARRANQUE && (
            <ArranqueResults auditResult={auditResult} />
          )}
          {auditResult.route === AuditRoute.EVOLUCION && evolutionData && (
            <EvolucionResults
              auditResult={auditResult}
              evolutionData={evolutionData}
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
