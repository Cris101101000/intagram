'use client';

import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { LEVEL_CONFIG } from '../constants/level-config';
import { SectionLabel } from './MetricsBlock';

interface ActionPlanProps {
  level: ScoreLevel;
}

const WEEK_COLORS = ['#60A5FA', '#5694E1', '#34D399', '#2FBE8A'];

export function ActionPlan({ level }: ActionPlanProps) {
  const cfg = LEVEL_CONFIG[level];

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 48 }}>
        <p className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, maxWidth: 520, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Así se ve{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#2FBE8A' }}>
            tu primer mes
          </span>
          {' '}con Linda.
        </p>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560 }}>
          Un plan paso a paso para mejorar cada métrica de tu perfil — sin que necesites experiencia.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div className="absolute" style={{ left: 23, top: 0, bottom: 0, width: 2, backgroundColor: '#E2E8F0' }} aria-hidden="true" />

        {cfg.weeks.map((week, i) => (
          <div key={week.id} className="reveal relative flex gap-5" style={{ padding: '20px 0' }}>
            {/* Dot */}
            <div
              className="relative z-10 flex shrink-0 items-center justify-center rounded-full font-inter text-white"
              style={{ width: 48, height: 48, fontSize: 13, fontWeight: 700, backgroundColor: WEEK_COLORS[i] }}
            >
              {week.id}
            </div>

            {/* Content */}
            <div className="flex-1" style={{ paddingTop: 4 }}>
              <div className="font-inter text-base-oscura" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>
                {week.title}
              </div>
              <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5 }}>
                {week.desc}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {week.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center gap-1 rounded-full font-inter"
                    style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px',
                      backgroundColor: tag.variant === 'linda' ? '#D6F6EB' : '#F1F5F9',
                      color: tag.variant === 'linda' ? '#279E73' : '#64748B',
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
