'use client';

import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';

interface UsernamePillProps {
  username: string;
  fullName?: string;
  profilePicUrl?: string;
}

export function UsernamePill({ username, fullName, profilePicUrl }: UsernamePillProps) {
  const imgSrc = proxyImageUrl(profilePicUrl);

  return (
    <div className="mb-5 flex justify-center">
      <div
        className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white"
        style={{ padding: '12px 20px 12px 12px', boxShadow: '0 4px 20px rgba(10,37,64,0.08)' }}
      >
        {/* Avatar */}
        {imgSrc && (
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{
              width: 52,
              height: 52,
              border: '2.5px solid #34D399',
              boxShadow: '0 0 0 3px rgba(52,211,153,0.15)',
            }}
          >
            <img
              src={imgSrc}
              alt={`Foto de perfil de @${username} en Instagram`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="font-inter text-base-oscura"
              style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}
            >
              {fullName || username}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="#9CA3AF" stroke="none" />
            </svg>
          </div>
          <span
            className="font-inter text-gray-400"
            style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}
          >
            @{username}
          </span>
        </div>
      </div>
    </div>
  );
}
