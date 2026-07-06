"use client";

import { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";

export function Dialog(
    { open, onOpenChange, title, children,}: 
    { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode;}
) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40" />
        <RadixDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-lg p-6 focus:outline-none">
          <RadixDialog.Title className="font-display font-bold text-lg text-foreground">
            {title}
          </RadixDialog.Title>
          <div className="mt-4">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}