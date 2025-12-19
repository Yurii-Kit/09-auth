// ===========================
// СТОРІНКА ВХОДУ (SIGN-IN)
// ===========================
// Ця сторінка дозволяє користувачу увійти в систему.
// Використовуємо Server Actions (нова функція Next.js 13+) замість традиційних form submit.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInPage.module.css';
import { login, LoginRequest } from '@/lib/api/clientApi';

export default function SignInPage() {
  const router = useRouter(); // Для навігації між сторінками
  const [error, setError] = useState<string | null>(null); // Зберігаємо помилку, якщо вона є
  const [isLoading, setIsLoading] = useState(false); // Показуємо, чи йде процес входу

  // Отримуємо функцію для збереження користувача в глобальний стан (Zustand store)
  const setUser = useAuthStore((state) => state.setUser);

  // ===========================
  // ОБРОБКА ФОРМИ
  // ===========================
  // Ця функція викликається, коли користувач натискає "Log in"
  const handleSubmit = async (formData: FormData) => {
    // Очищуємо попередні помилки
    setError(null);
    setIsLoading(true);

    try {
      // FormData — це спеціальний об'єкт, який містить дані з форми.
      // Перетворюємо його в звичайний об'єкт { email: "...", password: "..." }
      const formValues = Object.fromEntries(formData) as LoginRequest;

      // Відправляємо запит на сервер для входу
      const res = await login(formValues);

      if (res) {
        // Якщо успішно — зберігаємо користувача в глобальний стан
        setUser(res);
        // Перенаправляємо на сторінку профілю
        router.push('/profile');
      } else {
        // Якщо сервер повернув порожню відповідь
        setError('Invalid email or password');
      }
    } catch (error) {
      // Обробка помилок
      // ApiError — це наш власний тип помилки з axios
      const errorMessage =
        (error as ApiError).response?.data?.error ?? // Помилка від сервера
        (error as ApiError).message ?? // Загальне повідомлення помилки
        'Oops... something went wrong';

      setError(errorMessage);
    } finally {
      // Завжди вимикаємо індикатор завантаження
      setIsLoading(false);
    }
  };

  return (
    <div className={css.mainContent}>
      <h1 className={css.formTitle}>Sign In</h1>

      {/* 
        action={handleSubmit} — це Server Action з Next.js.
        Форма автоматично передає дані в функцію handleSubmit як FormData
      */}
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={css.input}
            placeholder="Enter your email"
            required
            disabled={isLoading} // Вимикаємо поле під час завантаження
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className={css.input}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading} // Вимикаємо кнопку під час завантаження
          >
            {isLoading ? 'Loading...' : 'Log In'}
          </button>
        </div>

        {/* Показуємо помилку, якщо вона є */}
        {error && <p className={css.error}>{error}</p>}
      </form>
    </div>
  );
}
