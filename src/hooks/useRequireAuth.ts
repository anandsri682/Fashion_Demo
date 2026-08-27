"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRequireAuth(opts?: { adminOnly?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      if (opts?.adminOnly && user.role !== "ADMIN") {
        router.replace("/");
      }
      return;
    }

    router.replace(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
  }, [user, mounted, opts?.adminOnly, pathname, router]);

  const isAuthorized = Boolean(
    mounted && user !== null && (!opts?.adminOnly || user.role === "ADMIN")
  );

  return {
    user,
    ready: isAuthorized,
  };
}