import { AuditResult, PreviousAudit } from '../../domain/interfaces/audit';
import { LeadData, StoredLead } from '../../domain/interfaces/lead';

export interface StoragePort {
  saveAudit(audit: AuditResult): Promise<string>; // returns audit ID
  getLastAudit(username: string): Promise<PreviousAudit | null>;
  saveLead(lead: LeadData, auditId: string, score: number, scoreLevel: string, sector: string): Promise<StoredLead>;
  getLeadByEmail(email: string): Promise<StoredLead | null>;
}
