"use client";

import { Address } from "@/types";
import { cn } from "@/lib/cn";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { AddressForm } from "./AddressForm";

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (address: Omit<Address, "id">) => void;
  onEdit: (id: string, address: Omit<Address, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) =>
        editingId === addr.id ? (
          <div key={addr.id} className="border border-stone p-5">
            <AddressForm
              initial={addr}
              onSave={(a) => {
                onEdit(addr.id, a);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div
            key={addr.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(addr.id)}
            className={cn(
              "flex items-start justify-between border p-5 text-left transition-colors cursor-pointer",
              selectedId === addr.id ? "border-ink bg-stone-light/30" : "border-stone hover:border-ash"
            )}
          >
            <div>
              <p className="text-sm font-medium text-ink">
                {addr.firstName} {addr.lastName}
                {addr.isDefault && <span className="ml-2 text-[10px] uppercase text-brass-dark font-semibold">Default</span>}
              </p>
              <p className="mt-1 text-sm text-ash">
                {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ""}
                {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="mt-1 text-sm text-ash">{addr.phone}</p>
            </div>
            <div className="flex shrink-0 gap-3 pl-4">
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(addr.id);
                }}
                className="text-ash hover:text-ink p-1 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(addr.id);
                }}
                className="text-ash hover:text-error p-1 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </span>
            </div>
          </div>

        )
      )}

      {adding ? (
        <div className="border border-stone p-5">
          <AddressForm
            onSave={(a) => {
              onAdd(a);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2 border border-dashed border-stone py-4 text-sm text-ash hover:border-ink hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Add New Address
        </button>
      )}
    </div>
  );
}
