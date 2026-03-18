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
  const [isMobile, setIsMobile] = useState(false);
  const shareImageRef = useRef<HTMLDivElement>(null);

  const isArranque = route === AuditRoute.ARRANQUE;

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);
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

  const trackEvent = useCallback((eventType: string) => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, eventType }),
    }).catch(() => {});
  }, [username]);

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
    trackEvent('share_copy_url');
  }, [shareUrl, trackEvent]);

  // -----------------------------------------------------------------------
  // Generate & share/download image
  // -----------------------------------------------------------------------

  const handleShareImage = useCallback(async (target: 'download' | 'whatsapp' | 'instagram') => {
    const el = shareImageRef.current;
    if (!el || generating) return;

    const eventMap = { download: 'share_download', whatsapp: 'share_whatsapp', instagram: 'share_instagram' } as const;
    trackEvent(eventMap[target]);

    setGenerating(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(el, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();

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
  }, [generating, username, level, score, shareUrl, trackEvent]);

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
        <div className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
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
          <div className="flex flex-col" style={{ padding: '40px 28px 20px' }}>

            {/* ── Hero text ── */}
            <div className="text-center" style={{ marginBottom: 16 }}>
              <p className="font-inter text-base-oscura" style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
                Comparte tu resultado en Stories
              </p>
              <p className="font-inter text-gray-400" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {isMobile
                  ? 'Presume tu score en Stories y reta a otros negocios a descubrir el suyo.'
                  : 'Descarga tu imagen, súbela a Stories y reta a otros negocios a descubrir su score.'}
              </p>
            </div>

            {/* ── Two-column layout (desktop) / stacked (mobile) ── */}
            <div className="flex flex-col sm:flex-row gap-5" style={{ marginBottom: 16 }}>

              {/* Left: Image Preview */}
              <div className="mx-auto sm:mx-0 shrink-0" style={{ width: isMobile ? 160 : 180 }}>
                <div
                  className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  style={{ aspectRatio: '9/16', background: '#F8FAFC' }}
                >
                  <div style={{ transform: `scale(${(isMobile ? 160 : 180) / 1080})`, transformOrigin: 'top left', width: 1080, height: 1920 }}>
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

              {/* Right: Actions */}
              <div className="flex flex-col flex-1 justify-center gap-3">
                {/* Download button (desktop only) */}
                {!isMobile && (
                  <button
                    onClick={() => handleShareImage('download')}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 rounded-2xl font-inter text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      padding: '12px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                    }}
                  >
                    <Icon icon="solar:download-minimalistic-outline" width={18} height={18} />
                    {generating ? 'Generando...' : 'Descargar imagen'}
                  </button>
                )}

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShareImage('whatsapp')}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white font-inter transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                    style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#0A2540' }}
                  >
                    <div
                      className="flex shrink-0 items-center justify-center rounded-xl"
                      style={{ width: 30, height: 30, background: '#25D36610' }}
                    >
                      <Icon icon="mdi:whatsapp" width={16} height={16} color="#25D366" />
                    </div>
                    {isMobile ? 'Enviar' : 'WhatsApp'}
                  </button>
                  <button
                    onClick={() => handleShareImage('instagram')}
                    disabled={generating}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white font-inter transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                    style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#0A2540' }}
                  >
                    <div
                      className="flex shrink-0 items-center justify-center rounded-xl"
                      style={{ width: 30, height: 30, background: '#E040FB10' }}
                    >
                      <Icon icon="mdi:instagram" width={16} height={16} color="#E040FB" />
                    </div>
                    {isMobile ? 'Stories' : 'Instagram'}
                  </button>
                </div>

                {/* Link section */}
                <div
                  className="rounded-2xl"
                  style={{
                    padding: '14px 14px 12px',
                    background: 'linear-gradient(135deg, #EEF6FF 0%, #F0FDF9 100%)',
                    border: '1.5px solid #BFDBFE',
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <Icon icon="solar:link-circle-bold" width={16} height={16} color="#3B82F6" />
                    <p className="font-inter" style={{ fontSize: 12, fontWeight: 700, color: '#0A2540' }}>
                      Tu enlace único
                    </p>
                  </div>
                  <p className="font-inter" style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4, marginBottom: 8 }}>
                    Guárdalo para ver tu auditoría cuando quieras.
                  </p>
                  <div
                    className="flex items-center rounded-xl bg-white"
                    style={{ padding: '6px 6px 6px 12px', border: '1px solid #E2E8F0' }}
                  >
                    <span
                      className="flex-1 truncate font-inter"
                      style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}
                    >
                      {truncateUrl(shareUrl.replace(/^https?:\/\//, ''), 36)}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg font-inter text-white transition-all hover:opacity-90"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '6px 14px',
                        background: copied ? '#10B981' : '#3B82F6',
                      }}
                    >
                      <Icon icon={copied ? 'solar:check-circle-outline' : 'solar:copy-outline'} width={13} height={13} />
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom branding */}
          <div
            className="flex items-center justify-center border-t border-gray-100 font-inter text-gray-300"
            style={{ padding: 10, fontSize: 11 }}
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
