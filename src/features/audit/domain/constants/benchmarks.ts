import { Sector, SectorBenchmark } from '../interfaces/benchmark';

const CATEGORY_TO_SECTOR: Record<string, Sector> = {
  'Beauty, Cosmetic & Personal Care': 'Belleza',
  'Beauty Salon': 'Belleza',
  'Hair Salon': 'Belleza',
  'Skin Care Service': 'Belleza',
  'Clothing (Brand)': 'Moda',
  'Fashion Designer': 'Moda',
  'Shopping & Retail': 'Moda',
  'Gym/Physical Fitness Center': 'Fitness',
  'Personal Trainer': 'Fitness',
  'Sports & Recreation': 'Fitness',
  'Restaurant': 'Gastronomia',
  'Food & Beverage': 'Gastronomia',
  'Cafe': 'Gastronomia',
  'Bakery': 'Gastronomia',
  'Computers & Internet Website': 'Tecnologia',
  'Software': 'Tecnologia',
  'Science, Technology & Engineering': 'Tecnologia',
  'Travel Agency': 'Viajes',
  'Hotel': 'Viajes',
  'Tour Agency': 'Viajes',
  'Education': 'Educacion',
  'Tutor/Teacher': 'Educacion',
  'School': 'Educacion',
  'Entertainment': 'Entretenimiento',
  'Musician/Band': 'Entretenimiento',
  'Artist': 'Entretenimiento',
  'Consulting Agency': 'Negocios',
  'Business Service': 'Negocios',
  'Marketing Agency': 'Negocios',
  'Health/Beauty': 'Salud',
  'Doctor': 'Salud',
  'Medical & Health': 'Salud',
};

const DEFAULT_SECTOR: Sector = 'Negocios';

export function resolveSector(businessCategory?: string): Sector {
  if (!businessCategory) return DEFAULT_SECTOR;
  return CATEGORY_TO_SECTOR[businessCategory] ?? DEFAULT_SECTOR;
}

export const SECTOR_BENCHMARKS: Record<Sector, SectorBenchmark> = {
  Belleza: { engagementRate: 3.5, commentRate: 0.05, reelsViewRate: 120 },
  Moda: { engagementRate: 2.8, commentRate: 0.04, reelsViewRate: 100 },
  Fitness: { engagementRate: 3.2, commentRate: 0.045, reelsViewRate: 130 },
  Gastronomia: { engagementRate: 3.0, commentRate: 0.042, reelsViewRate: 110 },
  Tecnologia: { engagementRate: 2.5, commentRate: 0.035, reelsViewRate: 90 },
  Viajes: { engagementRate: 3.8, commentRate: 0.055, reelsViewRate: 140 },
  Educacion: { engagementRate: 2.2, commentRate: 0.03, reelsViewRate: 80 },
  Entretenimiento: { engagementRate: 4.0, commentRate: 0.06, reelsViewRate: 150 },
  Negocios: { engagementRate: 2.0, commentRate: 0.028, reelsViewRate: 70 },
  Salud: { engagementRate: 2.8, commentRate: 0.04, reelsViewRate: 100 },
};
