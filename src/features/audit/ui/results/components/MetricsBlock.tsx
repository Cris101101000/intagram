'use client';

import { Card, CardBody, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { AuditMetrics, NormalizedMetrics } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface Benchmark {
  engagementRate: number;
  commentRate: number;
  reelsViewRate: number;
}

interface MetricsBlockProps {
  metrics: AuditMetrics;
  normalizedMetrics: NormalizedMetrics;
  sector: string;
  benchmarks: Benchmark;
}

interface MetricCardData {
  key: string;
  label: string;
  value: number;
  benchmark: number;
  normalized: number;
  unit: string;
  hasData: boolean;
  icon: string;
}

function getMetricLevel(normalized: number): { label: string; color: string } {
  if (normalized < 40) return { label: 'Bajo', color: '#F87171' };
  if (normalized < 70) return { label: 'Medio', color: '#FBBF24' };
  return { label: 'Alto', color: '#4ADE80' };
}

export function MetricsBlock({ metrics, normalizedMetrics, sector, benchmarks }: MetricsBlockProps) {
  const { t } = useTranslation('audit');

  const metricCards: MetricCardData[] = [
    {
      key: 'er',
      label: 'Engagement Rate',
      value: metrics.engagementRate,
      benchmark: benchmarks.engagementRate,
      normalized: normalizedMetrics.erNormalized,
      unit: '%',
      hasData: true,
      icon: 'solar:heart-outline',
    },
    {
      key: 'cr',
      label: 'Comment Rate',
      value: metrics.commentRate,
      benchmark: benchmarks.commentRate,
      normalized: normalizedMetrics.crNormalized,
      unit: '%',
      hasData: true,
      icon: 'solar:chat-round-dots-outline',
    },
    {
      key: 'rvr',
      label: 'Reels View Rate',
      value: metrics.reelsViewRate,
      benchmark: benchmarks.reelsViewRate,
      normalized: normalizedMetrics.rvrNormalized,
      unit: '%',
      hasData: metrics.hasReels,
      icon: 'solar:videocamera-record-outline',
    },
  ];

  return (
    <section className="flex flex-col gap-bewe-4">
      <h3 className="text-h3 font-inter text-base-oscura">
        M&eacute;tricas clave
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-bewe-4">
        {metricCards.map((metric) => {
          const level = getMetricLevel(metric.normalized);
          const progressValue = metric.benchmark > 0
            ? Math.min((metric.value / metric.benchmark) * 100, 150)
            : 0;

          return (
            <Card key={metric.key} className="border border-primary-100">
              <CardBody className="flex flex-col gap-bewe-3 p-bewe-5">
                {/* Header */}
                <div className="flex items-center gap-bewe-2">
                  <Icon
                    icon={metric.icon}
                    className="text-primary-400"
                    width={20}
                    height={20}
                  />
                  <span className="text-small font-inter font-semibold text-base-oscura">
                    {metric.label}
                  </span>
                </div>

                {metric.hasData ? (
                  <>
                    {/* Value */}
                    <div className="flex items-baseline gap-bewe-2">
                      <span className="text-h1 font-inter font-bold text-base-oscura">
                        {metric.value.toFixed(1)}
                      </span>
                      <span className="text-body font-inter text-base-oscura/60">
                        {metric.unit}
                      </span>
                    </div>

                    {/* Progress bar with benchmark reference */}
                    <div className="relative">
                      <Progress
                        aria-label={`${metric.label} progress`}
                        value={Math.min(progressValue, 100)}
                        className="w-full"
                        classNames={{
                          indicator: 'rounded-full',
                          track: 'rounded-full bg-primary-100',
                        }}
                        style={{
                          // @ts-expect-error CSS custom property
                          '--heroui-progress-indicator-bg': level.color,
                        }}
                        size="md"
                      />
                      {/* Benchmark reference line */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-base-oscura/30"
                        style={{ left: `${Math.min((100 / Math.max(progressValue, 100)) * 100, 100)}%` }}
                      />
                    </div>

                    {/* Benchmark label */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-small font-inter font-semibold"
                        style={{ color: level.color }}
                      >
                        {level.label}
                      </span>
                      <span className="text-small font-inter text-base-oscura/50">
                        Benchmark: {metric.benchmark.toFixed(1)}{metric.unit}
                      </span>
                    </div>
                  </>
                ) : (
                  /* No data state for RVR */
                  <div className="flex flex-col items-center justify-center gap-bewe-2 py-bewe-5">
                    <Icon
                      icon="solar:videocamera-record-outline"
                      className="text-base-oscura/30"
                      width={32}
                      height={32}
                    />
                    <span className="text-body font-inter text-base-oscura/50 text-center">
                      Sin datos de video
                    </span>
                    <span className="text-small font-inter text-base-oscura/40 text-center">
                      No se detectaron Reels en el per&iacute;odo analizado
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
