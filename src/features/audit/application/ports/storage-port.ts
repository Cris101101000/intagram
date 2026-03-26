import { AuditResult, PreviousAudit, InstagramProfile } from '../../domain/interfaces/audit';
import { LeadData, StoredLead } from '../../domain/interfaces/lead';

export interface StoragePort {
  // Sessions
  createSession(username: string, userAgent?: string, ip?: string, locale?: string): Promise<string>;
  completeSession(sessionId: string): Promise<void>;

  // Instagram profiles
  saveProfile(profile: InstagramProfile): Promise<string>;

  // Audits
  saveAudit(audit: AuditResult, sessionId?: string, profileId?: string): Promise<{ id: string; accessToken: string }>;
  getLastAudit(username: string): Promise<PreviousAudit | null>;
  getAuditByToken(accessToken: string): Promise<AuditResult | null>;
  getRecentAudit(username: string, maxAgeHours: number): Promise<(AuditResult & { auditId: string; accessToken: string }) | null>;

  // Leads
  saveLead(lead: LeadData, auditId: string | null, score: number, scoreLevel: string, sector: string): Promise<StoredLead>;
  getLeadByEmail(email: string): Promise<StoredLead | null>;
  updateLeadSignupUrl(leadId: string, signupUrl: string): Promise<void>;
  getSignupUrlByAuditId(auditId: string): Promise<string | null>;
  hasLeadForAudit(auditId: string): Promise<boolean>;
}
