"use client";

import { Suspense, FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ShieldCheck } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ email, password, rememberMe: remember }, redirect);
  }

  return (
    <div className="container-x flex min-h-[80vh] items-center justify-center py-20">
      <div className="w-full max-w-md border border-stone/60 bg-paper p-8 sm:p-10 shadow-subtle relative overflow-hidden">
        {/* Subtle top brass accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brass" />

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-brass text-[10px] uppercase tracking-widest2 font-semibold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Maison Noir Private Ledger</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-light text-ink">Client Sign In</h1>
          <p className="mt-2 text-xs text-ash">Access your orders, saved creations, and personal ledger</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@maisonnoir.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          {error && (
            <div className="border border-error/30 bg-error/5 p-3 text-xs text-error font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-graphite cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-brass h-4 w-4"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-graphite hover:text-brass transition-colors font-medium hover-underline-gold"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="gold" size="lg" loading={loading} className="mt-3 w-full justify-center">
            Sign In To Account
          </Button>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-ash bg-stone-light/40 py-2 border border-stone/30">
            <ShieldCheck className="h-3.5 w-3.5 text-brass" />
            <span>Demo: use &ldquo;admin@maisonnoir.com&rdquo; to preview admin features</span>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-ash pt-6 border-t border-stone/50">
          Don&apos;t have a private ledger account?{" "}
          <Link href="/register" className="text-ink font-semibold hover:text-brass transition-colors hover-underline-gold">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

