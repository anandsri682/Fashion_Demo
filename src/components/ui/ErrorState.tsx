"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";


export function ErrorState({
  message = "Something went wrong while loading this page.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-error" strokeWidth={1.25} />
      <div>
        <h3 className="font-display text-xl text-ink">We hit a snag</h3>
        <p className="mt-2 max-w-sm text-sm text-ash">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
