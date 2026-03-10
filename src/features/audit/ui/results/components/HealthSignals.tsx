'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  HealthSignals as HealthSignalsType,
  FrequencyLabel,
  FormatMixLabel,
  RecencyLabel,
  ConsistencyLabel,
  TrendLabel,
} from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface HealthSignalsProps {
  healthSignals: HealthSignalsType;
}

type SignalColor = 'success' | 'warning' | 'error';

const FREQUENCY_COLORS: Record<FrequencyLabel, SignalColor> = {
  Baja: 'error',
  Media: 'warning',
  Alta: 'success',
};

const FORMAT_MIX_COLORS: Record<FormatMixLabel, SignalColor> = {
  Variado: 'success',
  'Dependiente de un formato': 'warning',
};

const RECENCY_COLORS: Record<RecencyLabel, SignalColor> = {
  Activo: 'success',
  Irregular: 'warning',
  Inactivo: 'error',
};

const CONSISTENCY_COLORS: Record<ConsistencyLabel, SignalColor> = {
  Consistente: 'success',
  Irregular: 'warning',
  'Muy irregular': 'error',
};

const TREND_COLORS: Record<TrendLabel, SignalColor> = {
  Mejorando: 'success',
  Estable: 'warning',
  Cayendo: 'error',
};

const TREND_ARROWS: Record<TrendLabel, string> = {
  Mejorando: '\u2191',
  Estable: '\u2192',
  Cayendo: '\u2193',
};

const SEMANTIC_COLOR_MAP: Record<SignalColor, string> = {
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
};

interface SignalCardProps {
  icon: string;
  label: string;
  value: string;
  statusLabel: string;
  statusColor: SignalColor;
}

function SignalCard({ icon, label, value, statusLabel, statusColor }: SignalCardProps) {
  const color = SEMANTIC_COLOR_MAP[statusColor];

  return (
    <Card className="border border-primary-100">
      <CardBody className="flex flex-row items-center gap-bewe-3 p-bewe-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon icon={icon} width={22} height={22} style={{ color }} />
        </div>

        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-small font-inter text-base-oscura/60 truncate">
            {label}
          </span>
          <span className="text-body font-inter font-semibold text-base-oscura truncate">
            {value}
          </span>
        </div>

        <span
          className="text-small font-inter font-semibold shrink-0 px-bewe-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {statusLabel}
        </span>
      </CardBody>
    </Card>
  );
}

export function HealthSignals({ healthSignals }: HealthSignalsProps) {
  const { t } = useTranslation('audit');

  const { frequency, formatMix, recency, consistency, trend } = healthSignals;

  // Build format mix display string
  const formatEntries = Object.entries(formatMix.distribution);
  const formatDisplay = formatEntries
    .map(([type, pct]) => `${type}: ${pct}%`)
    .join(', ');

  const trendChangeText = trend.changePercent >= 0
    ? `+${trend.changePercent.toFixed(1)}%`
    : `${trend.changePercent.toFixed(1)}%`;

  return (
    <section className="flex flex-col gap-bewe-4">
      <h3 className="text-h3 font-inter text-base-oscura">
        {t('audit_signal_post_frequency', 'Senales de salud')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-bewe-3">
        {/* Frequency */}
        <SignalCard
          icon="solar:calendar-outline"
          label="Frecuencia"
          value={`${frequency.value.toFixed(1)} posts/semana`}
          statusLabel={frequency.label}
          statusColor={FREQUENCY_COLORS[frequency.label]}
        />

        {/* Format Mix */}
        <SignalCard
          icon="solar:gallery-outline"
          label="Mix de formatos"
          value={formatDisplay || 'Sin datos'}
          statusLabel={formatMix.label}
          statusColor={FORMAT_MIX_COLORS[formatMix.label]}
        />

        {/* Recency */}
        <SignalCard
          icon="solar:clock-circle-outline"
          label="Recencia"
          value={`Hace ${recency.daysSinceLastPost} d\u00edas`}
          statusLabel={recency.label}
          statusColor={RECENCY_COLORS[recency.label]}
        />

        {/* Consistency */}
        <SignalCard
          icon="solar:graph-up-outline"
          label="Consistencia"
          value={`\u03c3 ${consistency.stddev.toFixed(1)}`}
          statusLabel={consistency.label}
          statusColor={CONSISTENCY_COLORS[consistency.label]}
        />

        {/* Trend */}
        <SignalCard
          icon="solar:chart-outline"
          label="Tendencia"
          value={`${TREND_ARROWS[trend.label]} ${trendChangeText}`}
          statusLabel={trend.label}
          statusColor={TREND_COLORS[trend.label]}
        />
      </div>
    </section>
  );
}
