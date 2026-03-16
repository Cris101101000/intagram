import { Sector, SectorBenchmark } from '../interfaces/benchmark';

// Keywords in username/bio/fullName → sector (checked in order, first match wins)
const KEYWORD_TO_SECTOR: [RegExp, Sector][] = [
  // Belleza
  [/\b(nails?|u[ñn]as?|manicur|pedicur|gel|acr[ií]lic|esmalte|lash|pesta[ñn]|cejas?|brow|makeup|maquillaj|beauty|belleza|peluquer[ií]?a?|estilista|stylist|salon|sal[oó]n|barber|barber[ií]a|spa|facial|skincare|piel|cabello|hair|extensiones|keratina|tattoo|tatuaj|piercing|depilaci[oó]n|microblading)\b/i, 'Belleza'],
  // Moda
  [/\b(moda|fashion|ropa|cloth|boutique|tienda|joyer[ií]a|jewelry|accesorios|zapatos|shoes|textil|outfit|style|estilo|bolsos|bags|lencer[ií]a|lingerie|camisetas|sneakers)\b/i, 'Moda'],
  // Fitness
  [/\b(gym|fitness|entrena|workout|crossfit|yoga|pilates|personal.?trainer|deporte|sport|boxeo|funcional|gimnasio|zumba|calistenia|running|marat[oó]n)\b/i, 'Fitness'],
  // Gastronomia
  [/\b(comida|food|restaurant|restaurante|cocina|chef|reposter[ií]a|pastel|cake|pizza|sushi|caf[eé]|coffee|panader[ií]a|bakery|burger|hamburgues|taco|helado|catering|gastro|cerveza|beer|vino|wine|postres?|dessert|brunch|bar\b|cantina|carnicer[ií]a|empanada)\b/i, 'Gastronomia'],
  // Tecnologia
  [/\b(tech|software|desarrollo|developer|programaci[oó]n|app|digital|web|c[oó]digo|code|startup|saas|ia\b|inteligencia.?artificial|ciberseguridad|cloud|datos|data)\b/i, 'Tecnologia'],
  // Viajes
  [/\b(travel|viaje|turismo|tourism|hotel|hostal|aventura|destino|excursi[oó]n|tour|playa|beach|mochiler|camping)\b/i, 'Viajes'],
  // Educacion
  [/\b(academia|escuela|school|cursos?|clases?|formaci[oó]n|coaching|coach\b|mentor|aprende|ense[ñn]|taller|workshop|capacitaci[oó]n|tutor|educaci[oó]n|pedagog|idiomas|ingl[eé]s|matem[aá]tica)\b/i, 'Educacion'],
  // Entretenimiento
  [/\b(music|m[uú]sic|band|fot[oó]graf|photo|video|film|event|evento|dj\b|arte|artist|dise[ñn]o|design|creativo|creative|cine|teatro|podcast|stream|influencer|content.?creator)\b/i, 'Entretenimiento'],
  // Salud
  [/\b(salud|health|m[eé]dic|doctor|dental|dent|nutri|psic[oó]log|therap|terapi|cl[ií]nica|clinic|bienestar|wellness|hol[ií]stic|fisioterapi|quiropr[aá]ctic|veterinar|farmacia|optic)\b/i, 'Salud'],
];

const DEFAULT_SECTOR: Sector = 'Negocios';

export function resolveSector(
  _businessCategory?: string,
  context?: { username?: string; fullName?: string; biography?: string },
): Sector {
  if (context) {
    const text = [context.username, context.fullName, context.biography]
      .filter(Boolean)
      .join(' ');
    for (const [regex, sector] of KEYWORD_TO_SECTOR) {
      if (regex.test(text)) return sector;
    }
  }

  return DEFAULT_SECTOR;
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
