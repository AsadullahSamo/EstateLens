import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {children}
    </div>
  );
}