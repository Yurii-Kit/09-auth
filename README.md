# 📝 NoteHub — Notes Application with Authentication

A modern, full-featured web application built with Next.js 15 featuring complete authentication system and note management capabilities.

[Ukrainian version (README.ua.md)](README.ua.md)

## 🎯 Overview

**NoteHub** is a web application where users can:

- ✅ Register and sign in with secure authentication
- ✅ Create, view, and delete notes
- ✅ Filter notes by tags
- ✅ Search through notes
- ✅ Edit user profile
- ✅ Experience smooth UI with modal previews and pagination

## 🛠️ Tech Stack

### Core Technologies:

- **Next.js 15** — React framework with App Router and Server Components
- **TypeScript** — Type-safe JavaScript for better development experience
- **React 19** — Latest version with enhanced features

### State Management:

- **Zustand** — Lightweight state management solution (Redux alternative)
- **TanStack Query (React Query)** — Server state management, caching, and mutations

### Forms & Validation:

- **Formik** — Form management library
- **Yup** — Schema validation for forms

### HTTP & API:

- **Axios** — Promise-based HTTP client

### Additional Tools:

- **use-debounce** — Debouncing utility for performance optimization
- **react-paginate** — Pagination component
- **cookie** — Cookie parsing and serialization

## 📁 Project Structure

```
09-auth/
├── app/                          # Next.js App Router
│   ├── (auth routes)/           # Public pages (sign-in, sign-up)
│   ├── (private routes)/        # Protected pages (profile, notes)
│   ├── @modal/                  # Parallel routes (modals)
│   ├── api/                     # API Routes (backend endpoints)
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # React components
│   ├── AuthProvider/            # Authentication verification
│   ├── Header/                  # Site header
│   ├── Footer/                  # Site footer
│   ├── NoteForm/                # Note creation form
│   ├── NoteList/                # Notes list display
│   ├── Modal/                   # Modal component
│   ├── Pagination/              # Pagination controls
│   ├── SearchBox/               # Search functionality
│   └── TagsMenu/                # Tag filtering menu
│
├── lib/                         # Utilities and business logic
│   ├── api/                     # API functions
│   │   ├── clientApi.ts        # Client-side API calls
│   │   └── serverApi.ts        # Server-side API calls
│   └── store/                   # Zustand stores
│       ├── authStore.ts        # Authentication state
│       └── noteStore.ts        # Notes state
│
├── types/                       # TypeScript type definitions
│   ├── user.ts                 # User types
│   └── note.ts                 # Note types
│
└── middleware.ts                # Next.js Middleware (route protection)
```

## 🔐 Authentication System

### Token-Based Authentication

The application uses a dual-token system for security:

- **accessToken** (Short-lived) — Expires in 10-15 minutes
  - Used for regular API requests
  - If compromised, becomes invalid quickly
- **refreshToken** (Long-lived) — Expires in 7-30 days
  - Used to obtain new access tokens
  - Stored more securely and transmitted less frequently

### Middleware Protection

The `middleware.ts` file acts as a route guard that:

1. Checks for valid authentication tokens
2. Automatically refreshes expired access tokens using refresh token
3. Protects private routes from unauthorized access
4. Redirects authenticated users away from auth pages

### AuthProvider Component

The `AuthProvider` wraps the application and:

- Verifies authentication status on app load
- Fetches user data for authenticated sessions
- Displays loading state during verification
- Handles automatic logout for invalid sessions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd 09-auth
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Available Scripts

- `npm run dev` — Start development server with Turbopack
- `npm run build` — Build production application
- `npm start` — Start production server
- `npm run lint` — Run ESLint

## 🎨 Key Features

### Authentication

- User registration with validation
- Secure login system
- Automatic token refresh
- Session management
- Protected routes

### Notes Management

- Create notes with title, content, and tags
- View notes in list or modal preview
- Delete notes
- Filter by tags
- Search functionality
- Pagination for large lists

### User Profile

- View profile information
- Edit profile details
- Secure profile page access

## 🏗️ Architecture Highlights

### Server & Client Components

- Leverages Next.js 15 Server Components for optimal performance
- Strategic use of client components for interactivity
- Server-side authentication checks

### Route Groups

- `(auth routes)` — Authentication-related pages
- `(private routes)` — Protected pages requiring authentication
- `@modal` — Parallel routes for modal overlays

### API Routes

- RESTful API structure
- Authentication endpoints (login, logout, register, refresh)
- CRUD operations for notes
- User management endpoints

### State Management Strategy

- **Zustand** for client-side global state (auth, notes)
- **TanStack Query** for server state and caching
- **Formik** for form state

## 🔧 Development Best Practices

### Type Safety

- Comprehensive TypeScript types
- Strict type checking
- Type definitions for API responses

### Code Organization

- Modular component structure
- Separation of concerns
- Reusable utilities

### Performance Optimization

- Debounced search inputs
- Optimized re-renders with useMemo and useCallback
- Efficient caching with React Query

## 📚 Learning Resources

### Next.js:

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

### React:

- [React Documentation](https://react.dev)
- [React Hooks Reference](https://react.dev/reference/react)

### TypeScript:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### State Management:

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

## 🐛 Troubleshooting

### "Module not found" Error

```bash
npm install
```

### Hydration Errors

Check for client-only code (localStorage, window) running on the server. Use:

```typescript
if (typeof window !== 'undefined') {
  // client-only code
}
```

### Authentication Issues

1. Clear browser cookies
2. Check `.env.local` configuration
3. Verify API endpoint availability

## 📄 License

This project is created for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Coding! 🚀**
