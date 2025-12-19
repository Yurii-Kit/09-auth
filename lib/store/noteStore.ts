// ===========================
// ZUSTAND STORE ДЛЯ ЧЕРНЕТКИ НОТАТКИ
// ===========================
// Цей store зберігає чернетку нотатки, щоб користувач не втратив дані
// при випадковому закритті вкладки або перезавантаженні сторінки.
//
// Використовує middleware 'persist' для збереження в localStorage.

import { create } from 'zustand';
import { NoteFormValues } from '@/types/note';
import { persist } from 'zustand/middleware';

// ===========================
// ЩО ТАКЕ LOCALSTORAGE?
// ===========================
// localStorage — це сховище в браузері, де можна зберігати дані.
// Дані залишаються навіть після закриття браузера!
//
// Приклад:
// localStorage.setItem('name', 'Іван');
// const name = localStorage.getItem('name'); // 'Іван'

type NoteDraftStore = {
  draft: NoteFormValues; // Чернетка нотатки
  setDraft: (note: NoteFormValues) => void; // Зберегти чернетку
  clearDraft: () => void; // Очистити чернетку
};

// Початкове значення чернетки (порожня нотатка)
const initialDraft: NoteFormValues = {
  title: '',
  content: '',
  tag: '',
};

// ===========================
// СТВОРЕННЯ STORE З PERSIST
// ===========================
// persist() — це middleware, який автоматично зберігає стан в localStorage
export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      // Зберегти чернетку (автоматично збережеться в localStorage)
      setDraft: (note) => set(() => ({ draft: note })),

      // Очистити чернетку
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      // Ключ, під яким зберігається в localStorage
      // Можна перевірити в DevTools -> Application -> Local Storage
      name: 'note-draft',

      // partialize — зберігати тільки частину стану
      // Тут зберігаємо лише draft (не всі внутрішні дані Zustand)
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
