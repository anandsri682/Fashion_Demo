"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  hydrated: boolean;

  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: true,

      setUser: (user) => {
        set({ user, hydrated: true });
      },
    }),
    {
      name: "fashion-store-auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => {
        return () => {
          useAuthStore.setState({
            hydrated: true,
          });
        };
      },
    }
  )
);