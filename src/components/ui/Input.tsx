"use client";

import { cn } from "@/lib/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-xs font-semibold uppercase tracking-luxury text-graphite">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ash-light transition-all duration-200 focus:bg-paper-pure focus:outline-none focus:ring-1 focus:ring-brass focus:border-brass rounded-none",
            error ? "border-error focus:ring-error" : "border-stone hover:border-graphite/40",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

