'use client';

import { useState } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

type ErrorType = 'profile_private' | 'profile_not_found' | 'timeout' | 'server_error';

interface ErrorCardProps {
  errorType: ErrorType;
  onRetry: (username?: string) => void;
}

const ERROR_CONFIG: Record<
  ErrorType,
  { icon: string; titleKey: string; messageKey: string; showInput: boolean }
> = {
  profile_private: {
    icon: 'solar:lock-keyhole-outline',
    titleKey: 'audit_error_private_title',
    messageKey: 'audit_error_private_message',
    showInput: true,
  },
  profile_not_found: {
    icon: 'solar:user-cross-outline',
    titleKey: 'audit_error_not_found_title',
    messageKey: 'audit_error_not_found_message',
    showInput: true,
  },
  timeout: {
    icon: 'solar:danger-triangle-outline',
    titleKey: 'audit_error_timeout_title',
    messageKey: 'audit_error_timeout_message',
    showInput: false,
  },
  server_error: {
    icon: 'solar:danger-triangle-outline',
    titleKey: 'audit_error_generic_title',
    messageKey: 'audit_error_generic_message',
    showInput: false,
  },
};

export function ErrorCard({ errorType, onRetry }: ErrorCardProps) {
  const { t } = useTranslation('audit');
  const [username, setUsername] = useState('');

  const config = ERROR_CONFIG[errorType];
  const isRetryOnly = errorType === 'timeout' || errorType === 'server_error';
  const iconColor = isRetryOnly ? 'text-semantic-warning' : 'text-semantic-error';

  const handleSubmit = () => {
    if (config.showInput) {
      const trimmed = username.trim().replace(/^@/, '');
      if (trimmed) {
        onRetry(trimmed);
      }
    } else {
      onRetry();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-soft-aqua px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardBody className="flex flex-col items-center gap-5 p-8 text-center">
          <Icon
            icon={config.icon}
            className={iconColor}
            width={48}
            height={48}
          />

          <h2 className="font-inter text-h3 text-base-oscura">
            {t(config.titleKey)}
          </h2>

          <p className="font-inter text-body text-base-oscura">
            {t(config.messageKey)}
          </p>

          {config.showInput ? (
            <div className="flex w-full flex-col gap-3">
              <Input
                placeholder="@username"
                value={username}
                onValueChange={setUsername}
                onKeyDown={handleKeyDown}
                startContent={
                  <span className="text-small text-base-superficie">@</span>
                }
                variant="bordered"
                classNames={{
                  inputWrapper: 'border-base-teal',
                }}
              />
              <Button
                color="primary"
                className="w-full font-inter text-button"
                onPress={handleSubmit}
                isDisabled={!username.trim()}
              >
                Analizar
              </Button>
            </div>
          ) : (
            <Button
              variant="bordered"
              className="border-base-teal font-inter text-button text-base-oscura"
              onPress={() => onRetry()}
            >
              Intentar de nuevo
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
