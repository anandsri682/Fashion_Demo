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
          <div key={addr.id} className="border border-slate-200 rounded-2xl p-5 bg-white">
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
              "flex items-start justify-between border rounded-2xl p-4 text-left transition-all cursor-pointer bg-white shadow-xs relative",
              selectedId === addr.id
                ? "border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/20"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                    selectedId === addr.id ? "border-rose-600 bg-rose-600 text-white" : "border-slate-300 bg-white"
                  )}
                >
                  {selectedId === addr.id && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {addr.isDefault ? "Home (Default)" : "Address"}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {addr.firstName} {addr.lastName}
                  </h4>
                </div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-body">
                  {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ""}
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="mt-1 text-xs text-slate-500 font-mono">Phone: {addr.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(addr.id);
                }}
                className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
              >
                Edit
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
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
          className="flex items-center justify-center gap-2 border border-dashed border-rose-300 rounded-2xl py-3.5 text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-100/50 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add New Address
        </button>
      )}
    </div>
  );
}

