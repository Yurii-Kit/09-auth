import { nextServer } from './api';
import { FetchNotesResponse, Note, NoteFormValues } from '@/types/note';
import { User } from '@/types/user';

// All notes
export const fetchNotes = async (params?: {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string; // ← додано
}): Promise<FetchNotesResponse> => {
  const { query = '', page = 1, perPage = 12, tag } = params ?? {};
  const res = await nextServer.get<FetchNotesResponse>('/notes', {
    params: {
      ...(query.trim() ? { search: query.trim() } : {}),
      ...(tag ? { tag } : {}),
      page,
      perPage,
    },
  });
  return res.data;
};

// Create note
export const createNote = async (newNote: NoteFormValues) => {
  const response = await nextServer.post<Note>('/notes', newNote);
  return response.data;
};

// Delete note
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`notes/${id}`);
  return response.data;
};

// Single note
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`notes/${id}`);
  return response.data;
};

//Registration
export type RegisterRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

// Login
export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

// Check session
type CheckSessionRequest = {
  success: boolean;
};
export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

// Current user
export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

// Logout
export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

//Update user
export interface UpdateUserPayload {
  username: string;
  email?: string;
}

export async function updateUser(data: UpdateUserPayload): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}
