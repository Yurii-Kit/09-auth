// ===========================
// ЩО ТАКЕ ZUSTAND?
// ===========================
// Zustand — це бібліотека для управління глобальним станом у React.
// Глобальний стан — це дані, які потрібні багатьом компонентам у додатку.
//
// Наприклад:
// - Інформація про залогіненого користувача
// - Налаштування теми (темна/світла)
// - Дані кошика в інтернет-магазині
//
// Переваги Zustand:
// ✅ Простіша за Redux (менше коду)
// ✅ Не потребує Context Provider
// ✅ Швидка та легка
// ✅ Має DevTools для відлагодження

import { create } from 'zustand';
import type { User } from '@/types/user';
import { devtools } from 'zustand/middleware';

// ===========================
// ТИПИ ДЛЯ TYPESCRIPT
// ===========================
// Описуємо, які дані та функції будуть у нашому store
interface AuthState {
  // Дані користувача (або null, якщо не залогінений)
  user: User | null;

  // Чи користувач авторизований?
  isAuthenticated: boolean;

  // Функція для збереження користувача після логіну
  setUser: (user: User) => void;

  // Функція для очищення даних при logout
  clearIsAuthenticated: () => void;
}

// ===========================
// СТВОРЕННЯ STORE
// ===========================
// create() — основна функція Zustand для створення store
// devtools() — додаток для відлагодження через Redux DevTools у браузері
export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    // ===========================
    // ПОЧАТКОВИЙ СТАН
    // ===========================
    user: null, // Спочатку користувача немає
    isAuthenticated: false, // Спочатку не авторизований

    // ===========================
    // ФУНКЦІЯ: Зберегти користувача
    // ===========================
    // Викликається після успішного логіну
    // set() — спеціальна функція Zustand для оновлення стану
    setUser: (user) => set({ user, isAuthenticated: true }),

    // ===========================
    // ФУНКЦІЯ: Очистити авторизацію
    // ===========================
    // Викликається при logout або якщо сесія недійсна
    clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
  })),
);

// ===========================
// ЯК ВИКОРИСТОВУВАТИ?
// ===========================
// У будь-якому компоненті:
//
// import { useAuthStore } from '@/lib/store/authStore';
//
// const MyComponent = () => {
//   // Отримати дані користувача
//   const user = useAuthStore((state) => state.user);
//
//   // Отримати функцію setUser
//   const setUser = useAuthStore((state) => state.setUser);
//
//   // Перевірити, чи залогінений
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//
//   return <div>Hello, {user?.username}</div>;
// };
