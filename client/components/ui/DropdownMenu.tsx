"use client";

import { ReactNode } from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

export function DropdownMenu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="end"
          sideOffset={4}
          className="min-w-40 bg-card border border-border rounded-md p-1"
        >
          {children}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export function DropdownMenuItem({
  onSelect,
  destructive,
  children,
}: {
  onSelect: () => void;
  destructive?: boolean;
  children: ReactNode;
}) {
  return (
    <RadixDropdown.Item
      onSelect={onSelect}
      className={`px-3 py-2 text-sm rounded-sm cursor-pointer outline-none hover:bg-background ${
        destructive ? "text-destructive hover:bg-destructive hover:text-white" : "text-foreground hover:bg-primary hover:text-white"
      }`}
    >
      {children}
    </RadixDropdown.Item>
  );
}