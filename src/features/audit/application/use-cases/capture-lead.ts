import { StoragePort } from '../ports/storage-port';
import { CrmPort } from '../ports/crm-port';
import { LeadData, LeadResponse } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export async function captureLead(
  leadData: LeadData,
  auditResult: AuditResult,
  auditId: string | null,
  storagePort: StoragePort,
  crmPort: CrmPort,
  sessionId?: string,
): Promise<LeadResponse> {
  // Validate
  if (!leadData.gdprConsent) {
    return { success: false, message: 'Se requiere consentimiento para procesar datos.' };
  }
  if (!leadData.email || !leadData.firstName || !leadData.phone.number) {
    return { success: false, message: 'Todos los campos son obligatorios.' };
  }

  // Save lead
  const storedLead = await storagePort.saveLead(
    leadData,
    auditId,
    auditResult.score,
    auditResult.level,
    auditResult.sector
  );

  // Send to CRM webhooks (non-blocking - don't fail if CRM fails)
  let signupUrl: string | null = null;
  try {
    signupUrl = await crmPort.sendLead(storedLead, auditResult, sessionId);
    if (signupUrl) {
      await storagePort.updateLeadSignupUrl(storedLead.id, signupUrl);
    }
  } catch (error) {
    console.error('CRM webhook failed:', error);
  }

  return { success: true, message: 'Lead capturado exitosamente.', signupUrl };
}
