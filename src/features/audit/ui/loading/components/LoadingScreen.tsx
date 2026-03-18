'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LoadingVariant = 'standard' | 'new' | 'returning';

interface LoadingScreenProps {
  username: string;
  variant?: LoadingVariant;
  profilePicUrl?: string;
  dataReady?: boolean;
}

// ---------------------------------------------------------------------------
// Message sets keyed by progress threshold
// ---------------------------------------------------------------------------

const MESSAGES: Record<LoadingVariant, { at: number; key: string }[]> = {
  standard: [
    { at: 0,  key: 'audit_loading_standard_0' },
    { at: 12, key: 'audit_loading_standard_12' },
    { at: 30, key: 'audit_loading_standard_30' },
    { at: 48, key: 'audit_loading_standard_48' },
    { at: 60, key: 'audit_loading_standard_60' },
    { at: 75, key: 'audit_loading_standard_75' },
    { at: 90, key: 'audit_loading_standard_90' },
  ],
  new: [
    { at: 0,  key: 'audit_loading_new_0' },
    { at: 20, key: 'audit_loading_new_20' },
    { at: 40, key: 'audit_loading_new_40' },
    { at: 60, key: 'audit_loading_new_60' },
    { at: 80, key: 'audit_loading_new_80' },
  ],
  returning: [
    { at: 0,  key: 'audit_loading_returning_0' },
    { at: 20, key: 'audit_loading_returning_20' },
    { at: 40, key: 'audit_loading_returning_40' },
    { at: 60, key: 'audit_loading_returning_60' },
    { at: 80, key: 'audit_loading_returning_80' },
  ],
};

const EMOJIS_PER_MESSAGE: Record<string, string> = {
  audit_loading_standard_0: '🔍',
  audit_loading_standard_12: '📱',
  audit_loading_standard_30: '📊',
  audit_loading_standard_48: '💬',
  audit_loading_standard_60: '🎬',
  audit_loading_standard_75: '🏆',
  audit_loading_standard_90: '✨',
  audit_loading_new_0: '🔍',
  audit_loading_new_20: '📝',
  audit_loading_new_40: '🧩',
  audit_loading_new_60: '💡',
  audit_loading_new_80: '🚀',
  audit_loading_returning_0: '🔍',
  audit_loading_returning_20: '📋',
  audit_loading_returning_40: '🎉',
  audit_loading_returning_60: '📈',
  audit_loading_returning_80: '⚡',
};

function resolveMessage(variant: LoadingVariant, progress: number) {
  const msgs = MESSAGES[variant];
  let current = msgs[0];
  for (const m of msgs) {
    if (progress >= m.at) current = m;
  }
  return current;
}

// ---------------------------------------------------------------------------
// Non-linear progress curve
// ---------------------------------------------------------------------------

function useSimulatedProgress(durationMs = 18000) {
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const baseProgressRef = useRef(0);
  const FILL_MS = 2500;

  // Phase 1: simulated progress (0 → 90)
  useEffect(() => {
    if (isCompleting) return;
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const linear = Math.min(elapsed / durationMs, 1);
      let visual: number;
      if (linear < 0.3) {
        visual = linear * 1.2;
      } else if (linear < 0.7) {
        visual = 0.36 + (linear - 0.3) * 0.7;
      } else {
        visual = 0.64 + (linear - 0.7) * 1.2;
      }
      const val = Math.min(Math.round(visual * 100), 90);
      setProgress(val);
      baseProgressRef.current = val;
      if (linear < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, isCompleting]);

  // Phase 2: fill to 100 over FILL_MS
  useEffect(() => {
    if (!isCompleting) return;
    const start = Date.now();
    const base = baseProgressRef.current;
    let raf: number;

    const tick = () => {
      const t = Math.min((Date.now() - start) / FILL_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(base + (100 - base) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isCompleting]);

  const complete = useCallback(() => setIsCompleting(true), []);

  return { progress, complete };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/* Orbit emojis */
const OUTER_EMOJIS = ['❤️', '💬', '📈', '🎯', '🔥', '👀'];
const INNER_EMOJIS = ['⭐', '📊', '💡'];
const OUTER_ANGLES = [0, 60, 120, 180, 240, 300];
const INNER_ANGLES = [0, 120, 240];

function OrbitEmojis() {
  return (
    <>
      {OUTER_EMOJIS.map((emoji, i) => (
        <span
          key={`outer-${i}`}
          className="absolute select-none"
          style={{
            top: '50%',
            left: '50%',
            fontSize: 28,
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 8px rgba(10,37,64,0.1))',
            willChange: 'transform',
            animation: `orbit-outer-${OUTER_ANGLES[i]} 12s linear infinite`,
          }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}
      {INNER_EMOJIS.map((emoji, i) => (
        <span
          key={`inner-${i}`}
          className="absolute select-none"
          style={{
            top: '50%',
            left: '50%',
            fontSize: 20,
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 6px rgba(10,37,64,0.08))',
            willChange: 'transform',
            animation: `orbit-inner-${INNER_ANGLES[i]} 8s linear infinite`,
          }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      ))}
    </>
  );
}

/* Sparkles */
const SPARKLE_STYLES = [
  { top: '20%', left: '15%', color: '#9FC0FA', delay: '0s' },
  { top: '70%', right: '10%', color: '#6EE7B7', delay: '1.3s' },
  { bottom: '15%', left: '25%', color: '#FAD19E', delay: '2.6s' },
];

function Sparkles() {
  return (
    <>
      {SPARKLE_STYLES.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: s.color,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            animation: `sparkle 4s ease-in-out infinite ${s.delay}`,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/* Score ring SVG */
function ScoreRing({ progress, isComplete }: { progress: number; isComplete: boolean }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference * (1 - progress / 100);

  return (
    <div
      className="absolute w-24 h-24 sm:w-24 sm:h-24"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {/* Glow */}
      <div
        className="absolute rounded-full animate-pulse-orb"
        style={{
          inset: -8,
          background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* SVG ring */}
      <svg
        viewBox="0 0 96 96"
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <defs>
          <linearGradient id="loading-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="48" r="40" fill="none" stroke="#F3F4F6" strokeWidth="6" />
        <circle
          cx="48" cy="48" r="40" fill="none"
          stroke="url(#loading-ring-grad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(0deg)' }}>
        {isComplete ? (
          <span className="font-inter text-h2 text-secondary-500">✓</span>
        ) : (
          <>
            <span className="font-inter text-h2 text-base-oscura" style={{ letterSpacing: '-0.03em' }}>
              {progress}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* Instagram icon */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="#9CA3AF" stroke="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LoadingScreen({ username, variant = 'standard', profilePicUrl, dataReady }: LoadingScreenProps) {
  const { t } = useTranslation('audit');
  const { progress, complete } = useSimulatedProgress(30000);
  const imgSrc = proxyImageUrl(profilePicUrl);

  // When data arrives, jump to 100%
  useEffect(() => {
    if (dataReady) complete();
  }, [dataReady, complete]);
  const isComplete = progress >= 100;
  const msg = resolveMessage(variant, progress);
  const emoji = EMOJIS_PER_MESSAGE[msg.key] ?? '';

  const [msgKey, setMsgKey] = useState(msg.key);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (msg.key === msgKey) return;
    setVisible(false);
    const timer = setTimeout(() => {
      setMsgKey(msg.key);
      setVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [msg.key, msgKey]);

  const currentEmoji = EMOJIS_PER_MESSAGE[msgKey] ?? '';

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #EEF6FF 0%, #F0FDF9 40%, #FEFCE8 100%)', backgroundAttachment: 'fixed' }}
    >
      {/* Orbs */}
      <div className="absolute animate-pulse-orb rounded-full" style={{ top: '-20%', right: '-15%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, transparent 70%)' }} aria-hidden="true" />
      <div className="absolute animate-pulse-orb rounded-full" style={{ bottom: '-25%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', animationDelay: '-3s' }} aria-hidden="true" />
      <div className="absolute animate-pulse-orb rounded-full" style={{ top: '40%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(103,232,249,0.12) 0%, transparent 70%)', animationDelay: '-6s' }} aria-hidden="true" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0A2540 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* --- Orbit container --- */}
      <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] mb-12">
        {/* Orbit tracks */}
        <div
          className="absolute rounded-full border border-dashed border-gray-200"
          style={{ width: 188, height: 188, top: '50%', left: '50%', margin: '-94px 0 0 -94px' }}
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute rounded-full border border-dashed border-gray-200"
          style={{ width: 240, height: 240, top: '50%', left: '50%', margin: '-120px 0 0 -120px' }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full border border-dashed"
          style={{ width: 124, height: 124, top: '50%', left: '50%', margin: '-62px 0 0 -62px', borderColor: 'rgba(96,165,250,0.15)' }}
          aria-hidden="true"
        />
        <div
          className="hidden sm:block absolute rounded-full border border-dashed"
          style={{ width: 160, height: 160, top: '50%', left: '50%', margin: '-80px 0 0 -80px', borderColor: 'rgba(96,165,250,0.15)' }}
          aria-hidden="true"
        />

        <OrbitEmojis />
        <Sparkles />
        <ScoreRing progress={progress} isComplete={isComplete} />
      </div>

      {/* --- Profile pic + Username --- */}
      <div
        className="mb-8 flex flex-col items-center gap-3"
        style={{ animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        {imgSrc && (
          <div
            className="rounded-full border-[3px] border-white overflow-hidden"
            style={{ width: 72, height: 72, boxShadow: '0 4px 20px rgba(10,37,64,0.10)' }}
          >
            <img
              src={imgSrc}
              alt={`Foto de perfil de @${username} en Instagram`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm">
          <InstagramIcon />
          <span className="text-body font-inter text-base-oscura" style={{ fontWeight: 600 }}>
            @{username}
          </span>
        </div>
      </div>

      {/* --- Progressive message --- */}
      <div className="relative h-14 flex items-center justify-center px-6" style={{ minHeight: 56 }}>
        <p
          className="text-body font-inter text-gray-500 text-center transition-all duration-400"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDuration: '0.4s',
            fontWeight: 400,
          }}
        >
          {t(msgKey)}{' '}
          <span
            className="inline-block"
            style={{ animation: visible ? 'emoji-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none' }}
            key={msgKey}
          >
            {currentEmoji}
          </span>
        </p>
      </div>

      {/* --- Progress bar --- */}
      <div className="mt-8 w-full px-6" style={{ maxWidth: 320 }}>
        <div className="relative h-1 rounded-full bg-gray-200 overflow-visible">
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #60A5FA, #34D399)',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Dot indicator */}
            <div
              className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-white border-2 border-primary-400"
              style={{
                transform: 'translate(50%, -50%)',
                boxShadow: '0 0 8px rgba(96,165,250,0.4)',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-small font-inter text-gray-400" style={{ fontWeight: 400 }}>
            {isComplete ? t('audit_loading_complete') : t('audit_loading_label')}
          </span>
          <span className="text-small font-inter text-gray-400" style={{ fontWeight: 400 }}>
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
