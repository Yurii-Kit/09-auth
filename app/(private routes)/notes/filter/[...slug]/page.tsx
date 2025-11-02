// app/notes/filter/[...slug]/page.tsx
import NotesClient from '@/app/(private routes)/notes/filter/[...slug]/Notes.client';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import type { Metadata } from 'next';

// Генерація динамічних метаданих
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const tagName =
    slug && slug.length > 0 && slug[0] !== 'all' ? slug[0] : 'all';

  const title =
    tagName !== 'all'
      ? `Notes tagged "${tagName}" | NoteHub`
      : 'All Notes | NoteHub';

  const description =
    tagName !== 'all'
      ? `Перегляд нотаток з фільтром за тегом "${tagName}".`
      : 'Перегляд усіх нотаток без фільтру.';

  const url = `https://08-zustand-eight-sigma.vercel.app/notes/filter/${tagName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes page - ${tagName}`,
        },
      ],
    },
  };
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

const FilteredNotesPage = async ({ params }: Props) => {
  const { slug } = await params;

  const tagName =
    slug && slug.length > 0 && slug[0] !== 'all' ? slug[0] : undefined;

  const queryClient = new QueryClient();

  const initialQuery = ''; // пустий пошук
  const initialPage = 1;

  await queryClient.prefetchQuery({
    queryKey: ['notes', initialQuery, initialPage, tagName ?? 'all'],
    queryFn: () =>
      fetchNotes({
        query: initialQuery,
        page: initialPage,
        perPage: 12,
        ...(tagName ? { tag: tagName } : {}),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        tagName={tagName}
        initialQuery={initialQuery}
        initialPage={initialPage}
      />
    </HydrationBoundary>
  );
};

export default FilteredNotesPage;
