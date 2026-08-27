"use client";

import { useState } from "react";
import { CartTotals } from "@/types";
import { formatCurrency } from "@/lib/format";
import { ShieldCheck, Truck, Ticket } from "lucide-react";
import { couponService } from "@/services/couponService";
import { useToastStore } from "@/store/toastStore";
import { useCartStore } from "@/store/cartStore";

export function CartSummary({ totals, ctaLabel }: { totals: CartTotals; ctaLabel?: string }) {
  const freeShippingThreshold = 999;
  const amountNeeded = freeShippingThreshold - totals.subtotal;
  const freeShippingPercent = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const push = useToastStore((s) => s.push);
  const setAppliedCoupon = useCartStore((s) => s.setAppliedCoupon);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode) return;
    try {
      setApplying(true);
      const res = await couponService.validateCoupon(couponCode, totals.subtotal);
      setAppliedCoupon(res.code, res.calculatedDiscount);
      push(`Coupon "${res.code}" applied! Savings: ${formatCurrency(res.calculatedDiscount)}`);
      setCouponCode("");
    } catch (err: any) {
      push(err?.message || "Invalid coupon code", "error");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="border border-stone/60 bg-paper-pure p-6 shadow-subtle rounded-xl">
      <h3 className="mb-4 font-editorial text-xl font-bold text-ink border-b border-stone/50 pb-3">
        Order Summary
      </h3>

      {/* Shipping progress indicator */}
      <div className="mb-6 bg-stone-light/50 p-3.5 border border-stone/40 rounded-lg">
        <div className="flex items-center gap-2 text-xs text-ink font-medium">
          <Truck className="h-4 w-4 text-primary" />
          <span>
            {totals.subtotal >= freeShippingThreshold
              ? "Complimentary Express Delivery Unlocked"
              : `Add ${formatCurrency(amountNeeded)} more for Free Express Delivery`}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 w-full bg-stone overflow-hidden rounded-full">
          <div className="h-full bg-crimson-gradient transition-all duration-500" style={{ width: `${freeShippingPercent}%` }} />
        </div>
      </div>

      {/* Coupon Code Input */}
      <form onSubmit={handleApplyCoupon} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
            <input
              type="text"
              placeholder="Promo code (e.g. WELCOME10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-stone bg-white px-3 pl-9 py-2 text-xs font-mono font-bold text-ink placeholder:text-ash uppercase focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={applying}
            className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-primary transition-colors disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply"}
          </button>
        </div>
        {appliedCoupon && (
          <p className="mt-1.5 text-[10px] font-mono text-emerald-600 font-bold">
            ✓ Active Coupon: {appliedCoupon.code} (-{formatCurrency(appliedCoupon.discount)})
          </p>
        )}
      </form>

      <div className="space-y-3.5 text-xs sm:text-sm font-body">
        <div className="flex justify-between text-graphite">
          <span>Items Subtotal</span>
          <span className="font-mono text-ink font-bold">{formatCurrency(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-primary font-bold">
            <span>Coupon Discount</span>
            <span className="font-mono">-{formatCurrency(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-graphite">
          <span>Insured Shipping</span>
          <span className="font-mono text-ink font-bold">
            {totals.shipping === 0 ? <span className="text-primary uppercase text-[10px] tracking-wider font-bold">FREE</span> : formatCurrency(totals.shipping)}
          </span>
        </div>
        <div className="flex justify-between text-graphite">
          <span>Estimated Tax (5%)</span>
          <span className="font-mono text-ink font-bold">{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-stone/60 pt-4 text-base font-bold text-ink">
          <span>Estimated Total</span>
          <span className="font-mono text-primary">{formatCurrency(totals.total)}</span>
        </div>
      </div>


      <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-ash pt-4 border-t border-stone/40">
        <ShieldCheck className="h-3.5 w-3.5 text-brass" />
        <span>256-Bit Encrypted Secure Checkout</span>
      </div>

      {ctaLabel && <p className="mt-2 text-xs text-ash">{ctaLabel}</p>}
    </div>
  );
}

