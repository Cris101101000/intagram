export interface LeadData {
  name: string;
  email: string;
  phone: string;
  username: string;
  gdprConsent: boolean;
}

export interface LeadResponse {
  success: boolean;
  message: string;
}

export interface StoredLead extends LeadData {
  id: string;
  auditId: string;
  score: number;
  scoreLevel: string;
  sector: string;
  createdAt: string;
}
