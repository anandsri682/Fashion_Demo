"use client";

import { Suspense, FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

function LoginForm() {

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ email, password, rememberMe: true }, redirect);
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-10 px-4 sm:px-6 bg-slate-50/50">
      <div className="w-full max-w-md rounded-2xl border border-stone/60 bg-paper-pure p-6 sm:p-10 shadow-subtle space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-editorial text-2xl font-extrabold tracking-[0.2em] uppercase text-ink">
              {storeName}
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-rose-600 font-sans font-bold -mt-0.5">
              HAUTE COUTURE
            </span>
          </Link>
          <div className="pt-4">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">Welcome back</h1>
            <p className="text-xs text-ash mt-1 font-body">Sign in to continue your luxury shopping experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-ink p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 font-bold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Signing in..." : "SIGN IN"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-stone/50">
          <p className="text-xs text-ash">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-rose-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
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

