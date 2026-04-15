import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuditPageController } from '@/features/audit/ui/_shared/components/AuditPageController';

interface AuditPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { username } = await params;
  const clean = username.replace(/^@/, '').trim();

  return {
    title: `Auditoría de @${clean} — Instagram Score | BeweOS`,
    description: `Resultados del análisis de Instagram de @${clean}. Score de 0 a 100, métricas clave y plan de acción personalizado.`,
    openGraph: {
      title: `Auditoría de @${clean} — Instagram Score`,
      description: `Descubre el score de Instagram de @${clean} comparado con negocios de su sector.`,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Auditoría de @${clean} — Instagram Score`,
      description: `Descubre el score de Instagram de @${clean} comparado con negocios de su sector.`,
      images: ['/og-image.png'],
    },
    robots: { index: false, follow: true },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { username } = await params;
  return (
    <Suspense>
      <AuditPageController username={username} />
    </Suspense>
  );
}
