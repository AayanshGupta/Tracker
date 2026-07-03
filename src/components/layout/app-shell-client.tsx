"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Database,
  FileSearch,
  Gauge,
  LogOut,
  Plus,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
  { href: "/tracker", label: "Tracker", icon: ClipboardList },
  { href: "/workload", label: "Workload", icon: Gauge },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/approval", label: "Approval", icon: ShieldCheck },
] as const;

interface AppShellClientProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    roleLabel?: string | null;
  };
  canManageUsers: boolean;
  initials: string;
  signOut: () => Promise<void>;
}

export function AppShellClient({ children, user, canManageUsers, initials, signOut }: AppShellClientProps) {
  const pathname = usePathname();

  const allNavItems = [
    ...navItems,
    ...(canManageUsers ? [{ href: "/members" as const, label: "Members", icon: UserCog }] : []),
    ...(canManageUsers ? [{ href: "/audit" as const, label: "Audit", icon: FileSearch }] : []),
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
          {/* Brand */}
          <Link href="/dashboard" className="group flex min-w-max items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-base font-bold tracking-tight text-foreground">
                Database Tracker
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Performance Team
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center gap-1 px-4 lg:flex">
            {allNavItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button asChild className="hidden rounded-lg sm:inline-flex" size="sm">
              <Link href="/tracker/new">
                <Plus className="h-3.5 w-3.5" />
                New Request
              </Link>
            </Button>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 shadow-sm transition-shadow hover:shadow-md">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-xs font-semibold leading-tight">{user.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{user.roleLabel}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-soft">
                {/* User info */}
                <div className="mb-1 flex items-center gap-3 border-b border-border px-3 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">{user.email}</p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{user.roleLabel}</p>
                  </div>
                </div>

                <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Analytics
                </Link>
                <Link href="/tracker/new" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  New request
                </Link>
                {canManageUsers && (
                  <>
                    <Link href="/members" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      Manage members
                    </Link>
                    <Link href="/audit" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">
                      <FileSearch className="h-4 w-4 text-muted-foreground" />
                      Audit log
                    </Link>
                  </>
                )}
                <div className="mt-1 border-t border-border pt-1">
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden">
          {allNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-max items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
