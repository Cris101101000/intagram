export interface PhoneData {
  code: string;    // e.g. "+57"
  country: string; // e.g. "CO"
  number: string;  // e.g. "3001234567"
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: PhoneData;
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
