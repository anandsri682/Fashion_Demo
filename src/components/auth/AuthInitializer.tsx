"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = localStorage.getItem("auth_token");

      // No JWT means there is no backend session.
      if (!token) {
        return;
      }

      try {
        const user = await authService.getMe();

        if (!cancelled) {
          setUser(user);
        }
      } catch (error) {
        console.error("Session restore failed:", error);

        localStorage.removeItem("auth_token");

        if (!cancelled) {
          setUser(null);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  return null;
}