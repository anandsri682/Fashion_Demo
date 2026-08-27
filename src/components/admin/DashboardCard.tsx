import { LucideIcon } from "lucide-react";

export function DashboardCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}) {
  return (
    <div className="flex items-start justify-between rounded-xl bg-paper-pure p-5 border border-stone/60 shadow-subtle hover:border-primary/40 transition-all hover:-translate-y-0.5">
      <div>
        <p className="text-[10px] uppercase font-bold tracking-wider text-ash font-mono">{label}</p>
        <p className={`mt-2 font-editorial text-2xl font-bold ${tone === "warning" ? "text-error" : "text-ink"}`}>{value}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
    </div>
  );
}

