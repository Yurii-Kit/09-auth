'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <main className="auth-layout">{children}</main>;
}
