'use client';

import { useCallback } from 'react';

type Translations = Record<string, string>;

// Static imports for SSR compatibility
import esCommon from '@/locales/es/common.json';
import esAudit from '@/locales/es/audit.json';
import ptCommon from '@/locales/pt/common.json';
import ptAudit from '@/locales/pt/audit.json';

const translations: Record<string, Record<string, Translations>> = {
  es: { common: esCommon, audit: esAudit },
  pt: { common: ptCommon, audit: ptAudit },
};

// Default locale
const DEFAULT_LOCALE = 'es';

export function useTranslation(namespace: 'common' | 'audit' = 'common', locale?: string) {
  const currentLocale = locale ?? DEFAULT_LOCALE;

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const ns = translations[currentLocale]?.[namespace];
      return ns?.[key] ?? fallback ?? key;
    },
    [currentLocale, namespace]
  );

  return { t, locale: currentLocale };
}
