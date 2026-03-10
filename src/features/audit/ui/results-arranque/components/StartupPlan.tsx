'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface WeekPlan {
  numberKey: string;
  objectiveKey: string;
  actionKeys: string[];
  icon: string;
  accentColor: string;
}

const WEEKS: WeekPlan[] = [
  {
    numberKey: 'audit_arranque_plan_week1_number',
    objectiveKey: 'audit_arranque_plan_week1_objective',
    actionKeys: [
      'audit_arranque_plan_week1_action1',
      'audit_arranque_plan_week1_action2',
      'audit_arranque_plan_week1_action3',
    ],
    icon: 'solar:rocket-2-outline',
    accentColor: '#60A5FA',
  },
  {
    numberKey: 'audit_arranque_plan_week2_number',
    objectiveKey: 'audit_arranque_plan_week2_objective',
    actionKeys: [
      'audit_arranque_plan_week2_action1',
      'audit_arranque_plan_week2_action2',
      'audit_arranque_plan_week2_action3',
    ],
    icon: 'solar:calendar-mark-outline',
    accentColor: '#34D399',
  },
  {
    numberKey: 'audit_arranque_plan_week3_number',
    objectiveKey: 'audit_arranque_plan_week3_objective',
    actionKeys: [
      'audit_arranque_plan_week3_action1',
      'audit_arranque_plan_week3_action2',
      'audit_arranque_plan_week3_action3',
    ],
    icon: 'solar:chart-2-outline',
    accentColor: '#FBBF24',
  },
  {
    numberKey: 'audit_arranque_plan_week4_number',
    objectiveKey: 'audit_arranque_plan_week4_objective',
    actionKeys: [
      'audit_arranque_plan_week4_action1',
      'audit_arranque_plan_week4_action2',
      'audit_arranque_plan_week4_action3',
    ],
    icon: 'solar:verified-check-outline',
    accentColor: '#75C9C8',
  },
];

export function StartupPlan() {
  const { t } = useTranslation('audit');

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col gap-bewe-5"
    >
      {/* Section title */}
      <h2 className="text-h2 font-merriweather text-base-oscura">
        {t('audit_arranque_plan_title')}
      </h2>

      {/* Timeline */}
      <div className="relative flex flex-col gap-bewe-4">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-base-teal/20 hidden sm:block" />

        {WEEKS.map((week, index) => (
          <motion.div
            key={week.numberKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            className="relative"
          >
            <Card className="border border-primary-100 shadow-sm overflow-visible">
              <CardBody className="flex flex-col sm:flex-row gap-bewe-4 p-bewe-5">
                {/* Step indicator */}
                <div className="flex flex-row sm:flex-col items-center gap-bewe-2 sm:min-w-[80px]">
                  <div
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-white"
                    style={{ backgroundColor: week.accentColor }}
                  >
                    <Icon icon={week.icon} width={20} height={20} />
                  </div>
                  <span className="text-small font-inter font-semibold text-base-oscura/50">
                    {t(week.numberKey)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-bewe-3 flex-1">
                  {/* Objective */}
                  <h3 className="text-h3 font-inter text-base-oscura">
                    {t(week.objectiveKey)}
                  </h3>

                  {/* Actions */}
                  <ul className="flex flex-col gap-bewe-2">
                    {week.actionKeys.map((actionKey) => (
                      <li
                        key={actionKey}
                        className="flex items-start gap-bewe-2"
                      >
                        <Icon
                          icon="solar:check-circle-outline"
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: week.accentColor }}
                          width={18}
                          height={18}
                        />
                        <span className="text-body font-inter text-base-oscura/80">
                          {t(actionKey)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
