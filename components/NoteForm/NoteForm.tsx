// ===========================
// ФОРМА СТВОРЕННЯ НОТАТКИ
// ===========================
// Цей компонент дозволяє користувачу створювати нові нотатки.
// Використовує декілька продвинутих технік React:
// - Локальний стан для швидкої роботи форми
// - Debounce для автозбереження чернетки
// - React Query для відправки даних на сервер

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

// Доступні теги для нотаток
const tagOptions: string[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const NoteForm = () => {
  const router = useRouter(); // Для навігації

  // ===========================
  // ZUSTAND STORE ДЛЯ ЧЕРНЕТКИ
  // ===========================
  // Зберігаємо чернетку нотатки, щоб не втратити дані при перезавантаженні
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  // ===========================
  // ЛОКАЛЬНИЙ СТАН ФОРМИ
  // ===========================
  // Чому не одразу в Zustand?
  // - Оновлення локального стану швидше (React перемальовує тільки цей компонент)
  // - Zustand оновлюватиметься з debounce (затримкою)
  const [formValues, setFormValues] = useState<NoteFormValues>(draft);

  // ===========================
  // ОБРОБКА ЗМІНИ ПОЛІВ ФОРМИ
  // ===========================
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    // Оновлюємо локальний стан негайно (форма реагує швидко)
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================
  // DEBOUNCE ДЛЯ АВТОЗБЕРЕЖЕННЯ
  // ===========================
  // Що таке debounce?
  // Це техніка, яка відкладає виконання функції до моменту, коли користувач перестане друкувати.
  //
  // Приклад:
  // - Користувач друкує "Hello"
  // - Без debounce: 5 викликів setDraft (H, He, Hel, Hell, Hello)
  // - З debounce (1000ms): 1 виклик setDraft через 1 секунду після останнього введення
  //
  // Це економить ресурси і робить додаток швидшим!
  const debouncedSaveDraft = useDebouncedCallback((values: NoteFormValues) => {
    setDraft(values); // Зберігаємо чернетку в Zustand
  }, 1000); // Чекаємо 1 секунду після останнього введення

  // ===========================
  // АВТОЗБЕРЕЖЕННЯ ПРИ ЗМІНІ ФОРМИ
  // ===========================
  useEffect(() => {
    // Кожного разу, коли formValues змінюється, викликаємо debounced функцію
    debouncedSaveDraft(formValues);
  }, [formValues, debouncedSaveDraft]);

  // ===========================
  // REACT QUERY MUTATION
  // ===========================
  // Що таке mutation?
  // Mutation — це операція, яка ЗМІНЮЄ дані на сервері (POST, PUT, DELETE).
  // React Query автоматично керує станом завантаження, помилками, кешем.
  //
  // Переваги:
  // ✅ Автоматична обробка loading/error
  // ✅ Оптимістичні оновлення
  // ✅ Автоматичне повторення при помилках
  const { mutate, isPending } = useMutation({
    mutationFn: createNote, // Функція для відправки даних
    onSuccess: () => {
      // Викликається після успішного створення нотатки
      clearDraft(); // Очищуємо чернетку
      router.push('/notes/filter/all'); // Перенаправляємо на список нотаток
    },
  });

  // ===========================
  // ОБРОБКА ВІДПРАВКИ ФОРМИ
  // ===========================
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки
    console.log('Submitting note:', formValues);
    mutate(formValues); // Відправляємо дані на сервер
  };

  // Скасувати створення нотатки
  const handleCancel = () => router.push('/notes/filter/all');

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      {/* Поле для заголовка нотатки */}
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
          disabled={isPending} // Вимикаємо поле під час відправки
          placeholder="Enter note title"
        />
      </div>

      {/* Поле для змісту нотатки */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formValues.content}
          onChange={handleChange}
          className={css.textarea}
          required
          disabled={isPending}
          placeholder="Write your note content..."
          rows={8}
        ></textarea>
      </div>

      {/* Поле для вибору тегу */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <TagsMenu
          id="tag"
          options={tagOptions}
          value={formValues.tag}
          onChange={(tag) => setFormValues((prev) => ({ ...prev, tag: tag }))}
          placeholder="Select a tag"
        />
      </div>

      {/* Кнопки дій */}
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending} // Вимикаємо під час відправки
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending} // Вимикаємо під час відправки
        >
          {isPending ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
