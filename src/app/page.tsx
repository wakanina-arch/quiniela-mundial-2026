'use client';

import { useRouter } from 'next/navigation';
import { SplashBracket } from '@/components/SplashBracket';

export default function RootPage() {
  const router = useRouter();

  const handleTrophyClick = () => {
    router.push('/home');
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <SplashBracket 
        modo="splash"
        trophyInteractive={true}
        onTrophyClick={handleTrophyClick}
      />
    </main>
  );
}
