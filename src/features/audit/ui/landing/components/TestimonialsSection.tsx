'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

interface Testimonial {
  textKey: string;
  emKey: string;
  nameKey: string;
  bizKey: string;
  initials: string;
  gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    textKey: 'audit_landing_testimonial1_text',
    emKey: 'audit_landing_testimonial1_em',
    nameKey: 'audit_landing_testimonial1_name',
    bizKey: 'audit_landing_testimonial1_biz',
    initials: 'MC',
    gradient: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
  },
  {
    textKey: 'audit_landing_testimonial2_text',
    emKey: 'audit_landing_testimonial2_em',
    nameKey: 'audit_landing_testimonial2_name',
    bizKey: 'audit_landing_testimonial2_biz',
    initials: 'AS',
    gradient: 'linear-gradient(135deg, #34D399, #10B981)',
  },
  {
    textKey: 'audit_landing_testimonial3_text',
    emKey: 'audit_landing_testimonial3_em',
    nameKey: 'audit_landing_testimonial3_name',
    bizKey: 'audit_landing_testimonial3_biz',
    initials: 'DF',
    gradient: 'linear-gradient(135deg, #FAD19E, #FBBF24)',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function highlightEm(fullText: string, emText: string) {
  const idx = fullText.indexOf(emText);
  if (idx === -1) return <>{fullText}</>;
  const before = fullText.slice(0, idx);
  const after = fullText.slice(idx + emText.length);
  return (
    <>
      {before}
      <strong className="font-inter font-semibold text-gray-600">{emText}</strong>
      {after}
    </>
  );
}

export function TestimonialsSection() {
  const { t } = useTranslation('audit');
  const { ref, visible } = useInView();

  return (
    <section className="py-24 px-6 sm:px-12" ref={ref}>
      <div className="mx-auto" style={{ maxWidth: 1152 }}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-5 bg-primary-400" aria-hidden="true" />
            <span className="text-small font-inter font-bold uppercase tracking-[0.08em] text-primary-500">
              {t('audit_landing_testimonials_label')}
            </span>
            <div className="h-px w-5 bg-primary-400" aria-hidden="true" />
          </div>
          <h2 className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}>
            {t('audit_landing_testimonials_title')}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <div
              key={i}
              className="flex flex-col rounded-[20px] border border-gray-100 bg-gray-50 p-8 transition-all duration-300 hover:border-gray-200 hover:shadow-md"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
              }}
            >
              <Stars />
              <p className="text-body text-gray-500 font-inter mb-6 leading-relaxed flex-1">
                {highlightEm(t(item.textKey), t(item.emKey))}
              </p>
              <div className="mt-auto flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: item.gradient }}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="text-small font-inter text-base-oscura" style={{ fontWeight: 600 }}>{t(item.nameKey)}</p>
                  <p className="text-small font-inter text-gray-400">{t(item.bizKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
