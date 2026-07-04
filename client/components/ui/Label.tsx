import { LabelHTMLAttributes } from "react";

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block font-mono text-xs uppercase tracking-wide text-muted-foreground mb-2 ${className}`}
      {...props}
    />
  );
}