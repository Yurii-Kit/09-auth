// ===========================
// НАЛАШТУВАННЯ AXIOS (HTTP КЛІЄНТ)
// ===========================
// Цей файл створює налаштований екземпляр axios для спілкування з бекенд API.
//
// ЩО ТАКЕ AXIOS?
// Axios — це бібліотека для відправки HTTP запитів (GET, POST, PUT, DELETE).
// Альтернатива: fetch API (вбудований в браузер), але axios зручніший.

import axios, { AxiosError } from 'axios';

// ===========================
// ТИПИ ДЛЯ ПОМИЛОК
// ===========================
// ApiError — це спеціальний тип для помилок від API.
// Він містить інформацію про помилку від сервера.
export type ApiError = AxiosError<{ error: string }>;

// ===========================
// СТВОРЕННЯ AXIOS INSTANCE
// ===========================
// Це "шаблон" для всіх запитів до нашого API.
// Всі запити будуть автоматично використовувати ці налаштування.
export const api = axios.create({
  // Базова URL — адреса бекенд сервера
  // Всі запити будуть починатися з цієї адреси
  // Наприклад: api.get('/notes') -> GET https://notehub-api.goit.study/notes
  baseURL: 'https://notehub-api.goit.study',

  // withCredentials: true — дозволяє відправляти cookies разом із запитами
  // Це потрібно для авторизації (accessToken і refreshToken зберігаються в cookies)
  withCredentials: true,
});

// ===========================
// ЯК ВИКОРИСТОВУВАТИ?
// ===========================
// import { api } from './api';
//
// // GET запит
// const response = await api.get('/notes');
//
// // POST запит
// await api.post('/notes', { title: 'Моя нотатка', content: 'Текст' });
//
// // DELETE запит
// await api.delete('/notes/123');
//
// // Обробка помилок
// try {
//   await api.post('/auth/login', { email, password });
// } catch (error) {
//   const apiError = error as ApiError;
//   console.log(apiError.response?.data?.error);
// }
