'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LandingHero } from '@/features/audit/ui/input/components';
import { UsernameInput } from '@/features/audit/ui/input/components';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (username: string) => {
    setIsLoading(true);
    router.push(`/audit/${username}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-soft-aqua">
      {/* BeweOS Logo */}
      <div className="absolute top-6 left-6">
        <span className="font-inter font-bold text-h3 text-base-oscura">BeweOS</span>
      </div>

      <LandingHero />
      <UsernameInput onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  );
}
