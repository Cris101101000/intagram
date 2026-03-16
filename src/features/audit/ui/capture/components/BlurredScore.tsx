'use client';

import { AuditRoute } from '@/features/audit/domain/interfaces/audit';

interface BlurredScoreProps {
  score: number;
  route: AuditRoute;
}

export function BlurredScore({ score, route }: BlurredScoreProps) {
  const isArranque = route === AuditRoute.ARRANQUE;
  const displayValue = isArranque ? '—' : String(score);

  const circumference = 2 * Math.PI * 65;
  // Show ~75% filled ring
  const offset = circumference * 0.25;

  return (
    <div className="relative mb-4" style={{ width: 150, height: 150 }}>
      {/* SVG Ring */}
      <svg
        viewBox="0 0 150 150"
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)', filter: 'blur(3px)' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="capture-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <circle cx="75" cy="75" r="65" fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx="75" cy="75" r="65" fill="none"
          stroke="url(#capture-ring-grad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Score text (blurred) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
        style={{ filter: 'blur(4px)' }}
      >
        <span
          className="font-inter text-base-oscura"
          style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          {displayValue}
        </span>
        <span
          className="font-inter text-gray-400"
          style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}
        >
          Score
        </span>
      </div>

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'capture-shimmer 2.5s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
