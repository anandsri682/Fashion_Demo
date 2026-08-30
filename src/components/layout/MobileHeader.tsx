import { MapPin, ChevronDown, Heart, Search, Camera, X, CheckCircle, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOverlay } from "./SearchOverlay";
import { useSettingsStore } from "@/store/settingsStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { addressService } from "@/services/addressService";
import { Address } from "@/types";
import { useToastStore } from "@/store/toastStore";


export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("Home - 400001");

  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const push = useToastStore((s) => s.push);
  const settings = useSettingsStore((s) => s.settings);

  useEffect(() => {
    addressService.getAddresses().then((addrs) => {
      setSavedAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      if (def) {
        setSelectedAddress(`${def.type} - ${def.pincode}`);
        setPincode(def.pincode);
      }
    });
  }, []);

  function handleVerifyPincode() {
    if (!/^\d{6}$/.test(pincode)) {
      push("Please enter a valid 6-digit Pincode", "error");
      return;
    }
    setPincodeStatus(`Pincode ${pincode} verified! Express 2-Day Delivery Available.`);
    setSelectedAddress(`Pincode ${pincode}`);
    push(`Pincode ${pincode} verified successfully!`);
  }

  return (
    <>
      <div className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 lg:hidden sticky top-0 z-30 shadow-xs">
        {/* Top Row: Brand Name + Icons */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <Link href="/" className="flex flex-col">
              <span className="font-editorial text-lg font-extrabold uppercase tracking-widest text-slate-900 leading-tight">
                {settings.storeName || "MAISON NOIR"}
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] font-sans font-bold text-rose-600 -mt-0.5">
                HAUTE COUTURE
              </span>
            </Link>

            {/* Location Pill */}
            <div onClick={() => setAddressModalOpen(true)} className="flex items-center gap-1 cursor-pointer group mt-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
                <MapPin className="h-2.5 w-2.5" />
              </div>
              <div className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-700">
                <span>Deliver to</span>
                <span className="font-bold text-slate-900 truncate max-w-[130px]">{selectedAddress}</span>
                <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search items"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <Heart className="h-4 w-4 fill-rose-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>



      {/* Address & Pincode Selection Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Delivery Location</h3>
              </div>
              <button onClick={() => setAddressModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Pincode Verification Form */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Check Pincode Availability</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 400001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-900 focus:border-rose-600 focus:outline-none"
                />
                <button
                  onClick={handleVerifyPincode}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Verify
                </button>
              </div>
              {pincodeStatus && (
                <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> {pincodeStatus}
                </p>
              )}
            </div>

            {/* Saved Addresses List */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Or Select Saved Address</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {savedAddresses.map((addr) => {
                    const label = `${addr.type} - ${addr.pincode}`;
                    const isSel = selectedAddress === label;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(label);
                          setPincode(addr.pincode);
                          setAddressModalOpen(false);
                          push(`Selected ${addr.type} address (${addr.pincode})`);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                          isSel ? "border-rose-600 bg-rose-50/50 text-slate-900 font-bold" : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="uppercase text-[10px] font-bold text-rose-600">{addr.type}</span>
                          <span className="font-mono text-[10px] text-slate-400">{addr.pincode}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-800 truncate">{addr.addressLine1}, {addr.city}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link
                href="/account/addresses"
                onClick={() => setAddressModalOpen(false)}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                + Manage Saved Addresses
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

