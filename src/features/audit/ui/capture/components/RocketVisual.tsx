'use client';

const ORBIT_EMOJIS = [
  { emoji: '💡', delay: 0 },
  { emoji: '⭐', delay: 4.67 },
  { emoji: '📊', delay: 9.33 },
];

export function RocketVisual() {
  return (
    <div className="relative mb-4" style={{ width: 200, height: 200 }}>
      {/* Orbit ring — dashed circle */}
      <div
        className="absolute rounded-full"
        style={{
          inset: 10,
          border: '1.5px dashed rgba(160,174,192,0.35)',
        }}
        aria-hidden="true"
      />

      {/* Orbiting emojis */}
      {ORBIT_EMOJIS.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: 32,
            height: 32,
            top: '50%',
            left: '50%',
            marginTop: -16,
            marginLeft: -16,
            animation: `capture-orbit 14s linear infinite`,
            animationDelay: `${-item.delay}s`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              lineHeight: 1,
              display: 'block',
              animation: `capture-counter-orbit 14s linear infinite`,
              animationDelay: `${-item.delay}s`,
            }}
          >
            {item.emoji}
          </span>
        </div>
      ))}

      {/* Center rocket — floating */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: 'capture-float 3s ease-in-out infinite' }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>🚀</span>
      </div>
    </div>
  );
}
