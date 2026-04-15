'use client';

import { Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import type { InstagramProfile, HealthSignals } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface ProfileStatusProps {
  profile: InstagramProfile;
  healthSignals: HealthSignals;
}

export function ProfileStatus({ profile, healthSignals }: ProfileStatusProps) {
  const { t } = useTranslation('audit');

  const daysSinceLastPost = healthSignals.recency.daysSinceLastPost;
  const hasFormatMix = Object.keys(healthSignals.formatMix.distribution).length > 0;

  const stats = [
    {
      icon: 'solar:users-group-rounded-outline',
      label: t('audit_arranque_profile_followers'),
      value: profile.followersCount.toLocaleString(),
    },
    {
      icon: 'solar:gallery-minimalistic-outline',
      label: t('audit_arranque_profile_posts'),
      value: profile.postsCount.toString(),
    },
    {
      icon: 'solar:calendar-outline',
      label: profile.postsCount > 0
        ? t('audit_arranque_profile_last_post', `Último post hace ${daysSinceLastPost} días`).replace('{{days}}', String(daysSinceLastPost))
        : t('audit_arranque_profile_no_posts'),
      value: profile.postsCount > 0 ? `${daysSinceLastPost}d` : '—',
    },
  ];

  // Add format mix if data is available
  if (hasFormatMix) {
    const formats = Object.entries(healthSignals.formatMix.distribution)
      .map(([format, count]) => `${format}: ${count}`)
      .join(', ');
    stats.push({
      icon: 'solar:slider-vertical-outline',
      label: t('audit_arranque_profile_format_mix'),
      value: formats,
    });
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-bewe-4"
    >
      {/* Section title */}
      <h2 className="text-h2 font-merriweather text-base-oscura">
        {t('audit_arranque_profile_title')}
      </h2>

      {/* Badge */}
      <Chip
        size="lg"
        classNames={{
          base: 'bg-base-teal/20 px-bewe-4 py-bewe-2',
          content: 'font-inter font-semibold text-base-superficie text-small',
        }}
      >
        {t('audit_arranque_profile_badge')}
      </Chip>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-bewe-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-primary-100 shadow-sm">
            <CardBody className="flex flex-row items-center gap-bewe-3 p-bewe-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-base-teal/10">
                <Icon
                  icon={stat.icon}
                  className="text-base-teal"
                  width={22}
                  height={22}
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-small font-inter text-base-oscura/60">
                  {stat.label}
                </span>
                <span className="text-body font-inter font-semibold text-base-oscura">
                  {stat.value}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Encouraging explanation */}
      <Card className="border border-secondary-200 bg-secondary-100/30">
        <CardBody className="flex flex-row items-start gap-bewe-3 p-bewe-5">
          <Icon
            icon="solar:lightbulb-bolt-outline"
            className="text-secondary-600 flex-shrink-0 mt-0.5"
            width={24}
            height={24}
          />
          <p className="text-body font-inter text-base-oscura/80 leading-relaxed">
            {t('audit_arranque_profile_explanation')}
          </p>
        </CardBody>
      </Card>
    </motion.section>
  );
}
