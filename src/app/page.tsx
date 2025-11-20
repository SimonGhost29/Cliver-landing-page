'use client';

import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('@/components/LandingPage'),
  { 
    ssr: false,
    loading: () => <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff'
    }}>Chargement de l'application...</div>
  }
);

export default function Home() {
  return <LandingPage />;
}
