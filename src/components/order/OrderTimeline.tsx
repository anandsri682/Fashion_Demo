import { ORDER_STATUS_FLOW, OrderStatus } from "@/types";
import { cn } from "@/lib/cn";
import { Check, X } from "lucide-react";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 border border-error/40 bg-error/5 px-4 py-3 text-error text-xs font-mono">
        <X className="h-4 w-4" />
        <span>This order was cancelled.</span>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="flex flex-col gap-0">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === ORDER_STATUS_FLOW.length - 1;
        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center border text-[10px] transition-all duration-300",
                  done ? "border-brass bg-brass text-paper-pure font-bold shadow-xs" : "border-stone text-ash bg-paper",
                  isCurrent && "ring-2 ring-brass/30"
                )}
              >
                {done && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              {!isLast && (
                <div
                  className={cn("w-[1.5px] flex-1 transition-colors duration-500", done ? "bg-brass" : "bg-stone/50")}
                  style={{ minHeight: 28 }}
                />
              )}
            </div>
            <div className="pb-6">
              <p className={cn("text-xs font-semibold uppercase tracking-luxury", done ? "text-ink" : "text-ash")}>
                {step}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

