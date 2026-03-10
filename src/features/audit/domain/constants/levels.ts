import { ScoreLevel } from '../interfaces/audit';

export interface ScoreLevelConfig {
  level: ScoreLevel;
  min: number;
  max: number;
  color: string;
  message: string;
  planFocus: string;
}

export const SCORE_LEVELS: ScoreLevelConfig[] = [
  {
    level: ScoreLevel.CRITICO,
    min: 0,
    max: 40,
    color: '#F87171',
    message: 'Tu perfil necesita atención urgente. Estás por debajo del promedio del sector en las métricas clave.',
    planFocus: 'Construye la base',
  },
  {
    level: ScoreLevel.REGULAR,
    min: 41,
    max: 60,
    color: '#FBBF24',
    message: 'Tu perfil tiene potencial pero hay puntos débiles claros que frenan tu crecimiento.',
    planFocus: 'Dale estructura a lo que ya tienes',
  },
  {
    level: ScoreLevel.BUENO,
    min: 61,
    max: 80,
    color: '#38BDF8',
    message: 'Tu perfil tiene buen desempeño. Con ajustes específicos puedes llegar al siguiente nivel.',
    planFocus: 'Optimiza y escala',
  },
  {
    level: ScoreLevel.EXCELENTE,
    min: 81,
    max: 100,
    color: '#4ADE80',
    message: 'Tu perfil está por encima del promedio del sector. Sigue así y escala lo que funciona.',
    planFocus: 'Mantén el liderazgo y diversifica',
  },
];

export function getScoreLevel(score: number): ScoreLevelConfig {
  const level = SCORE_LEVELS.find((l) => score >= l.min && score <= l.max);
  return level ?? SCORE_LEVELS[0];
}
