"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, fullName);
    } catch {
      setError("Email already registered.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="blueprint-grid min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-10">
        <div className="flex justify-center text-primary">
          <Logo />
        </div>
        <h1 className="mt-7 text-center font-display font-bold text-xl text-foreground">
          Create your account
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Start your first due diligence project.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full hover:cursor-pointer">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}