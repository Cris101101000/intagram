'use client';

import { useState } from 'react';
import { Input, Button, Checkbox } from '@heroui/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { AuditRoute } from '@/features/audit/domain/interfaces/audit';

export interface CaptureFormData {
  name: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
}

interface UnlockFormProps {
  route: AuditRoute;
  onSubmit: (data: CaptureFormData) => void;
  isLoading?: boolean;
}

export function UnlockForm({ route, onSubmit, isLoading = false }: UnlockFormProps) {
  const { t } = useTranslation('common');
  const { t: tAudit } = useTranslation('audit');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isArranque = route === AuditRoute.ARRANQUE;

  const title = isArranque
    ? 'Desbloquea tu Plan de Crecimiento — es gratis'
    : 'Desbloquea tu análisis completo — es gratis';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('validation_required');
    }

    if (!email.trim()) {
      newErrors.email = t('validation_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t('validation_email');
    }

    if (!phone.trim()) {
      newErrors.phone = t('validation_required');
    }

    if (!gdprConsent) {
      newErrors.gdprConsent = t('validation_consent');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), gdprConsent });
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

  return (
    <div className="flex flex-col gap-bewe-4 w-full">
      <div className="text-center">
        <h2 className="text-h2 font-inter font-semibold text-base-oscura">
          {title}
        </h2>
      </div>

      <Input
        label={t('field_name')}
        placeholder={t('placeholder_name')}
        value={name}
        onValueChange={(val) => {
          setName(val);
          clearError('name');
        }}
        variant="bordered"
        size="lg"
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        classNames={{ input: 'text-body font-inter' }}
        aria-label={t('field_name')}
      />

      <Input
        label={t('field_email')}
        placeholder={t('placeholder_email')}
        type="email"
        value={email}
        onValueChange={(val) => {
          setEmail(val);
          clearError('email');
        }}
        variant="bordered"
        size="lg"
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        classNames={{ input: 'text-body font-inter' }}
        aria-label={t('field_email')}
      />

      <Input
        label={t('field_phone')}
        placeholder={t('placeholder_phone')}
        type="tel"
        value={phone}
        onValueChange={(val) => {
          setPhone(val);
          clearError('phone');
        }}
        variant="bordered"
        size="lg"
        isInvalid={!!errors.phone}
        errorMessage={errors.phone}
        classNames={{ input: 'text-body font-inter' }}
        aria-label={t('field_phone')}
      />

      <div className="flex flex-col gap-1">
        <Checkbox
          isSelected={gdprConsent}
          onValueChange={(val) => {
            setGdprConsent(val);
            clearError('gdprConsent');
          }}
          size="sm"
          classNames={{ label: 'text-small font-inter text-gray-600' }}
        >
          {t('label_consent')}
        </Checkbox>
        {errors.gdprConsent && (
          <p className="text-tiny text-semantic-error font-inter ml-7">
            {errors.gdprConsent}
          </p>
        )}
      </div>

      <Button
        color="primary"
        size="lg"
        radius="full"
        className="w-full bg-primary-400 font-inter font-semibold text-button"
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        {t('button_submit')}
      </Button>

      <p className="text-small text-gray-400 text-center font-inter">
        {t('message_no_spam')}
      </p>
    </div>
  );
}
