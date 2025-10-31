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

export async function getCurrentUser() {
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
