//components/AuthProvider/AuthProvider

'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import css from './AuthProvider.module.css';

type Props = {
  children: React.ReactNode;
};

const PRIVATE_ROUTES = ['/profile', '/notes'] as const;

const AuthProvider = ({ children }: Props) => {
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const isPrivateRoute = useMemo(
    () => PRIVATE_ROUTES.some((route) => pathname.startsWith(route)),
    [pathname],
  );

  const handleLogoutAndRedirect = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      // Ignore logout errors
      console.warn('Logout failed:', error);
    } finally {
      clearIsAuthenticated();
      if (isPrivateRoute) {
        router.push('/sign-in');
      }
    }
  }, [clearIsAuthenticated, isPrivateRoute, router]);

  const checkAuth = useCallback(async () => {
    setIsChecking(true);

    try {
      const isSessionValid = await checkSession();

      if (isSessionValid) {
        const user = await getMe();
        if (user) {
          setUser(user);
        } else {
          await handleLogoutAndRedirect();
        }
      } else {
        clearIsAuthenticated();
        if (isPrivateRoute) {
          await handleLogoutAndRedirect();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearIsAuthenticated();
      if (isPrivateRoute) {
        await handleLogoutAndRedirect();
      }
    } finally {
      setIsChecking(false);
    }
  }, [setUser, clearIsAuthenticated, isPrivateRoute, handleLogoutAndRedirect]);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {children}
      {mounted && isChecking && (
        <div
          className={css.overlay}
          role="status"
          aria-live="polite"
          aria-label="Перевірка сесії"
        >
          <div className={css.loaderContainer}>
            <div className={css.spinner} aria-hidden="true"></div>
            <p className={css.text}>Перевірка сесії...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthProvider;
