'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/splash-screen';
import Dashboard from '@/components/dashboard';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return <Dashboard />;
}
