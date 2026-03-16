'use client';

import { useState } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface CtaSectionProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
}

export function CtaSection({ onSubmit, isLoading }: CtaSectionProps) {
  const { t } = useTranslation('audit');
  const { t: tc } = useTranslation('common');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const clean = username.replace(/^@/, '').trim();
    if (!clean) { setError(tc('validation_required')); return; }
    if (!/^[a-zA-Z0-9._]+$/.test(clean)) { setError(tc('validation_username')); return; }
    setError('');
    onSubmit(clean);
  };

  return (
    <section className="relative py-24 px-6 sm:px-12 overflow-hidden">

      <div className="relative mx-auto flex flex-col items-center text-center" style={{ maxWidth: 600 }}>
        <h2 className="text-h1 font-inter text-base-oscura mb-4">
          {t('audit_landing_cta_title')}
        </h2>

        <p className="text-body text-gray-500 font-inter mb-8">
          {t('audit_landing_cta_subtitle')}
        </p>

        {/* Input group — light variant */}
        <div className="w-full max-w-[480px]">
          <div
            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-[20px] sm:rounded-full p-1.5 transition-all duration-200 ${
              error
                ? 'border-2 border-semantic-error ring-4 ring-semantic-error/10'
                : 'border border-gray-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-400/10'
            }`}
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <div className="flex flex-1 items-center gap-2 px-4 py-2 sm:py-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="#9CA3AF" stroke="none" />
              </svg>
              <span className="text-gray-400 text-small font-inter">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={t('audit_landing_hero_input_placeholder')}
                className="flex-1 bg-transparent text-body font-inter text-base-oscura placeholder:text-gray-400 outline-none"
                aria-label={tc('field_username')}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-button font-inter text-white transition-all duration-200 hover:scale-[1.03] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', boxShadow: '0 4px 12px rgba(96,165,250,0.30)' }}
            >
              {isLoading ? tc('status_analyzing') : t('audit_landing_hero_button')}
              {!isLoading && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-small text-semantic-error font-inter text-center">{error}</p>}
        </div>

        <p className="mt-6 text-small text-gray-400 font-inter">
          {t('audit_landing_cta_note')}
        </p>
      </div>
    </section>
  );
}
