import { StoredLead } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export interface CrmPort {
  sendLead(lead: StoredLead, audit: AuditResult, sessionId?: string): Promise<string | null>;
}
