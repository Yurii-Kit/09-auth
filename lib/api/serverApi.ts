import { nextServer } from './api';
import { FetchNotesParams, FetchNotesResponse, Note } from '@/types/note';
import { User } from '@/types/user';
import { cookies } from 'next/headers';

// All notes
export const fetchNotes = async (
  params?: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

// Single note
export async function fetchNoteById(id: string) {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
}

// Current user
export async function getMe() {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  try {
    const res = await nextServer.get<User>(`/users/me`, {
      headers: {
        // передаємо кукі далі
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch {
    return null;
  }
}

// Check session
export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб middleware мав доступ до нових cookie
  return res;
};
