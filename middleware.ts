// middleware.ts
// ===========================
// ЩО ТАКЕ MIDDLEWARE?
// ===========================
// Middleware в Next.js — це функція, яка виконується ПЕРЕД тим, як користувач потрапить на сторінку.
// Це як "охоронець" на вході в будівлю: перевіряє, чи можна вас пустити.
//
// У цьому проекті middleware:
// 1. Перевіряє, чи користувач залогінений (є токени)
// 2. Захищає приватні сторінки від незалогінених користувачів
// 3. Автоматично оновлює застарілі токени

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

// ===========================
// ЩО ТАКЕ ТОКЕНИ?
// ===========================
// Токени — це спеціальні "ключі", які підтверджують, що ви залогінені.
//
// accessToken — короткоживучий токен (10-15 хв), використовується для звичайних запитів
// refreshToken — довгоживучий токен (7-30 днів), використовується для оновлення accessToken
//
// Чому два токени?
// - Якщо хтось викраде accessToken, він швидко стане недійсним
// - refreshToken зберігається безпечніше і рідше передається по мережі

// Маршрути, які потребують авторизації (треба бути залогіненим)
const privateRoutes = ['/profile', '/notes'];

// Маршрути для незалогінених користувачів
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  // Отримуємо cookie (це такі маленькі файли, що зберігаються в браузері)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // Дізнаємося, на яку сторінку користувач намагається потрапити
  const { pathname } = request.nextUrl;

  // Перевіряємо, чи це приватна сторінка
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Перевіряємо, чи це публічна сторінка (sign-in, sign-up)
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // ===========================
  // СЦЕНАРІЙ 1: Користувач йде на приватну сторінку
  // ===========================
  if (isPrivateRoute) {
    // Немає accessToken? Перевіряємо refreshToken
    if (!accessToken) {
      if (refreshToken) {
        // Є refreshToken — спробуємо отримати новий accessToken
        const data = await checkServerSession();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          // Обробляємо нові cookie від сервера
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
            };

            // Зберігаємо нові токени в cookie
            if (parsed.accessToken)
              cookieStore.set('accessToken', parsed.accessToken, options);
            if (parsed.refreshToken)
              cookieStore.set('refreshToken', parsed.refreshToken, options);
          }

          // Важливо! Передаємо оновлені cookie далі в браузер
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }

      // Немає жодного валідного токена — перенаправляємо на сторінку входу
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // ===========================
  // СЦЕНАРІЙ 2: Залогінений користувач йде на sign-in або sign-up
  // ===========================
  // Якщо вже залогінений, нема сенсу показувати форму входу
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // ===========================
  // СЦЕНАРІЙ 3: Все ОК, пропускаємо користувача
  // ===========================
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/notes/:path*', '/sign-in', '/sign-up'],
};
