import { StoragePort } from '../ports/storage-port';
import { CrmPort } from '../ports/crm-port';
import { LeadData, LeadResponse } from '../../domain/interfaces/lead';
import { AuditResult } from '../../domain/interfaces/audit';

export async function captureLead(
  leadData: LeadData,
  auditResult: AuditResult,
  storagePort: StoragePort,
  crmPort: CrmPort
): Promise<LeadResponse> {
  // Validate
  if (!leadData.gdprConsent) {
    return { success: false, message: 'Se requiere consentimiento para procesar datos.' };
  }
  if (!leadData.email || !leadData.name || !leadData.phone) {
    return { success: false, message: 'Todos los campos son obligatorios.' };
  }

  // Save lead
  const storedLead = await storagePort.saveLead(
    leadData,
    auditResult.username, // this should be auditId but we'll use username for now
    auditResult.score,
    auditResult.level,
    auditResult.sector
  );

  // Send to CRM (non-blocking - don't fail if CRM fails)
  try {
    await crmPort.sendLead(storedLead, auditResult);
  } catch (error) {
    console.error('CRM webhook failed:', error);
  }

  return { success: true, message: 'Lead capturado exitosamente.' };
}
