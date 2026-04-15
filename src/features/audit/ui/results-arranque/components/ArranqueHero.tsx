'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';

interface ArranqueHeroProps {
  username: string;
  followersCount: number;
  postsCount: number;
  daysSinceLastPost: number;
  reelsCount: number;
  isPaused: boolean;
  profilePicUrl?: string;
}

const CHIPS: { icon: string; key: string; valueKey: string }[] = [
  { icon: 'solar:users-group-rounded-outline', key: 'followers', valueKey: 'followersCount' },
  { icon: 'solar:gallery-minimalistic-outline', key: 'posts', valueKey: 'postsCount' },
  { icon: 'solar:calendar-outline', key: 'lastPost', valueKey: 'daysSinceLastPost' },
  { icon: 'solar:videocamera-record-outline', key: 'reels', valueKey: 'reelsCount' },
];

export function ArranqueHero({ username, followersCount, postsCount, daysSinceLastPost, reelsCount, isPaused, profilePicUrl }: ArranqueHeroProps) {
  const { t } = useTranslation('audit');
  const proxiedPic = proxyImageUrl(profilePicUrl);

  const chipData = [
    { icon: 'solar:users-group-rounded-outline', value: String(followersCount), label: t('audit_arranque_hero_followers'), accent: '#60A5FA', accentBg: 'rgba(96,165,250,0.08)' },
    { icon: 'solar:gallery-minimalistic-outline', value: String(postsCount), label: t('audit_arranque_hero_posts'), accent: '#34D399', accentBg: 'rgba(52,211,153,0.08)' },
    { icon: 'solar:calendar-outline', value: `${daysSinceLastPost} ${t('audit_arranque_hero_days')}`, label: t('audit_arranque_hero_last_post'), accent: '#FBBF24', accentBg: 'rgba(251,191,36,0.08)' },
    { icon: 'solar:videocamera-record-outline', value: String(reelsCount), label: 'Reels', accent: '#F87171', accentBg: 'rgba(248,113,113,0.08)' },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      {proxiedPic ? (
        <div className="reveal mb-4">
          <img
            src={proxiedPic}
            alt={`Foto de perfil de @${username} en Instagram`}
            loading="lazy"
            className="rounded-full object-cover"
            style={{ width: 80, height: 80, border: '3px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          />
        </div>
      ) : (
        <div
          className="reveal mb-4 flex items-center justify-center rounded-full"
          style={{
            width: 80, height: 80,
            background: 'linear-gradient(135deg, #B0D2FC, #9AE9CC)',
          }}
        >
          <Icon icon="solar:user-circle-outline" width={40} height={40} color="#0A2540" />
        </div>
      )}

      {/* Username */}
      <div className="reveal mb-3 font-inter text-gray-500" style={{ fontSize: 16, fontWeight: 600 }}>
        @{username}
      </div>

      {/* Badge pill */}
      <div
        className="reveal mb-6 inline-flex items-center gap-1.5 rounded-full font-inter"
        style={{ fontSize: 14, fontWeight: 600, padding: '8px 20px', backgroundColor: 'rgba(251,191,36,0.12)', color: '#D97706' }}
      >
        <Icon icon="solar:leaf-outline" width={16} height={16} />
        {t(isPaused ? 'audit_arranque_hero_badge_paused' : 'audit_arranque_hero_badge_new')}
      </div>

      {/* Title */}
      <h1
        className="reveal font-inter text-base-oscura"
        style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 560 }}
      >
        {t(isPaused ? 'audit_arranque_hero_title_paused' : 'audit_arranque_hero_title_new')}
      </h1>

      {/* Subtitle */}
      <p className="reveal font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 520, marginBottom: 40 }}>
        {t(isPaused ? 'audit_arranque_hero_subtitle_paused' : 'audit_arranque_hero_subtitle_new')}
      </p>

      {/* Profile data chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full" style={{ maxWidth: 560 }}>
        {chipData.map((chip, i) => (
          <div
            key={i}
            className="reveal flex flex-col items-center gap-1.5 rounded-[16px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ padding: '16px 12px', boxShadow: '0 1px 3px rgba(10,37,64,0.04)' }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36, backgroundColor: chip.accentBg }}
            >
              <Icon icon={chip.icon} width={18} height={18} color={chip.accent} />
            </div>
            <span className="font-inter text-base-oscura" style={{ fontSize: 16, fontWeight: 700 }}>
              {chip.value}
            </span>
            <span className="font-inter text-gray-400" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {chip.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
