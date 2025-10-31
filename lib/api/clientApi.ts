import { nextServer } from './api';
import { FetchNotesResponse, Note, NoteFormValues } from '@/types/note';

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

export const createNote = async (newNote: NoteFormValues) => {
  const response = await nextServer.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`notes/${id}`);
  return response.data;
};

// Single note
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`notes/${id}`);
  return response.data;
};
