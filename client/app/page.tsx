"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/projects" : "/login");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
        <span className="text-sm">Loading EstateLens…</span>
      </div>
    </div>
  );

}