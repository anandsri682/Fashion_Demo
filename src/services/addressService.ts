import { apiFetch } from "@/lib/api";
import { Address } from "@/types";

interface AddressResponse {
  success: boolean;
  message: string;
  address: Address & { _id?: string };
}

interface AddressListResponse {
  success: boolean;
  message: string;
  addresses: (Address & { _id?: string })[];
}

function mapAddress(addr: any): Address {
  return {
    id: addr._id || addr.id,
    firstName: addr.firstName,
    lastName: addr.lastName,
    phone: addr.phone,
    email: addr.email,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    country: addr.country || "India",
    pincode: addr.pincode,
    landmark: addr.landmark,
    isDefault: addr.isDefault || false,
  };
}

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    try {
      const res = await apiFetch<AddressListResponse>("/addresses");
      return (res.addresses || []).map(mapAddress);
    } catch {
      return [];
    }
  },

  async createAddress(payload: Omit<Address, "id">): Promise<Address> {
    const res = await apiFetch<AddressResponse>("/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapAddress(res.address);
  },

  async updateAddress(id: string, payload: Partial<Address>): Promise<Address> {
    const res = await apiFetch<AddressResponse>(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapAddress(res.address);
  },

  async deleteAddress(id: string): Promise<void> {
    await apiFetch(`/addresses/${id}`, {
      method: "DELETE",
    });
  },
};
