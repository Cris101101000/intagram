'use client';

// ---------------------------------------------------------------------------
// CTA with phone mockup showing iOS-style notifications
// Used in Diagnóstico and Arranque result pages
// ---------------------------------------------------------------------------

type SectorKey = 'belleza' | 'bienestar' | 'fitness' | 'salud' | 'general';
type Page = 'diagnostico' | 'arranque';

function getTodayFormatted(): string {
  const now = new Date();
  const day = now.toLocaleDateString('es-ES', { weekday: 'long' });
  const date = now.getDate();
  const month = now.toLocaleDateString('es-ES', { month: 'long' });
  return `${day.charAt(0).toUpperCase() + day.slice(1)}, ${date} de ${month}`;
}

interface CTAPhoneNotifsProps {
  username: string;
  sector: string;
  page: Page;
  signupUrl?: string | null;
}

// ---------------------------------------------------------------------------
// Sector → notification content library
// ---------------------------------------------------------------------------

interface NotifContent {
  app: 'beweos' | 'instagram' | 'crm';
  title: string;
  body: string;
  timestamp: string;
}

const SECTOR_EMOJI: Record<SectorKey, string> = {
  belleza: '💇‍♀️',
  fitness: '🏋️',
  bienestar: '🧘',
  salud: '🩺',
  general: '💼',
};

function getSectorKey(sector: string): SectorKey {
  const s = sector.toLowerCase();
  if (['belleza'].includes(s)) return 'belleza';
  if (['fitness'].includes(s)) return 'fitness';
  if (['bienestar'].includes(s)) return 'bienestar';
  if (['salud'].includes(s)) return 'salud';
  return 'general';
}

const NOTIF_LIBRARY: Record<SectorKey, NotifContent[]> = {
  belleza: [
    { app: 'beweos', title: 'Propuesta de contenido lista', body: '"5 errores al cuidar tu cabello" — copy + imagen listos. Toca para aprobar.', timestamp: 'ahora' },
    { app: 'instagram', title: 'Linda respondió a María G.', body: '"¿Cuánto cuesta un corte + tinte?" — Respondido en 8s con precios y cita agendada.', timestamp: 'hace 2 min' },
    { app: 'crm', title: 'Nuevo lead: Ana López', body: 'Registrada automáticamente. Interés: balayage rubio. Potencial: alto.', timestamp: 'hace 8 min' },
  ],
  fitness: [
    { app: 'beweos', title: 'Propuesta de contenido lista', body: '"3 ejercicios que haces mal" — copy + imagen listos. Toca para aprobar.', timestamp: 'ahora' },
    { app: 'instagram', title: 'Linda respondió a Carlos R.', body: '"¿Tienen clases para principiantes?" — Respondido en 8s con horarios y clase de prueba.', timestamp: 'hace 2 min' },
    { app: 'crm', title: 'Nuevo lead: Pedro Sánchez', body: 'Registrado automáticamente. Interés: plan trimestral. Potencial: alto.', timestamp: 'hace 8 min' },
  ],
  bienestar: [
    { app: 'beweos', title: 'Propuesta de contenido lista', body: '"Lo que nadie te dice del yoga" — copy + imagen listos. Toca para aprobar.', timestamp: 'ahora' },
    { app: 'instagram', title: 'Linda respondió a Ana L.', body: '"¿Tienen yoga para embarazadas?" — Respondido en 8s con opciones y disponibilidad.', timestamp: 'hace 2 min' },
    { app: 'crm', title: 'Nuevo lead: Carmen Ruiz', body: 'Registrada automáticamente. Interés: pilates. Potencial: alto.', timestamp: 'hace 8 min' },
  ],
  salud: [
    { app: 'beweos', title: 'Propuesta de contenido lista', body: '"Mitos sobre la alimentación" — copy + imagen listos. Toca para aprobar.', timestamp: 'ahora' },
    { app: 'instagram', title: 'Linda respondió a Laura D.', body: '"¿Cuánto cuesta una consulta?" — Respondido en 8s con precios y agenda disponible.', timestamp: 'hace 2 min' },
    { app: 'crm', title: 'Nuevo lead: Jorge Martínez', body: 'Registrado automáticamente. Interés: consulta nutrición. Potencial: alto.', timestamp: 'hace 8 min' },
  ],
  general: [
    { app: 'beweos', title: 'Propuesta de contenido lista', body: 'Contenido nuevo para tu negocio — copy + imagen listos. Toca para aprobar.', timestamp: 'ahora' },
    { app: 'instagram', title: 'Linda respondió a María G.', body: '"¿Qué servicios ofrecen?" — Respondido en 8s con información completa.', timestamp: 'hace 2 min' },
    { app: 'crm', title: 'Nuevo lead: Ana López', body: 'Registrada automáticamente. Interés detectado por Linda. Potencial: alto.', timestamp: 'hace 8 min' },
  ],
};

const NOTIF_4_DIAGNOSTICO: NotifContent = {
  app: 'beweos',
  title: '12 comentarios respondidos',
  body: 'Linda respondió todos los comentarios de tu post de ayer con el tono de tu marca.',
  timestamp: 'hace 15 min',
};

const NOTIF_4_ARRANQUE: NotifContent = {
  app: 'beweos',
  title: 'Tu primer post publicado',
  body: 'Linda generó y publicó tu primer contenido desde BeweOS. ¡Ya estás en el feed!',
  timestamp: 'hace 15 min',
};

const SUBTITLES: Record<Page, string> = {
  diagnostico: 'Linda responde DMs, crea contenido y captura leads por ti. Pruébala 30 días gratis y ve tu score subir desde la primera semana.',
  arranque: 'Linda responde mensajes, crea contenido y registra contactos desde el día 1. Pruébala 30 días gratis.',
};

// ---------------------------------------------------------------------------
// App icon styles
// ---------------------------------------------------------------------------

const APP_STYLES: Record<string, { bg: string; emoji: string; name: string }> = {
  beweos: { bg: 'linear-gradient(135deg, #34D399, #279E73)', emoji: '🤖', name: 'BeweOS' },
  instagram: { bg: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)', emoji: '📷', name: 'Instagram' },
  crm: { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', emoji: '📋', name: 'BeweOS CRM' },
};

// ---------------------------------------------------------------------------
// Notification card
// ---------------------------------------------------------------------------

function NotifCard({ notif, index }: { notif: NotifContent; index: number }) {
  const style = APP_STYLES[notif.app];

  return (
    <div
      className="cta-notif-bubble flex gap-2 items-start"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.9)',
        borderRadius: 14,
        padding: '8px 10px',
        textAlign: 'left',
        animationDelay: `${index * 1.5}s`,
      }}
    >
      {/* App icon */}
      <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: 26, minWidth: 26, height: 26, borderRadius: 7, background: style.bg, fontSize: 12 }}
      >
        {style.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-1" style={{ marginBottom: 1 }}>
          <span className="font-inter text-gray-400" style={{ fontSize: 9, fontWeight: 600 }}>{style.name}</span>
          <span style={{ width: 2, height: 2, borderRadius: '50%', backgroundColor: '#D1D5DB', flexShrink: 0 }} />
          <span className="font-inter text-gray-400" style={{ fontSize: 9, fontWeight: 500 }}>{notif.timestamp}</span>
        </div>
        {/* Title */}
        <p className="font-inter text-base-oscura" style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.2 }}>
          {notif.title}
        </p>
        {/* Body */}
        <p
          className="font-inter text-gray-500"
          style={{
            fontSize: 9,
            fontWeight: 400,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {notif.body}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phone mockup
// ---------------------------------------------------------------------------

function PhoneMockup({ notifications }: { notifications: NotifContent[] }) {
  return (
    <div className="relative inline-block" style={{ marginBottom: 40, animation: 'cta-phone-float 4s ease-in-out infinite', zIndex: 2 }}>
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          top: '50%',
          left: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, rgba(96,165,250,0.06) 50%, transparent 70%)',
          animation: 'cta-glow-pulse 3s ease-in-out infinite',
          zIndex: -1,
        }}
        aria-hidden="true"
      />

      {/* Phone frame */}
      <div
        className="relative"
        style={{
          width: 240,
          height: 490,
          borderRadius: 36,
          background: '#000',
          padding: 8,
          boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 20px 60px rgba(10,37,64,0.18), 0 0 60px rgba(52,211,153,0.06)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute flex items-center justify-center"
          style={{ top: 8, left: '50%', transform: 'translateX(-50%)', width: 90, height: 26, background: '#000', borderRadius: '0 0 16px 16px', zIndex: 10 }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a2e', border: '2px solid #2a2a3e' }} />
        </div>

        {/* Screen */}
        <div
          className="flex flex-col"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 28,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #E8F0FE 0%, #DBEAFE 30%, #D1FAE5 70%, #ECFDF5 100%)',
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between" style={{ padding: '10px 20px 0' }}>
            <span className="font-inter" style={{ fontSize: 11, fontWeight: 600, color: '#0A2540', opacity: 0.5 }}>9:41</span>
            <span style={{ fontSize: 9, opacity: 0.35 }}>📶 🔋</span>
          </div>

          {/* Time */}
          <div className="text-center" style={{ padding: '10px 0 6px' }}>
            <div className="font-inter" style={{ fontSize: 40, fontWeight: 300, color: '#0A2540', letterSpacing: -2, lineHeight: 1 }}>
              9:41
            </div>
            <div className="font-inter text-gray-500" style={{ fontSize: 10, fontWeight: 500, marginTop: 3 }}>
              {getTodayFormatted()}
            </div>
          </div>

          {/* Notifications */}
          <div
            className="flex flex-col flex-1"
            style={{ gap: 6, padding: '6px 8px 0', overflow: 'hidden' }}
          >
            {notifications.map((notif, i) => (
              <NotifCard key={i} notif={notif} index={i} />
            ))}
          </div>

          {/* Home indicator */}
          <div style={{ width: 100, height: 4, borderRadius: 99, background: 'rgba(10,37,64,0.12)', margin: '6px auto 10px' }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function CTAPhoneNotifs({ username, sector, page, signupUrl }: CTAPhoneNotifsProps) {
  const sectorKey = getSectorKey(sector);
  const sectorNotifs = NOTIF_LIBRARY[sectorKey];
  const notif4 = page === 'arranque' ? NOTIF_4_ARRANQUE : NOTIF_4_DIAGNOSTICO;
  const notifications = [...sectorNotifs, notif4];

  return (
    <div className="reveal" style={{ overflow: 'hidden' }}>
      <div
        className="flex flex-col items-center text-center"
        style={{ padding: '80px 24px' }}
      >
        {/* Phone */}
        <PhoneMockup notifications={notifications} />

        {/* Text content */}
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {/* Title */}
          <h2
            className="font-inter text-base-oscura"
            style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 12 }}
          >
            Esto pasa cuando Linda trabaja para{' '}
            <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#2FBE8A' }}>
              {username}
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="font-inter text-gray-500"
            style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}
          >
            {SUBTITLES[page]}
          </p>

          {/* CTA button */}
          <a
            href={signupUrl ?? '#'}
            target={signupUrl ? '_blank' : undefined}
            rel={signupUrl ? 'noopener noreferrer' : undefined}
            onClick={() => {
              fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, eventType: 'cta_free_trial' }),
              }).catch(() => {});
            }}
            className="cta-shimmer relative mb-4 inline-flex items-center gap-2.5 rounded-full font-inter text-white transition-all hover:-translate-y-0.5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #34D399, #60A5FA)',
              fontSize: 16,
              fontWeight: 700,
              padding: '16px 40px',
              borderRadius: 99,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(52,211,153,0.35)',
              animation: 'cta-pulse 2.5s ease-in-out infinite',
              textDecoration: 'none',
            }}
          >
            <span className="relative z-10 inline-flex items-center gap-2.5">
              Comenzar mi prueba gratis
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="cta-arrow">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

          {/* Trust note */}
          <p className="font-inter text-gray-400" style={{ fontSize: 12, marginTop: 16 }}>
            <span className="text-gray-600" style={{ fontWeight: 700 }}>30 días gratis.</span>{' '}
            Sin tarjeta de crédito. Cancela cuando quieras.
          </p>
        </div>
      </div>
    </div>
  );
}
