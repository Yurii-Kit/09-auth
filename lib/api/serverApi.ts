// ===========================
// СЕРВЕРНІ API ФУНКЦІЇ
// ===========================
// Ці функції викликаються ТІЛЬКИ на сервері Next.js (Server Components, Server Actions, API Routes).
// НЕ можна використовувати в клієнтських компонентах ('use client').
//
// Чому потрібні серверні функції?
// - Безпека: токени не потрапляють в браузер
// - SEO: дані завантажуються до рендерингу сторінки
// - Швидкість: менше запитів від клієнта

import { nextServer } from './api';
import { FetchNotesParams, FetchNotesResponse, Note } from '@/types/note';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

// ===========================
// ОТРИМАТИ ВСІ НОТАТКИ (з фільтрами)
// ===========================
// Використовується на серверних сторінках для першого завантаження
export const fetchNotes = async (
  params?: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  // Отримуємо cookies з поточного запиту
  // Cookies містять accessToken та refreshToken
  const cookieStore = await cookies();

  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params, // Параметри фільтрації (search, tag, page, perPage)
    headers: {
      // ВАЖЛИВО! Передаємо cookies серверу API
      // Без цього сервер не зрозуміє, хто робить запит
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

// ===========================
// ОТРИМАТИ ОДНУ НОТАТКУ ЗА ID
// ===========================
// Використовується для відображення деталей нотатки
export async function fetchNoteById(id: string) {
  const cookieStore = await cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
}

// ===========================
// ОТРИМАТИ ДАНІ ПОТОЧНОГО КОРИСТУВАЧА
// ===========================
// Використовується в AuthProvider та на сторінці профілю
export async function getMe() {
  const cookieStore = await cookies();
  try {
    const res = await nextServer.get<User>(`/users/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch {
    // Якщо користувач не авторизований або токен недійсний
    return null;
  }
}

// ===========================
// ПЕРЕВІРИТИ СЕСІЮ (для middleware)
// ===========================
// Ця функція викликається в middleware для оновлення токенів
// Повертає ПОВНИЙ response, щоб middleware міг отримати нові cookies
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  // ВАЖЛИВО! Повертаємо весь response, а не тільки data
  // Middleware потребує доступу до headers['set-cookie']
  return res;
};
