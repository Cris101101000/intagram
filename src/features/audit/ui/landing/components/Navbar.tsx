'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface NavbarProps {
  onAuditClick: () => void;
}

export function Navbar({ onAuditClick }: NavbarProps) {
  const { t } = useTranslation('audit');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
        padding: scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1152, padding: '0 48px' }}>
        {/* Logo + Badge */}
        <div className="flex items-center gap-3">
          <span className="font-inter font-bold text-xl text-base-oscura">BeweOS</span>
          <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-400">
            {t('audit_landing_navbar_badge')}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onAuditClick}
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-base-oscura px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.03]"
        >
          {t('audit_landing_navbar_cta')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
