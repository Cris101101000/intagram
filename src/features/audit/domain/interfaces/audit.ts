export enum AuditRoute {
  DIAGNOSTICO = 'DIAGNOSTICO',
  EVOLUCION = 'EVOLUCION',
  ARRANQUE = 'ARRANQUE',
}

export interface PreviousAudit {
  id: string;
  score: number;
  metrics: AuditMetrics;
  createdAt: string;
}

export interface PostData {
  id: string;
  type: 'Image' | 'Sidecar' | 'Video' | 'Clips';
  likesCount: number;
  commentsCount: number;
  videoViewCount?: number;
  timestamp: string;
}

export interface AuditMetrics {
  engagementRate: number;
  commentRate: number;
  reelsViewRate: number;
  hasReels: boolean;
}

export interface NormalizedMetrics {
  erNormalized: number;
  crNormalized: number;
  rvrNormalized: number;
  erWeight: number;
  crWeight: number;
  rvrWeight: number;
}

export type FrequencyLabel = 'Baja' | 'Media' | 'Alta';
export type FormatMixLabel = 'Variado' | 'Dependiente de un formato';
export type RecencyLabel = 'Activo' | 'Irregular' | 'Inactivo';
export type ConsistencyLabel = 'Consistente' | 'Irregular' | 'Muy irregular';
export type TrendLabel = 'Mejorando' | 'Estable' | 'Cayendo';

export interface HealthSignals {
  frequency: { value: number; label: FrequencyLabel };
  formatMix: { distribution: Record<string, number>; label: FormatMixLabel };
  recency: { daysSinceLastPost: number; label: RecencyLabel };
  consistency: { stddev: number; label: ConsistencyLabel };
  trend: { changePercent: number; label: TrendLabel };
}

export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
  isBusinessAccount: boolean;
  businessCategoryName?: string;
}

export interface CriticalPoint {
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export enum ScoreLevel {
  CRITICO = 'CRITICO',
  REGULAR = 'REGULAR',
  BUENO = 'BUENO',
  EXCELENTE = 'EXCELENTE',
}

export interface AuditResult {
  username: string;
  profile: InstagramProfile;
  score: number;
  level: ScoreLevel;
  route: AuditRoute;
  metrics: AuditMetrics;
  normalizedMetrics: NormalizedMetrics;
  healthSignals: HealthSignals;
  criticalPoints: CriticalPoint[];
  sector: string;
  postsAnalyzed: number;
  analysisWindow: number;
  previousAudit?: PreviousAudit;
  createdAt: string;
}
