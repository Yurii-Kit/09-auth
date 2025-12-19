# 📋 Шпаргалка з команд та корисних прийомів

## 🚀 Команди для роботи з проектом

### Запуск проекту

```bash
# Встановити всі залежності
npm install

# Запустити сервер розробки
npm run dev

# Відкрити в браузері
# http://localhost:3000
```

### Робота з кодом

```bash
# Перевірити код на помилки
npm run lint

# Збудувати проект для продакшену
npm run build

# Запустити збудований проект
npm start
```

### Git команди (якщо використовуєте Git)

```bash
# Подивитися статус файлів
git status

# Додати всі зміни
git add .

# Зробити commit
git commit -m "Опис змін"

# Відправити на GitHub
git push
```

## 🔧 Корисні команди в терміналі

### Навігація

```bash
# Показати поточну директорію
pwd

# Показати список файлів
ls          # Mac/Linux
dir         # Windows

# Перейти в папку
cd app
cd ..       # На рівень вище
cd ~        # Домашня директорія

# Очистити термінал
clear       # Mac/Linux
cls         # Windows
```

### Робота з npm

```bash
# Встановити нову бібліотеку
npm install axios

# Встановити dev залежність
npm install --save-dev typescript

# Видалити бібліотеку
npm uninstall axios

# Оновити всі залежності
npm update

# Очистити кеш npm
npm cache clean --force
```

## ⌨️ Гарячі клавіші VS Code

### Основні

- `Ctrl + S` (Cmd + S на Mac) — Зберегти файл
- `Ctrl + P` — Швидкий пошук файлів
- `Ctrl + Shift + P` — Палітра команд
- `Ctrl + /` — Закоментувати/розкоментувати рядок
- `Ctrl + D` — Вибрати наступне входження слова
- `Alt + Up/Down` — Перемістити рядок вгору/вниз

### Редагування

- `Ctrl + Space` — Автодоповнення
- `Ctrl + Click` — Перейти до визначення
- `Alt + Click` — Багаторядковий курсор
- `Ctrl + F` — Пошук у файлі
- `Ctrl + H` — Пошук і заміна

### Термінал

- `Ctrl + `` ` `` — Відкрити/закрити термінал
- `Ctrl + Shift + `` ` `` — Новий термінал

## 🐛 Команди для відлагодження

### Console.log трюки

```typescript
// Звичайний лог
console.log('message');

// Лог з міткою
console.log('user:', user);

// Лог об'єкта (зручний формат)
console.table(users);

// Групування логів
console.group('API Request');
console.log('URL:', url);
console.log('Data:', data);
console.groupEnd();

// Лог з часом
console.time('fetchUsers');
await fetchUsers();
console.timeEnd('fetchUsers');

// Лог помилки (червоний)
console.error('Something went wrong!');

// Лог попередження (жовтий)
console.warn('This is deprecated');
```

### Chrome DevTools

```javascript
// У консолі браузера:

// Знайти всі елементи
document.querySelectorAll('.button');

// Дізнатися розмір елемента
$0.getBoundingClientRect();

// Очистити консоль
clear();

// Подивитися localStorage
localStorage;

// Видалити все з localStorage
localStorage.clear();

// Подивитися cookies
document.cookie;
```

## 📝 Шаблони коду (Snippets)

### React компонент (TypeScript)

```typescript
import React from 'react';

type Props = {
  title: string;
};

export default function MyComponent({ title }: Props) {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

### useState

```typescript
import { useState } from 'react';

const [count, setCount] = useState(0);

// Оновити
setCount(5);

// Оновити на основі попереднього значення
setCount((prev) => prev + 1);
```

### useEffect

```typescript
import { useEffect } from 'react';

// Виконується один раз при монтуванні
useEffect(() => {
  console.log('Компонент завантажився');
}, []);

// Виконується при зміні залежності
useEffect(() => {
  console.log('count змінився:', count);
}, [count]);

// З cleanup функцією
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup
  return () => clearInterval(timer);
}, []);
```

### Zustand Store

```typescript
import { create } from 'zustand';

type Store = {
  count: number;
  increment: () => void;
};

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Використання
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

### React Query Mutation

```typescript
import { useMutation } from '@tanstack/react-query';

const { mutate, isPending, isError, error } = useMutation({
  mutationFn: createNote,
  onSuccess: (data) => {
    console.log('Success!', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});

// Викликати
mutate({ title: 'My Note' });
```

### Axios запит

```typescript
import axios from 'axios';

// GET
const response = await axios.get('/api/users');

// POST
await axios.post('/api/users', {
  name: 'John',
  email: 'john@example.com',
});

// DELETE
await axios.delete('/api/users/123');

// З обробкою помилок
try {
  const response = await axios.get('/api/users');
  console.log(response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data);
  }
}
```

### TypeScript типи

```typescript
// Інтерфейс
interface User {
  id: number;
  name: string;
  email?: string; // опційне поле
}

// Type
type Status = 'pending' | 'success' | 'error';

// Об'єднання типів
type Result = User | null;

// Масив
type Users = User[];

// Функція
type FetchUsers = () => Promise<User[]>;

// Generic
type Response<T> = {
  data: T;
  status: number;
};
```

## 🔍 Як шукати рішення проблем

### Google пошук

```
✅ Добре:
"nextjs middleware redirect not working"
"zustand persist localStorage not saving"
"react query mutation loading state"

❌ Погано:
"не працює"
"помилка в коді"
"як зробити"
```

### Stack Overflow

```
Додайте до пошуку: site:stackoverflow.com

Приклад:
"typescript cannot find module site:stackoverflow.com"
```

### GitHub Issues

```
Шукайте в Issues конкретної бібліотеки:

Приклад пошуку в Google:
"persist not working site:github.com/pmndrs/zustand"
```

## 🎨 Корисні розширення VS Code

### Must have

```
- ESLint — перевірка коду
- Prettier — форматування коду
- Auto Rename Tag — автоперейменування тегів
- Path Intellisense — автодоповнення шляхів
```

### Для React/TypeScript

```
- ES7+ React/Redux snippets — швидкі шаблони
- TypeScript Importer — автоімпорт типів
- Console Ninja — покращена консоль
```

### Теми та іконки

```
- Material Icon Theme — іконки для файлів
- One Dark Pro — темна тема
- GitHub Theme — світла/темна тема від GitHub
```

## 📊 Структура типового компонента

```typescript
// 1. Імпорти
import { useState, useEffect } from 'react';
import styles from './MyComponent.module.css';

// 2. Типи
type Props = {
  title: string;
};

// 3. Компонент
export default function MyComponent({ title }: Props) {
  // 4. Хуки useState
  const [count, setCount] = useState(0);

  // 5. Хуки useEffect
  useEffect(() => {
    console.log('Mounted');
  }, []);

  // 6. Функції-обробники
  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  // 7. Рендер
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        Count: {count}
      </button>
    </div>
  );
}
```

## 🚨 Типові помилки та їх рішення

### "Module not found"

```bash
# Рішення:
npm install
```

### "Port 3000 is already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module '@/...' "

```typescript
// Перевірте tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Hydration failed"

```typescript
// ❌ Погано (випадкове значення на сервері та клієнті різне)
<div>{Math.random()}</div>

// ✅ Добре (перевіряємо чи на клієнті)
<div>
  {typeof window !== 'undefined' && Math.random()}
</div>
```

## 💾 Git команди для новачків

```bash
# Перший раз налаштувати
git config --global user.name "Ваше Ім'я"
git config --global user.email "your@email.com"

# Створити репозиторій
git init

# Клонувати репозиторій
git clone https://github.com/username/repo.git

# Подивитися статус
git status

# Додати файли
git add .                    # Всі файли
git add file.txt            # Один файл

# Зробити commit
git commit -m "Опис змін"

# Відправити на GitHub
git push

# Отримати зміни з GitHub
git pull

# Створити нову гілку
git checkout -b feature/new-feature

# Перейти на іншу гілку
git checkout main

# Об'єднати гілки
git merge feature/new-feature

# Подивитися історію
git log

# Скасувати останній commit (але зберегти зміни)
git reset --soft HEAD~1
```

## 🎯 Чек-ліст перед commit

- [ ] Код працює без помилок
- [ ] Видалив усі `console.log` (крім важливих)
- [ ] Код відформатований (Prettier)
- [ ] Немає невикористаних імпортів
- [ ] Написав зрозумілий commit message
- [ ] Перевірив у браузері

---

**💡 Порада:** Роздрукуйте цю шпаргалку або тримайте відкритою під час розробки!
