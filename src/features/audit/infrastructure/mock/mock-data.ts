import {
  AuditResult,
  AuditRoute,
  ScoreLevel,
  PostData,
  HealthSignals,
  CriticalPoint,
  NormalizedMetrics,
  AuditMetrics,
  InstagramProfile,
  PreviousAudit,
} from '../../domain/interfaces/audit';

// ---------------------------------------------------------------------------
// Mock mode detection
// ---------------------------------------------------------------------------

const DEMO_USERNAMES = ['demo', 'salonbelleza', 'nuevonegocio', 'negocioinactivo', 'clientebewe', 'clientebajada'];

export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
}

export function isDemoUsername(username: string): boolean {
  return DEMO_USERNAMES.includes(username.toLowerCase().trim());
}

/** Returns true when mock data should be used instead of real APIs */
export function shouldUseMock(username: string): boolean {
  return isMockMode() || isDemoUsername(username);
}

export function getMockDelay(): number {
  // Shorter delay in full mock mode for faster dev iteration
  if (isMockMode()) return Math.floor(Math.random() * 1500) + 1000; // 1000–2500 ms
  return Math.floor(Math.random() * 3000) + 3000; // 3000–6000 ms
}

// ---------------------------------------------------------------------------
// Helper – generate post IDs
// ---------------------------------------------------------------------------

function postId(index: number): string {
  return `mock_post_${index}_${Date.now()}`;
}

// ---------------------------------------------------------------------------
// 1. Ruta Diagnóstico – "demo" / "salonbelleza"
// ---------------------------------------------------------------------------

function buildDiagnosticoProfile(): InstagramProfile {
  return {
    username: 'salonbelleza',
    fullName: 'Salón Belleza Studio',
    biography:
      '✨ Salón de belleza integral\n💇‍♀️ Color · Corte · Tratamientos\n📍 Madrid | Citas 👇',
    followersCount: 8500,
    followsCount: 1120,
    postsCount: 245,
    profilePicUrl: 'https://placehold.co/150x150/E0B0FF/333?text=SB',
    isVerified: false,
    isPrivate: false,
    isBusinessAccount: true,
    businessCategoryName: 'Beauty Salon',
  };
}

function buildDiagnosticoPosts(): PostData[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: postId(1), type: 'Clips', likesCount: 342, commentsCount: 18, videoViewCount: 4200, timestamp: new Date(now - 3 * day).toISOString() },
    { id: postId(2), type: 'Image', likesCount: 198, commentsCount: 12, timestamp: new Date(now - 5 * day).toISOString() },
    { id: postId(3), type: 'Sidecar', likesCount: 275, commentsCount: 22, timestamp: new Date(now - 8 * day).toISOString() },
    { id: postId(4), type: 'Clips', likesCount: 410, commentsCount: 25, videoViewCount: 5100, timestamp: new Date(now - 11 * day).toISOString() },
    { id: postId(5), type: 'Image', likesCount: 165, commentsCount: 8, timestamp: new Date(now - 14 * day).toISOString() },
    { id: postId(6), type: 'Clips', likesCount: 380, commentsCount: 20, videoViewCount: 4800, timestamp: new Date(now - 17 * day).toISOString() },
    { id: postId(7), type: 'Image', likesCount: 145, commentsCount: 6, timestamp: new Date(now - 20 * day).toISOString() },
    { id: postId(8), type: 'Sidecar', likesCount: 230, commentsCount: 15, timestamp: new Date(now - 24 * day).toISOString() },
    { id: postId(9), type: 'Clips', likesCount: 290, commentsCount: 14, videoViewCount: 3900, timestamp: new Date(now - 27 * day).toISOString() },
    { id: postId(10), type: 'Image', likesCount: 120, commentsCount: 5, timestamp: new Date(now - 30 * day).toISOString() },
  ];
}

function buildDiagnosticoMetrics(): AuditMetrics {
  return {
    engagementRate: 2.8,
    commentRate: 0.042,
    reelsViewRate: 15.3,
    hasReels: true,
  };
}

function buildDiagnosticoNormalized(): NormalizedMetrics {
  // Benchmarks Belleza: ER 3.5, CR 0.05, RVR 120
  return {
    erNormalized: 2.8 / 3.5,   // 0.80
    crNormalized: 0.042 / 0.05, // 0.84
    rvrNormalized: 15.3 / 120,  // 0.1275
    erWeight: 0.4,
    crWeight: 0.3,
    rvrWeight: 0.3,
  };
}

function buildDiagnosticoHealth(): HealthSignals {
  return {
    frequency: { value: 2.1, label: 'Media' },
    formatMix: {
      distribution: { Clips: 40, Image: 35, Sidecar: 25 },
      label: 'Variado',
    },
    recency: { daysSinceLastPost: 3, label: 'Activo' },
    consistency: { stddev: 4.2, label: 'Irregular' },
    trend: { changePercent: 8, label: 'Mejorando' },
  };
}

function buildDiagnosticoCriticalPoints(): CriticalPoint[] {
  return [
    {
      type: 'comment_rate',
      message:
        'Tu tasa de comentarios (0.042) está por debajo del promedio del sector Belleza (0.05). Intenta hacer preguntas en tus captions para fomentar la conversación.',
      severity: 'high',
    },
    {
      type: 'posting_consistency',
      message:
        'Tu frecuencia de publicación es irregular. Publicar de forma consistente ayuda al algoritmo a mostrar más tu contenido.',
      severity: 'medium',
    },
    {
      type: 'reels_view_rate',
      message:
        'Tus Reels alcanzan solo el 15.3% de tus seguidores frente al 120% del benchmark. Experimenta con hooks en los primeros 3 segundos y tendencias de audio.',
      severity: 'high',
    },
  ];
}

function buildDiagnosticoResult(): AuditResult {
  return {
    username: 'salonbelleza',
    profile: buildDiagnosticoProfile(),
    score: 62,
    level: ScoreLevel.BUENO,
    route: AuditRoute.DIAGNOSTICO,
    metrics: buildDiagnosticoMetrics(),
    normalizedMetrics: buildDiagnosticoNormalized(),
    healthSignals: buildDiagnosticoHealth(),
    criticalPoints: buildDiagnosticoCriticalPoints(),
    sector: 'Belleza',
    postsAnalyzed: 10,
    analysisWindow: 30,
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 2. Ruta Arranque – "nuevonegocio"
// ---------------------------------------------------------------------------

function buildArranqueProfile(): InstagramProfile {
  return {
    username: 'nuevonegocio',
    fullName: 'Nuevo Negocio Wellness',
    biography: '🧘 Centro de bienestar holístico\n🌿 Yoga · Meditación · Masajes\n📍 Barcelona',
    followersCount: 320,
    followsCount: 210,
    postsCount: 4,
    profilePicUrl: 'https://placehold.co/150x150/B2F5EA/333?text=NN',
    isVerified: false,
    isPrivate: false,
    isBusinessAccount: true,
    businessCategoryName: 'Health/Beauty',
  };
}

function buildArranquePosts(): PostData[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: postId(1), type: 'Image', likesCount: 28, commentsCount: 3, timestamp: new Date(now - 2 * day).toISOString() },
    { id: postId(2), type: 'Clips', likesCount: 45, commentsCount: 5, videoViewCount: 180, timestamp: new Date(now - 7 * day).toISOString() },
    { id: postId(3), type: 'Image', likesCount: 18, commentsCount: 1, timestamp: new Date(now - 15 * day).toISOString() },
    { id: postId(4), type: 'Image', likesCount: 12, commentsCount: 0, timestamp: new Date(now - 22 * day).toISOString() },
  ];
}

function buildArranqueMetrics(): AuditMetrics {
  return {
    engagementRate: 0,
    commentRate: 0,
    reelsViewRate: 0,
    hasReels: true,
  };
}

function buildArranqueNormalized(): NormalizedMetrics {
  return {
    erNormalized: 0,
    crNormalized: 0,
    rvrNormalized: 0,
    erWeight: 0.4,
    crWeight: 0.3,
    rvrWeight: 0.3,
  };
}

function buildArranqueHealth(): HealthSignals {
  return {
    frequency: { value: 0.8, label: 'Baja' },
    formatMix: {
      distribution: { Image: 75, Clips: 25 },
      label: 'Dependiente de un formato',
    },
    recency: { daysSinceLastPost: 2, label: 'Activo' },
    consistency: { stddev: 7.5, label: 'Muy irregular' },
    trend: { changePercent: 0, label: 'Estable' },
  };
}

function buildArranqueResult(): AuditResult {
  return {
    username: 'nuevonegocio',
    profile: buildArranqueProfile(),
    score: 0,
    level: ScoreLevel.CRITICO,
    route: AuditRoute.ARRANQUE,
    metrics: buildArranqueMetrics(),
    normalizedMetrics: buildArranqueNormalized(),
    healthSignals: buildArranqueHealth(),
    criticalPoints: [],
    sector: 'Salud',
    postsAnalyzed: 4,
    analysisWindow: 30,
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 2b. Ruta Arranque (pausado) – "negocioinactivo"
// ---------------------------------------------------------------------------

function buildArranquePausadoResult(): AuditResult {
  return {
    username: 'negocioinactivo',
    profile: {
      username: 'negocioinactivo',
      fullName: 'Studio Zen Spa',
      biography: '🧖‍♀️ Spa & Bienestar\n💆 Masajes · Faciales · Relax\n📍 Bogotá',
      followersCount: 580,
      followsCount: 340,
      postsCount: 8,
      profilePicUrl: 'https://placehold.co/150x150/FDE68A/333?text=SZ',
      isVerified: false,
      isPrivate: false,
      isBusinessAccount: true,
      businessCategoryName: 'Spa',
    },
    score: 0,
    level: ScoreLevel.CRITICO,
    route: AuditRoute.ARRANQUE,
    metrics: { engagementRate: 0, commentRate: 0, reelsViewRate: 0, hasReels: false },
    normalizedMetrics: { erNormalized: 0, crNormalized: 0, rvrNormalized: 0, erWeight: 0.4, crWeight: 0.3, rvrWeight: 0.3 },
    healthSignals: {
      frequency: { value: 0.3, label: 'Muy baja' },
      formatMix: { distribution: { Image: 100 }, label: 'Dependiente de un formato' },
      recency: { daysSinceLastPost: 120, label: 'Inactivo' },
      consistency: { stddev: 12, label: 'Muy irregular' },
      trend: { changePercent: -30, label: 'Cayendo' },
    },
    criticalPoints: [],
    sector: 'Bienestar',
    postsAnalyzed: 8,
    analysisWindow: 30,
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 3. Modo Evolución – "clientebewe"
// ---------------------------------------------------------------------------

function buildEvolucionProfile(): InstagramProfile {
  return {
    username: 'clientebewe',
    fullName: 'FitZone Gym',
    biography:
      '💪 Tu gimnasio de confianza\n🏋️ Entrenamiento personalizado\n📍 Valencia | Reserva tu clase 👇',
    followersCount: 12000,
    followsCount: 850,
    postsCount: 380,
    profilePicUrl: 'https://placehold.co/150x150/93C5FD/333?text=FZ',
    isVerified: false,
    isPrivate: false,
    isBusinessAccount: true,
    businessCategoryName: 'Gym/Physical Fitness Center',
  };
}

function buildEvolucionPosts(): PostData[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: postId(1), type: 'Clips', likesCount: 520, commentsCount: 38, videoViewCount: 8200, timestamp: new Date(now - 1 * day).toISOString() },
    { id: postId(2), type: 'Sidecar', likesCount: 410, commentsCount: 30, timestamp: new Date(now - 3 * day).toISOString() },
    { id: postId(3), type: 'Image', likesCount: 320, commentsCount: 22, timestamp: new Date(now - 5 * day).toISOString() },
    { id: postId(4), type: 'Clips', likesCount: 680, commentsCount: 45, videoViewCount: 9500, timestamp: new Date(now - 7 * day).toISOString() },
    { id: postId(5), type: 'Image', likesCount: 290, commentsCount: 18, timestamp: new Date(now - 9 * day).toISOString() },
    { id: postId(6), type: 'Clips', likesCount: 590, commentsCount: 35, videoViewCount: 8800, timestamp: new Date(now - 11 * day).toISOString() },
    { id: postId(7), type: 'Sidecar', likesCount: 350, commentsCount: 25, timestamp: new Date(now - 14 * day).toISOString() },
    { id: postId(8), type: 'Image', likesCount: 275, commentsCount: 15, timestamp: new Date(now - 17 * day).toISOString() },
    { id: postId(9), type: 'Clips', likesCount: 620, commentsCount: 40, videoViewCount: 9100, timestamp: new Date(now - 20 * day).toISOString() },
    { id: postId(10), type: 'Image', likesCount: 245, commentsCount: 12, timestamp: new Date(now - 23 * day).toISOString() },
  ];
}

function buildEvolucionMetrics(): AuditMetrics {
  return {
    engagementRate: 4.1,
    commentRate: 0.052,
    reelsViewRate: 72.5,
    hasReels: true,
  };
}

function buildEvolucionNormalized(): NormalizedMetrics {
  // Benchmarks Fitness: ER 3.2, CR 0.045, RVR 130
  return {
    erNormalized: 4.1 / 3.2,    // 1.28
    crNormalized: 0.052 / 0.045, // 1.16
    rvrNormalized: 72.5 / 130,   // 0.558
    erWeight: 0.4,
    crWeight: 0.3,
    rvrWeight: 0.3,
  };
}

function buildEvolucionHealth(): HealthSignals {
  return {
    frequency: { value: 3.2, label: 'Alta' },
    formatMix: {
      distribution: { Clips: 45, Image: 30, Sidecar: 25 },
      label: 'Variado',
    },
    recency: { daysSinceLastPost: 1, label: 'Activo' },
    consistency: { stddev: 1.8, label: 'Consistente' },
    trend: { changePercent: 15, label: 'Mejorando' },
  };
}

function buildEvolucionCriticalPoints(): CriticalPoint[] {
  return [
    {
      type: 'reels_view_rate',
      message:
        'Tus Reels alcanzan el 72.5% de tus seguidores, por debajo del 130% del benchmark Fitness. Prueba publicar Reels en horarios de mayor actividad de tu audiencia.',
      severity: 'medium',
    },
  ];
}

function buildPreviousAudit(): PreviousAudit {
  const daysAgo = 45;
  const previousDate = new Date(Date.now() - daysAgo * 86400000);
  return {
    id: 'prev_audit_mock_001',
    score: 45,
    metrics: {
      engagementRate: 2.3,
      commentRate: 0.028,
      reelsViewRate: 35.0,
      hasReels: true,
    },
    createdAt: previousDate.toISOString(),
  };
}

function buildEvolucionResult(): AuditResult {
  return {
    username: 'clientebewe',
    profile: buildEvolucionProfile(),
    score: 78,
    level: ScoreLevel.BUENO,
    route: AuditRoute.EVOLUCION,
    metrics: buildEvolucionMetrics(),
    normalizedMetrics: buildEvolucionNormalized(),
    healthSignals: buildEvolucionHealth(),
    criticalPoints: buildEvolucionCriticalPoints(),
    sector: 'Fitness',
    postsAnalyzed: 10,
    analysisWindow: 30,
    previousAudit: buildPreviousAudit(),
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 4. Modo Evolución (bajada) – "clientebajada"
// ---------------------------------------------------------------------------

function buildEvolucionBajadaPreviousAudit(): PreviousAudit {
  const daysAgo = 45;
  const previousDate = new Date(Date.now() - daysAgo * 86400000);
  return {
    id: 'prev_audit_mock_002',
    score: 38,
    metrics: {
      engagementRate: 1.8,
      commentRate: 0.018,
      reelsViewRate: 22.0,
      hasReels: true,
    },
    createdAt: previousDate.toISOString(),
  };
}

function buildEvolucionBajadaResult(): AuditResult {
  return {
    username: 'clientebajada',
    profile: {
      username: 'clientebajada',
      fullName: 'FitZone Gym',
      biography:
        '💪 Tu gimnasio de confianza\n🏋️ Entrenamiento personalizado\n📍 Valencia | Reserva tu clase 👇',
      followersCount: 12000,
      followsCount: 850,
      postsCount: 380,
      profilePicUrl: 'https://placehold.co/150x150/93C5FD/333?text=FZ',
      isVerified: false,
      isPrivate: false,
      isBusinessAccount: true,
      businessCategoryName: 'Gym/Physical Fitness Center',
    },
    score: 38,
    level: ScoreLevel.REGULAR,
    route: AuditRoute.EVOLUCION,
    metrics: {
      engagementRate: 1.9,
      commentRate: 0.019,
      reelsViewRate: 24.0,
      hasReels: true,
    },
    normalizedMetrics: {
      erNormalized: 1.9 / 3.2,
      crNormalized: 0.019 / 0.045,
      rvrNormalized: 24.0 / 130,
      erWeight: 0.4,
      crWeight: 0.3,
      rvrWeight: 0.3,
    },
    healthSignals: {
      frequency: { value: 1.2, label: 'Baja' },
      formatMix: {
        distribution: { Clips: 20, Image: 60, Sidecar: 20 },
        label: 'Dependiente de un formato',
      },
      recency: { daysSinceLastPost: 18, label: 'Inactivo' },
      consistency: { stddev: 6.5, label: 'Irregular' },
      trend: { changePercent: -12, label: 'Cayendo' },
    },
    criticalPoints: [
      {
        type: 'engagement_rate',
        message: 'Tu ER bajó significativamente. Necesitas publicar contenido que genere más interacción.',
        severity: 'high',
      },
      {
        type: 'reels_view_rate',
        message: 'El alcance de tus Reels cayó. Experimenta con nuevos formatos y tendencias.',
        severity: 'high',
      },
    ],
    sector: 'Fitness',
    postsAnalyzed: 10,
    analysisWindow: 30,
    previousAudit: buildEvolucionBajadaPreviousAudit(),
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns mock audit data. Known demo usernames get their fixed scenario.
 * In global mock mode, arbitrary usernames are deterministically mapped
 * to one of the 3 routes based on a simple hash so results are stable
 * across reloads for the same username.
 */
export function getMockAuditResult(username: string): AuditResult {
  const clean = username.toLowerCase().trim();

  // Known demo usernames → fixed scenario
  switch (clean) {
    case 'nuevonegocio':
      return buildArranqueResult();
    case 'negocioinactivo':
      return buildArranquePausadoResult();
    case 'clientebewe':
      return buildEvolucionResult();
    case 'clientebajada':
      return buildEvolucionBajadaResult();
    case 'demo':
    case 'salonbelleza':
      return buildDiagnosticoResult();
  }

  // Global mock mode – map arbitrary username to a route
  const hash = simpleHash(clean) % 3;
  const builders = [buildDiagnosticoResult, buildArranqueResult, buildEvolucionResult];
  const result = builders[hash]();
  // Patch the username so the UI shows the real handle
  result.username = clean;
  result.profile.username = clean;
  return result;
}

/** Simple deterministic hash for a string → number */
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}
