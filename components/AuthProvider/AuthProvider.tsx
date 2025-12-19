//components/AuthProvider/AuthProvider
// ===========================
// ЩО РОБИТЬ ЦЕЙ КОМПОНЕНТ?
// ===========================
// AuthProvider — це "обгортка" навколо всього додатку, яка:
// 1. Перевіряє, чи користувач залогінений, коли додаток запускається
// 2. Завантажує дані користувача, якщо він залогінений
// 3. Показує loader під час перевірки
// 4. Автоматично розлогінює, якщо сесія недійсна

'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import css from './AuthProvider.module.css';

type Props = {
  children: React.ReactNode; // Це все, що буде "всередині" AuthProvider
};

// Приватні маршрути, які потребують авторизації
const PRIVATE_ROUTES = ['/profile', '/notes'] as const;

const AuthProvider = ({ children }: Props) => {
  // ===========================
  // ЛОКАЛЬНИЙ СТАН (useState)
  // ===========================
  // useState — це хук для зберігання даних, які можуть змінюватися.
  // Коли вони змінюються, React перемальовує компонент.

  // Чи зараз відбувається перевірка авторизації?
  const [isChecking, setIsChecking] = useState(true);

  // Чи компонент змонтовано в DOM? (потрібно для уникнення проблем з SSR)
  const [mounted, setMounted] = useState(false);

  // ===========================
  // ХУКИ NEXT.JS ДЛЯ НАВІГАЦІЇ
  // ===========================
  // pathname — поточний шлях (наприклад, "/profile")
  const pathname = usePathname();
  // router — для програмного переходу між сторінками
  const router = useRouter();

  // ===========================
  // ГЛОБАЛЬНИЙ СТАН (Zustand)
  // ===========================
  // Zustand — це бібліотека для глобального стану (як Redux, але простіша).
  // Отримуємо функції для роботи з користувачем із store.
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  // ===========================
  // useMemo — ЗАПАМ'ЯТОВУЄМО РЕЗУЛЬТАТ ОБЧИСЛЕННЯ
  // ===========================
  // useMemo запам'ятовує результат складного обчислення.
  // Перераховується тільки коли pathname змінюється.
  // Це оптимізація: якщо pathname не змінився, не треба знову перевіряти.
  const isPrivateRoute = useMemo(
    () => PRIVATE_ROUTES.some((route) => pathname.startsWith(route)),
    [pathname], // перераховувати тільки коли pathname змінюється
  );

  // ===========================
  // useCallback — ЗАПАМ'ЯТОВУЄМО ФУНКЦІЮ
  // ===========================
  // useCallback запам'ятовує функцію, щоб вона не створювалася заново при кожному рендері.
  // Це важливо, коли ми передаємо функцію як залежність в useEffect.

  // Функція для виходу і перенаправлення на sign-in
  const handleLogoutAndRedirect = useCallback(async () => {
    try {
      // Намагаємося розлогінитись на сервері
      await logout();
    } catch (error) {
      // Якщо помилка при logout — не проблема, просто попереджуємо
      console.warn('Logout failed:', error);
    } finally {
      // В будь-якому випадку очищуємо локальний стан
      clearIsAuthenticated();
      // Якщо користувач на приватній сторінці, перенаправляємо на sign-in
      if (isPrivateRoute) {
        router.push('/sign-in');
      }
    }
  }, [clearIsAuthenticated, isPrivateRoute, router]); // функція оновлюється, якщо ці змінні змінюються

  // Основна функція перевірки авторизації
  const checkAuth = useCallback(async () => {
    // Встановлюємо прапорець "перевірка триває"
    setIsChecking(true);

    try {
      // Перевіряємо, чи сесія ще дійсна на сервері
      const isSessionValid = await checkSession();

      if (isSessionValid) {
        // Якщо сесія валідна, завантажуємо дані користувача
        const user = await getMe();
        if (user) {
          // Зберігаємо користувача в глобальний стан
          setUser(user);
        } else {
          // Не вдалося отримати користувача — розлогінюємо
          await handleLogoutAndRedirect();
        }
      } else {
        // Сесія невалідна
        clearIsAuthenticated();
        if (isPrivateRoute) {
          // Якщо користувач на приватній сторінці, розлогінюємо і перенаправляємо
          await handleLogoutAndRedirect();
        }
      }
    } catch (error) {
      // Якщо сталася помилка під час перевірки
      console.error('Auth check failed:', error);
      clearIsAuthenticated();
      if (isPrivateRoute) {
        await handleLogoutAndRedirect();
      }
    } finally {
      // Завжди вимикаємо індикатор перевірки
      setIsChecking(false);
    }
  }, [setUser, clearIsAuthenticated, isPrivateRoute, handleLogoutAndRedirect]);

  // ===========================
  // useEffect — ПОБІЧНІ ЕФЕКТИ
  // ===========================
  // useEffect виконується після рендеру компонента.
  // Тут ми викликаємо перевірку авторизації один раз при завантаженні.
  useEffect(() => {
    setMounted(true); // Позначаємо, що компонент змонтовано
    checkAuth(); // Запускаємо перевірку авторизації
  }, [checkAuth]); // виконується знову, якщо checkAuth змінюється (але воно стабільне через useCallback)

  return (
    <>
      {children}
      {mounted && isChecking && (
        <div
          className={css.overlay}
          role="status"
          aria-live="polite"
          aria-label="Checking session"
        >
          <div className={css.loaderContainer}>
            <div className={css.spinner} aria-hidden="true"></div>
            <p className={css.text}>Checking session...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthProvider;
