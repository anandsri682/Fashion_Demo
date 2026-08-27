"use client";

import { useAuthStore } from "@/store/authStore";
import {
  authService,
  LoginPayload,
  RegisterPayload,
} from "@/services/authService";
import { useToastStore } from "@/store/toastStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const push = useToastStore((state) => state.push);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(
    payload: LoginPayload,
    redirectTo = "/account"
  ) {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login(payload);

      // 1. Save user to Zustand.
      setUser(res.user);

      // 2. Give Zustand persistence a moment to write.
      await new Promise((resolve) => setTimeout(resolve, 50));

      push("Login successful");

      // 3. Navigate after user state has been saved.
      router.push(
        res.user.role === "ADMIN"
          ? "/admin"
          : redirectTo
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.register(payload);

      setUser(res.user);

      await new Promise((resolve) => setTimeout(resolve, 50));

      push("Account created");

      router.push("/account");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      push("Logged out");
      router.push("/");
    }
  }

  return {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAdmin: user?.role === "ADMIN",
  };
}