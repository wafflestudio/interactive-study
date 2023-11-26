'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Wallet from '@/components/wallet';
import Navigation from '@/components/navigation';

export default function Home() {
  const start = 500;
  const end = 6000;
  const router = useRouter();
  const [step, setStep] = useState(0);

  const onNext = useCallback(() => {
    router.push('/game');
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, end);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {step === 0 && <Wallet start={start} end={end} />}
      {step === 1 && <Navigation onNext={onNext} />}
    </>
  );
}
