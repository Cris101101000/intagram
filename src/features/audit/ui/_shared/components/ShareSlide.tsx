'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { AuditRoute, ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { ShareImage, type ShareImageProps } from './ShareImage';

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
  percentile: number;
  /** CSS selector for the element that triggers the slide */
  triggerSelector: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getShareUrl(username: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/audit/${username}`;
}

function truncateUrl(url: string, max: number): string {
  if (url.length <= max) return url;
  return url.slice(0, max) + '...';
}

function computePercentile(score: number): number {
  if (score <= 40) return Math.round(80 - (score / 40) * 20);
  if (score <= 60) return Math.round(60 - ((score - 40) / 20) * 20);
  if (score <= 80) return Math.round(40 - ((score - 60) / 20) * 20);
  return Math.round(20 - ((score - 80) / 20) * 15);
}

// ---------------------------------------------------------------------------
// Social config
// ---------------------------------------------------------------------------

const SOCIALS = [
  { name: 'WhatsApp', icon: 'mdi:whatsapp', color: '#25D366', bg: '#25D36610' },
  { name: 'Instagram', icon: 'mdi:instagram', color: '#E040FB', bg: '#E040FB10' },
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
  percentile,
  triggerSelector,
}: ShareSlideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const shareImageRef = useRef<HTMLDivElement>(null);

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
  // Generate & share/download image
  // -----------------------------------------------------------------------

  const handleShareImage = useCallback(async (target: 'download' | 'whatsapp' | 'instagram') => {
    const el = shareImageRef.current;
    if (!el || generating) return;

    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => { if (b) resolve(b); }, 'image/png', 1.0);
      });

      const fileName = `igaudit-${username}-${level.toLowerCase()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // Try Web Share API (mobile)
      if (target !== 'download' && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mi resultado IG Audit',
        });
        return;
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      // If WhatsApp, also open share link after download
      if (target === 'whatsapp') {
        const shareText = `Acabo de descubrir mi Instagram Score: ${score}/100. ¿Quieres conocer el tuyo?`;
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank');
      }
    } catch (err) {
      console.error('Error generating share image:', err);
    } finally {
      setGenerating(false);
    }
  }, [generating, username, level, score, shareUrl]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (!isOpen && !hasTriggered) return null;

  return (
    <>
      {/* Off-screen share image for html2canvas */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: -9999, top: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <ShareImage
          ref={shareImageRef}
          username={username}
          score={score}
          level={level}
          sector={sector}
          percentile={percentile}
        />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] transition-all duration-300 ${isOpen ? 'bg-black/30 backdrop-blur-[2px]' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compartir auditoría"
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full bg-gray-100 transition-all hover:bg-gray-200"
            style={{ width: 36, height: 36 }}
            aria-label="Cerrar"
          >
            <Icon icon="solar:close-circle-outline" width={20} height={20} color="#64748B" />
          </button>

          {/* Content */}
          <div className="flex flex-col" style={{ padding: '48px 24px 24px' }}>

            {/* ── Image Preview ── */}
            <div style={{ marginBottom: 20 }}>
              <p
                className="font-inter"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#60A5FA',
                  marginBottom: 10,
                }}
              >
                Tu imagen para compartir
              </p>
              <div
                className="rounded-2xl overflow-hidden border border-gray-100"
                style={{ aspectRatio: '9/16', background: '#F8FAFC' }}
              >
                <div style={{ transform: 'scale(0.333)', transformOrigin: 'top left', width: 1080, height: 1920 }}>
                  <ShareImage
                    username={username}
                    score={score}
                    level={level}
                    sector={sector}
                    percentile={percentile}
                  />
                </div>
              </div>
            </div>

            {/* ── Download button ── */}
            <button
              onClick={() => handleShareImage('download')}
              disabled={generating}
              className="flex items-center justify-center gap-2 rounded-2xl font-inter text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                marginBottom: 16,
              }}
            >
              <Icon icon="solar:download-minimalistic-outline" width={18} height={18} />
              {generating ? 'Generando...' : 'Descargar imagen'}
            </button>

            {/* ── Share buttons ── */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 16 }}>
              <button
                onClick={() => handleShareImage('whatsapp')}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white font-inter transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#0A2540' }}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-xl"
                  style={{ width: 32, height: 32, background: '#25D36610' }}
                >
                  <Icon icon="mdi:whatsapp" width={18} height={18} color="#25D366" />
                </div>
                WhatsApp
              </button>
              <button
                onClick={() => handleShareImage('instagram')}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white font-inter transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#0A2540' }}
              >
                <div
                  className="flex shrink-0 items-center justify-center rounded-xl"
                  style={{ width: 32, height: 32, background: '#E040FB10' }}
                >
                  <Icon icon="mdi:instagram" width={18} height={18} color="#E040FB" />
                </div>
                Instagram
              </button>
            </div>

            {/* ── Link section ── */}
            <div style={{ marginBottom: 8 }}>
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
              <div
                className="flex items-center rounded-2xl border border-gray-100 bg-gray-50"
                style={{ padding: '10px 10px 10px 16px' }}
              >
                <span
                  className="flex-1 truncate font-inter text-gray-500"
                  style={{ fontSize: 13, fontWeight: 400 }}
                >
                  {truncateUrl(shareUrl.replace(/^https?:\/\//, ''), 32)}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center justify-center rounded-xl font-inter text-white transition-all hover:opacity-90"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '8px 16px',
                    background: '#0A2540',
                  }}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom branding */}
          <div
            className="flex items-center justify-center border-t border-gray-100 font-inter text-gray-300"
            style={{ padding: 14, fontSize: 11 }}
          >
            Powered by Linda AI
          </div>
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
