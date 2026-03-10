'use client';

import { motion } from 'framer-motion';
import { AuditMetrics, HealthSignals } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface MetricsComparisonProps {
  currentMetrics: AuditMetrics;
  previousMetrics: AuditMetrics;
  currentSignals: HealthSignals;
  previousSignals?: HealthSignals;
}

interface MetricRowProps {
  label: string;
  previousValue: number;
  currentValue: number;
  suffix?: string;
  index: number;
}

function MetricRow({ label, previousValue, currentValue, suffix = '%', index }: MetricRowProps) {
  const delta = currentValue - previousValue;
  const improved = delta > 0;
  const unchanged = delta === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 * index }}
      className="flex items-center justify-between py-bewe-3 border-b border-gray-100 last:border-b-0"
    >
      <span className="text-body font-inter font-medium text-base-oscura">{label}</span>

      <div className="flex items-center gap-bewe-4">
        <span className="text-small font-inter text-gray-400 line-through">
          {previousValue.toFixed(2)}{suffix}
        </span>
        <span className="text-body font-inter font-semibold text-base-oscura">
          {currentValue.toFixed(2)}{suffix}
        </span>
        <span
          className={`text-small font-inter font-semibold min-w-[80px] text-right ${
            improved
              ? 'text-semantic-success'
              : unchanged
              ? 'text-gray-400'
              : 'text-semantic-error'
          }`}
        >
          {improved ? '+' : ''}
          {delta.toFixed(2)}{suffix}
        </span>
      </div>
    </motion.div>
  );
}

interface SignalRowProps {
  label: string;
  previousLabel: string;
  currentLabel: string;
  improved: boolean;
  index: number;
}

function SignalRow({ label, previousLabel, currentLabel, improved, index }: SignalRowProps) {
  const changed = previousLabel !== currentLabel;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 * index }}
      className="flex items-center justify-between py-bewe-3 border-b border-gray-100 last:border-b-0"
    >
      <span className="text-body font-inter font-medium text-base-oscura">{label}</span>

      <div className="flex items-center gap-bewe-4">
        {changed ? (
          <>
            <span className="text-small font-inter text-gray-400 line-through">
              {previousLabel}
            </span>
            <span
              className={`text-body font-inter font-semibold ${
                improved ? 'text-semantic-success' : 'text-semantic-error'
              }`}
            >
              {currentLabel}
            </span>
          </>
        ) : (
          <span className="text-body font-inter font-semibold text-base-oscura">
            {currentLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

const POSITIVE_LABELS: Record<string, string[]> = {
  frequency: ['Alta', 'Media'],
  recency: ['Activo'],
  trend: ['Mejorando', 'Estable'],
};

function isImproved(signal: string, prevLabel: string, currLabel: string): boolean {
  const positive = POSITIVE_LABELS[signal] ?? [];
  const prevGood = positive.includes(prevLabel);
  const currGood = positive.includes(currLabel);
  if (currGood && !prevGood) return true;
  if (!currGood && prevGood) return false;
  return currGood;
}

export function MetricsComparison({
  currentMetrics,
  previousMetrics,
  currentSignals,
  previousSignals,
}: MetricsComparisonProps) {
  const { t } = useTranslation('audit');

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col gap-bewe-4 py-bewe-5"
    >
      <h3 className="text-h3 font-inter font-semibold text-base-oscura">
        Comparativa de Métricas
      </h3>

      {/* Core Metrics */}
      <div className="bg-white rounded-2xl p-bewe-5 shadow-sm border border-gray-100">
        <MetricRow
          label={t('audit_metric_engagement_rate', 'Engagement Rate')}
          previousValue={previousMetrics.engagementRate}
          currentValue={currentMetrics.engagementRate}
          index={0}
        />
        <MetricRow
          label="Comment Rate"
          previousValue={previousMetrics.commentRate}
          currentValue={currentMetrics.commentRate}
          index={1}
        />
        <MetricRow
          label="Reels View Rate"
          previousValue={previousMetrics.reelsViewRate}
          currentValue={currentMetrics.reelsViewRate}
          index={2}
        />
      </div>

      {/* Health Signals */}
      {previousSignals && (
        <>
          <h3 className="text-h3 font-inter font-semibold text-base-oscura mt-bewe-3">
            Señales de Salud
          </h3>

          <div className="bg-white rounded-2xl p-bewe-5 shadow-sm border border-gray-100">
            <SignalRow
              label={t('audit_signal_post_frequency', 'Frecuencia')}
              previousLabel={previousSignals.frequency.label}
              currentLabel={currentSignals.frequency.label}
              improved={isImproved('frequency', previousSignals.frequency.label, currentSignals.frequency.label)}
              index={0}
            />
            <SignalRow
              label="Actividad reciente"
              previousLabel={previousSignals.recency.label}
              currentLabel={currentSignals.recency.label}
              improved={isImproved('recency', previousSignals.recency.label, currentSignals.recency.label)}
              index={1}
            />
            <SignalRow
              label="Tendencia"
              previousLabel={previousSignals.trend.label}
              currentLabel={currentSignals.trend.label}
              improved={isImproved('trend', previousSignals.trend.label, currentSignals.trend.label)}
              index={2}
            />
          </div>
        </>
      )}
    </motion.section>
  );
}
