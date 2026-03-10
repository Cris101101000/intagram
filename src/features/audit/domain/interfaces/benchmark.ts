export type Sector =
  | 'Belleza'
  | 'Moda'
  | 'Fitness'
  | 'Gastronomia'
  | 'Tecnologia'
  | 'Viajes'
  | 'Educacion'
  | 'Entretenimiento'
  | 'Negocios'
  | 'Salud';

export interface SectorBenchmark {
  engagementRate: number;
  commentRate: number;
  reelsViewRate: number;
}
