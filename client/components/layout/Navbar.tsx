"use client";

import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-end px-6 gap-4">
      <span className="text-sm text-muted-foreground">{user?.full_name}</span>
      <button onClick={() => logout()} className="text-sm font-medium text-primary hover:underline">
        Log out
      </button>
    </header>
  );
}