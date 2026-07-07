"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmLabel = "Delete",
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  isPending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-background cursor-pointer"
        >
          Cancel
        </button>
        <Button variant="destructive" className="w-auto" onClick={onConfirm} disabled={isPending}>
          {isPending ? "Deleting…" : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}