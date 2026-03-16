'use client';

const SOCIAL_LINKS = [
  {
    url: 'https://www.instagram.com/bewe_software/',
    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"/></svg>,
  },
  {
    url: 'https://www.linkedin.com/company/bewesoftware/posts/?feedView=all',
    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>,
  },
  {
    url: 'https://www.youtube.com/@BeweSoftware',
    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z"/></svg>,
  },
  {
    url: 'https://www.tiktok.com/@bewe_software',
    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/></svg>,
  },
  {
    url: 'https://www.facebook.com/BeweSoftware',
    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06 2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96c1.09 0 2.23.19 2.23.19V8.62H15.19c-1.24 0-1.63.77-1.63 1.56V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>,
  },
];

const FEATURE_LINKS = [
  { label: 'CRM AI-Native', url: 'https://www.bewe.io/soluciones/crm' },
  { label: 'Asistente de Ventas con IA', url: 'https://www.bewe.io/soluciones/asistente-ventas' },
  { label: 'Marketing Automatizado', url: 'https://www.bewe.io/soluciones/fideliza/automatizacion-de-mensajes' },
];

export function BeweFooter() {
  return (
    <footer style={{ background: '#0A2540', padding: '60px 24px 32px' }}>
      <div
        className="mx-auto flex flex-col sm:flex-row justify-between gap-10"
        style={{ maxWidth: 1100 }}
      >
        {/* Left column */}
        <div className="items-center sm:items-start" style={{ maxWidth: 400 }}>
          <p
            className="font-inter"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 16 }}
          >
            BeweOS
          </p>
          <p
            className="font-inter"
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 20 }}
          >
            El sistema operativo AI-first para PYMES. Deja de operar y empieza a dirigir tu negocio.
          </p>
          <div className="flex gap-3" style={{ marginBottom: 20 }}>
            {SOCIAL_LINKS.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {s.svg}
              </a>
            ))}
          </div>
          <p className="font-inter" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            &copy; 2026 Bewe
          </p>
        </div>

        {/* Right column */}
        <div>
          <p
            className="font-inter"
            style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}
          >
            Funcionalidades
          </p>
          <div className="flex flex-col gap-2.5">
            {FEATURE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter transition-colors hover:text-white"
                style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
