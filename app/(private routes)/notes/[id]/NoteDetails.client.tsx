'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  id?: string;
}
const NoteDetailsClient = ({ id }: NoteDetailsClientProps) => {
  const params = useParams();
  const noteId = id ?? (params?.id as string);
  //  Використовуємо кешований запит або фетчимо, якщо треба
  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });
  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
