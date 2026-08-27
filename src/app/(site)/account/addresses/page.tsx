"use client";

import { useEffect, useState } from "react";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { Address } from "@/types";
import { addressService } from "@/services/addressService";
import { useToastStore } from "@/store/toastStore";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    addressService.getAddresses().then((data) => {
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault) || data[0];
      if (defaultAddr) {
        setSelectedId(defaultAddr.id);
      }
      setLoading(false);
    });
  }, []);

  async function addAddress(a: Omit<Address, "id">) {
    try {
      const created = await addressService.createAddress({
        ...a,
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [...prev, created]);
      if (!selectedId) setSelectedId(created.id);
      push("Address added to directory");
    } catch {
      push("Failed to save address", "error");
    }
  }

  async function editAddress(id: string, a: Omit<Address, "id">) {
    try {
      const updated = await addressService.updateAddress(id, a);
      setAddresses((prev) => prev.map((addr) => (addr.id === id ? updated : addr)));
      push("Address updated");
    } catch {
      push("Failed to update address", "error");
    }
  }

  async function deleteAddress(id: string) {
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedId === id) {
        setSelectedId(addresses.find((a) => a.id !== id)?.id || null);
      }
      push("Address removed");
    } catch {
      push("Failed to delete address", "error");
    }
  }

  async function handleSelect(id: string) {
    setSelectedId(id);
    try {
      await addressService.updateAddress(id, { isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      push("Primary delivery address updated");
    } catch {
      // Ignore if silent error
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-xs text-ash">Loading saved addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone/40 pb-4">
        <h2 className="font-editorial text-2xl font-medium text-ink">Saved Address Directory</h2>
        <p className="mt-1 text-xs text-ash font-body">Select a destination to set it as your primary address for private checkout.</p>
      </div>
      <AddressSelector
        addresses={addresses}
        selectedId={selectedId}
        onSelect={handleSelect}
        onAdd={addAddress}
        onEdit={editAddress}
        onDelete={deleteAddress}
      />
    </div>
  );
}


