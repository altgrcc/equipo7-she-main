import { create } from "zustand";

interface UserState {
  user: string | null;
  setUser: (user: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
