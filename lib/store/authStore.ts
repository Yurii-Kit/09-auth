import { create } from 'zustand';
import type { User } from '@/types/user';
import { devtools } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
    logout: () => set({ user: null, isAuthenticated: false }),
  })),
);
