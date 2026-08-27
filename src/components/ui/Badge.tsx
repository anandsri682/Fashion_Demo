import { cn } from "@/lib/cn";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "brass" | "error" | "outline" | "sand";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-crimson-gradient text-white font-bold shadow-xs",
    primary: "bg-crimson-gradient text-white font-bold shadow-xs",
    brass: "bg-crimson-gradient text-white font-bold shadow-xs",
    sand: "bg-stone-light text-graphite border border-stone",
    error: "bg-error text-white font-bold",
    outline: "border border-primary text-primary bg-primary/10 font-bold",
  };


  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-luxury transition-all duration-300 select-none",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

