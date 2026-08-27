"use client";

import { PaymentMethod } from "@/types";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Smartphone, CreditCard, Wallet, Banknote } from "lucide-react";
import { useState } from "react";

const options: { value: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "CREDIT_CARD", label: "Credit Card", icon: CreditCard },
  { value: "DEBIT_CARD", label: "Debit Card", icon: Wallet },
  { value: "COD", label: "Cash on Delivery", icon: Banknote },
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 border px-3 py-5 text-xs",
              value === opt.value ? "border-ink bg-ink text-paper" : "border-stone text-ink"
            )}
          >
            <opt.icon className="h-5 w-5" />
            {opt.label}
          </button>
        ))}
      </div>

      {(value === "CREDIT_CARD" || value === "DEBIT_CARD") && (
        <div className="mt-6 grid grid-cols-1 gap-4 border border-stone p-5 sm:grid-cols-2">
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
          <div className="sm:col-span-2">
            <Input
              label="Card Holder Name"
              value={card.name}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
            />
          </div>
          <p className="text-[11px] text-ash sm:col-span-2">
            This is a UI-only demo. Card details are never stored or transmitted.
          </p>
        </div>
      )}

      {value === "UPI" && (
        <div className="mt-6 border border-stone p-5">
          <Input label="UPI ID" placeholder="yourname@upi" />
        </div>
      )}

      {value === "COD" && (
        <p className="mt-4 text-sm text-ash">
          Pay in cash when your order is delivered. A small COD handling fee may apply.
        </p>
      )}
    </div>
  );
}
