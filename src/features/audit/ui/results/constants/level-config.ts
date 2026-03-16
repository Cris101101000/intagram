import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';

export interface LevelConfig {
  color: string;
  colorBg: string;
  colorDark: string;
  badgeEmoji: string;
  heroHeadline: string;
  heroSubtitle: string;
  rankingTitle: string;
  rankingConsequence: string;
  rankingConsequenceShort: string;
  criticalTitle: string;
  criticalSubtitle: string;
  bridge1: string;
  bridge1Italic: string;
  bridge2: string;
  bridge2Italic: string;
  bridge3Italic: string;
  planTitle: string;
  planSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  weeks: { id: string; title: string; desc: string; tags: { label: string; variant: 'linda' | 'manual' }[] }[];
}

export const LEVEL_CONFIG: Record<ScoreLevel, LevelConfig> = {
  [ScoreLevel.CRITICO]: {
    color: '#F87171',
    colorBg: 'rgba(248,113,113,0.1)',
    colorDark: '#F87171',
    badgeEmoji: '⚠️',
    heroHeadline: 'Tu perfil necesita atención. Pero saber dónde estás es el primer paso.',
    heroSubtitle: 'Estás por debajo del promedio del sector en las métricas clave. La buena noticia: cada punto débil tiene una solución concreta.',
    rankingTitle: 'Tu perfil está por debajo de la mayoría de tu sector',
    rankingConsequence: 'de negocios de {{sector}} en Latinoamérica tiene mejor rendimiento que tú. Eso significa que cuando alguien busca opciones en tu ciudad, tu perfil no es el que genera confianza. Pero este es tu punto de partida — y cada métrica que mejores te acerca al promedio.',
    rankingConsequenceShort: 'de negocios de {{sector}} tiene mejor rendimiento. Cada métrica que mejores te acerca al promedio.',
    criticalTitle: 'Lo que está afectando tu perfil ahora mismo',
    criticalSubtitle: 'Estos 3 indicadores necesitan atención urgente. Son la razón por la que tu Instagram no está generando el impacto que debería.',
    bridge1: 'Estos son los puntos que necesitan atención inmediata.',
    bridge1Italic: 'Linda',
    bridge2: 'Estos problemas se pueden resolver.',
    bridge2Italic: 'Linda',
    bridge3Italic: 'tu primer mes',
    planTitle: '30 días para construir una base sólida',
    planSubtitle: 'Tu perfil necesita fundamentos. Este es el plan que Linda ejecutará contigo — paso a paso, sin que necesites experiencia.',
    ctaTitle: 'Tu perfil necesita acción. Linda puede empezar hoy.',
    ctaSubtitle: 'Prueba BeweOS gratis por 30 días. Linda responde mensajes y crea contenido desde el día 1.',
    weeks: [
      { id: 'S1', title: 'Semana 1 — Activar respuestas', desc: 'Activar Linda en Instagram para responder mensajes 24/7 y agregar FAQs frecuentes a su base de conocimiento.', tags: [{ label: 'Linda responde mensajes', variant: 'linda' }, { label: 'Tú agregas FAQs', variant: 'manual' }] },
      { id: 'S2', title: 'Semana 2 — Primer contenido', desc: 'Publicar primer contenido desde BeweOS (imagen + copy generado por IA).', tags: [{ label: 'Linda genera contenido', variant: 'linda' }, { label: 'Tú apruebas', variant: 'manual' }] },
      { id: 'S3', title: 'Semana 3 — Construir ritmo', desc: 'Aprobar propuestas proactivas de contenido cada 3 días y registrar primeros contactos en el panel.', tags: [{ label: 'Linda propone cada 3 días', variant: 'linda' }] },
      { id: 'S4', title: 'Semana 4 — Primera campaña', desc: 'Activar campaña de bienvenida automática para nuevos contactos de Instagram.', tags: [{ label: 'Linda automatiza', variant: 'linda' }, { label: 'Tú mides', variant: 'manual' }] },
    ],
  },
  [ScoreLevel.REGULAR]: {
    color: '#FBBF24',
    colorBg: 'rgba(251,191,36,0.1)',
    colorDark: '#D97706',
    badgeEmoji: '⚡',
    heroHeadline: 'Tu perfil tiene potencial. Pero hay puntos débiles que lo frenan.',
    heroSubtitle: 'Hay cosas que funcionan y cosas que no. Vamos a ver exactamente cuáles son y cómo resolverlas.',
    rankingTitle: 'Estás en el camino, pero tu competencia te lleva ventaja',
    rankingConsequence: 'de negocios de {{sector}} tiene mejor rendimiento. Tienes una base — pero los negocios que están por encima de ti son los que se quedan con los clientes que te buscan primero. Cerrar esa brecha es cuestión de consistencia y estrategia.',
    rankingConsequenceShort: 'de negocios de {{sector}} tiene mejor rendimiento. Cerrar esa brecha es cuestión de consistencia y estrategia.',
    criticalTitle: 'Lo que está frenando tu crecimiento',
    criticalSubtitle: 'Estos 3 indicadores son los que más están afectando tu rendimiento. Resolverlos es la diferencia entre quedarte donde estás o subir de nivel.',
    bridge1: 'Sabes dónde estás. Ahora veamos',
    bridge1Italic: 'qué te frena',
    bridge2: 'Cada uno de estos problemas tiene una solución directa.',
    bridge2Italic: 'Linda',
    bridge3Italic: 'tu primer mes',
    planTitle: '30 días para darle estructura a tu crecimiento',
    planSubtitle: 'Tienes una base. Ahora necesitas consistencia y estrategia. Linda se encarga de ambas.',
    ctaTitle: '¿Listo para subir de nivel?',
    ctaSubtitle: 'Prueba BeweOS gratis por 30 días. Linda le da estructura a tu Instagram para crecer.',
    weeks: [
      { id: 'S1', title: 'Semana 1 — Configurar reglas', desc: 'Configurar reglas de comportamiento de Linda (precios, competencia, horarios fuera de atención).', tags: [{ label: 'Linda aprende tu negocio', variant: 'linda' }, { label: 'Tú configuras reglas', variant: 'manual' }] },
      { id: 'S2', title: 'Semana 2 — Contenido proactivo', desc: 'Activar contenido proactivo de BeweOS cada 3 días y publicar desde la plataforma.', tags: [{ label: 'Linda publica', variant: 'linda' }, { label: 'Tú apruebas', variant: 'manual' }] },
      { id: 'S3', title: 'Semana 3 — Primera campaña', desc: 'Lanzar primera campaña segmentada por etiquetas de Linda hacia contactos calificados del panel.', tags: [{ label: 'Linda segmenta y lanza', variant: 'linda' }] },
      { id: 'S4', title: 'Semana 4 — Reengagement', desc: 'Activar reengagement automático para contactos sin respuesta en 7 días.', tags: [{ label: 'Linda reactiva contactos', variant: 'linda' }, { label: 'Tú mides el impacto', variant: 'manual' }] },
    ],
  },
  [ScoreLevel.BUENO]: {
    color: '#38BDF8',
    colorBg: 'rgba(56,189,248,0.1)',
    colorDark: '#0284C7',
    badgeEmoji: '🔵',
    heroHeadline: 'Tu perfil tiene buen desempeño. Pero algo lo está frenando.',
    heroSubtitle: 'Con ajustes específicos puedes llegar al siguiente nivel. Vamos a ver exactamente qué está pasando y cómo resolverlo.',
    rankingTitle: '¿Cómo te ven tus clientes vs. tu competencia?',
    rankingConsequence: 'de negocios de {{sector}} en Latinoamérica tienen un rendimiento inferior al tuyo. Estás bien posicionado — pero el resto que está por encima de ti es el que se queda con los clientes que te buscan y encuentran "algo mejor" primero. Cerrar esa brecha es la diferencia entre que te elijan a ti o a tu competencia.',
    rankingConsequenceShort: 'de negocios de {{sector}} tienen un rendimiento inferior al tuyo. Cerrar la brecha con el resto es la diferencia entre que te elijan a ti o a tu competencia.',
    criticalTitle: '3 cosas que están costándote clientes hoy',
    criticalSubtitle: 'No son problemas técnicos — son oportunidades de negocio que se están escapando cada semana.',
    bridge1: 'Sabes dónde estás. Ahora veamos',
    bridge1Italic: 'qué te frena',
    bridge2: 'Cada uno de estos problemas tiene una solución directa.',
    bridge2Italic: 'Linda',
    bridge3Italic: 'tu primer mes',
    planTitle: '30 días para pasar de Bueno a Excelente',
    planSubtitle: 'Este es el plan que Linda ejecutará por ti. Optimizar y escalar lo que ya funciona — semana a semana.',
    ctaTitle: '¿Listo para mejorar tu score?',
    ctaSubtitle: 'Prueba BeweOS gratis por 30 días. Linda transforma tu Instagram en una máquina de captar clientes.',
    weeks: [
      { id: 'S1', title: 'Semana 1 — Segmentar', desc: 'Revisar etiquetas de Linda en el panel y crear segmentos por potencialidad (alto / medio).', tags: [{ label: 'Linda segmenta', variant: 'linda' }, { label: 'Tú revisas', variant: 'manual' }] },
      { id: 'S2', title: 'Semana 2 — Campañas diferenciadas', desc: 'Lanzar 2 campañas diferenciadas por segmento (premium vs. precio).', tags: [{ label: 'Linda crea campañas', variant: 'linda' }, { label: 'Tú apruebas', variant: 'manual' }] },
      { id: 'S3', title: 'Semana 3 — Automatizar retención', desc: 'Configurar automatizaciones de retención (reengagement 30 días, cumpleaños, aniversario).', tags: [{ label: 'Linda automatiza', variant: 'linda' }] },
      { id: 'S4', title: 'Semana 4 — Conectar contenido', desc: 'Linda responde mensajes post-publicación con CTA directo al servicio estrella.', tags: [{ label: 'Linda conecta', variant: 'linda' }, { label: 'Tú mides el impacto', variant: 'manual' }] },
    ],
  },
  [ScoreLevel.EXCELENTE]: {
    color: '#34D399',
    colorBg: 'rgba(52,211,153,0.1)',
    colorDark: '#1D7454',
    badgeEmoji: '🏆',
    heroHeadline: 'Tu perfil está por encima del sector. El reto ahora es escalar.',
    heroSubtitle: 'Estás haciendo las cosas bien. Vamos a ver qué puedes optimizar para mantener el liderazgo y seguir creciendo.',
    rankingTitle: 'Estás liderando tu sector',
    rankingConsequence: 'de negocios de {{sector}} tiene mejor rendimiento que tú. Estás construyendo una presencia digital que la mayoría de tu competencia no tiene. El reto ahora es mantener ese liderazgo y diversificar tus canales de captación.',
    rankingConsequenceShort: 'de negocios de {{sector}} tiene mejor rendimiento. El reto ahora es mantener tu liderazgo y seguir escalando.',
    criticalTitle: '3 puntos que puedes optimizar para escalar',
    criticalSubtitle: 'Tu perfil está fuerte, pero estos indicadores tienen margen de mejora. Optimizarlos puede ser la diferencia entre crecer un 10% y un 30%.',
    bridge1: 'Tu perfil está fuerte. Pero siempre hay algo que',
    bridge1Italic: 'optimizar',
    bridge2: 'Ya haces mucho bien.',
    bridge2Italic: 'Linda',
    bridge3Italic: 'tu primer mes',
    planTitle: '30 días para consolidar tu liderazgo',
    planSubtitle: 'Estás arriba. El plan ahora es mantener ese nivel y encontrar nuevas palancas de crecimiento.',
    ctaTitle: 'Escala lo que ya funciona',
    ctaSubtitle: 'Prueba BeweOS gratis por 30 días. Linda escala tu presencia mientras tú manejas tu negocio.',
    weeks: [
      { id: 'S1', title: 'Semana 1 — Campaña personalizada', desc: 'Lanzar campaña personalizada hacia contactos de alto potencial del panel.', tags: [{ label: 'Linda personaliza', variant: 'linda' }, { label: 'Tú defines el target', variant: 'manual' }] },
      { id: 'S2', title: 'Semana 2 — Reglas avanzadas', desc: 'Configurar reglas avanzadas de Linda (replies de Stories, menciones, escalamiento automático).', tags: [{ label: 'Linda escala', variant: 'linda' }] },
      { id: 'S3', title: 'Semana 3 — Motor de contenido', desc: 'Activar motor de contenido proactivo completo y medir qué tipo convierte más en mensajes.', tags: [{ label: 'Linda analiza conversión', variant: 'linda' }] },
      { id: 'S4', title: 'Semana 4 — Optimizar', desc: 'Revisar métricas del panel BeweOS y definir las 2 acciones de mayor impacto para el mes siguiente.', tags: [{ label: 'Linda reporta', variant: 'linda' }, { label: 'Tú decides', variant: 'manual' }] },
    ],
  },
};

export const SECTOR_BENCHMARKS: Record<string, { er: number; cr: number; rvr: number }> = {
  belleza: { er: 3.5, cr: 0.05, rvr: 20 },
  bienestar: { er: 3.2, cr: 0.04, rvr: 18 },
  fitness: { er: 3.0, cr: 0.04, rvr: 22 },
  salud: { er: 2.5, cr: 0.03, rvr: 15 },
  general: { er: 2.8, cr: 0.04, rvr: 18 },
};

export const SECTOR_EMOJI: Record<string, string> = {
  belleza: '💇‍♀️',
  bienestar: '🧘',
  fitness: '🏋️',
  salud: '🏥',
  general: '📱',
};

export const METRIC_CONSEQUENCES = {
  er: {
    good: 'Tu contenido genera buena reacción. Instagram reconoce esto y distribuye tus posts a más personas. Mantener este nivel es clave para seguir creciendo orgánicamente.',
    mid: 'Tu audiencia reacciona a tu contenido, pero menos de lo que el sector espera. Instagram interpreta esto como una señal de que tu contenido no merece tanta distribución — cada post llega a menos personas de las que podría.',
    low: 'Tu audiencia ve tu contenido pero no interactúa. Para Instagram, eso es una señal de que tu contenido no merece distribución. Tu alcance orgánico se está reduciendo aunque publiques con frecuencia.',
  },
  cr: {
    good: 'Tu contenido genera conversación real. Los comentarios son la interacción más valiosa para el algoritmo — estás ganando distribución orgánica con cada publicación.',
    mid: 'Tu contenido genera algo de conversación pero por debajo de lo esperado. Los comentarios pesan más que los likes en el algoritmo de 2025. Hay margen claro de mejora aquí.',
    low: 'Tu contenido genera vistas y likes, pero no conversación real. Los comentarios son la señal que más pesa en el algoritmo de Instagram en 2025. Sin comentarios, tus posts pierden prioridad frente a los de tu competencia.',
  },
  rvr: {
    good: 'Tus Reels están llegando más allá de tu base de seguidores. Este es el formato con mayor distribución orgánica — estás aprovechándolo bien para llegar a clientes nuevos.',
    mid: 'Tus Reels llegan a tu audiencia pero sin superar el benchmark. Un pequeño empujón aquí puede significar cientos de personas nuevas viendo tu negocio cada semana.',
    low: 'Tus Reels tienen bajo alcance. Los Reels son la forma más efectiva de llegar a clientes nuevos sin pagar publicidad. Este es el punto con mayor potencial de mejora.',
    none: 'No estás usando Reels. Este es el único formato que Instagram distribuye orgánicamente a personas que aún no te siguen. Cada semana sin Reels es una semana sin llegar a clientes nuevos.',
  },
};
