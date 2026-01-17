'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HealthCoachingPageContent from './page-content';

export default function HealthCoachingClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user clicks "Start Free Trial" while already logged in, redirect to onboarding
    const handleCTAClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href="/auth/signup"]');

      if (link && status === 'authenticated') {
        e.preventDefault();
        router.push('/app/onboarding');
      }
    };

    document.addEventListener('click', handleCTAClick, true);
    return () => document.removeEventListener('click', handleCTAClick, true);
  }, [status, router]);

  return <HealthCoachingPageContent />;
}
