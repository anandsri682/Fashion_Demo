"use client";

import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSettingsStore } from "@/store/settingsStore";
import { Printer, X, QrCode } from "lucide-react";

export function AdminShippingLabel({ order, onClose }: { order: Order; onClose: () => void }) {
  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";
  const isCOD = order.paymentMethod === "COD";


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl space-y-6 text-black print:p-0 print:shadow-none print:max-w-none print:w-full">
        {/* Modal Action Bar */}
        <div className="flex items-center justify-between border-b border-stone/50 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary">COMMERCIAL FULFILLMENT BILL &amp; SHIPPING LABEL</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-primary shadow-xs transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Shipping Label</span>
            </button>
            <button onClick={onClose} className="p-2 text-ash hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHIPPING LABEL BOX matching Screenshot 3 */}
        <div className="border-2 border-dashed border-black p-4 font-sans text-xs space-y-3 bg-white">
          {/* Header COD / Prepaid Box */}
          <div className="border-2 border-black p-2 flex justify-between items-center bg-gray-100 font-mono">
            <div>
              <p className="text-xs uppercase font-bold text-gray-700">Payment Status / Mode</p>
              <p className="text-base font-bold text-black">
                {isCOD ? `COD Collect Amount: ${formatCurrency(order.total)}` : `PREPAID - DO NOT COLLECT CASH (${formatCurrency(order.total)})`}
              </p>
            </div>
            <div className="border-2 border-black px-3 py-1 font-bold text-xl bg-white">
              {isCOD ? "COD" : "E"}
            </div>
          </div>

          {/* Delivery Address & QR Barcode Section */}
          <div className="grid grid-cols-12 border-2 border-black divide-x-2 divide-black">
            <div className="col-span-7 p-3 space-y-1">
              <p className="font-bold uppercase tracking-wider text-[10px] text-gray-600">DELIVERY ADDRESS:</p>
              <p className="font-bold text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-xs leading-tight">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - <strong className="font-mono text-sm">{order.shippingAddress.pincode}</strong>
              </p>
              <p className="font-mono text-xs pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* QR / Barcode Visual */}
            <div className="col-span-5 p-3 flex flex-col items-center justify-center text-center bg-gray-50">
              <div className="p-2 border-2 border-black bg-white">
                <QrCode className="h-20 w-20 text-black" />
              </div>
              <p className="font-mono text-[9px] mt-1 font-bold">SCAN LOGISTICS AWB</p>
            </div>
          </div>

          {/* Courier Details */}
          <div className="border-2 border-black p-2 font-mono text-[10px] space-y-0.5 bg-gray-50">
            <div className="flex justify-between">
              <span><strong>Courier Name:</strong> Express Logistics Ltd.</span>
              <span><strong>HBD:</strong> {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Courier AWB No:</strong> AWB-{order.id.slice(-8).toUpperCase()}</span>
              <span><strong>CPD:</strong> {formatDate(order.expectedDelivery)}</span>
            </div>
          </div>

          {/* Sold By Info */}
          <div className="border-2 border-black p-2 text-[10px] space-y-0.5 font-mono">
            <p><strong>Sold By:</strong> {storeName} Commercial Apparel Ltd., Main Industrial Area, PIN-110001</p>
            <p><strong>GSTIN No:</strong> 056H523JI7F45DG</p>
          </div>

          {/* Product Items Table */}
          <div className="border-2 border-black overflow-hidden">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-black text-[10px] uppercase font-bold">
                  <th className="p-2 border-r-2 border-black">Product Item</th>
                  <th className="p-2 text-center w-16">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y border-black">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r-2 border-black">
                      <span className="font-bold">{item.title}</span> ({item.size} / {item.color})
                    </td>
                    <td className="p-2 text-center font-bold">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Handover & Tracking ID Barcode */}
          <div className="border-2 border-black p-3 font-mono text-[10px] space-y-2 text-center bg-gray-50">
            <div className="flex justify-between items-center border-b border-black pb-1">
              <span className="bg-black text-white px-2 py-0.5 font-bold uppercase text-[9px]">Handover to Logistics</span>
              <span className="font-bold text-xs">STD</span>
            </div>
            <p className="font-bold text-xs">Tracking ID: HU523JI752F452</p>

            {/* Simulated Barcode */}
            <div className="flex justify-center items-center gap-1 py-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="bg-black inline-block h-8"
                  style={{ width: i % 3 === 0 ? "3px" : "1.5px" }}
                />
              ))}
            </div>

            <p className="font-bold text-xs">Order ID: {order.id}</p>
          </div>

          {/* Footer App Tag */}
          <div className="flex justify-between items-center text-[9px] font-mono pt-1 text-gray-600">
            <span>Ordered Through Commercial Platform</span>
            <span className="font-bold text-black uppercase">{storeName} App / Web</span>
          </div>
        </div>
      </div>
    </div>
  );
}
