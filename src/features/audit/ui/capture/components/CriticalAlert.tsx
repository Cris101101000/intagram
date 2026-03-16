'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface CriticalAlertProps {
  count: number;
}

export function CriticalAlert({ count }: CriticalAlertProps) {
  const { t } = useTranslation('audit');

  return (
    <div
      className="mb-6 flex w-full items-center gap-3 rounded-[14px] border border-gray-200 bg-white shadow-sm"
      style={{ padding: '12px 18px' }}
    >
      {/* Warning icon */}
      <div
        className="flex shrink-0 items-center justify-center rounded-[10px]"
        style={{ width: 36, height: 36, backgroundColor: 'rgba(248,113,113,0.08)' }}
        aria-hidden="true"
      >
        <Icon icon="solar:danger-triangle-outline" width={18} height={18} color="#F87171" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-inter text-base-oscura" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>
          {t('audit_capture_critical_title', { count: String(count) })}
        </p>
        <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5 }}>
          {t('audit_capture_critical_subtitle')}
        </p>
      </div>

      {/* Mini CTA */}
      <div className="flex shrink-0 items-center gap-1 text-primary-500" style={{ fontSize: 11, fontWeight: 600 }}>
        <Icon icon="solar:lock-keyhole-outline" width={12} height={12} />
        <span>{t('audit_capture_critical_cta')}</span>
      </div>
    </div>
  );
}
