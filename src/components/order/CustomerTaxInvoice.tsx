"use client";

import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { useSettingsStore } from "@/store/settingsStore";
import { Printer, X } from "lucide-react";

export function CustomerTaxInvoice({ order, onClose }: { order: Order; onClose: () => void }) {
  const settings = useSettingsStore((s) => s.settings);
  const storeName = settings.storeName || "MAISON NOIR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl bg-white p-6 sm:p-10 shadow-2xl space-y-6 text-black print:p-0 print:shadow-none print:max-w-none print:w-full">
        {/* Action bar (hidden on print) */}
        <div className="flex items-center justify-between border-b border-stone/50 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary">COMMERCIAL TAX INVOICE</span>
            <span className="text-xs text-ash">&middot; Ready for Print / PDF Export</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-crimson transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-2 text-ash hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE TAX INVOICE BOX matching Screenshot 2 */}
        <div className="border-2 border-black p-4 font-sans text-[11px] leading-tight space-y-3">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-black pb-2 text-[10px] font-mono">
            <span>Page No. 1 of 1</span>
            <span className="font-bold text-sm tracking-wider uppercase">TAX INVOICE</span>
            <span>Original Copy</span>
          </div>

          {/* Company Details */}
          <div className="text-center pb-2 border-b border-black">
            <h2 className="text-xl font-bold font-editorial uppercase tracking-widest">{storeName}</h2>
            <p className="text-[10px] text-gray-700">Haute Couture &amp; Commercial Textiles Ltd.</p>
            <p className="text-[10px] font-mono mt-0.5">
              Mobile: {settings.supportPhone || "+91 9999999999"} | Email: {settings.supportEmail || "support@maisonnoir.com"}
            </p>
            <p className="text-[10px] font-mono font-bold">GSTIN: 29AAAAA1234F000 | PAN: 29AAAAA1234F</p>
          </div>

          {/* Order & Transporter Details Grid */}
          <div className="grid grid-cols-2 border-b border-black divide-x divide-black text-[10px] font-mono">
            <div className="p-2 space-y-1">
              <p><strong className="w-28 inline-block">Invoice Number:</strong> INV/{order.id}</p>
              <p><strong className="w-28 inline-block">Invoice Date:</strong> {formatDate(order.createdAt)}</p>
              <p><strong className="w-28 inline-block">Due Date:</strong> {formatDate(order.expectedDelivery)}</p>
              <p><strong className="w-28 inline-block">Place of Supply:</strong> {order.shippingAddress.state}</p>
              <p><strong className="w-28 inline-block">Reverse Charge:</strong> No</p>
            </div>
            <div className="p-2 space-y-1">
              <p className="font-bold text-ink mb-1 uppercase">Transporter Details</p>
              <p><strong className="w-28 inline-block">Transporter:</strong> Express Courier Logistics</p>
              <p><strong className="w-28 inline-block">Vehicle No:</strong> MH-01-AB-1234</p>
              <p><strong className="w-28 inline-block">Courier AWB No:</strong> AWB-{order.id.slice(-8).toUpperCase()}</p>
              <p><strong className="w-28 inline-block">Payment Mode:</strong> {order.paymentMethod.replace("_", " ")}</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 border-b border-black divide-x divide-black text-[10px]">
            <div className="p-2 space-y-1">
              <p className="font-bold uppercase tracking-wider text-black">Billing Details</p>
              <p className="font-bold">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
              <p>{order.billingAddress.addressLine1}, {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}</p>
              <p className="font-mono">Mobile: {order.billingAddress.phone} | Email: {order.billingAddress.email}</p>
            </div>
            <div className="p-2 space-y-1">
              <p className="font-bold uppercase tracking-wider text-black">Shipping Details</p>
              <p className="font-bold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p className="font-mono">Mobile: {order.shippingAddress.phone} | Email: {order.shippingAddress.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] font-mono border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100 border-b border-black uppercase text-[9px] font-bold">
                  <th className="border-r border-black p-1.5 text-center">Sr.</th>
                  <th className="border-r border-black p-1.5">Item Description</th>
                  <th className="border-r border-black p-1.5 text-center">HSN/SAC</th>
                  <th className="border-r border-black p-1.5 text-center">Qty</th>
                  <th className="border-r border-black p-1.5 text-center">Unit</th>
                  <th className="border-r border-black p-1.5 text-right">Price (₹)</th>
                  <th className="border-r border-black p-1.5 text-right">Disc</th>
                  <th className="border-r border-black p-1.5 text-right">Tax (5%)</th>
                  <th className="p-1.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-r border-black p-1.5 text-center">{idx + 1}</td>
                    <td className="border-r border-black p-1.5">
                      <p className="font-bold">{item.title}</p>
                      <p className="text-[9px] text-gray-600">Size: {item.size} | Color: {item.color}</p>
                    </td>
                    <td className="border-r border-black p-1.5 text-center">62052000</td>
                    <td className="border-r border-black p-1.5 text-center">{item.quantity}</td>
                    <td className="border-r border-black p-1.5 text-center">Pcs</td>
                    <td className="border-r border-black p-1.5 text-right">{formatCurrency(item.price)}</td>
                    <td className="border-r border-black p-1.5 text-right">₹0.00</td>
                    <td className="border-r border-black p-1.5 text-right">{formatCurrency(Math.round(item.price * item.quantity * 0.05))}</td>
                    <td className="p-1.5 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="border-t border-black pt-2 space-y-1 font-mono text-[10px]">
            {order.discount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Coupon Discount Applied:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Estimated Tax (5% GST):</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping Fee:</span>
              <span>{order.shipping === 0 ? "FREE" : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs border-t border-black pt-1">
              <span>Grand Total Amount:</span>
              <span className="text-black">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Terms & Bank Details Footer */}
          <div className="grid grid-cols-3 border-t-2 border-black pt-3 text-[9px] gap-4">
            <div>
              <p className="font-bold uppercase mb-1">Terms &amp; Conditions</p>
              <ol className="list-decimal pl-3 space-y-0.5 text-gray-600">
                <li>Goods once sold can be returned within 30 days.</li>
                <li>Interest @ 18% p.a. will be charged for delayed payments.</li>
                <li>Subject to local jurisdiction only.</li>
              </ol>
            </div>

            <div className="font-mono text-[9px]">
              <p className="font-bold uppercase mb-1">Bank Payment Details</p>
              <p>Account Name: {storeName} Ltd.</p>
              <p>Bank: ICICI Bank</p>
              <p>Account: 123456789012</p>
              <p>IFSC: ICIC0001234</p>
              <p>Branch: Main Commercial Branch</p>
            </div>

            <div className="text-right flex flex-col justify-between items-end">
              <span className="font-bold uppercase">For {storeName}</span>
              <div className="h-12 border-b border-black w-32 border-dashed" />
              <span className="text-[9px] text-gray-600">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
