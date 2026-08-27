"use client";

import { useEffect, useState } from "react";
import { couponService, CouponItem } from "@/services/couponService";
import { formatCurrency, formatDate } from "@/lib/format";
import { useToastStore } from "@/store/toastStore";
import { Ticket, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const push = useToastStore((s) => s.push);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 10,
    minOrderAmount: 199,
    maxDiscountAmount: 500,
    endDate: "2026-12-31",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    try {
      setLoading(true);
      const data = await couponService.listCoupons();
      setCoupons(data);
    } catch {
      push("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCoupon() {
    if (!form.code) return;
    try {
      await couponService.createCoupon({
        code: form.code,
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrderAmount: form.minOrderAmount,
        maxDiscountAmount: form.maxDiscountAmount,
        endDate: form.endDate,
        isActive: true,
      });
      push(`Coupon "${form.code.toUpperCase()}" created in MongoDB!`);
      setModal(false);
      setForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 199,
        maxDiscountAmount: 500,
        endDate: "2026-12-31",
      });
      await loadCoupons();
    } catch {
      push("Failed to create coupon");
    }
  }

  async function handleDeleteCoupon(id: string) {
    if (!confirm("Delete this coupon code?")) return;
    try {
      await couponService.deleteCoupon(id);
      push("Coupon deleted");
      await loadCoupons();
    } catch {
      push("Failed to delete coupon");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/50 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">MARKETING &amp; PROMOTIONS</span>
          <h1 className="font-editorial text-3xl font-bold text-ink">Coupons &amp; Promo Codes ({coupons.length})</h1>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson transition-all w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="rounded-xl border border-stone/60 bg-paper-pure shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-ash font-mono animate-pulse">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-xs text-ash font-mono">No active coupons in database. Click &quot;Create New Coupon&quot; to add one.</div>
        ) : (

          <table className="w-full text-left text-xs">
            <thead className="bg-stone/30 text-graphite font-mono font-bold uppercase border-b border-stone/50">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Order</th>
                <th className="p-4">Max. Savings</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/50">
              {coupons.map((c) => {
                const id = c.id || c._id || "";
                return (
                  <tr key={id} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary text-sm">{c.code}</td>
                    <td className="p-4 font-bold text-ink">
                      {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="p-4 font-mono text-ash">{formatCurrency(c.minOrderAmount)}</td>
                    <td className="p-4 font-mono text-ash">{c.maxDiscountAmount ? formatCurrency(c.maxDiscountAmount) : "Unlimited"}</td>
                    <td className="p-4 font-mono text-ash">{formatDate(c.endDate)}</td>
                    <td className="p-4 font-mono text-ash">{c.usedCount} used</td>
                    <td className="p-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-error">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteCoupon(id)} className="p-1.5 text-ash hover:text-error transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Coupon Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold text-ink">Create Coupon Code</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10, FESTIVE20"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono font-bold text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as any }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">Discount Value</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">Min. Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-ash font-mono">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm((f) => ({ ...f, maxDiscountAmount: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-ash font-mono">Expiry Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full rounded-lg border border-stone p-2.5 text-xs font-mono focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-xs font-bold text-ash hover:text-ink">
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
