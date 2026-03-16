'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { AuditRoute } from '@/features/audit/domain/interfaces/audit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CaptureFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: {
    code: string;
    country: string;
    number: string;
  };
  gdprConsent: boolean;
}

interface UnlockFormProps {
  route: AuditRoute;
  levelLabel: string;
  criticalCount: number;
  onSubmit: (data: CaptureFormData) => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnlockForm({
  route,
  levelLabel,
  criticalCount,
  onSubmit,
  isLoading = false,
}: UnlockFormProps) {
  const { t } = useTranslation('audit');
  const { t: tc } = useTranslation('common');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phone, setPhone] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isArranque = route === AuditRoute.ARRANQUE;

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = tc('validation_required');
    if (!lastName.trim()) e.lastName = tc('validation_required');
    if (!email.trim()) {
      e.email = tc('validation_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = tc('validation_email');
    }
    const digitsOnly = phone.trim().replace(/\D/g, '');
    if (!phone.trim()) {
      e.phone = tc('validation_required');
    } else if (digitsOnly.length !== selectedPhoneConfig.digits) {
      e.phone = `El número debe tener ${selectedPhoneConfig.digits} dígitos para ${selectedPhoneConfig.country}`;
    }
    if (!gdprConsent) e.gdprConsent = tc('validation_consent');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const PHONE_CODES: { code: string; country: string; label: string; digits: number }[] = [
    { code: '+57', country: 'CO', label: '🇨🇴 +57', digits: 10 },
    { code: '+52', country: 'MX', label: '🇲🇽 +52', digits: 10 },
    { code: '+54', country: 'AR', label: '🇦🇷 +54', digits: 10 },
    { code: '+56', country: 'CL', label: '🇨🇱 +56', digits: 9 },
    { code: '+51', country: 'PE', label: '🇵🇪 +51', digits: 9 },
    { code: '+593', country: 'EC', label: '🇪🇨 +593', digits: 9 },
    { code: '+58', country: 'VE', label: '🇻🇪 +58', digits: 10 },
    { code: '+591', country: 'BO', label: '🇧🇴 +591', digits: 8 },
    { code: '+595', country: 'PY', label: '🇵🇾 +595', digits: 9 },
    { code: '+598', country: 'UY', label: '🇺🇾 +598', digits: 8 },
    { code: '+507', country: 'PA', label: '🇵🇦 +507', digits: 8 },
    { code: '+506', country: 'CR', label: '🇨🇷 +506', digits: 8 },
    { code: '+502', country: 'GT', label: '🇬🇹 +502', digits: 8 },
    { code: '+503', country: 'SV', label: '🇸🇻 +503', digits: 8 },
    { code: '+504', country: 'HN', label: '🇭🇳 +504', digits: 8 },
    { code: '+505', country: 'NI', label: '🇳🇮 +505', digits: 8 },
    { code: '+1', country: 'US', label: '🇺🇸 +1', digits: 10 },
    { code: '+34', country: 'ES', label: '🇪🇸 +34', digits: 9 },
    { code: '+55', country: 'BR', label: '🇧🇷 +55', digits: 11 },
  ];

  const selectedPhoneConfig = PHONE_CODES.find((p) => p.code === phoneCode) ?? PHONE_CODES[0];

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, selectedPhoneConfig.digits);
    setPhone(cleaned);
    clearError('phone');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: {
        code: selectedPhoneConfig.code,
        country: selectedPhoneConfig.country,
        number: phone.trim(),
      },
      gdprConsent,
    });
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const canSubmit = gdprConsent;

  // -----------------------------------------------------------------------
  // Input styles
  // -----------------------------------------------------------------------

  const inputClass = `w-full font-inter text-base-oscura outline-none transition-all ${
    'bg-gray-50 border border-gray-200 rounded-xl'
  } focus:border-primary-400 focus:bg-white focus:ring-[3px] focus:ring-primary-400/10`;

  const inputStyle = { height: 44, padding: '0 14px', fontSize: 14, fontWeight: 400 };
  const labelStyle = { fontSize: 14, fontWeight: 600, marginBottom: 3 };

  // -----------------------------------------------------------------------
  // CTA color config
  // -----------------------------------------------------------------------

  const ctaGradient = isArranque
    ? 'linear-gradient(135deg, #34D399, #10B981)'
    : 'linear-gradient(135deg, #60A5FA, #3B82F6)';
  const ctaShadow = isArranque
    ? '0 4px 16px rgba(52,211,153,0.30)'
    : '0 4px 16px rgba(96,165,250,0.30)';
  const ctaText = isArranque
    ? t('audit_capture_button_arranque')
    : t('audit_capture_button_submit');

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className="w-full rounded-3xl border border-gray-200 bg-white"
      style={{
        padding: 28,
        boxShadow: '0 16px 64px rgba(10,37,64,0.08)',
        borderRadius: 24,
      }}
    >
      {/* Header */}
      <div className="mb-5 text-center">
        <h3
          className="font-inter text-base-oscura"
          style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}
        >
          {isArranque ? t('audit_capture_arranque_title') : t('audit_capture_diagnostico_title')}
        </h3>
        <p
          className="font-inter text-gray-500"
          style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.5 }}
        >
          {isArranque
            ? 'Ingresa tus datos para acceder a tu plan de crecimiento personalizado.'
            : 'Ingresa tus datos para ver tu diagnóstico completo y plan de acción.'}
        </p>
      </div>

      {/* Form fields */}
      <div className="mb-4 flex flex-col gap-3">
        {/* Name row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2.5">
          <div className="flex-1">
            <label htmlFor="capture-firstName" className="block font-inter text-gray-600" style={labelStyle}>
              {t('audit_capture_field_first_name')}<span className="text-red-500">*</span>
            </label>
            <input
              id="capture-firstName"
              type="text"
              placeholder={t('audit_capture_placeholder_first_name')}
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
              className={`${inputClass} ${errors.firstName ? '!border-red-400 !ring-red-400/10' : ''}`}
              style={inputStyle}
            />
            {errors.firstName && <p className="mt-1 font-inter text-red-500" style={{ fontSize: 11 }}>{errors.firstName}</p>}
          </div>
          <div className="flex-1">
            <label htmlFor="capture-lastName" className="block font-inter text-gray-600" style={labelStyle}>
              {t('audit_capture_field_last_name')}<span className="text-red-500">*</span>
            </label>
            <input
              id="capture-lastName"
              type="text"
              placeholder={t('audit_capture_placeholder_last_name')}
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
              className={`${inputClass} ${errors.lastName ? '!border-red-400 !ring-red-400/10' : ''}`}
              style={inputStyle}
            />
            {errors.lastName && <p className="mt-1 font-inter text-red-500" style={{ fontSize: 11 }}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="capture-email" className="block font-inter text-gray-600" style={labelStyle}>
            {t('audit_capture_field_email')}<span className="text-red-500">*</span>
          </label>
          <input
            id="capture-email"
            type="email"
            placeholder={t('audit_capture_placeholder_email')}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            className={`${inputClass} ${errors.email ? '!border-red-400 !ring-red-400/10' : ''}`}
            style={inputStyle}
          />
          {errors.email && <p className="mt-1 font-inter text-red-500" style={{ fontSize: 11 }}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="capture-phone" className="block font-inter text-gray-600" style={labelStyle}>
            {t('audit_capture_field_phone')}<span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center rounded-xl border bg-gray-50 transition-all focus-within:border-primary-400 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-primary-400/10 ${errors.phone ? '!border-red-400 !ring-red-400/10' : 'border-gray-200'}`}
            style={{ height: 44 }}
          >
            {/* Country code selector */}
            <div className="relative shrink-0">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="h-full cursor-pointer appearance-none bg-transparent font-inter text-base-oscura outline-none"
                style={{ fontSize: 14, fontWeight: 500, paddingLeft: 14, paddingRight: 28, height: 44 }}
              >
                {PHONE_CODES.map((p) => (
                  <option key={p.code} value={p.code}>{p.label}</option>
                ))}
              </select>
              <Icon
                icon="solar:alt-arrow-down-outline"
                width={12} height={12}
                color="#94A3B8"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
              />
            </div>
            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 shrink-0" />
            {/* Phone input */}
            <input
              id="capture-phone"
              type="tel"
              inputMode="numeric"
              placeholder={t('audit_capture_placeholder_phone')}
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={selectedPhoneConfig.digits}
              className="flex-1 h-full bg-transparent font-inter text-base-oscura outline-none placeholder:text-gray-400"
              style={{ fontSize: 14, fontWeight: 400, paddingLeft: 12, paddingRight: 14 }}
            />
            {/* Digit counter */}
            <span className="shrink-0 font-inter text-gray-300 pr-3" style={{ fontSize: 11 }}>
              {phone.length}/{selectedPhoneConfig.digits}
            </span>
          </div>
          {errors.phone && <p className="mt-1 font-inter text-red-500" style={{ fontSize: 11 }}>{errors.phone}</p>}
        </div>
      </div>

      {/* Consent checkbox */}
      <div className="mb-4 flex items-start gap-2.5">
        <input
          id="capture-consent"
          type="checkbox"
          checked={gdprConsent}
          onChange={(e) => { setGdprConsent(e.target.checked); clearError('gdprConsent'); }}
          className="mt-0.5 shrink-0 rounded-[5px] border-[1.5px] border-gray-300 bg-white text-primary-400 focus:ring-[3px] focus:ring-primary-400/10"
          style={{ width: 18, height: 18 }}
        />
        <label
          htmlFor="capture-consent"
          className="cursor-pointer font-inter text-gray-500"
          style={{ fontSize: 14, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: t('audit_capture_consent_html') }}
        />
      </div>
      {errors.gdprConsent && (
        <p className="mb-3 font-inter text-red-500" style={{ fontSize: 11, marginLeft: 28 }}>
          {errors.gdprConsent}
        </p>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className={`cta-shimmer relative flex w-full items-center justify-center gap-2 rounded-full font-inter text-white transition-all hover:-translate-y-1 overflow-hidden ${canSubmit && !isLoading ? 'capture-btn-active' : ''}`}
        style={{
          height: 48,
          fontSize: 16,
          fontWeight: 600,
          background: ctaGradient,
          opacity: canSubmit ? 1 : 0.5,
          pointerEvents: canSubmit ? 'auto' : 'none',
          boxShadow: canSubmit ? ctaShadow : 'none',
          animation: canSubmit && !isLoading ? `capture-btn-pulse 2.5s ease-in-out infinite` : 'none',
          // pass color for the pulse via CSS variable
          ...({ '--capture-pulse-color': isArranque ? 'rgba(52,211,153,0.35)' : 'rgba(96,165,250,0.35)' } as React.CSSProperties),
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {t('audit_capture_button_loading')}
          </>
        ) : (
          <>
            <Icon icon={isArranque ? 'solar:rocket-2-outline' : 'solar:lock-keyhole-unlocked-outline'} width={18} height={18} />
            {ctaText}
          </>
        )}
      </button>

      {/* Trust note */}
      <div
        className="mt-3.5 flex items-center justify-center gap-1.5 font-inter text-gray-400"
        style={{ fontSize: 11, fontWeight: 500 }}
      >
        <Icon icon="solar:shield-check-outline" width={13} height={13} />
        <span>{t('audit_capture_trust_note')}</span>
      </div>
    </div>
  );
}
