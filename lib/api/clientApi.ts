// ===========================
// КЛІЄНТСЬКІ API ФУНКЦІЇ
// ===========================
// Ці функції викликаються в браузері (клієнтські компоненти 'use client').
// Використовуються в React Query (useMutation, useQuery) та в обробниках подій.
//
// Відмінність від серверних функцій:
// - Виконуються в браузері користувача
// - Cookies передаються автоматично через withCredentials: true
// - Можуть використовуватися в інтерактивних компонентах

import { nextServer } from './api';
import { FetchNotesResponse, Note, NoteFormValues } from '@/types/note';
import { User } from '@/types/user';

// ===========================
// ОТРИМАТИ ВСІ НОТАТКИ (з клієнта)
// ===========================
// Використовується для динамічного завантаження нотаток (пошук, фільтри, пагінація)
export const fetchNotes = async (params?: {
  query?: string; // Пошуковий запит
  page?: number; // Номер сторінки
  perPage?: number; // Кількість на сторінці
  tag?: string; // Фільтр за тегом
}): Promise<FetchNotesResponse> => {
  // Встановлюємо значення за замовчуванням
  const { query = '', page = 1, perPage = 12, tag } = params ?? {};

  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      // Додаємо параметр search тільки якщо є текст
      ...(query.trim() ? { search: query.trim() } : {}),
      // Додаємо тег тільки якщо він обраний
      ...(tag?.trim() ? { tag: tag.trim() } : {}),
      page,
      perPage,
    },
  });
  return res.data;
};

// ===========================
// СТВОРИТИ НОВУ НОТАТКУ
// ===========================
// Відправляє POST запит на сервер з даними нової нотатки
export const createNote = async (newNote: NoteFormValues) => {
  const response = await nextServer.post<Note>('/notes', newNote);
  return response.data;
};

// ===========================
// ВИДАЛИТИ НОТАТКУ
// ===========================
// Відправляє DELETE запит для видалення нотатки за ID
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

// ===========================
// ОТРИМАТИ ОДНУ НОТАТКУ (з клієнта)
// ===========================
// Використовується для динамічного завантаження деталей нотатки
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

// ===========================
// РЕЄСТРАЦІЯ НОВОГО КОРИСТУВАЧА
// ===========================
export type RegisterRequest = {
  email: string;
  password: string;
};

// Відправляє дані реєстрації на сервер
// При успіху сервер поверне дані користувача та встановить cookies (токени)
export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

// ===========================
// ВХІД В СИСТЕМУ (LOGIN)
// ===========================
export type LoginRequest = {
  email: string;
  password: string;
};

// Відправляє дані входу на сервер
// При успіху сервер поверне дані користувача та встановить cookies (токени)
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

// ===========================
// ПЕРЕВІРИТИ СЕСІЮ (з клієнта)
// ===========================
type CheckSessionRequest = {
  success: boolean;
};

// Перевіряє, чи дійсні токени користувача
// Повертає true, якщо сесія валідна
export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

// ===========================
// ОТРИМАТИ ДАНІ КОРИСТУВАЧА (з клієнта)
// ===========================
// Використовується в AuthProvider для завантаження даних користувача
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

// ===========================
// ВИХІД З СИСТЕМИ (LOGOUT)
// ===========================
// Видаляє токени на сервері та в cookies
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

// ===========================
// ОНОВИТИ ДАНІ КОРИСТУВАЧА
// ===========================
export interface UpdateUserPayload {
  username: string; // Нове ім'я користувача
  email?: string; // Новий email (опційно)
}

// Відправляє PATCH запит для оновлення профілю
export async function updateUser(data: UpdateUserPayload): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}
