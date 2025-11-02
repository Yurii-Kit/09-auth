'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import type { NoteFormValues } from '../../types/note';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import TagsMenu from '../TagsMenu/TagsMenu';
import { useDebouncedCallback } from 'use-debounce';
import css from './NoteForm.module.css';

const tagOptions: string[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const NoteForm = () => {
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  // локальний стан форми — не оновлює Zustand на кожному введенні
  const [formValues, setFormValues] = useState<NoteFormValues>(draft);
  // локально оновлюємо одразу
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // debounce для автозбереження
  const debouncedSaveDraft = useDebouncedCallback((values: NoteFormValues) => {
    setDraft(values);
  }, 1000);

  useEffect(() => {
    debouncedSaveDraft(formValues);
  }, [formValues, debouncedSaveDraft]);

  // Мутація для створення нотатки
  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formValues);
    mutate(formValues); // всі поля: title, content, tag
  };

  const handleCancel = () => router.push('/notes/filter/all');

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          className={css.input}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formValues.content}
          onChange={handleChange}
          className={css.textarea}
          required
        ></textarea>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <TagsMenu
          id="tag"
          options={tagOptions}
          value={formValues.tag}
          onChange={(tag) => setFormValues((prev) => ({ ...prev, tag: tag }))}
          placeholder={'Select tag'}
        />
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
