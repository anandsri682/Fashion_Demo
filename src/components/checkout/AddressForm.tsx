"use client";

import { Address } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail, isValidPhone, isValidPincode } from "@/lib/validation";
import { FormEvent, useState } from "react";

type FormState = Omit<Address, "id" | "isDefault">;

const empty: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  landmark: "",
};

export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (address: Omit<Address, "id">) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial || empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email";
    if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.addressLine1) e.addressLine1 = "Address is required";
    if (!form.city) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!isValidPincode(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} error={errors.firstName} />
      <Input label="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} error={errors.lastName} />
      <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
      <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
      <div className="sm:col-span-2">
        <Input label="Address Line 1" value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} error={errors.addressLine1} />
      </div>
      <div className="sm:col-span-2">
        <Input label="Address Line 2 (optional)" value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} />
      </div>
      <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
      <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} error={errors.state} />
      <Input label="Country" value={form.country} onChange={(e) => update("country", e.target.value)} />
      <Input label="Pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} error={errors.pincode} />
      <div className="sm:col-span-2">
        <Input label="Landmark (optional)" value={form.landmark} onChange={(e) => update("landmark", e.target.value)} />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" className="flex-1 sm:flex-none">
          Save Address
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
