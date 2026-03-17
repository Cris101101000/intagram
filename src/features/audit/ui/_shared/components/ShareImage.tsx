'use client';

import { forwardRef } from 'react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShareImageProps {
  username: string;
  score: number;
  level: ScoreLevel;
  sector: string;
  percentile: number;
}

// ---------------------------------------------------------------------------
// Level config for the share image
// ---------------------------------------------------------------------------

interface LevelVisual {
  emoji: string;
  nombreDisplay: string;
  copyInicio: string;
  posicionLabel: string;
  fraseCompartir: string;
  gradient: string;
  gradientRing: string;
  accentColor: string;
  accentBg: string;
  mostrarTopSector: boolean;
  topEmoji: string;
}

const LEVEL_VISUALS: Record<ScoreLevel, LevelVisual> = {
  [ScoreLevel.CRITICO]: {
    emoji: '🌱',
    nombreDisplay: 'Potencial',
    copyInicio: 'Mi perfil tiene',
    posicionLabel: 'nivel 1 de 4',
    fraseCompartir: 'Con mucho potencial de crecer este año',
    gradient: 'linear-gradient(180deg, #EEF6FF 0%, #BFDBFE 100%)',
    gradientRing: 'linear-gradient(135deg, #60A5FA, #3B82F6, #60A5FA)',
    accentColor: '#3B82F6',
    accentBg: 'rgba(96,165,250,0.12)',
    mostrarTopSector: false,
    topEmoji: '📊',
  },
  [ScoreLevel.REGULAR]: {
    emoji: '💪',
    nombreDisplay: 'En Camino',
    copyInicio: 'Mi perfil va',
    posicionLabel: 'nivel 2 de 4',
    fraseCompartir: 'Con mucho potencial de crecer este año',
    gradient: 'linear-gradient(180deg, #F0FDF9 0%, #A7F3D0 100%)',
    gradientRing: 'linear-gradient(135deg, #34D399, #10B981, #34D399)',
    accentColor: '#10B981',
    accentBg: 'rgba(52,211,153,0.12)',
    mostrarTopSector: false,
    topEmoji: '📊',
  },
  [ScoreLevel.BUENO]: {
    emoji: '⭐',
    nombreDisplay: 'Destacado',
    copyInicio: 'Mi perfil está',
    posicionLabel: 'nivel 3 de 4',
    fraseCompartir: 'Estoy entre los mejores perfiles de mi sector',
    gradient: 'linear-gradient(180deg, #EEF6FF 0%, #93C5FD 100%)',
    gradientRing: 'linear-gradient(135deg, #60A5FA, #2563EB, #60A5FA)',
    accentColor: '#2563EB',
    accentBg: 'rgba(96,165,250,0.12)',
    mostrarTopSector: true,
    topEmoji: '🏆',
  },
  [ScoreLevel.EXCELENTE]: {
    emoji: '🚀',
    nombreDisplay: 'Imparable',
    copyInicio: 'Mi perfil es',
    posicionLabel: 'nivel 4 de 4 🏆',
    fraseCompartir: 'Estoy en el top de perfiles de mi sector',
    gradient: 'linear-gradient(180deg, #CCFBF1 0%, #5EEAD4 100%)',
    gradientRing: 'linear-gradient(135deg, #34D399, #0D9488, #34D399)',
    accentColor: '#0D9488',
    accentBg: 'rgba(52,211,153,0.12)',
    mostrarTopSector: true,
    topEmoji: '🏆',
  },
};

const SECTOR_EMOJIS: Record<string, string> = {
  belleza: '💅',
  fitness: '🏋️',
  bienestar: '🧘',
  salud: '🏥',
  general: '📱',
};

// ---------------------------------------------------------------------------
// Shared inline styles (no Tailwind — html2canvas works better with inline)
// ---------------------------------------------------------------------------

const S = {
  container: (gradient: string): React.CSSProperties => ({
    width: 1080,
    height: 1920,
    background: gradient,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  }),
  // Decorative orbs
  orb1: (color: string): React.CSSProperties => ({
    position: 'absolute',
    top: -120,
    right: -120,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
  }),
  orb2: (color: string): React.CSSProperties => ({
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
  }),
  header: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'rgba(10,37,64,0.5)',
    marginBottom: 48,
  },
  usernamePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 36px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(12px)',
    border: '2px solid rgba(255,255,255,0.8)',
    fontSize: 32,
    fontWeight: 600,
    color: '#0A2540',
    marginBottom: 56,
  },
  emojiRingOuter: (gradient: string): React.CSSProperties => ({
    width: 192,
    height: 192,
    borderRadius: '50%',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  }),
  emojiRingInner: (bg: string): React.CSSProperties => ({
    width: 172,
    height: 172,
    borderRadius: '50%',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 80,
  }),
  copyInicio: {
    fontSize: 32,
    fontWeight: 400,
    color: 'rgba(10,37,64,0.6)',
    marginBottom: 8,
  },
  nombreDisplay: {
    fontSize: 72,
    fontWeight: 700,
    fontFamily: "'Merriweather', serif",
    fontStyle: 'italic' as const,
    color: '#0A2540',
    marginBottom: 12,
  },
  posicionLabel: {
    fontSize: 26,
    fontWeight: 500,
    color: 'rgba(10,37,64,0.4)',
    marginBottom: 56,
  },
  metricsCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    width: 720,
    padding: '36px 44px',
    borderRadius: 32,
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(16px)',
    border: '2px solid rgba(255,255,255,0.8)',
    marginBottom: 36,
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 30,
    fontWeight: 500,
    color: '#0A2540',
  },
  metricLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    fontSize: 30,
    fontWeight: 500,
    color: 'rgba(10,37,64,0.7)',
  },
  metricValue: (color: string): React.CSSProperties => ({
    fontSize: 34,
    fontWeight: 700,
    color,
  }),
  fraseCard: {
    width: 720,
    padding: '32px 44px',
    borderRadius: 28,
    background: 'rgba(255,255,255,0.4)',
    border: '2px solid rgba(255,255,255,0.6)',
    textAlign: 'center' as const,
    fontSize: 30,
    fontWeight: 500,
    fontStyle: 'italic' as const,
    color: 'rgba(10,37,64,0.7)',
    lineHeight: 1.5,
    marginBottom: 56,
  },
  ctaText: {
    fontSize: 30,
    fontWeight: 400,
    color: 'rgba(10,37,64,0.5)',
    marginBottom: 8,
  },
  ctaUrl: {
    fontSize: 34,
    fontWeight: 600,
    color: '#0A2540',
  },
};

// ---------------------------------------------------------------------------
// Component (rendered off-screen for html2canvas capture)
// ---------------------------------------------------------------------------

export const ShareImage = forwardRef<HTMLDivElement, ShareImageProps>(
  function ShareImage({ username, score, level, sector, percentile }, ref) {
    const v = LEVEL_VISUALS[level];
    const sectorEmoji = SECTOR_EMOJIS[sector] ?? '📱';
    const topText = `Top ${percentile}%`;

    return (
      <div ref={ref} style={S.container(v.gradient)}>
        {/* Decorative orbs */}
        <div style={S.orb1(v.accentColor)} />
        <div style={S.orb2(v.accentColor)} />

        {/* Header */}
        <div style={S.header}>Auditoría Instagram ✨</div>

        {/* Username pill */}
        <div style={S.usernamePill}>
          <span>{sectorEmoji}</span>
          <span>@{username}</span>
        </div>

        {/* Emoji ring (IG Stories style) */}
        <div style={S.emojiRingOuter(v.gradientRing)}>
          <div style={S.emojiRingInner('rgba(255,255,255,0.85)')}>
            {v.emoji}
          </div>
        </div>

        {/* Copy inicio */}
        <div style={S.copyInicio}>{v.copyInicio}</div>

        {/* Nombre display */}
        <div style={S.nombreDisplay}>{v.nombreDisplay}</div>

        {/* Posicion label */}
        <div style={S.posicionLabel}>{v.posicionLabel}</div>

        {/* Metrics card */}
        <div style={S.metricsCard}>
          <div style={S.metricRow}>
            <span style={S.metricLabel}>⚡ Mi score</span>
            <span style={S.metricValue(v.accentColor)}>{score}/100</span>
          </div>
          <div style={{ height: 1, background: 'rgba(10,37,64,0.06)' }} />
          <div style={S.metricRow}>
            <span style={S.metricLabel}>{v.topEmoji} Top sector</span>
            <span style={S.metricValue(v.accentColor)}>{topText}</span>
          </div>
        </div>

        {/* Frase card */}
        <div style={S.fraseCard}>
          {v.emoji} {v.fraseCompartir}
        </div>

        {/* CTA */}
        <div style={S.ctaText}>Descubre el tuyo 👇</div>
        <div style={S.ctaUrl}>igaudit.bewe.io</div>
      </div>
    );
  },
);
