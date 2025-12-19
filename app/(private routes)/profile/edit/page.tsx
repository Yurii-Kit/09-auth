'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe, updateUser } from '@/lib/api/clientApi';
import axios, { AxiosError } from 'axios';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        // 1️⃣ Оновлюємо сесію
        await checkSession();

        // 2️⃣ Отримуємо користувача
        const me = await getMe();

        if (!me) {
          console.error('User not found');
          router.push('/sign-in');
          return;
        }

        // 3️⃣ Записуємо користувача в Zustand і локальний state
        setUser(me);
        setUsername(me.username ?? '');
      } catch (err) {
        console.error('Failed to fetch user:', err);
        router.push('/sign-in'); // редірект при будь-якій помилці
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <main>Loading profile...</main>;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      if (!user) return;

      const updatedUser = await updateUser({ username });
      setUser(updatedUser);
      setUsername(updatedUser.username ?? '');
      router.push('/profile');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 409) {
          alert('This username is already taken. Please try another one.');
        } else {
          console.error('Failed to update user:', axiosErr);
          alert('Error saving profile.');
        }
      } else {
        console.error('Unexpected error:', err);
        alert('Error saving profile.');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    router.push('/profile');
  }

  return (
    <div className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email ?? 'Not found'}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
