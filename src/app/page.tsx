'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  HeroSection,
  SocialProofMarquee,
  FeaturesSection,
  ScorePreviewSection,
  TestimonialsSection,
  CtaSection,
  Footer,
} from '@/features/audit/ui/landing/components';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Read error from query params (redirected back from audit page)
  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setApiError(err);
      // Clean URL without reloading
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    (username: string) => {
      setIsLoading(true);
      setApiError('');
      router.push(`/audit/${username}`);
    },
    [router],
  );

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EEF6FF 0%, #F0FDF9 40%, #FEFCE8 100%)', backgroundAttachment: 'fixed' }}>
      <HeroSection onSubmit={handleSubmit} isLoading={isLoading} apiError={apiError} />

      <SocialProofMarquee />
      <FeaturesSection />
      <ScorePreviewSection />
      <TestimonialsSection />
      <CtaSection onSubmit={handleSubmit} isLoading={isLoading} />
      <Footer />
    </main>
  );
}
