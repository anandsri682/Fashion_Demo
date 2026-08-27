"use client";

import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";
import { FormEvent, useState } from "react";
import { Mail, Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const push = useToastStore((s) => s.push);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    push("Thank you. You have been added to the Maison Noir Gazette.");
    setEmail("");
  }

  return (
    <section className="border-t border-stone/80 bg-ink py-20 lg:py-24 text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="container-x relative z-10 flex flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>JOIN THE MAISON NOIR CLUB</span>
        </div>

        <h2 className="max-w-xl font-editorial text-3xl sm:text-4xl font-bold leading-snug">
          Know What They Say — Get Early Access to Collection Drops &amp; Exclusive Deals
        </h2>

        <p className="max-w-md text-xs sm:text-sm text-ash font-body">
          Subscribe to receive private invitations, seasonal promo codes, and luxury fashion previews.
        </p>

        <form onSubmit={handleSubmit} className="mt-2 flex w-full max-w-md flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 pl-11 py-3 text-xs sm:text-sm text-white placeholder:text-ash transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-full px-6 shadow-crimson">
            Subscribe
          </Button>
        </form>


        <p className="text-[10px] text-ash tracking-wide">
          By joining you agree to our Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

