'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalyticsData {
  totalSessions: number;
  totalAudits: number;
  totalLeads: number;
  conversionRate: number;
  scoreDistribution: { level: string; count: number; color: string }[];
  averageScore: number;
  scoreBySector: { sector: string; avgScore: number; count: number }[];
  routeDistribution: { route: string; count: number }[];
  dailyData: { date: string; sessions: number; audits: number; leads: number; freeTrials: number }[];
  leadsByScoreLevel: { level: string; count: number }[];
  leadsBySector: { sector: string; count: number }[];
  byDevice: { device: string; count: number; pct: number }[];
  byLocale: { locale: string; count: number }[];
  byCountry: { country: string; count: number; pct: number }[];
  topAuditedUsernames: { username: string; auditCount: number; lastScore: number }[];
  highestScores: { username: string; score: number; sector: string }[];
  lowestScores: { username: string; score: number; sector: string }[];
  eventCounts: Record<string, number>;
  freeTrialLeads: { fechaClick: string; username: string; nombreCompleto: string; email: string; telefono: string }[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const LEVEL_LABELS: Record<string, string> = {
  CRITICO: 'Critico',
  REGULAR: 'Regular',
  BUENO: 'Bueno',
  EXCELENTE: 'Excelente',
};

const LEVEL_COLORS: Record<string, string> = {
  CRITICO: '#F87171',
  REGULAR: '#FBBF24',
  BUENO: '#38BDF8',
  EXCELENTE: '#4ADE80',
};

const ROUTE_COLORS: Record<string, string> = {
  DIAGNOSTICO: '#6366F1',
  ARRANQUE: '#34D399',
  EVOLUCION: '#F59E0B',
};

const SECTOR_EMOJIS: Record<string, string> = {
  belleza: '💅',
  fitness: '🏋️',
  bienestar: '🧘',
  salud: '🏥',
  general: '📱',
};

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------

const S = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: "'Inter', system-ui, sans-serif",
    color: '#0A2540',
  } as React.CSSProperties,
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: 12,
    padding: '16px 24px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #E2E8F0',
  } as React.CSSProperties,
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  } as React.CSSProperties,
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  dateInput: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    fontSize: 13,
    fontFamily: 'inherit',
    color: '#0A2540',
    outline: 'none',
  } as React.CSSProperties,
  btn: (bg: string, color: string): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: 10,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    background: bg,
    color,
    transition: 'opacity 0.15s',
  }),
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px 64px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 32,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    marginBottom: 4,
  } as React.CSSProperties,
  sectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  } as React.CSSProperties,
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  } as React.CSSProperties,
  card: (accent: string): React.CSSProperties => ({
    padding: 24,
    borderRadius: 16,
    background: '#FFFFFF',
    border: '1px solid #F1F5F9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }),
  cardIcon: (bg: string): React.CSSProperties => ({
    width: 40,
    height: 40,
    borderRadius: 12,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  }),
  cardValue: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1,
  } as React.CSSProperties,
  cardLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#64748B',
  } as React.CSSProperties,
  dropoff: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: '#EF4444',
    padding: '2px 8px',
    borderRadius: 99,
    background: 'rgba(239,68,68,0.08)',
    alignSelf: 'center' as const,
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 13,
  } as React.CSSProperties,
  th: {
    padding: '10px 14px',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: '#64748B',
    borderBottom: '1px solid #E2E8F0',
  } as React.CSSProperties,
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #F1F5F9',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  chartCard: {
    padding: 24,
    borderRadius: 16,
    background: '#FFFFFF',
    border: '1px solid #F1F5F9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    overflowX: 'auto' as const,
  } as React.CSSProperties,
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 16,
  } as React.CSSProperties,
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 16,
  } as React.CSSProperties,
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  } as React.CSSProperties,
  pill: (bg: string, color: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
    background: bg,
    color,
  }),
  skeleton: {
    height: 20,
    borderRadius: 8,
    background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  } as React.CSSProperties,
  footer: {
    textAlign: 'center' as const,
    padding: '24px 0',
    fontSize: 12,
    color: '#94A3B8',
  } as React.CSSProperties,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AnalyticsDashboardPage() {
  const today = new Date();
  const defaultStart = addDays(today, -30);

  const [startDate, setStartDate] = useState(fmtDate(defaultStart));
  const [endDate, setEndDate] = useState(fmtDate(today));
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  // ── Fetch data ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analytics?start=${startDate}&end=${endDate}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString('es'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── CSV export ──────────────────────────────────────────────────
  const exportCSV = () => {
    if (!data) return;
    const escapeCsv = (v: string | number): string => {
      const s = String(v ?? '');
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows: (string | number)[][] = [
      ['Metrica', 'Valor'],
      ['Total Sesiones', data.totalSessions],
      ['Total Auditorias', data.totalAudits],
      ['Total Leads', data.totalLeads],
      ['Tasa de Conversion (%)', data.conversionRate],
      ['Score Promedio', data.averageScore],
      [],
      ['Fecha', 'Usuarios unicos', 'Auditorias', 'Leads', 'Free Trial'],
      ...data.dailyData.map((d) => [d.date, d.sessions, d.audits, d.leads, d.freeTrials]),
      [],
      ['Pais', 'Sesiones', '%'],
      ...data.byCountry.map((c) => [c.country, c.count, c.pct]),
      [],
      ['Leads que hicieron click en Free Trial'],
      ['Fecha Click', '@Usuario IG', 'Nombre Completo', 'Email', 'Telefono'],
      ...(data.freeTrialLeads ?? []).map((l) => [l.fechaClick, l.username, l.nombreCompleto, l.email, l.telefono]),
    ];
    const csv = rows.map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ig-audit-analytics-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render helpers ──────────────────────────────────────────────
  const sectionHeader = (title: string, sub?: string) => (
    <div>
      <div style={S.sectionTitle}>{title}</div>
      {sub && <div style={S.sectionSub}>{sub}</div>}
    </div>
  );

  const funnelCard = (
    emoji: string,
    value: number | string,
    label: string,
    desc: string,
    color: string,
    bg: string,
  ) => (
    <div style={S.card(color)}>
      <div style={S.cardIcon(bg)}>{emoji}</div>
      <div style={{ ...S.cardValue, color }}>{value}</div>
      <div style={{ ...S.cardLabel, fontWeight: 700, color: '#0A2540', fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.4 }}>{desc}</div>
    </div>
  );

  // ── Loading / Error ─────────────────────────────────────────────
  if (error && !data) {
    return (
      <div style={S.page}>
        <div style={{ ...S.content, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Error al cargar datos</div>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>{error}</div>
          <button onClick={fetchData} style={S.btn('#0A2540', '#FFFFFF')}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Shimmer keyframe */}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } to { background-position: -200% 0 } }`}</style>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={S.header}>
        <div style={S.headerTitle}>📊 IG Audit — Analytics</div>
        <div style={S.headerRight}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={S.dateInput}
          />
          <span style={{ color: '#94A3B8', fontSize: 13 }}>—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={S.dateInput}
          />
          <button
            onClick={exportCSV}
            disabled={loading || !data}
            style={{ ...S.btn('#F1F5F9', '#0A2540'), opacity: loading || !data ? 0.5 : 1 }}
          >
            📥 Exportar CSV
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{ ...S.btn('#0A2540', '#FFFFFF'), opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
          </button>
        </div>
      </header>

      <div style={S.content}>
        {/* ── Section 1: Funnel ────────────────────────────────── */}
        {sectionHeader('Embudo de Conversión', 'Flujo completo: sesión → auditoría → lead')}

        {!data ? (
          <div style={S.cardsRow}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...S.card('#E2E8F0'), height: 140 }}>
                <div style={{ ...S.skeleton, width: 40, height: 40 }} />
                <div style={{ ...S.skeleton, width: 80, height: 32 }} />
                <div style={{ ...S.skeleton, width: 120, height: 14 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={S.cardsRow}>
              {funnelCard('👁️', data.totalSessions, 'Usuarios que ingresaron', 'Cantidad de usuarios que iniciaron una sesión en la herramienta', '#6366F1', 'rgba(99,102,241,0.1)')}
              {funnelCard('✅', data.totalAudits, 'Usuarios auditados', 'Cantidad de perfiles de Instagram que fueron scrapeados y analizados', '#3B82F6', 'rgba(59,130,246,0.1)')}
              {funnelCard('📩', data.totalLeads, 'Usuarios que dejaron datos', 'Cantidad de usuarios que llenaron el formulario de datos personales', '#10B981', 'rgba(16,185,129,0.1)')}
              {funnelCard('🚀', data.eventCounts['cta_free_trial'] ?? 0, 'Click en Free Trial', 'Cantidad de usuarios que hicieron click en el botón de prueba gratis', '#F59E0B', 'rgba(245,158,11,0.1)')}
            </div>

            {/* ── Abandonment section ────────────────────────────── */}
            {(() => {
              const a1 = data.totalSessions;
              const a2 = Math.min(data.totalAudits, a1);
              const a3 = Math.min(data.totalLeads, a2);
              const a4 = Math.min(data.eventCounts['cta_free_trial'] ?? 0, a3);

              const stages = [
                {
                  icon: '🚪',
                  label: 'Ingresaron pero no auditaron su perfil',
                  desc: 'Usuarios que iniciaron sesión pero no ingresaron un usuario de Instagram para auditar',
                  count: a1 - a2,
                  color: '#EF4444',
                  bg: '#FEF2F2',
                  border: '#FECACA',
                },
                {
                  icon: '📋',
                  label: 'Se auditaron pero no llenaron el formulario',
                  desc: 'Usuarios que completaron el análisis de su perfil pero abandonaron en el formulario de datos personales',
                  count: a2 - a3,
                  color: '#F59E0B',
                  bg: '#FFFBEB',
                  border: '#FDE68A',
                },
                {
                  icon: '🚀',
                  label: 'Vieron resultados pero no dieron click en Free Trial',
                  desc: 'Usuarios que llenaron sus datos y vieron su auditoría completa pero no activaron la prueba gratis',
                  count: a3 - a4,
                  color: '#8B5CF6',
                  bg: '#F5F3FF',
                  border: '#DDD6FE',
                },
              ];

              const maxCount = Math.max(...stages.map((s) => s.count));

              return (
                <div>
                  {sectionHeader('Dónde se pierden los usuarios', 'Abandono por cada etapa del flujo')}
                  <div style={S.chartCard}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {stages.map((stage, i) => {
                        const isWorst = stage.count === maxCount && stage.count > 0;
                        const pct = a1 > 0 ? Math.round((stage.count / a1) * 1000) / 10 : 0;
                        const barWidth = a1 > 0 ? Math.max((stage.count / a1) * 100, stage.count > 0 ? 2 : 0) : 0;

                        return (
                          <div
                            key={i}
                            style={{
                              padding: '16px 18px',
                              borderRadius: 12,
                              border: `1px solid ${isWorst ? stage.border : '#F1F5F9'}`,
                              borderLeft: `4px solid ${stage.color}`,
                              background: isWorst ? stage.bg : '#FFFFFF',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                <span style={{ fontSize: 22 }}>{stage.icon}</span>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{stage.label}</div>
                                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{stage.desc}</div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: stage.color }}>{stage.count}</div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>personas</div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                                <div
                                  style={{
                                    width: `${barWidth}%`,
                                    height: '100%',
                                    borderRadius: 4,
                                    background: stage.color,
                                    transition: 'width 0.6s ease',
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: stage.color, minWidth: 48, textAlign: 'right' }}>
                                {pct}%
                              </span>
                            </div>

                            {/* Worst stage indicator */}
                            {isWorst && (
                              <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, marginTop: 8 }}>
                                ⚠️ Etapa con mayor pérdida de usuarios
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {data && (
          <>
            {/* ── Post-Audit Actions ─────────────────────────────── */}
            <div>
              {sectionHeader('Acciones Post-Auditoría', 'Qué hacen los usuarios después de ver sus resultados')}
              <div style={{ ...S.cardsRow, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {[
                  { key: 'share_whatsapp', emoji: '💬', label: 'Compartieron por WhatsApp', color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
                  { key: 'share_instagram', emoji: '📸', label: 'Compartieron por Instagram', color: '#E040FB', bg: 'rgba(224,64,251,0.1)' },
                  { key: 'share_download', emoji: '📥', label: 'Descargaron imagen', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
                  { key: 'share_copy_url', emoji: '🔗', label: 'Copiaron URL de resultados', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
                  { key: 'cta_free_trial', emoji: '🚀', label: 'Click en Free Trial', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
                ].map((item) => (
                  <div key={item.key} style={S.card(item.color)}>
                    <div style={S.cardIcon(item.bg)}>{item.emoji}</div>
                    <div style={{ ...S.cardValue, color: item.color }}>{data.eventCounts[item.key] ?? 0}</div>
                    <div style={S.cardLabel}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 2: Score Distribution ──────────────────── */}
            <div>
              {sectionHeader('Distribución de Scores', 'Cantidad de auditorías por nivel')}
              <div style={S.grid2}>
                <div style={S.chartCard}>
                  {data.scoreDistribution.map((item) => {
                    const max = Math.max(...data.scoreDistribution.map((i) => i.count), 1);
                    return (
                      <div key={item.level} style={S.barRow}>
                        <span style={{ width: 80, fontSize: 13, fontWeight: 600 }}>
                          {LEVEL_LABELS[item.level] ?? item.level}
                        </span>
                        <div style={{ flex: 1, height: 28, borderRadius: 8, background: '#F1F5F9', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${(item.count / max) * 100}%`,
                              height: '100%',
                              background: item.color,
                              borderRadius: 8,
                              transition: 'width 0.6s ease',
                              minWidth: item.count > 0 ? 2 : 0,
                            }}
                          />
                        </div>
                        <span style={{ width: 40, textAlign: 'right', fontSize: 14, fontWeight: 700 }}>
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ ...S.chartCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Score Promedio</div>
                  <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.03em', color: '#0A2540' }}>
                    {data.averageScore}
                  </div>
                  <div style={{ fontSize: 14, color: '#94A3B8' }}>de 100</div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Score by Sector ─────────────────────── */}
            <div>
              {sectionHeader('Score por Sector', 'Promedio de score y cantidad de auditorías por sector')}
              <div style={S.chartCard}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.scoreBySector} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="sector"
                      tickFormatter={(v: string) => `${SECTOR_EMOJIS[v] ?? ''} ${capitalize(v)}`}
                      tick={{ fontSize: 12, fill: '#64748B' }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'avgScore' ? `${value} pts` : value,
                        name === 'avgScore' ? 'Score promedio' : 'Auditorías',
                      ]}
                      contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                    />
                    <Legend formatter={(v: string) => (v === 'avgScore' ? 'Score promedio' : 'Auditorías')} />
                    <Bar dataKey="avgScore" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="count" fill="#34D399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Section 4: Route Distribution ──────────────────── */}
            <div>
              {sectionHeader('Distribución de Rutas', 'Tipo de auditoría generada')}
              <div style={{ ...S.cardsRow, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {data.routeDistribution.map((r) => (
                  <div key={r.route} style={S.card(ROUTE_COLORS[r.route] ?? '#94A3B8')}>
                    <div style={S.pill(
                      `${ROUTE_COLORS[r.route] ?? '#94A3B8'}15`,
                      ROUTE_COLORS[r.route] ?? '#94A3B8',
                    )}>
                      {r.route === 'DIAGNOSTICO' ? '🔍' : r.route === 'ARRANQUE' ? '🚀' : '📊'} {r.route}
                    </div>
                    <div style={{ ...S.cardValue, color: ROUTE_COLORS[r.route] ?? '#0A2540' }}>{r.count}</div>
                    <div style={S.cardLabel}>
                      {data.totalAudits > 0 ? Math.round((r.count / data.totalAudits) * 100) : 0}% del total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 5: Daily Trend ─────────────────────────── */}
            <div>
              {sectionHeader('Tendencia Diaria', 'Evolución día a día del embudo de conversión')}
              <div style={S.chartCard}>
                {/* Legend explanation */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, fontSize: 12, color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 2, background: '#6366F1' }} />
                    <span><strong>Usuarios únicos</strong> — perfiles distintos auditados por día</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 2, background: '#F472B6' }} />
                    <span><strong>Auditorías</strong> — total de análisis ejecutados (incluye repetidos)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 2, background: '#10B981' }} />
                    <span><strong>Leads</strong> — usuarios que llenaron datos personales</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 2, background: '#F59E0B' }} />
                    <span><strong>Free Trial</strong> — clicks en el botón de prueba gratis</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={data.dailyData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v: string) => v.slice(5)}
                      tick={{ fontSize: 11, fill: '#94A3B8' }}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = {
                          sessions: 'Usuarios únicos',
                          audits: 'Auditorías',
                          leads: 'Leads',
                          freeTrials: 'Free Trial',
                        };
                        return [value, labels[name] ?? name];
                      }}
                    />
                    <Legend
                      formatter={(v: string) => {
                        const labels: Record<string, string> = {
                          sessions: 'Usuarios únicos',
                          audits: 'Auditorías',
                          leads: 'Leads',
                          freeTrials: 'Free Trial',
                        };
                        return labels[v] ?? v;
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#6366F1" strokeWidth={2} dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="audits" stroke="#F472B6" strokeWidth={2} dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="freeTrials" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Section 6: Lead Quality ────────────────────────── */}
            <div>
              {sectionHeader('Calidad de Leads', 'Distribución de leads por nivel y sector')}
              <div style={S.grid2}>
                {/* By score level */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Por nivel de score</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Nivel</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Leads</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leadsByScoreLevel.map((row) => (
                        <tr key={row.level}>
                          <td style={S.td}>
                            <span style={S.pill(
                              `${LEVEL_COLORS[row.level] ?? '#94A3B8'}18`,
                              LEVEL_COLORS[row.level] ?? '#64748B',
                            )}>
                              {LEVEL_LABELS[row.level] ?? row.level}
                            </span>
                          </td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.count}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>
                            {data.totalLeads > 0 ? Math.round((row.count / data.totalLeads) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* By sector */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Por sector</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Sector</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Leads</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.leadsBySector.map((row) => (
                        <tr key={row.sector}>
                          <td style={S.td}>
                            {SECTOR_EMOJIS[row.sector] ?? '📱'} {capitalize(row.sector)}
                          </td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.count}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>
                            {data.totalLeads > 0 ? Math.round((row.count / data.totalLeads) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Section 7: Traffic ─────────────────────────────── */}
            <div>
              {sectionHeader('Tráfico', 'Dispositivos, países y localización de los usuarios')}
              <div style={S.grid3}>
                {/* By device */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📱 Por dispositivo</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Dispositivo</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Sesiones</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byDevice.map((row) => (
                        <tr key={row.device}>
                          <td style={S.td}>
                            {row.device === 'Mobile iOS' ? '📱' : row.device === 'Mobile Android' ? '🤖' : row.device === 'Bot' ? '🕷️' : '💻'}{' '}
                            {row.device}
                          </td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.count}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>{row.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* By country */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🌎 Por país</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>País</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Sesiones</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byCountry.length > 0 ? data.byCountry.map((row) => (
                        <tr key={row.country}>
                          <td style={S.td}>{row.country}</td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.count}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>{row.pct}%</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} style={{ ...S.td, textAlign: 'center', color: '#94A3B8' }}>
                            Sin datos aún — se registra en nuevas sesiones
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* By locale */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🗣️ Por idioma</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Locale</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Sesiones</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byLocale.map((row) => (
                        <tr key={row.locale}>
                          <td style={S.td}>{row.locale}</td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.count}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>
                            {data.totalSessions > 0 ? Math.round((row.count / data.totalSessions) * 100) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Section 8: Top Profiles ────────────────────────── */}
            <div>
              {sectionHeader('Top Perfiles', 'Perfiles más auditados y con scores extremos')}
              <div style={S.grid3}>
                {/* Most audited */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔥 Más auditados</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>#</th>
                        <th style={S.th}>Usuario</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Veces</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Último score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topAuditedUsernames.map((row, i) => (
                        <tr key={row.username}>
                          <td style={S.td}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td>
                          <td style={{ ...S.td, fontWeight: 600 }}>@{row.username}</td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{row.auditCount}</td>
                          <td style={{ ...S.td, textAlign: 'right', color: '#64748B' }}>{row.lastScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Highest scores */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>⭐ Scores más altos</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>#</th>
                        <th style={S.th}>Usuario</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Score</th>
                        <th style={S.th}>Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.highestScores.map((row, i) => (
                        <tr key={`${row.username}-${i}`}>
                          <td style={S.td}>{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td>
                          <td style={{ ...S.td, fontWeight: 600 }}>@{row.username}</td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700, color: '#4ADE80' }}>{row.score}</td>
                          <td style={{ ...S.td, color: '#64748B' }}>{SECTOR_EMOJIS[row.sector] ?? ''} {capitalize(row.sector)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lowest scores */}
                <div style={S.chartCard}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔻 Scores más bajos</div>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>#</th>
                        <th style={S.th}>Usuario</th>
                        <th style={{ ...S.th, textAlign: 'right' }}>Score</th>
                        <th style={S.th}>Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.lowestScores.map((row, i) => (
                        <tr key={`${row.username}-${i}`}>
                          <td style={S.td}>{i + 1}</td>
                          <td style={{ ...S.td, fontWeight: 600 }}>@{row.username}</td>
                          <td style={{ ...S.td, textAlign: 'right', fontWeight: 700, color: '#F87171' }}>{row.score}</td>
                          <td style={{ ...S.td, color: '#64748B' }}>{SECTOR_EMOJIS[row.sector] ?? ''} {capitalize(row.sector)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div style={S.footer}>
              {lastUpdated && <span>Última actualización: {lastUpdated} · </span>}
              Rango: {startDate} — {endDate} · Powered by Linda AI
            </div>
          </>
        )}
      </div>
    </div>
  );
}
