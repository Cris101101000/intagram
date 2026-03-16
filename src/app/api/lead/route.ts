import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAdapter } from '@/features/audit/infrastructure/adapters/supabase-adapter';
import { N8nAdapter } from '@/features/audit/infrastructure/adapters/n8n-adapter';
import { captureLead } from '@/features/audit/application/use-cases/capture-lead';
import { AuditResult } from '@/features/audit/domain/interfaces/audit';
import { LeadData } from '@/features/audit/domain/interfaces/lead';
import { shouldUseMock } from '@/features/audit/infrastructure/mock/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, username, gdprConsent, auditId, auditResult } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone?.number || !username) {
      return NextResponse.json(
        {
          error: 'missing_fields',
          message: 'Todos los campos son obligatorios.',
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'invalid_email',
          message: 'El email no tiene un formato válido.',
        },
        { status: 400 },
      );
    }

    // Validate GDPR consent
    if (!gdprConsent) {
      return NextResponse.json(
        {
          error: 'no_consent',
          message: 'Se requiere consentimiento para procesar tus datos.',
        },
        { status: 400 },
      );
    }

    // Validate auditResult is present
    if (!auditResult) {
      return NextResponse.json(
        {
          error: 'missing_audit',
          message: 'Se requiere el resultado de la auditoría.',
        },
        { status: 400 },
      );
    }

    // Mock mode – skip Supabase and N8N calls
    if (shouldUseMock(username)) {
      return NextResponse.json({ success: true, message: 'Lead capturado exitosamente (demo).' });
    }

    const storagePort = new SupabaseAdapter();
    const crmPort = new N8nAdapter();

    const leadData: LeadData = {
      firstName,
      lastName,
      email,
      phone: {
        code: phone.code || '+57',
        country: phone.country || 'CO',
        number: phone.number,
      },
      username,
      gdprConsent,
    };

    const result = await captureLead(
      leadData,
      auditResult as AuditResult,
      auditId || null,
      storagePort,
      crmPort,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: 'capture_failed', message: result.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'Error al procesar tu información.' },
      { status: 500 },
    );
  }
}
