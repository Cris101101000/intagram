'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  Navbar,
  HeroSection,
  SocialProofMarquee,
  FeaturesSection,
  ScorePreviewSection,
  TestimonialsSection,
  CtaSection,
  Footer,
} from '@/features/audit/ui/landing/components';
import { MoreTools } from '@/features/audit/ui/_shared/components/MoreTools';

function HomeContent() {
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

  // Track session start (once per browser session)
  useEffect(() => {
    if (sessionStorage.getItem('session_tracked')) return;
    sessionStorage.setItem('session_tracked', '1');
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '_landing', eventType: 'session_start' }),
    }).catch(() => {});
  }, []);

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
      <Navbar />
      <HeroSection onSubmit={handleSubmit} isLoading={isLoading} apiError={apiError} />

      <SocialProofMarquee />
      <FeaturesSection />
      <ScorePreviewSection />
      <TestimonialsSection />
      <CtaSection onSubmit={handleSubmit} isLoading={isLoading} />
      <section style={{ padding: '0 0 64px' }}>
        <div className="mx-auto max-w-[800px] px-6">
          <MoreTools />
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
