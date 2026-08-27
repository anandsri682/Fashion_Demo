import { LucideIcon } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Icon className="h-10 w-10 text-ash" strokeWidth={1.25} />
      <div>
        <h3 className="font-display text-xl text-ink">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-ash">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="outline" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
