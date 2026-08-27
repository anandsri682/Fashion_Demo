"use client";

import { PaymentMethod } from "@/types";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Smartphone, CreditCard, Wallet, Banknote } from "lucide-react";
import { useState } from "react";

const options: { value: PaymentMethod; label: string; subtext: string; icon: typeof Smartphone }[] = [
  { value: "UPI", label: "UPI", subtext: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { value: "CREDIT_CARD", label: "Credit / Debit Card", subtext: "Visa, Mastercard, RuPay", icon: CreditCard },
  { value: "DEBIT_CARD", label: "Net Banking", subtext: "All major banks", icon: Wallet },
  { value: "COD", label: "Cash on Delivery", subtext: "Pay at delivery", icon: Banknote },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

  return (
    <div>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <div
            key={opt.value}
            role="button"
            tabIndex={0}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-between border rounded-2xl p-4 transition-all cursor-pointer bg-white shadow-xs",
              value === opt.value
                ? "border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                  value === opt.value ? "border-rose-600 bg-rose-600 text-white" : "border-slate-300 bg-white"
                )}
              >
                {value === opt.value && <span className="text-[10px] font-bold">✓</span>}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{opt.label}</h4>
                <p className="text-[11px] text-slate-500">{opt.subtext}</p>
              </div>
            </div>

            <opt.icon className="h-5 w-5 text-slate-400" />
          </div>
        ))}
      </div>

      {(value === "CREDIT_CARD" || value === "DEBIT_CARD") && (
        <div className="mt-4 grid grid-cols-1 gap-4 border border-slate-200 rounded-2xl p-5 bg-white sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={card.number}
              onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
            />
          </div>
          <Input
            label="Expiry Date"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
          />
          <Input
            label="CVV"
            placeholder="•••"
            maxLength={3}
            value={card.cvv}
            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
          />
        </div>
      )}

      {value === "UPI" && (
        <div className="mt-4 border border-slate-200 rounded-2xl p-4 bg-white">
          <Input label="Enter VPA / UPI ID" placeholder="username@okaxis or username@paytm" />
        </div>
      )}
    </div>
  );
}

