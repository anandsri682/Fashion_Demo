"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Mail } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { Modal } from "@/components/ui/Modal";

export function ProductShare({ title, url }: { title: string; url?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const push = useToastStore((s) => s.push);

  const shareUrl = typeof window !== "undefined" ? (url || window.location.href) : "";

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} on Maison Noir!`,
          url: shareUrl,
        });
        push("Product shared successfully");
        return;
      } catch {
        // Fallback to modal if cancelled or unsupported
      }
    }
    setOpen(true);
  }

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      push("Product link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Check out ${title} on Maison Noir!`);

  return (
    <>
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-dark transition-colors py-1"
        aria-label="Share product"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Share Product">
        <div className="flex flex-col gap-6 py-2">
          <p className="text-sm font-editorial font-bold text-ink">{title}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-stone p-4 text-xs font-bold text-ink hover:border-primary hover:bg-primary/5 transition-all"
            >
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-stone p-4 text-xs font-bold text-ink hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Facebook className="h-6 w-6 text-[#1877F2]" />
              <span>Facebook</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-stone p-4 text-xs font-bold text-ink hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Twitter className="h-6 w-6 text-[#1DA1F2]" />
              <span>X (Twitter)</span>
            </a>

            <a
              href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%20${encodedUrl}`}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-stone p-4 text-xs font-bold text-ink hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Mail className="h-6 w-6 text-primary" />
              <span>Email</span>
            </a>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-stone/80 bg-paper-pure p-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-2 text-xs font-mono text-ink focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
