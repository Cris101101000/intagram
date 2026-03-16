'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

function useInView(threshold = 0.2) {
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

/* ---- Score Ring SVG ---- */
function ScoreRing({ value, visible }: { value: number; visible: boolean }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progress = value / 100;
  const offset = circumference * (1 - (visible ? progress : 0));

  return (
    <div className="relative flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
        <defs>
          <linearGradient id="preview-score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={radius} fill="none"
          stroke="url(#preview-score-grad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-inter text-h1 text-base-oscura">{value}</span>
        <span className="font-inter text-small text-gray-400">Score</span>
      </div>
    </div>
  );
}

/* ---- Metric Bar ---- */
function MetricBar({ label, value, displayValue, color, visible, delay }: {
  label: string; value: number; displayValue: string; color: string; visible: boolean; delay: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-small font-inter uppercase tracking-wider text-gray-400">{label}</span>
        <span className="text-small font-inter text-base-oscura" style={{ fontWeight: 600 }}>{displayValue}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: visible ? `${value}%` : '0%',
            backgroundColor: color,
            transitionDelay: `${delay}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  );
}

/* ---- Legend Dot ---- */
function LegendItem({ color, text }: { color: string; text: string }) {
  const dashIndex = text.indexOf('—');
  const boldPart = dashIndex !== -1 ? text.slice(0, dashIndex).trim() : text;
  const restPart = dashIndex !== -1 ? text.slice(dashIndex) : '';

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="text-body text-gray-500 font-inter">
        <strong className="font-semibold text-base-oscura">{boldPart}</strong> {restPart}
      </span>
    </div>
  );
}

export function ScorePreviewSection() {
  const { t } = useTranslation('audit');
  const { ref, visible } = useInView();

  return (
    <section
      ref={ref}
      className="py-24 px-6 sm:px-12"
    >
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 items-center" style={{ maxWidth: 1152, gap: 64 }}>
        {/* Left column */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-5 bg-primary-400" aria-hidden="true" />
            <span className="text-small font-inter font-bold uppercase tracking-[0.08em] text-primary-500">
              {t('audit_landing_preview_label')}
            </span>
          </div>

          <h2 className="font-inter text-base-oscura mb-4" style={{ fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}>
            {t('audit_landing_preview_title')}
          </h2>

          <p className="text-body text-gray-500 font-inter mb-8">
            {t('audit_landing_preview_subtitle')}
          </p>

          <div className="flex flex-col gap-4">
            <LegendItem color="#60A5FA" text={t('audit_landing_preview_legend_er')} />
            <LegendItem color="#34D399" text={t('audit_landing_preview_legend_cr')} />
            <LegendItem color="#FAD19E" text={t('audit_landing_preview_legend_rvr')} />
          </div>
        </div>

        {/* Right column — Score card */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}
        >
          <div className="rounded-3xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-lg"
                style={{ background: 'linear-gradient(135deg, #60A5FA, #34D399)' }}
              >
                🏋️
              </div>
              <div>
                <p className="text-small font-inter text-base-oscura" style={{ fontWeight: 600 }}>
                  {t('audit_landing_preview_card_name')}
                </p>
                <p className="text-small font-inter text-gray-400">
                  {t('audit_landing_preview_card_sector')}
                </p>
              </div>
            </div>

            {/* Score ring */}
            <div className="flex justify-center mb-8">
              <ScoreRing value={72} visible={visible} />
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-5">
              <MetricBar
                label={t('audit_landing_preview_card_er_label')}
                value={72} displayValue="3.8%" color="#60A5FA"
                visible={visible} delay={300}
              />
              <MetricBar
                label={t('audit_landing_preview_card_cr_label')}
                value={48} displayValue="1.2%" color="#34D399"
                visible={visible} delay={450}
              />
              <MetricBar
                label={t('audit_landing_preview_card_rvr_label')}
                value={85} displayValue="142%" color="#FAD19E"
                visible={visible} delay={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
