import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

const steps = ["Address", "Order Review", "Payment", "Confirmation"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-12 flex items-center max-w-3xl mx-auto">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center border text-xs font-mono transition-all duration-300",
                  done && "border-brass bg-brass text-paper-pure font-bold shadow-xs",
                  active && "border-brass text-brass font-bold bg-stone-light/50 ring-2 ring-brass/20",
                  !done && !active && "border-stone text-ash bg-paper"
                )}
              >
                {done ? <Check className="h-4 w-4 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-semibold uppercase tracking-luxury sm:block text-center",
                  active ? "text-ink" : done ? "text-brass" : "text-ash"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum !== steps.length && (
              <div
                className={cn(
                  "mx-3 h-[1.5px] flex-1 transition-colors duration-500",
                  done ? "bg-brass" : "bg-stone/60"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

