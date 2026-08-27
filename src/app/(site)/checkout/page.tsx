"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { CartSummary } from "@/components/cart/CartSummary";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { Button } from "@/components/ui/Button";
import { Address, PaymentMethod } from "@/types";
import { addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";

import { useToastStore } from "@/store/toastStore";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { getImageUrl } from "@/lib/api";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, totals, clearCart } = useCartStore();
  const activeItems = items.filter((i) => !i.savedForLater);
  const t = totals();

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [placing, setPlacing] = useState(false);
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    addressService.getAddresses().then((data) => {
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault) || data[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    });
  }, [user, router]);

  useEffect(() => {
    if (activeItems.length === 0 && !placing) {
      router.push("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || activeItems.length === 0) return null;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  async function addAddress(a: Omit<Address, "id">) {
    try {
      const created = await addressService.createAddress({
        ...a,
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      push("Address added successfully");
    } catch {
      push("Failed to add address", "error");
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
      if (selectedAddressId === id) {
        setSelectedAddressId(addresses.find((a) => a.id !== id)?.id || null);
      }
      push("Address removed");
    } catch {
      push("Failed to delete address", "error");
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddress || !user) {
      push("Please select a delivery address", "error");
      return;
    }
    setPlacing(true);
    try {
      const order = await orderService.createOrder(
        {
          userId: user.id,
          items: activeItems.map((i) => ({
            productId: i.productId,
            title: i.title,
            image: i.image,
            size: i.size,
            color: i.color,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddressId: selectedAddress.id,
          billingAddressId: selectedAddress.id,
          shippingAddress: selectedAddress,
          billingAddress: selectedAddress,
          paymentMethod,
          subtotal: t.subtotal,
          discount: t.discount,
          shipping: t.shipping,
          tax: t.tax,
          total: t.total,
        },

        { name: `${user.firstName} ${user.lastName}`, email: user.email, phone: user.phone }
      );
      clearCart();
      push("Order placed successfully");
      router.push(`/order-success/${order.id}`);
    } catch (e: any) {
      push(e?.message || "We couldn't place your order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  }


  return (
    <div className="container-x py-12 lg:py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-[10px] uppercase tracking-widest2 text-brass font-semibold">Atelier Order Dispatch</p>
        <h1 className="mt-1 font-editorial text-4xl sm:text-5xl font-light text-ink">Checkout</h1>
      </div>

      <StepIndicator current={step} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="border border-stone/50 bg-paper p-6 sm:p-8 shadow-subtle">
              <h2 className="mb-6 font-editorial text-2xl font-medium text-ink border-b border-stone/50 pb-3">
                1. Delivery Destination
              </h2>
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onAdd={addAddress}
                onEdit={editAddress}
                onDelete={deleteAddress}
              />
              <Button
                variant="gold"
                className="mt-8 gap-2"
                size="lg"
                disabled={!selectedAddressId}
                onClick={() => setStep(2)}
              >
                <span>Continue to Order Review</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Order Review */}
          {step === 2 && selectedAddress && (
            <div className="border border-stone/50 bg-paper p-6 sm:p-8 shadow-subtle">
              <h2 className="mb-6 font-editorial text-2xl font-medium text-ink border-b border-stone/50 pb-3">
                2. Review Items & Address
              </h2>
              <div className="mb-6 divide-y divide-stone/40 border border-stone/40">
                {activeItems.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-stone border border-stone/40">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 justify-between items-center">
                      <div>
                        <h4 className="font-editorial text-base text-ink font-medium">{item.title}</h4>
                        <p className="mt-1 text-xs text-ash font-mono">
                          Size: {item.size} &middot; Color: {item.color} &middot; Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-ink">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Address Brief */}
              <div className="border border-stone/50 bg-stone-light/30 p-4 text-xs">
                <p className="mb-1 text-[10px] uppercase tracking-luxury text-brass font-semibold">Shipping Destination</p>
                <p className="font-semibold text-ink">
                  {selectedAddress.firstName} {selectedAddress.lastName}
                </p>
                <p className="text-graphite font-body">
                  {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.pincode}
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button variant="gold" size="lg" onClick={() => setStep(3)} className="gap-2">
                  <span>Continue to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="border border-stone/50 bg-paper p-6 sm:p-8 shadow-subtle">
              <h2 className="mb-6 font-editorial text-2xl font-medium text-ink border-b border-stone/50 pb-3">
                3. Secure Payment Method
              </h2>
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

              <div className="mt-8 flex gap-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button variant="gold" size="lg" loading={placing} onClick={handlePlaceOrder} className="gap-2 px-8">
                  <ShieldCheck className="h-4 w-4 text-brass" />
                  <span>Authorize & Place Order</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="sticky top-28">
            <CartSummary totals={t} ctaLabel="Complimentary insured courier with real-time tracking." />
          </div>
        </div>
      </div>
    </div>
  );
}

