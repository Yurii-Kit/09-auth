// app/(private routers)/profile/page.tsx

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/types/user';
import { getMe } from '@/lib/api/serverApi';
import css from './Profile.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'User profile page with account details and settings.',
};

export default async function ProfilePage() {
  let user: User | null = null;

  try {
    user = await getMe();
  } catch (err) {
    console.error('Failed to fetch current user:', err);
  }

  if (!user) {
    return <p>User not found or not logged in.</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
