import { Database, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  const params = await searchParams;

  return (
    <main className="premium-bg relative flex min-h-dvh items-center justify-center overflow-hidden p-4">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] right-[10%] h-80 w-80 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <Card className="glass-card rounded-2xl border-border/50 p-8 shadow-soft">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-primary-glow">
              <Database className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Task Tracker
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your allocation workspace
            </p>
          </div>

          {/* Form */}
          <form action={loginAction} className="space-y-5">
            {params?.error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                Invalid email or password. Please try again.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Work Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl text-base">
              Sign In →
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Internal Use Only · Confidential
            </p>
          </div>
        </Card>

        {/* Version badge */}
        <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/60">
          v2026 · Performance Analytics
        </p>
      </div>
    </main>
  );
}
