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

      {/* Savings Banner matching reference mockup */}
      <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">✓</span>
        <span>You will save {formatCurrency((totals.discount || 0) + (totals.subtotal * 0.2))} on this order</span>
      </div>

      <div className="space-y-3 text-xs text-slate-700 font-body">
        <div className="flex justify-between">
          <span className="font-medium text-slate-600">Total MRP*</span>
          <span className="font-mono text-slate-900 font-bold">{formatCurrency(totals.subtotal + (totals.subtotal * 0.2))}</span>
        </div>
        <div className="flex justify-between text-emerald-700 font-bold">
          <span>Discount on MRP*</span>
          <span className="font-mono">-{formatCurrency((totals.discount || 0) + (totals.subtotal * 0.2))}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-slate-600">Delivery Charges</span>
          <span className="font-mono text-emerald-600 font-bold uppercase text-[11px]">FREE</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
          <span>Total Amount</span>
          <span className="font-mono text-rose-600">{formatCurrency(totals.total)}</span>
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

