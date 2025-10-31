// app/notes/Notes.client.tsx

'use client';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import type { FetchNotesResponse } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import css from './Notes.client.module.css';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';

interface NotesClientProps {
  tagName?: string;
  initialQuery: string;
  initialPage: number;
}

const NotesClient = ({
  tagName,
  initialQuery,
  initialPage,
}: NotesClientProps) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const debouncedSetQuery = useDebouncedCallback((newQuery: string) => {
    if (newQuery === query) return; // 👈 пропускаємо дубль
    setQuery(newQuery);
    setCurrentPage(1);
  }, 800);

  // ✅ React Query підхоплює гідратований кеш
  const tagKey = tagName ?? 'all';
  const { data, isError, isFetching } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', query, currentPage, tagKey],
    queryFn: () =>
      fetchNotes({
        query: query,
        page: currentPage,
        perPage: 12,
        tag: tagKey,
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    placeholderData: keepPreviousData, //  залишає старі дані поки нові завантажуються
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox text={query} onSearch={debouncedSetQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </div>

      {isError ? (
        <p className={css.error}>Failed to load notes.</p>
      ) : data?.notes?.length ? (
        <>
          <NoteList notes={data.notes} />
          {isFetching && <p className={css.loading}>Loading notes...</p>}
        </>
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
};

export default NotesClient;
