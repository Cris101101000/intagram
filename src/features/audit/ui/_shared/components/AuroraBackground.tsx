'use client';

interface AuroraBackgroundProps {
  variant?: 'default' | 'warm';
  children: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

export function AuroraBackground({ variant = 'default', children, containerRef }: AuroraBackgroundProps) {
  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: '#F8FBFF' }}
    >
      {/* Aurora layers — fixed, behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="aurora-layer aurora-layer--1" />
        <div className="aurora-layer aurora-layer--2" />
        <div className={`aurora-layer ${variant === 'warm' ? 'aurora-layer--3-warm' : 'aurora-layer--3'}`} />
      </div>

      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}
