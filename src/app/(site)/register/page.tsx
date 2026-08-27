"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { isValidEmail, isValidPhone, passwordStrength } from "@/lib/validation";
import { cn } from "@/lib/cn";
import { Sparkles } from "lucide-react";

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

  const strength = passwordStrength(form.password);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.firstName) errs.firstName = "Required";
    if (!form.lastName) errs.lastName = "Required";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (!isValidPhone(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
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
      phone: form.phone,
      password: form.password,
    });
  }

  return (
    <div className="container-x flex min-h-[85vh] items-center justify-center py-20">
      <div className="w-full max-w-lg border border-stone/60 bg-paper p-8 sm:p-10 shadow-subtle relative overflow-hidden">
        {/* Top brass accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brass" />

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-brass text-[10px] uppercase tracking-widest2 font-semibold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Maison Noir Private Ledger</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-light text-ink">Create Private Account</h1>
          <p className="mt-2 text-xs text-ash">Register for exclusive collection invitations and fast checkout</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} error={fieldErrors.firstName} placeholder="Henriette" />
          <Input label="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} error={fieldErrors.lastName} placeholder="Dupont" />
          <div className="sm:col-span-2">
            <Input label="Email Address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={fieldErrors.email} placeholder="h.dupont@maisonnoir.com" />
          </div>
          <div className="sm:col-span-2">
            <Input label="Phone Number" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={fieldErrors.phone} placeholder="9876543210" />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              error={fieldErrors.password}
              placeholder="Minimum 8 characters"
            />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 transition-all duration-300",
                        i < strength.score ? (strength.label === "Weak" ? "bg-error" : strength.label === "Fair" ? "bg-brass" : "bg-brass-dark") : "bg-stone"
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-ash font-mono uppercase tracking-wide">
                  Security Rating: <span className="text-ink font-semibold">{strength.label}</span>
                </p>
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              error={fieldErrors.confirmPassword}
              placeholder="Re-enter your password"
            />
          </div>

          {error && (
            <div className="sm:col-span-2 border border-error/30 bg-error/5 p-3 text-xs text-error font-medium text-center">
              {error}
            </div>
          )}

          <Button type="submit" variant="gold" size="lg" loading={loading} className="mt-3 w-full sm:col-span-2 justify-center">
            Create Account & Private Ledger
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-ash pt-6 border-t border-stone/50">
          Already have an account?{" "}
          <Link href="/login" className="text-ink font-semibold hover:text-brass transition-colors hover-underline-gold">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

