"use client";

import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const variants: Record<string, string> = {
  primary: "bg-crimson-gradient text-white hover:bg-primary-dark active:scale-[0.99] shadow-crimson border border-primary/20 font-bold",
  secondary: "bg-stone-light text-ink hover:bg-stone border border-stone active:scale-[0.99]",
  gold: "bg-crimson-gradient text-white hover:bg-primary-dark active:scale-[0.99] shadow-crimson font-bold",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.99] font-bold",
  ghost: "text-ink hover:bg-primary/10 hover:text-primary",
  danger: "bg-error text-white hover:opacity-90 active:scale-[0.99]",
};


const sizes: Record<string, string> = {
  sm: "text-[11px] px-3.5 py-1.5 tracking-luxury",
  md: "text-xs px-5 py-2.5 tracking-luxury",
  lg: "text-xs px-7 py-3.5 tracking-widest uppercase font-semibold",
  xl: "text-sm px-9 py-4 tracking-widest uppercase font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2.5 font-body font-medium uppercase tracking-luxury transition-all duration-300 ease-editorial disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

