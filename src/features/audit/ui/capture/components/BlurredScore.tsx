'use client';

import { AuditRoute } from '@/features/audit/domain/interfaces/audit';

interface BlurredScoreProps {
  score: number;
  route: AuditRoute;
}

export function BlurredScore({ score, route }: BlurredScoreProps) {
  const isArranque = route === AuditRoute.ARRANQUE;

  return (
    <div className="flex flex-col items-center">
      <p className="text-h3 font-inter font-semibold text-base-oscura mb-bewe-2">
        {isArranque ? 'Tu Plan de Crecimiento' : 'Tu score de Instagram'}
      </p>
      <div className="relative">
        <span
          className="font-merriweather font-bold text-base-oscura select-none"
          style={{ fontSize: '96px', lineHeight: 1.1, filter: 'blur(10px)' }}
        >
          {isArranque ? '★★★' : score}
        </span>
      </div>
    </div>
  );
}
