// app/notes/filter/@sidebar/default.tsx
import Link from 'next/link';
import css from './SidebarNotes.module.css';

// Перелік тегів — оскільки бекенд не має ендпоінта для них
const tags = [
  'Work',
  'Personal',
  ' Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

const SidebarNotes = async () => {
  return (
    <ul className={css.menuList}>
      {/* Посилання для всіх нотаток */}
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={css.menuLink}>
          All notes
        </Link>
      </li>

      {/* Посилання для кожного тегу */}
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
