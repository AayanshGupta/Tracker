import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { hasPermission, roleLabel } from "@/lib/permissions";
import { AppShellClient } from "./app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const initials = session.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const canManageUsers = hasPermission(session.user, "USER_MANAGE");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <AppShellClient
      canManageUsers={canManageUsers}
      initials={initials}
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        roleLabel: roleLabel(session.user.role),
      }}
      signOut={handleSignOut}
    >
      {children}
    </AppShellClient>
  );
}
