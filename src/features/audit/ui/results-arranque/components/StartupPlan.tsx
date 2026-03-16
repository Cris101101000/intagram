'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { SectionLabel } from './InsightsSection';

interface WeekDef {
  id: string;
  titleKey: string;
  descKey: string;
  tags: { icon: string; labelKey: string; variant: 'linda' | 'manual' }[];
}

const WEEK_COLORS = ['#60A5FA', '#5694E1', '#34D399', '#2FBE8A'];

const WEEKS: WeekDef[] = [
  {
    id: 'S1',
    titleKey: 'audit_arranque_plan_s1_title',
    descKey: 'audit_arranque_plan_s1_desc',
    tags: [
      { icon: 'solar:magic-stick-3-outline', labelKey: 'audit_arranque_plan_s1_tag1', variant: 'linda' },
      { icon: 'solar:smartphone-outline', labelKey: 'audit_arranque_plan_s1_tag2', variant: 'manual' },
    ],
  },
  {
    id: 'S2',
    titleKey: 'audit_arranque_plan_s2_title',
    descKey: 'audit_arranque_plan_s2_desc',
    tags: [
      { icon: 'solar:magic-stick-3-outline', labelKey: 'audit_arranque_plan_s2_tag1', variant: 'linda' },
      { icon: 'solar:check-circle-outline', labelKey: 'audit_arranque_plan_s2_tag2', variant: 'manual' },
    ],
  },
  {
    id: 'S3',
    titleKey: 'audit_arranque_plan_s3_title',
    descKey: 'audit_arranque_plan_s3_desc',
    tags: [
      { icon: 'solar:magic-stick-3-outline', labelKey: 'audit_arranque_plan_s3_tag1', variant: 'linda' },
      { icon: 'solar:videocamera-record-outline', labelKey: 'audit_arranque_plan_s3_tag2', variant: 'manual' },
    ],
  },
  {
    id: 'S4',
    titleKey: 'audit_arranque_plan_s4_title',
    descKey: 'audit_arranque_plan_s4_desc',
    tags: [
      { icon: 'solar:magic-stick-3-outline', labelKey: 'audit_arranque_plan_s4_tag1', variant: 'linda' },
      { icon: 'solar:chart-2-outline', labelKey: 'audit_arranque_plan_s4_tag2', variant: 'manual' },
    ],
  },
];

export function StartupPlan() {
  const { t } = useTranslation('audit');

  return (
    <div>
      {/* Timeline */}
      <div className="relative flex flex-col gap-0">
        {/* Vertical line */}
        <div className="absolute" style={{ left: 23, top: 0, bottom: 0, width: 2, backgroundColor: '#E2E8F0' }} aria-hidden="true" />

        {WEEKS.map((week, i) => (
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
                {t(week.titleKey)}
              </div>
              <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5 }}>
                {t(week.descKey)}
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
                    <Icon icon={tag.icon} width={12} height={12} />
                    {t(tag.labelKey)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promise card */}
    </div>
  );
}
