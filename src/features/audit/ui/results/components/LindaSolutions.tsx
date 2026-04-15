'use client';

import { Icon } from '@iconify/react';
import { CriticalPoint } from '@/features/audit/domain/interfaces/audit';
import { trackClickTrial } from '@/features/audit/infrastructure/analytics/audit-analytics';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';
import { SectionLabel } from './MetricsBlock';

interface LindaSolutionsProps {
  criticalPoints: CriticalPoint[];
  username: string;
  profilePicUrl?: string;
  fullName?: string;
  biography?: string;
  signupUrl?: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  low_er: 'Engagement rate bajo',
  low_cr: 'Pocos comentarios',
  no_reels: 'Sin Reels',
  low_rvr: 'Bajo alcance en Reels',
  low_frequency: 'Frecuencia baja',
  bad_recency: 'Inactividad',
  inconsistency: 'Publicación irregular',
  bad_trend: 'Engagement en caída',
  format_dependency: 'Un solo formato',
  engagement_rate: 'Engagement rate bajo',
  comment_rate: 'Pocos comentarios',
  reels_view_rate: 'Bajo alcance en Reels',
  posting_consistency: 'Publicación irregular',
  posting_frequency: 'Frecuencia baja',
  recency: 'Inactividad',
  trend: 'Engagement en caída',
};

// ---------------------------------------------------------------------------
// Sub-niche resolver — keyword scan on username + fullName + biography
// ---------------------------------------------------------------------------

export interface SubNicheContent {
  image: string;
  hook: string;
  cta: string;
  caption: string;
  chatMessages: { from: string; text: string }[];
  crmContacts: { name: string; status: string; statusColor: string; statusBg: string; tags: string[]; potential: string; potentialColor: string }[];
}

const SUB_NICHE_RULES: { regex: RegExp; niche: string }[] = [
  // Belleza sub-niches
  { regex: /\b(nails?|u[ñn]as?|manicur|pedicur|gel|acr[ií]lic|esmalte)\b/i, niche: 'unas' },
  { regex: /\b(barber|barber[ií]a)\b/i, niche: 'barberia' },
  { regex: /\b(lash|pesta[ñn]|cejas?|brow|microblading)\b/i, niche: 'pestanas' },
  { regex: /\b(makeup|maquillaj)\b/i, niche: 'maquillaje' },
  { regex: /\b(spa|facial|skincare|piel)\b/i, niche: 'spa' },
  { regex: /\b(tattoo|tatuaj|piercing)\b/i, niche: 'tattoo' },
  { regex: /\b(peluquer|cabello|hair|estilista|stylist|salon|sal[oó]n|keratina|extensiones|beauty|belleza)\b/i, niche: 'peluqueria' },
  // Fitness sub-niches
  { regex: /\b(crossfit|funcional|boxeo|calistenia)\b/i, niche: 'crossfit' },
  { regex: /\b(yoga|pilates)\b/i, niche: 'yoga' },
  { regex: /\b(personal.?trainer|entrenador|entrenamiento)\b/i, niche: 'entrenamiento' },
  { regex: /\b(gym|gimnasio|fitness|workout)\b/i, niche: 'gimnasio' },
  // Salud sub-niches
  { regex: /\b(dental|dent|odontolog)\b/i, niche: 'dental' },
  { regex: /\b(psic[oó]log|therap|terapi|mental)\b/i, niche: 'psicologia' },
  { regex: /\b(nutri)\b/i, niche: 'nutricion' },
  { regex: /\b(fisioterapi|quiropr[aá]ctic|rehabilitaci[oó]n)\b/i, niche: 'fisioterapia' },
  { regex: /\b(veterinar|mascota|pet)\b/i, niche: 'veterinaria' },
  { regex: /\b(m[eé]dic|doctor|cl[ií]nica|salud|health)\b/i, niche: 'medico' },
  // Educación sub-niches
  { regex: /\b(idioma|ingl[eé]s|english|franc[eé]s|portugu[eé]s)\b/i, niche: 'idiomas' },
  { regex: /\b(coach|mentor|coaching)\b/i, niche: 'coaching' },
  { regex: /\b(academia|escuela|school|curso|clase|formaci[oó]n|capacitaci[oó]n|taller|workshop|educaci[oó]n|tutor)\b/i, niche: 'academia' },
  // Bienestar
  { regex: /\b(bienestar|wellness|hol[ií]stic|meditaci[oó]n|reiki|aromaterapia)\b/i, niche: 'bienestar' },
  // Moda
  { regex: /\b(moda|fashion|ropa|cloth|boutique|tienda|joyer[ií]a|jewelry|accesorios|zapatos|shoes|textil|outfit|style|estilo|bolsos|bags|lencer[ií]a|lingerie|camisetas|sneakers)\b/i, niche: 'moda' },
  // Gastronomía
  { regex: /\b(comida|food|restaurant|restaurante|cocina|chef|reposter[ií]a|pastel|cake|pizza|sushi|caf[eé]|coffee|panader[ií]a|bakery|burger|hamburgues|taco|helado|catering|gastro|cerveza|beer|vino|wine|postres?|dessert|brunch|bar|cantina|carnicer[ií]a|empanada)\b/i, niche: 'gastronomia' },
  // Tecnología
  { regex: /\b(tech|software|desarrollo|developer|programaci[oó]n|app|digital|web|c[oó]digo|code|startup|saas|ia|inteligencia.?artificial|ciberseguridad|cloud|datos|data)\b/i, niche: 'tecnologia' },
  // Viajes
  { regex: /\b(travel|viaje|turismo|tourism|hotel|hostal|aventura|destino|excursi[oó]n|tour|playa|beach|mochiler|camping)\b/i, niche: 'viajes' },
  // Entretenimiento
  { regex: /\b(music|m[uú]sic|band|fot[oó]graf|photo|video|film|event|evento|dj|arte|artist|dise[ñn]o|design|creativo|creative|cine|teatro|podcast|stream|influencer|content.?creator)\b/i, niche: 'entretenimiento' },
];

const SUB_NICHE_CONTENT: Record<string, SubNicheContent> = {
  // ---- BELLEZA ----
  unas: {
    image: '/Belleza/sim-uñas.avif',
    hook: '5 diseños de uñas que están arrasando este mes — y cómo pedirlos en tu próxima cita',
    cta: 'Agenda tu cita →',
    caption: '¿Cuál es tu diseño favorito? Cuéntanos en los comentarios 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Vi los diseños de uñas. ¿Qué técnicas manejan?' },
      { from: 'linda', text: '¡Hola! 😊 Manejamos manicure en gel, acrílico y semi-permanente. También hacemos diseños personalizados.' },
      { from: 'user', text: 'Genial! ¿Cuánto cuesta el gel con diseño?' },
      { from: 'linda', text: 'El manicure en gel con diseño tiene un valor de $45.000. Tenemos disponibilidad esta semana 💅' },
      { from: 'user', text: 'Buenísimo, me interesa! Gracias por la info' },
    ],
    crmContacts: [
      { name: 'Valentina Ríos', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Gel', 'Diseño', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Camila Herrera', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Acrílico', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Laura Gómez', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Pedicure', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Andrea Muñoz', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Semi-permanente', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  barberia: {
    image: '/Belleza/sim-barberia.avif',
    hook: 'El fade perfecto no es casualidad — estos son los 3 cortes que más piden este mes',
    cta: 'Reserva tu turno →',
    caption: '¿Fade bajo, medio o alto? Cuéntanos cuál es tu favorito 👇',
    chatMessages: [
      { from: 'user', text: 'Buenas! ¿Qué cortes manejan?' },
      { from: 'linda', text: '¡Hola! 😊 Manejamos fade bajo, medio y alto, con o sin diseño. También barba y cejas.' },
      { from: 'user', text: 'Un fade medio con diseño. ¿Cuánto sale?' },
      { from: 'linda', text: 'El corte fade con diseño tiene un valor de $25.000. Atendemos de lunes a sábado 💈' },
      { from: 'user', text: 'Excelente, voy a pasar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Santiago Díaz', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Fade', 'Frecuente', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mateo Vargas', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Barba', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Andrés Rojas', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Corte + barba', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Nicolás Peña', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Diseño', 'Semanal'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  pestanas: {
    image: '/Belleza/sim-pestañas.avif',
    hook: 'Pestañas pelo a pelo vs. volumen ruso — cuál te queda mejor según tu ojo',
    cta: 'Agenda tu aplicación →',
    caption: '¿Pelo a pelo o volumen? Cuéntanos qué look prefieres 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Quiero hacerme las pestañas. ¿Qué técnicas manejan?' },
      { from: 'linda', text: '¡Hola! 😊 Manejamos pelo a pelo, volumen ruso y mega volumen. Cada una da un efecto diferente.' },
      { from: 'user', text: 'Me interesa pelo a pelo. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La aplicación pelo a pelo tiene un valor de $80.000. Incluye diseño personalizado según la forma de tu ojo ✨' },
      { from: 'user', text: 'Genial, gracias por la info! Lo voy a pensar' },
    ],
    crmContacts: [
      { name: 'Sofía Martínez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Volumen ruso', 'Mensual'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Isabella Torres', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Pelo a pelo', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Daniela López', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Lifting', 'Primera vez'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'María Fernanda R.', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Mega volumen', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  maquillaje: {
    image: '/Belleza/sim-maquillaje.avif',
    hook: '3 errores de maquillaje que te envejecen — y cómo corregirlos fácil',
    cta: 'Reserva tu sesión →',
    caption: '¿Cuál de estos errores cometes? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué tipos de maquillaje ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Hacemos maquillaje social, novias y editorial. Cada servicio incluye prueba previa.' },
      { from: 'user', text: 'Me interesa el social para un evento. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'El maquillaje social tiene un valor de $120.000 e incluye prueba previa y retoque el día del evento 💄' },
      { from: 'user', text: 'Muy bien! Lo tengo en cuenta, gracias' },
    ],
    crmContacts: [
      { name: 'Carolina Mejía', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Novia', 'Prueba hecha'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mariana Ruiz', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Social', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Paula Andrea C.', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Evento', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Natalia Ospina', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Editorial', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  spa: {
    image: '/Belleza/sim-spa.avif',
    hook: 'Tu piel te habla — 3 señales de que necesitas un facial profundo esta semana',
    cta: 'Reserva tu tratamiento →',
    caption: '¿Cuándo fue tu último facial? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué tratamientos faciales tienen?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos limpieza profunda, hidrafacial y rejuvenecimiento. Cada uno se adapta a tu tipo de piel.' },
      { from: 'user', text: 'Me interesa el hidrafacial. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'El hidrafacial tiene un valor de $150.000. La sesión dura 60 min y los resultados se ven desde la primera sesión 🧖‍♀️' },
      { from: 'user', text: 'Suena increíble, gracias por la info!' },
    ],
    crmContacts: [
      { name: 'Diana Herrera', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Hidrafacial', 'Mensual'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Gabriela Sánchez', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Limpieza facial', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Alejandra Parra', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Masaje', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Lucía Moreno', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Rejuvenecimiento', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  tattoo: {
    image: '/Belleza/sim-tatto.avif',
    hook: '5 estilos de tatuaje que están en tendencia — encuentra el tuyo',
    cta: 'Agenda tu consulta →',
    caption: '¿Qué estilo de tatuaje te define? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Me quiero hacer un tatuaje. ¿Qué estilos manejan?' },
      { from: 'linda', text: '¡Hola! 😊 Manejamos minimalista, realismo, lettering, blackwork y acuarela. ¿Tienes algo en mente?' },
      { from: 'user', text: 'Quiero algo minimalista en el antebrazo. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'Los tatuajes minimalistas arrancan desde $80.000 dependiendo del tamaño. La consulta de diseño es gratuita 🖋️' },
      { from: 'user', text: 'Genial, me interesa! Gracias por la info' },
    ],
    crmContacts: [
      { name: 'Sebastián Cruz', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Realismo', 'Brazo completo'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Juliana Mora', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Minimalista', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Felipe Arias', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Cover up', 'Consulta'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Camilo Restrepo', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Lettering', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  peluqueria: {
    image: '/Belleza/sim-peluqueria.avif',
    hook: '3 tratamientos capilares que transforman tu cabello en una sola sesión',
    cta: 'Agenda tu cita →',
    caption: '¿Cuál es tu tratamiento favorito? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios de cabello ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos corte, tinte, balayage, keratina y alisado. También tratamientos de hidratación profunda.' },
      { from: 'user', text: 'Me interesa un balayage. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'El balayage + corte tiene un valor de $180.000. Incluye tratamiento hidratante para proteger tu cabello ✨' },
      { from: 'user', text: 'Muy bien! Lo voy a tener en cuenta, gracias' },
    ],
    crmContacts: [
      { name: 'Camila Torres', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Balayage', 'Keratina', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Laura Hernández', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Corte + tinte', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Andrea López', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Alisado', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'María José S.', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Extensiones', 'Mensual'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- FITNESS ----
  gimnasio: {
    image: '/Fitness/sim-gimnasio.avif',
    hook: '3 ejercicios que transforman tus brazos en 4 semanas — y los puedes hacer en el gym',
    cta: 'Reserva tu clase de prueba →',
    caption: '¿Cuál es el ejercicio que más te cuesta? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Vi el post de los ejercicios. ¿Qué planes tienen?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos planes mensuales y trimestrales con acceso ilimitado a todas las clases grupales e individuales.' },
      { from: 'user', text: '¿Cuánto cuesta el plan mensual?' },
      { from: 'linda', text: 'El plan mensual tiene un valor de $89.000 con acceso ilimitado. También ofrecemos clase de prueba gratuita 💪' },
      { from: 'user', text: 'Buenísimo, me interesa! Gracias por la info' },
    ],
    crmContacts: [
      { name: 'Camila Torres', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Plan mensual', 'Fuerza', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Roberto Garrido', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Clase de prueba', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Andrea López', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['HIIT', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Daniel Mejía', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Funcional', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  crossfit: {
    image: '/Fitness/sim-crossfit.avif',
    hook: 'WOD del día: el circuito de 20 min que te va a destruir (en el buen sentido)',
    cta: 'Reserva tu primer WOD →',
    caption: '¿Cuál fue tu mejor WOD? Cuéntanos tu tiempo 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Nunca he hecho CrossFit. ¿Cómo funciona?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos clases para todos los niveles, incluyendo principiantes. La primera clase es gratis para que pruebes.' },
      { from: 'user', text: '¿Cuánto cuesta la mensualidad?' },
      { from: 'linda', text: 'El plan ilimitado tiene un valor de $120.000/mes. Incluye acceso a todas las clases y Open Gym 🏋️' },
      { from: 'user', text: 'Genial, lo voy a considerar! Gracias' },
    ],
    crmContacts: [
      { name: 'Andrés Ramírez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Ilimitado', 'Competidor'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Juliana Castro', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Principiante', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Sergio Vega', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['WOD', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Daniela Ríos', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Open Gym', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  yoga: {
    image: '/Fitness/sim-yoga.avif',
    hook: '5 posturas de yoga que alivian el dolor de espalda — hazlas en casa',
    cta: 'Reserva tu primera clase →',
    caption: '¿Cuál postura te cuesta más? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Tienen clases de yoga para principiantes?' },
      { from: 'linda', text: '¡Hola! 😊 Sí, tenemos Hatha yoga ideal para principiantes. Los horarios son lunes, miércoles y viernes.' },
      { from: 'user', text: '¿Cuánto cuesta?' },
      { from: 'linda', text: 'El plan mensual es de $75.000 con acceso a todas las clases. La primera clase es gratis para que pruebes 🧘' },
      { from: 'user', text: 'Qué bueno, me interesa! Gracias por la info' },
    ],
    crmContacts: [
      { name: 'Ana María Duarte', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Vinyasa', 'Mensual'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Patricia Gómez', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Hatha', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Claudia Herrera', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Principiante', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Marcela Ríos', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Ashtanga', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  entrenamiento: {
    image: '/Fitness/sim-entrenamiento-personal.webp',
    hook: 'Por qué tu rutina del gym no te da resultados — y cómo un plan personalizado lo cambia todo',
    cta: 'Agenda tu evaluación gratis →',
    caption: '¿Entrenas con plan o a lo que salga? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Me interesa el entrenamiento personalizado. ¿Cómo funciona?' },
      { from: 'linda', text: '¡Hola! 😊 Se inicia con una evaluación física gratuita y luego se diseña un plan a tu medida. Sesiones de 1 hora.' },
      { from: 'user', text: '¿Cuánto cuesta el paquete mensual?' },
      { from: 'linda', text: 'El plan de 3 sesiones/semana tiene un valor de $250.000/mes. Incluye plan nutricional personalizado 🏃' },
      { from: 'user', text: 'Me interesa, lo voy a pensar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Carlos Mendoza', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['3x semana', 'Hipertrofia'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Fernanda Ruiz', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Evaluación', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Miguel Ángel P.', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Pérdida peso', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Valentina Osorio', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['5x semana', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- SALUD ----
  dental: {
    image: '/Salud/sim-dental.webp',
    hook: '3 señales de que necesitas una limpieza dental urgente (la #2 te va a sorprender)',
    cta: 'Agenda tu cita →',
    caption: '¿Cuándo fue tu última limpieza dental? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios dentales ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos limpieza dental, blanqueamiento, ortodoncia e implantes. La primera valoración es sin costo.' },
      { from: 'user', text: 'Me interesa la limpieza. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La limpieza dental tiene un valor de $80.000. Tenemos disponibilidad de lunes a sábado 🦷' },
      { from: 'user', text: 'Perfecto, gracias por la información!' },
    ],
    crmContacts: [
      { name: 'Alejandro Duarte', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Ortodoncia', 'Tratamiento'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Diana Ríos', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Limpieza', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mónica Herrera', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Blanqueamiento', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Ricardo Peña', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Implantes', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  psicologia: {
    image: '/Salud/sim-psicologia.webp',
    hook: '5 señales de que la ansiedad está controlando tu vida — y qué hacer al respecto',
    cta: 'Agenda tu primera sesión →',
    caption: '¿Te identificas con alguna? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué tipo de terapias ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos terapia individual, de pareja y familiar. Modalidad presencial y online.' },
      { from: 'user', text: 'Me interesa individual. ¿Cuánto cuesta la sesión?' },
      { from: 'linda', text: 'La sesión individual tiene un valor de $120.000 (50 min). Puedes elegir presencial u online según tu preferencia 🧠' },
      { from: 'user', text: 'Bueno, lo voy a considerar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Paola Martínez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Individual', 'Online'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Gabriel Ospina', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Ansiedad', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Carolina Duque', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Pareja', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Martín Aguilar', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Semanal', 'Presencial'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  nutricion: {
    image: '/Salud/sim-nutricion.avif',
    hook: 'Mitos sobre la alimentación saludable que te están haciendo comer peor',
    cta: 'Agenda tu consulta →',
    caption: '¿Cuál mito creías que era cierto? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios de nutrición ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos planes personalizados para bajar de peso, ganar masa muscular o mejorar tu alimentación general.' },
      { from: 'user', text: 'Me interesa mejorar mi alimentación. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La primera consulta + plan nutricional tiene un valor de $100.000. Incluye seguimiento semanal por 4 semanas 🥗' },
      { from: 'user', text: 'Suena bien, gracias por la info!' },
    ],
    crmContacts: [
      { name: 'Lorena Castaño', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Plan mensual', 'Seguimiento'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Tomás Herrera', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Masa muscular', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Catalina Gómez', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Bajar peso', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Esteban Mora', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Deportista', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  fisioterapia: {
    image: '/Salud/sim-fisioterapia.avif',
    hook: '3 ejercicios para aliviar el dolor lumbar — aprobados por fisioterapeutas',
    cta: 'Agenda tu evaluación →',
    caption: '¿Sufres de dolor de espalda? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Tengo dolor de espalda crónico. ¿Pueden ayudarme?' },
      { from: 'linda', text: '¡Hola! 😊 Sí, tratamos dolor lumbar, cervical y lesiones deportivas. La primera valoración es sin costo.' },
      { from: 'user', text: '¿Cuánto cuesta la sesión?' },
      { from: 'linda', text: 'La sesión de fisioterapia tiene un valor de $90.000 (45 min). El plan se diseña según tu evaluación inicial 💆' },
      { from: 'user', text: 'Interesante, lo tengo en cuenta. Gracias!' },
    ],
    crmContacts: [
      { name: 'Ricardo Vargas', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Lumbar', 'Semanal'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Lucía Parra', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Rodilla', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Jorge Salazar', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Post-operatorio', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Sandra Mejía', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Cervical', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  veterinaria: {
    image: '/Salud/sim-veterinaria.avif',
    hook: '5 vacunas que tu mascota necesita este año — no dejes pasar ninguna',
    cta: 'Agenda la cita de tu mascota →',
    caption: '¿Tu mascota tiene sus vacunas al día? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Necesito vacunar a mi perrito. ¿Qué vacunas necesita?' },
      { from: 'linda', text: '¡Hola! 😊 Depende de su edad y esquema previo. ¿Cuántos meses tiene?' },
      { from: 'user', text: 'Tiene 4 meses. ¿Cuánto cuesta la consulta?' },
      { from: 'linda', text: 'La consulta general tiene un valor de $50.000 e incluye revisión completa + plan de vacunación 🐶' },
      { from: 'user', text: 'Genial, gracias por la información!' },
    ],
    crmContacts: [
      { name: 'Juliana Torres', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Canino', 'Vacunación'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Diego Muñoz', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Cachorro', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Laura Restrepo', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Felino', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Andrés Castaño', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Peluquería', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  medico: {
    image: '/Salud/sim-medico.avif',
    hook: '3 chequeos médicos que deberías hacerte cada año (y probablemente no lo haces)',
    cta: 'Agenda tu cita →',
    caption: '¿Cuándo fue tu último chequeo? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios médicos ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos consulta general, chequeos preventivos, exámenes de laboratorio y especialistas.' },
      { from: 'user', text: 'Me interesa un chequeo general. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La consulta general tiene un valor de $100.000. Incluye examen completo y recomendaciones personalizadas 🩺' },
      { from: 'user', text: 'Bueno, lo tengo en cuenta. Gracias!' },
    ],
    crmContacts: [
      { name: 'Patricia Gómez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Control anual', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Fernando López', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Primera vez', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Gloria Herrera', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Exámenes', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Roberto Sánchez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Especialista', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- EDUCACIÓN ----
  academia: {
    image: '/Educacion/sim-academia.webp',
    hook: '5 técnicas de estudio que triplican tu retención — respaldadas por la ciencia',
    cta: 'Inscríbete ahora →',
    caption: '¿Cuál técnica usas para estudiar? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué cursos tienen disponibles?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos cursos presenciales y online en marketing digital, diseño, programación y más. ¿Qué área te interesa?' },
      { from: 'user', text: 'Me interesa marketing digital. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'El curso de marketing digital tiene un valor de $350.000 (8 semanas). Incluye certificado y material de apoyo 📚' },
      { from: 'user', text: 'Interesante, gracias por la info!' },
    ],
    crmContacts: [
      { name: 'Natalia Vargas', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Marketing', 'Certificado'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'David Herrera', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Diseño', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Marcela Ríos', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Programación', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Felipe Castro', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Excel avanzado', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  idiomas: {
    image: '/Educacion/sim-idiomas.webp',
    hook: '3 errores en inglés que cometes sin darte cuenta — y cómo corregirlos hoy',
    cta: 'Reserva tu clase de prueba →',
    caption: '¿Cuál error cometes más? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Me interesa clases de inglés. ¿Qué niveles tienen?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos desde básico hasta avanzado. Los grupos son pequeños (máximo 6 personas) y ofrecemos test de nivel gratuito.' },
      { from: 'user', text: 'Genial! ¿Cuánto cuesta el curso?' },
      { from: 'linda', text: 'El plan mensual es de $180.000 con 3 clases/semana. Horarios de mañana y tarde disponibles 🌍' },
      { from: 'user', text: 'Buenísimo, lo voy a considerar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Carolina Ospina', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Inglés B2', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Santiago Mora', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Básico', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Adriana Peña', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Francés', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Sebastián Gil', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Conversacional', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  coaching: {
    image: '/Educacion/sim-coaching.avif',
    hook: 'Lo que nadie te dice sobre emprender — 3 lecciones que te ahorran un año de errores',
    cta: 'Agenda tu sesión →',
    caption: '¿Cuál fue tu mayor aprendizaje emprendiendo? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Me interesa el coaching de negocios. ¿Cómo funciona?' },
      { from: 'linda', text: '¡Hola! 😊 Son sesiones 1:1 enfocadas en tus metas de negocio. La primera sesión diagnóstico es gratuita.' },
      { from: 'user', text: '¿Cuánto cuesta el programa completo?' },
      { from: 'linda', text: 'El programa de 4 sesiones tiene un valor de $400.000/mes. Incluye seguimiento entre sesiones y material de apoyo 🎯' },
      { from: 'user', text: 'Interesante, lo voy a pensar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Alejandra Duarte', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Programa mensual', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mauricio López', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Diagnóstico', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Viviana Torres', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Emprendimiento', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Carlos Restrepo', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Liderazgo', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- BIENESTAR ----
  bienestar: {
    image: '/Fitness/sim-yoga.avif',
    hook: 'Tu cuerpo te pide un descanso — 3 rituales de bienestar que puedes hacer hoy',
    cta: 'Reserva tu experiencia →',
    caption: '¿Cuál es tu ritual de bienestar favorito? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios de bienestar ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos meditación guiada, reiki, aromaterapia y masajes holísticos. Cada sesión se personaliza.' },
      { from: 'user', text: 'Me interesa el reiki. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La sesión de reiki tiene un valor de $90.000 (60 min). Es una experiencia transformadora para tu bienestar ✨' },
      { from: 'user', text: 'Suena muy bien, gracias por la info!' },
    ],
    crmContacts: [
      { name: 'Natalia Herrera', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Reiki', 'Mensual'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Carmen Ruiz', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Meditación', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Isabel Torres', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Aromaterapia', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Gabriela Parra', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Masaje holístico', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- MODA ----
  moda: {
    image: '/Otros/sim-moda.avif',
    hook: '5 combinaciones de outfits que elevan tu estilo sin gastar de más',
    cta: 'Ver colección →',
    caption: '¿Cuál es tu estilo favorito? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Vi los outfits que publicaron. ¿Tienen tienda física?' },
      { from: 'linda', text: '¡Hola! 😊 Sí, tenemos tienda física y también hacemos envíos a todo el país. ¿Qué prenda te interesó?' },
      { from: 'user', text: 'El vestido negro del post. ¿Cuánto cuesta y qué tallas tienen?' },
      { from: 'linda', text: 'El vestido tiene un valor de $85.000. Disponible en tallas S, M y L. También tenemos otros colores 👗' },
      { from: 'user', text: 'Genial, me interesa! Gracias por la info' },
    ],
    crmContacts: [
      { name: 'Valentina Ríos', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Vestidos', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mariana Ospina', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Accesorios', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Sofía Herrera', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Zapatos', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Camila Duarte', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Joyería', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- GASTRONOMÍA ----
  gastronomia: {
    image: '/Otros/sim-gastronomia.avif',
    hook: '3 platos que enamoran a tus clientes desde la primera foto — el secreto está en la presentación',
    cta: 'Ver menú →',
    caption: '¿Cuál es tu plato favorito? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! Se ve todo delicioso. ¿Tienen menú del día?' },
      { from: 'linda', text: '¡Hola! 😊 Sí, nuestro menú del día incluye entrada, plato fuerte y bebida. Cambia cada día.' },
      { from: 'user', text: '¿Cuánto cuesta el menú del día?' },
      { from: 'linda', text: 'El menú ejecutivo tiene un valor de $18.000. También tenemos carta a la carta con más opciones 🍽️' },
      { from: 'user', text: 'Buenísimo, voy a pasar. Gracias!' },
    ],
    crmContacts: [
      { name: 'Andrés Mejía', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Menú ejecutivo', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Carolina Duque', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Catering', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Felipe Torres', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Evento privado', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Lucía Vargas', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Domicilios', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- TECNOLOGÍA ----
  tecnologia: {
    image: '/Otros/sim-tecnologia.avif',
    hook: '3 herramientas digitales que tu negocio necesita hoy — y probablemente no conoces',
    cta: 'Conoce nuestras soluciones →',
    caption: '¿Qué herramienta digital no puedes dejar de usar? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios de desarrollo ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos desarrollo web, apps móviles, automatización y consultoría digital. ¿Qué necesita tu negocio?' },
      { from: 'user', text: 'Necesito una página web. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'Los sitios web arrancan desde $2.500.000 dependiendo de la complejidad. Incluye diseño, desarrollo y hosting por 1 año 💻' },
      { from: 'user', text: 'Interesante, me gustaría saber más. Gracias!' },
    ],
    crmContacts: [
      { name: 'Ricardo Gómez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Web', 'Mantenimiento'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Daniela Ríos', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['App móvil', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Mauricio López', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Automatización', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Alejandra Peña', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['E-commerce', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- VIAJES ----
  viajes: {
    image: '/Otros/sim-viajes.avif',
    hook: '5 destinos increíbles que puedes visitar sin gastar una fortuna',
    cta: 'Ver destinos →',
    caption: '¿Cuál es tu destino soñado? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué paquetes turísticos tienen disponibles?' },
      { from: 'linda', text: '¡Hola! 😊 Tenemos paquetes nacionales e internacionales. Todo incluido o personalizados según tu presupuesto.' },
      { from: 'user', text: 'Me interesa un plan a San Andrés. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'Los paquetes a San Andrés arrancan desde $1.200.000 por persona (3 noches). Incluye vuelo + hotel + desayunos ✈️' },
      { from: 'user', text: 'Buenísimo, lo voy a revisar con mi familia. Gracias!' },
    ],
    crmContacts: [
      { name: 'Paola Martínez', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Internacional', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Sebastián Cruz', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['San Andrés', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Marcela Ospina', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Grupo', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Gabriel Herrera', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Luna de miel', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
  // ---- ENTRETENIMIENTO ----
  entretenimiento: {
    image: '/Otros/sim-entretenimiento.avif',
    hook: '3 claves para crear contenido que la gente comparte sin que se lo pidas',
    cta: 'Ver portafolio →',
    caption: '¿Qué tipo de contenido consumes más? Cuéntanos 👇',
    chatMessages: [
      { from: 'user', text: 'Hola! ¿Qué servicios ofrecen?' },
      { from: 'linda', text: '¡Hola! 😊 Ofrecemos fotografía, video, cobertura de eventos y producción de contenido para redes sociales.' },
      { from: 'user', text: 'Me interesa cobertura para un evento. ¿Cuánto cuesta?' },
      { from: 'linda', text: 'La cobertura fotográfica + video arranca desde $500.000 (4 horas). Incluye edición y entrega digital 📸' },
      { from: 'user', text: 'Genial, lo voy a tener en cuenta. Gracias!' },
    ],
    crmContacts: [
      { name: 'Juliana Castro', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Fotografía', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Tomás Herrera', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Evento', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
      { name: 'Natalia Gómez', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Video', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
      { name: 'Diego Salazar', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Contenido redes', 'VIP'], potential: 'Alta', potentialColor: '#059669' },
    ],
  },
};

// Default fallback
const DEFAULT_CONTENT: SubNicheContent = {
  image: '/Otros/sim-emprendimiento.avif',
  hook: '3 estrategias que hacen crecer tu negocio en Instagram — sin gastar en publicidad',
  cta: 'Conoce más →',
  caption: '¿Cuál estrategia te funciona mejor? Cuéntanos 👇',
  chatMessages: [
    { from: 'user', text: 'Hola! Vi su publicación. ¿Qué servicios ofrecen?' },
    { from: 'linda', text: '¡Hola! Gracias por escribirnos 😊 Ofrecemos varios servicios y paquetes adaptados a lo que necesites.' },
    { from: 'user', text: '¿Cuánto cuestan?' },
    { from: 'linda', text: 'Los precios varían según el servicio. Te puedo enviar nuestro catálogo completo con todos los detalles 📋' },
    { from: 'user', text: 'Dale, me interesa verlo. Gracias!' },
  ],
  crmContacts: [
    { name: 'María Torres', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Premium', 'Frecuente'], potential: 'Alta', potentialColor: '#059669' },
    { name: 'Roberto García', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Consulta', 'Instagram'], potential: 'Alta', potentialColor: '#059669' },
    { name: 'Andrea López', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Servicio A', 'Preguntó precios'], potential: 'Media', potentialColor: '#D97706' },
    { name: 'Daniel Mejía', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Paquete básico', 'Nuevo'], potential: 'Alta', potentialColor: '#059669' },
  ],
};

export function resolveSubNiche(username?: string, fullName?: string, biography?: string): SubNicheContent {
  const text = [username, fullName, biography].filter(Boolean).join(' ');
  for (const rule of SUB_NICHE_RULES) {
    if (rule.regex.test(text)) {
      return SUB_NICHE_CONTENT[rule.niche] ?? DEFAULT_CONTENT;
    }
  }
  return DEFAULT_CONTENT;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LindaSolutions({ criticalPoints, username, profilePicUrl, fullName, biography, signupUrl }: LindaSolutionsProps) {
  const topPoints = criticalPoints.slice(0, 3);
  const content = resolveSubNiche(username, fullName, biography);

  return (
    <div>
      <div className="reveal text-center flex flex-col items-center" style={{ marginBottom: 48 }}>
        <p className="font-inter text-base-oscura" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, lineHeight: 1.3, maxWidth: 520, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Cada problema tiene solución.{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#2FBE8A' }}>
            Linda
          </span>
          {' '}ya sabe cómo resolverlo.
        </p>
        <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560 }}>
          Cada punto crítico tiene su respuesta directa. Linda trabaja 24/7 para que tú te enfoques en tu negocio.
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 64 }}>
        {/* Feature 1 — Content creation */}
        <FeatureRow direction="normal">
          <FeatureText
            badgeIcon="solar:gallery-minimalistic-outline"
            badgeLabel={topPoints[0] ? `Resuelve: ${TYPE_LABELS[topPoints[0].type] ?? topPoints[0].type}` : 'Creación de contenido'}
            badgeBg="#DFEDFE"
            badgeColor="#487CBB"
            title="Crea contenido diseñado para que tu audiencia responda"
            desc="Cada 3 días Linda genera propuestas de contenido con hooks, preguntas y CTAs personalizados para tu sector. No publicas contenido genérico — publicas contenido que provoca respuestas. Tú solo apruebas y se publica."
            ctaLabel="Quiero mejorar mis publicaciones"
            signupUrl={signupUrl}
            username={username}
          />
          <PostSimulation username={username} profilePicUrl={profilePicUrl} content={content} />
        </FeatureRow>

        {/* Feature 2 — Auto replies (inverted) */}
        <FeatureRow direction="inverted">
          <FeatureText
            badgeIcon="solar:chat-round-dots-outline"
            badgeLabel={topPoints[1] ? `Resuelve: ${TYPE_LABELS[topPoints[1].type] ?? topPoints[1].type}` : 'Respuestas automáticas'}
            badgeBg="#D6F6EB"
            badgeColor="#279E73"
            title="Cada mensaje y comentario respondido al instante, 24/7"
            desc="Linda responde mensajes en segundos con el tono de tu marca, detecta la intención del mensaje y guía al cliente hacia agendar. También responde comentarios para mantener la conversación activa."
            ctaLabel="Quiero responder más rápido"
            signupUrl={signupUrl}
            username={username}
          />
          <ChatSimulation messages={content.chatMessages} />
        </FeatureRow>

        {/* Feature 3 — CRM inteligente */}
        <FeatureRow direction="normal">
          <FeatureText
            badgeIcon="solar:users-group-rounded-outline"
            badgeLabel={topPoints[2] ? `Resuelve: ${TYPE_LABELS[topPoints[2].type] ?? topPoints[2].type}` : 'CRM inteligente'}
            badgeBg="#FEF3C7"
            badgeColor="#D97706"
            title="Cada contacto de Instagram se guarda y organiza solo"
            desc="Cuando alguien te escribe por Instagram, Linda captura sus datos, lo etiqueta según su interés y lo registra automáticamente en tu panel de contactos. Tú solo ves quién te escribió, qué quiere y cuándo hacer seguimiento."
            ctaLabel="Quiero organizar mis contactos"
            signupUrl={signupUrl}
            username={username}
          />
          <CrmSimulation contacts={content.crmContacts} />
        </FeatureRow>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature layout                                                      */
/* ------------------------------------------------------------------ */

function FeatureRow({ direction, children }: { direction: 'normal' | 'inverted'; children: React.ReactNode }) {
  const dirClass = direction === 'inverted' ? 'sm:flex-row-reverse' : 'sm:flex-row';
  return (
    <div className={`reveal flex flex-col ${dirClass} gap-12 items-center`}>
      {children}
    </div>
  );
}

function FeatureText({ badgeIcon, badgeLabel, badgeBg, badgeColor, title, desc, ctaLabel, signupUrl, username }: {
  badgeIcon: string; badgeLabel: string; badgeBg: string; badgeColor: string; title: string; desc: string; ctaLabel?: string; signupUrl?: string | null; username?: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div
        className="mb-3 inline-flex items-center gap-1.5 rounded-full font-inter"
        style={{ fontSize: 14, fontWeight: 500, padding: '6px 16px', backgroundColor: badgeBg, color: badgeColor }}
      >
        <Icon icon={badgeIcon} width={14} height={14} />
        {badgeLabel}
      </div>
      <h3 className="font-inter text-base-oscura" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>
        {title}
      </h3>
      <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5 }}>
        {desc}
      </p>
      {ctaLabel && (
        <button
          type="button"
          onClick={() => {
            if (signupUrl) {
              trackClickTrial(username ?? '', { source: 'linda_solutions' });
              window.open(signupUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="inline-flex items-center gap-2 rounded-full font-inter transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            marginTop: 16,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: badgeColor,
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {ctaLabel}
          <Icon icon="solar:arrow-right-outline" width={16} height={16} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Post simulation                                                     */
/* ------------------------------------------------------------------ */

function PostSimulation({ username, profilePicUrl, content }: { username: string; profilePicUrl?: string; content: SubNicheContent }) {
  const proxiedPic = proxyImageUrl(profilePicUrl);

  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ padding: '12px 16px' }}>
        {proxiedPic ? (
          <img
            src={proxiedPic}
            alt={`Foto de perfil de @${username}`}
            loading="lazy"
            className="rounded-full object-cover"
            style={{ width: 32, height: 32 }}
          />
        ) : (
          <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #B0D2FC, #9AE9CC)' }}>
            <Icon icon="solar:user-circle-outline" width={18} height={18} color="#0A2540" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>@{username}</span>
        </div>
        <div
          className="inline-flex items-center gap-1 rounded-full font-inter"
          style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', backgroundColor: '#D6F6EB', color: '#279E73' }}
        >
          <Icon icon="solar:magic-stick-3-outline" width={10} height={10} />
          Linda
        </div>
      </div>

      {/* Body — photo */}
      <div
        className="relative flex flex-col justify-end"
        style={{
          height: 240,
          backgroundImage: `url(${content.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          padding: 16,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
        <p className="relative font-inter text-white" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
          {content.hook}
        </p>
        <span className="relative font-inter" style={{ fontSize: 12, color: '#93C5FD', fontWeight: 600 }}>
          {content.cta}
        </span>
      </div>

      {/* Caption */}
      <div style={{ padding: '12px 16px' }}>
        <p className="font-inter text-gray-600" style={{ fontSize: 12, lineHeight: 1.5 }}>
          {content.caption}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 border-t border-gray-100" style={{ padding: '10px 16px' }}>
        <StatChip icon="solar:heart-outline" value="147" />
        <StatChip icon="solar:chat-round-dots-outline" value="38" />
        <StatChip icon="solar:square-share-line-outline" value="12" />
      </div>
    </div>
  );
}

function StatChip({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-inter text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
      <Icon icon={icon} width={14} height={14} />
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Chat simulation                                                     */
/* ------------------------------------------------------------------ */

function ChatSimulation({ messages }: { messages: { from: string; text: string }[] }) {
  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100" style={{ padding: '12px 16px' }}>
        <span className="inline-block rounded-full arranque-dot-pulse" style={{ width: 8, height: 8, backgroundColor: '#34D399' }} />
        <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>Linda activa en mensajes</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2" style={{ padding: 16, maxHeight: 280, overflow: 'hidden' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`arranque-chat-bubble max-w-[85%] rounded-[14px] font-inter ${msg.from === 'user' ? 'self-start' : 'self-end'}`}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              lineHeight: 1.4,
              backgroundColor: msg.from === 'user' ? '#F1F5F9' : '#D6F6EB',
              color: msg.from === 'user' ? '#64748B' : '#1D7454',
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 flex items-center gap-1.5" style={{ padding: '10px 16px' }}>
        <Icon icon="solar:clock-circle-outline" width={12} height={12} color="#34D399" />
        <span className="font-inter" style={{ fontSize: 11, color: '#2FBE8A', fontWeight: 600 }}>
          Respondido en 8 segundos · Contacto registrado
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CRM simulation                                                      */
/* ------------------------------------------------------------------ */

interface CrmContact {
  name: string;
  status: string;
  statusColor: string;
  statusBg: string;
  tags: string[];
  potential: string;
  potentialColor: string;
}

function CrmSimulation({ contacts }: { contacts: CrmContact[] }) {
  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 700 }}>Contactos</span>
          <span className="font-inter text-gray-400" style={{ fontSize: 11 }}>25</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full font-inter" style={{ fontSize: 9, fontWeight: 600, padding: '3px 10px', backgroundColor: '#0A2540', color: '#fff' }}>
            <Icon icon="solar:user-plus-outline" width={10} height={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
            Nuevo
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid font-inter text-gray-400" style={{ gridTemplateColumns: '1fr auto auto', padding: '8px 16px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #F8FAFC' }}>
        <span>Contacto</span>
        <span style={{ width: 64, textAlign: 'center' }}>Estado</span>
        <span style={{ width: 48, textAlign: 'right' }}>Potencial</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {contacts.map((c, i) => (
          <div
            key={i}
            className="grid items-center"
            style={{ gridTemplateColumns: '1fr auto auto', padding: '10px 16px', borderBottom: i < contacts.length - 1 ? '1px solid #F8FAFC' : 'none' }}
          >
            <div>
              <span className="font-inter text-base-oscura" style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
              <div className="flex gap-1 mt-1">
                {c.tags.map((tag, j) => (
                  <span key={j} className="font-inter rounded" style={{ fontSize: 9, fontWeight: 500, padding: '1px 6px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span
              className="font-inter rounded-full text-center"
              style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', width: 64, backgroundColor: c.statusBg, color: c.statusColor }}
            >
              {c.status}
            </span>
            <span className="font-inter text-right" style={{ fontSize: 11, fontWeight: 700, width: 48, color: c.potentialColor }}>
              {c.potential}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5 border-t border-gray-100" style={{ padding: '10px 16px' }}>
        <Icon icon="solar:magic-stick-3-outline" width={12} height={12} color="#34D399" />
        <span className="font-inter" style={{ fontSize: 11, color: '#2FBE8A', fontWeight: 600 }}>
          Contactos etiquetados automáticamente por Linda
        </span>
      </div>
    </div>
  );
}
