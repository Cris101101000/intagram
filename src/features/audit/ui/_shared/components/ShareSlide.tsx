'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';
import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShareSlideProps {
  username: string;
  profilePicUrl: string;
  score: number;
  level: ScoreLevel;
  sector: string;
  route: AuditRoute;
  /** CSS selector for the element that triggers the slide */
  triggerSelector: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LEVEL_COLORS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: '#F87171',
  [ScoreLevel.REGULAR]: '#FBBF24',
  [ScoreLevel.BUENO]: '#34D399',
  [ScoreLevel.EXCELENTE]: '#60A5FA',
};

function getShareUrl(username: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/audit/${username}`;
}

function truncateUrl(url: string, max: number): string {
  if (url.length <= max) return url;
  return url.slice(0, max) + '...';
}

// ---------------------------------------------------------------------------
// Social config
// ---------------------------------------------------------------------------

const SOCIALS = [
  { name: 'WhatsApp', icon: 'mdi:whatsapp', color: '#25D366', bg: '#25D36610' },
  { name: 'Instagram', icon: 'mdi:instagram', color: '#E040FB', bg: '#E040FB10' },
  { name: 'X', icon: 'ri:twitter-x-fill', color: '#0A2540', bg: '#0A254008' },
  { name: 'LinkedIn', icon: 'mdi:linkedin', color: '#0A66C2', bg: '#0A66C210' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShareSlide({
  username,
  profilePicUrl,
  score,
  level,
  sector,
  route,
  triggerSelector,
}: ShareSlideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isArranque = route === AuditRoute.ARRANQUE;
  const accentColor = isArranque ? '#34D399' : '#60A5FA';

  // -----------------------------------------------------------------------
  // IntersectionObserver — trigger when section enters viewport
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (hasTriggered) return;

    const timer = setTimeout(() => {
      const el = document.querySelector(triggerSelector);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsOpen(true);
            setHasTriggered(true);
            obs.disconnect();
          }
        },
        { threshold: 0.3 },
      );

      obs.observe(el);
      return () => obs.disconnect();
    }, 500);

    return () => clearTimeout(timer);
  }, [triggerSelector, hasTriggered]);

  // -----------------------------------------------------------------------
  // Lock body scroll when open
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // -----------------------------------------------------------------------
  // Close on Escape
  // -----------------------------------------------------------------------

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // -----------------------------------------------------------------------
  // Copy URL
  // -----------------------------------------------------------------------

  const shareUrl = getShareUrl(username);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  // -----------------------------------------------------------------------
  // Social share URLs
  // -----------------------------------------------------------------------

  const shareText = isArranque
    ? 'Descubre cómo hacer crecer tu Instagram con IA'
    : `Acabo de descubrir mi Instagram Score: ${score}/100. ¿Quieres conocer el tuyo?`;

  function getSocialUrl(name: string): string {
    switch (name) {
      case 'WhatsApp':
        return `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
      case 'Instagram':
        return shareUrl;
      case 'X':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      case 'LinkedIn':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      default:
        return shareUrl;
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (!isOpen && !hasTriggered) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] transition-all duration-300 ${isOpen ? 'bg-black/30 backdrop-blur-[2px]' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Compartir auditoría"
        className={`fixed top-0 right-0 z-[9999] flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200"
          style={{ width: 36, height: 36 }}
          aria-label="Cerrar"
        >
          <Icon icon="solar:close-circle-outline" width={20} height={20} color="#64748B" />
        </button>

        {/* Scrollable content */}
        <div className="flex flex-1 flex-col overflow-y-auto" style={{ padding: '56px 24px 24px' }}>

          {/* ── Card 1: Profile ── */}
          <div
            className="rounded-2xl border border-gray-100"
            style={{ padding: 20, marginBottom: 16, background: 'linear-gradient(160deg, #F8FAFC, #F1F5F9)' }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="shrink-0 overflow-hidden rounded-full"
                style={{ width: 48, height: 48, border: `2px solid ${accentColor}` }}
              >
                {profilePicUrl ? (
                  <img
                    src={proxyImageUrl(profilePicUrl) ?? ''}
                    alt={username}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gray-200 font-inter"
                    style={{ fontSize: 16, fontWeight: 700, color: '#94A3B8' }}
                  >
                    {username[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Username + meta */}
              <div className="min-w-0 flex-1">
                <p className="font-inter truncate" style={{ fontSize: 16, fontWeight: 700, color: '#0A2540' }}>
                  @{username}
                </p>
                <p className="font-inter text-gray-400 truncate" style={{ fontSize: 14, fontWeight: 400, marginTop: 2 }}>
                  {sector}{!isArranque && ` · Score ${score}/100`}
                </p>
              </div>

              {/* Large score number */}
              {!isArranque && (
                <span
                  className="shrink-0 font-inter"
                  style={{ fontSize: 32, fontWeight: 800, color: LEVEL_COLORS[level], lineHeight: 1 }}
                >
                  {score}
                </span>
              )}
            </div>
          </div>

          {/* ── Section: Tu enlace único ── */}
          <div style={{ marginBottom: 16 }}>
            <p
              className="font-inter"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#60A5FA',
                marginBottom: 8,
              }}
            >
              Tu enlace único
            </p>
            <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>
              Guarda este enlace para volver a ver tus resultados cuando quieras.
            </p>
            <div
              className="flex items-center rounded-2xl border border-gray-100 bg-gray-50"
              style={{ padding: '12px 12px 12px 16px' }}
            >
              <span
                className="flex-1 truncate font-inter text-gray-500"
                style={{ fontSize: 14, fontWeight: 400 }}
              >
                {truncateUrl(shareUrl.replace(/^https?:\/\//, ''), 32)}
              </span>
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center justify-center rounded-xl font-inter text-white transition-all hover:opacity-90"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '8px 20px',
                  background: '#0A2540',
                }}
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* ── Section: Compartir en redes ── */}
          <div>
            <p
              className="font-inter"
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#60A5FA',
                marginBottom: 8,
              }}
            >
              Compartir en redes
            </p>
            <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
              Compártelo con otros negocios para que también descubran cómo hacer crecer su Instagram.
            </p>

            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.name === 'Instagram' ? undefined : getSocialUrl(social.name)}
                  target={social.name === 'Instagram' ? undefined : '_blank'}
                  rel={social.name === 'Instagram' ? undefined : 'noopener noreferrer'}
                  onClick={
                    social.name === 'Instagram'
                      ? (e) => { e.preventDefault(); handleCopy(); }
                      : undefined
                  }
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white font-inter transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  style={{ padding: '14px 16px' }}
                >
                  <div
                    className="flex shrink-0 items-center justify-center rounded-xl"
                    style={{ width: 40, height: 40, background: social.bg }}
                  >
                    <Icon icon={social.icon} width={20} height={20} color={social.color} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#0A2540' }}>
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom branding */}
        <div
          className="shrink-0 flex items-center justify-center border-t border-gray-100 font-inter text-gray-300"
          style={{ padding: 16, fontSize: 11 }}
        >
          Powered by Linda AI
        </div>
      </div>

      {/* Floating reopen button (after panel was closed) */}
      {hasTriggered && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-[9997] flex items-center gap-2 rounded-full border border-gray-200 bg-white font-inter shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          style={{
            bottom: 24,
            right: 24,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            color: '#0A2540',
            animation: 'share-fab-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          <Icon icon="solar:share-outline" width={16} height={16} style={{ color: accentColor }} />
          Compartir
        </button>
      )}
    </>
  );
}
