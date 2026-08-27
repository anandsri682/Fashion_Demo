"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { isValidEmail } from "@/lib/validation";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x flex min-h-[75vh] items-center justify-center py-16">
      <div className="w-full max-w-sm text-center">
        {sent ? (
          <>
            <MailCheck className="mx-auto h-10 w-10 text-brass" strokeWidth={1.25} />
            <h1 className="mt-4 font-display text-2xl text-ink">Check your email</h1>
            <p className="mt-2 text-sm text-ash">
              If an account exists for {email}, we&apos;ve sent instructions to reset your password.
            </p>
            <Link href="/login" className="mt-8 inline-block text-sm text-ink underline underline-offset-2">
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest2 text-ash">Reset Password</p>
            <h1 className="mt-2 font-display text-3xl text-ink">Forgot Password?</h1>
            <p className="mt-3 text-sm text-ash">
              Enter the email associated with your account and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 text-left">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error || undefined} />
              <Button type="submit" size="lg" loading={loading} className="w-full">
                Send Reset Link
              </Button>
            </form>
            <Link href="/login" className="mt-8 inline-block text-sm text-ink underline underline-offset-2">
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
