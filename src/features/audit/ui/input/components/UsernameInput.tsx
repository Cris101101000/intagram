'use client';

import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

export function UsernameInput({ onSubmit, isLoading = false }: UsernameInputProps) {
  const { t } = useTranslation('common');
  const { t: tAudit } = useTranslation('audit');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const clean = username.replace(/^@/, '').trim();
    if (!clean) {
      setError(t('validation_required'));
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(clean)) {
      setError(t('validation_username'));
      return;
    }
    setError('');
    onSubmit(clean);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex gap-0">
        <Input
          value={username}
          onValueChange={(val) => {
            setUsername(val);
            if (error) setError('');
          }}
          placeholder={t('placeholder_username')}
          variant="bordered"
          radius="full"
          size="lg"
          classNames={{
            inputWrapper: 'rounded-r-none border-r-0 border-primary-400 focus-within:border-primary-400',
            input: 'text-body font-inter',
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          isInvalid={!!error}
          errorMessage={error}
          aria-label={t('field_username')}
        />
        <Button
          color="primary"
          size="lg"
          radius="full"
          className="rounded-l-none px-6 bg-primary-400 font-inter font-semibold text-button"
          onPress={handleSubmit}
          isLoading={isLoading}
          startContent={!isLoading && <Icon icon="solar:magnifer-outline" width={20} />}
        >
          {t('button_analyze')}
        </Button>
      </div>
      <p className="mt-3 text-small text-gray-400 text-center font-inter">
        {t('message_social_proof')}
      </p>
    </div>
  );
}
