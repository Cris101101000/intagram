'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface MetricEducationCard {
  nameKey: string;
  whatKey: string;
  whyKey: string;
  lindaKey: string;
  icon: string;
  accentColor: string;
  borderColor: string;
}

const METRIC_CARDS: MetricEducationCard[] = [
  {
    nameKey: 'audit_arranque_growth_er_name',
    whatKey: 'audit_arranque_growth_er_what',
    whyKey: 'audit_arranque_growth_er_why',
    lindaKey: 'audit_arranque_growth_er_linda',
    icon: 'solar:heart-outline',
    accentColor: '#F87171',
    borderColor: 'border-l-[#F87171]',
  },
  {
    nameKey: 'audit_arranque_growth_cr_name',
    whatKey: 'audit_arranque_growth_cr_what',
    whyKey: 'audit_arranque_growth_cr_why',
    lindaKey: 'audit_arranque_growth_cr_linda',
    icon: 'solar:chat-round-dots-outline',
    accentColor: '#60A5FA',
    borderColor: 'border-l-[#60A5FA]',
  },
  {
    nameKey: 'audit_arranque_growth_rvr_name',
    whatKey: 'audit_arranque_growth_rvr_what',
    whyKey: 'audit_arranque_growth_rvr_why',
    lindaKey: 'audit_arranque_growth_rvr_linda',
    icon: 'solar:videocamera-record-outline',
    accentColor: '#34D399',
    borderColor: 'border-l-[#34D399]',
  },
];

export function GrowthMetrics() {
  const { t } = useTranslation('audit');

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="flex flex-col gap-bewe-5"
    >
      {/* Section title */}
      <h2 className="text-h2 font-merriweather text-base-oscura">
        {t('audit_arranque_growth_title')}
      </h2>

      {/* Metric education cards */}
      <div className="flex flex-col gap-bewe-4">
        {METRIC_CARDS.map((metric, index) => (
          <motion.div
            key={metric.nameKey}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
          >
            <Card className={`border border-primary-100 border-l-4 ${metric.borderColor} shadow-sm`}>
              <CardBody className="flex flex-col gap-bewe-4 p-bewe-5">
                {/* Card header */}
                <div className="flex items-center gap-bewe-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: `${metric.accentColor}15` }}
                  >
                    <Icon
                      icon={metric.icon}
                      style={{ color: metric.accentColor }}
                      width={22}
                      height={22}
                    />
                  </div>
                  <h3 className="text-h3 font-inter text-base-oscura">
                    {t(metric.nameKey)}
                  </h3>
                </div>

                {/* What it measures */}
                <div className="flex flex-col gap-bewe-1">
                  <span className="text-small font-inter font-semibold text-base-oscura/70 uppercase tracking-wide">
                    Qu&eacute; mide
                  </span>
                  <p className="text-body font-inter text-base-oscura/80">
                    {t(metric.whatKey)}
                  </p>
                </div>

                {/* Why it matters */}
                <div className="flex flex-col gap-bewe-1">
                  <span className="text-small font-inter font-semibold text-base-oscura/70 uppercase tracking-wide">
                    Por qu&eacute; importa
                  </span>
                  <p className="text-body font-inter text-base-oscura/80">
                    {t(metric.whyKey)}
                  </p>
                </div>

                {/* How Linda helps */}
                <div className="flex items-start gap-bewe-2 bg-linda/40 rounded-xl p-bewe-3">
                  <Icon
                    icon="solar:magic-stick-3-outline"
                    className="text-base-oscura/60 flex-shrink-0 mt-0.5"
                    width={18}
                    height={18}
                  />
                  <p className="text-small font-inter text-base-oscura/70">
                    {t(metric.lindaKey)}
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
