"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { isValidEmail, isValidPhone, passwordStrength } from "@/lib/validation";
import { useSettingsStore } from "@/store/settingsStore";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {

  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";

  const strength = passwordStrength(form.password);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (form.phone && !isValidPhone(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (form.password.length < 8) errs.password = "At least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || "9876543210",
      password: form.password,
    });
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-10 px-4 sm:px-6 bg-slate-50/50">
      <div className="w-full max-w-lg rounded-2xl border border-stone/60 bg-paper-pure p-6 sm:p-10 shadow-subtle space-y-6">
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
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">Create your account</h1>
            <p className="text-xs text-ash mt-1 font-body">Join us for a better luxury shopping experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="Henriette"
                className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none"
              />
              {fieldErrors.firstName && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.firstName}</span>}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Dupont"
                className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none"
              />
              {fieldErrors.lastName && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@domain.com"
              className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none"
            />
            {fieldErrors.email && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.email}</span>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="9876543210"
              className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none"
            />
            {fieldErrors.phone && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.phone}</span>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min 8 chars"
                  className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {fieldErrors.password && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold font-mono text-graphite block uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-stone bg-paper px-4 py-3 text-xs text-ink focus:border-rose-600 focus:outline-none"
              />
              {fieldErrors.confirmPassword && <span className="text-[10px] text-rose-600 font-bold">{fieldErrors.confirmPassword}</span>}
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
            <span>{loading ? "Creating..." : "CREATE ACCOUNT"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-stone/50">
          <p className="text-xs text-ash">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-rose-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


