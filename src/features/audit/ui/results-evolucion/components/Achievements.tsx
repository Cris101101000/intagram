'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/features/audit/application/use-cases/get-evolution';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface AchievementsProps {
  achievements: Achievement[];
}

const CELEBRATION_ICONS = ['\uD83C\uDF89', '\uD83D\uDE80', '\u2B50'];

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      className="relative overflow-hidden rounded-2xl p-bewe-5 bg-white shadow-sm"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-semantic-success/30 via-secondary-300/20 to-primary-300/20 pointer-events-none" />

      {/* Subtle confetti decoration */}
      <div className="absolute top-2 right-3 opacity-20 text-2xl select-none pointer-events-none">
        {CELEBRATION_ICONS[index % CELEBRATION_ICONS.length]}
      </div>

      <div className="relative flex flex-col gap-bewe-2">
        {/* Icon */}
        <span className="text-3xl" role="img" aria-label="celebration">
          {CELEBRATION_ICONS[index % CELEBRATION_ICONS.length]}
        </span>

        {/* Title */}
        <h4 className="text-h3 font-inter font-semibold text-base-oscura">
          {achievement.title}
        </h4>

        {/* Improvement badge */}
        <span className="inline-flex items-center self-start px-bewe-2 py-1 rounded-full bg-semantic-success/10 text-semantic-success text-small font-inter font-semibold">
          +{achievement.improvement}%
        </span>

        {/* Description connected to Linda IA */}
        <p className="text-body font-inter text-base-superficie leading-relaxed">
          {achievement.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Achievements({ achievements }: AchievementsProps) {
  const { t } = useTranslation('audit');

  if (achievements.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="flex flex-col gap-bewe-4 py-bewe-5"
    >
      <h3 className="text-h3 font-inter font-semibold text-base-oscura">
        Tus Logros
      </h3>

      <p className="text-body font-inter text-base-superficie">
        Estos son los avances más importantes desde tu última auditoría.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-bewe-4">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.metricName}
            achievement={achievement}
            index={index}
          />
        ))}
      </div>
    </motion.section>
  );
}
