//components/AuthProvider/AuthProvider

'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const privateRoutes = ['/profile', '/notes'];

const AuthProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      try {
        // Перевіряємо сесію
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          // Якщо сесія валідна — отримуємо користувача
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            // Якщо не вдалося отримати користувача — вихід
            await logout();
            clearIsAuthenticated();
            if (isPrivateRoute) {
              router.push('/sign-in');
            }
          }
        } else {
          // Якщо сесія невалідна — чистимо стан
          clearIsAuthenticated();

          // Якщо на приватній сторінці — виконуємо вихід і редірект
          if (isPrivateRoute) {
            await logout();
            clearIsAuthenticated();
            router.push('/sign-in');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearIsAuthenticated();

        // Якщо на приватній сторінці — виконуємо вихід і редірект
        if (isPrivateRoute) {
          try {
            await logout();
          } catch {
            // Ігноруємо помилки logout
          }
          clearIsAuthenticated();
          router.push('/sign-in');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, setUser, clearIsAuthenticated, router, isPrivateRoute]);

  // Показуємо лоадер під час перевірки
  if (isChecking) {
    return <div>Loading...</div>;
  }
  // Якщо на приватній сторінці і неавторизований — не показуємо контент
  // (редірект вже виконано в useEffect)

  if (isPrivateRoute && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
