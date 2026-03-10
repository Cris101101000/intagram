import { AuditPageController } from '@/features/audit/ui/_shared/components/AuditPageController';

interface AuditPageProps {
  params: Promise<{ username: string }>;
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { username } = await params;
  return <AuditPageController username={username} />;
}
