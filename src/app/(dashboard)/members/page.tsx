import { redirect } from "next/navigation";
import { ShieldCheck, UserPlus } from "lucide-react";
import type { Permission, Role } from "@prisma/client";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allPermissions, hasPermission, roleLabel } from "@/lib/permissions";
import { titleCase } from "@/lib/formatters";
import { getMemberAdminData } from "@/server/queries";
import { createMemberAction, removeMemberAction, updateMemberAction } from "./actions";

const roles = ["ADMIN", "MANAGER", "LEAD", "ANALYST", "REQUESTER", "VIEWER"];

export const dynamic = "force-dynamic";

function PermissionChecklist({ selected }: { selected: Permission[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
      {allPermissions.map((permission) => (
        <label
          key={permission}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/50"
        >
          <input
            name="permissions"
            type="checkbox"
            value={permission}
            defaultChecked={selected.includes(permission)}
            className="h-4 w-4 accent-primary"
          />
          <span className="font-mono tracking-tight">{titleCase(permission)}</span>
        </label>
      ))}
    </div>
  );
}

export default async function MembersPage() {
  const session = await auth();
  if (!hasPermission(session?.user, "USER_MANAGE")) redirect("/dashboard");

  const { users } = await getMemberAdminData();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Members
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add people, assign roles, reset passwords, and tune permissions.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMemberAction} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input id="name" name="name" required placeholder="Member name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabel(role as Role)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required placeholder="Min. 8 characters" />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
              <Label className="text-sm font-semibold">Granular Permissions</Label>
              <PermissionChecklist selected={[]} />
            </div>

            <div className="flex justify-end">
              <Button>Add member</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="bg-muted/20 pb-4">
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  {user.name}
                  <Badge variant="outline" className="ml-2 bg-background font-mono">
                    {roleLabel(user.role as Role)}
                  </Badge>
                </span>
                <Badge variant={user.active ? "success" : "secondary"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={updateMemberAction} className="grid gap-6">
                <input type="hidden" name="userId" value={user.id} />
                
                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input name="name" required defaultValue={user.name ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {roleLabel(role as Role)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input name="password" type="password" placeholder="Leave blank to keep" />
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4">
                  <Label className="text-sm font-semibold">Granular Permissions</Label>
                  <PermissionChecklist selected={user.permissions.map((grant) => grant.permission)} />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <input
                      name="active"
                      type="checkbox"
                      defaultChecked={user.active}
                      className="h-4 w-4 accent-primary"
                    />
                    Account is Active
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <form action={removeMemberAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <Button type="submit" variant="destructive" size="sm">
                        Delete Member
                      </Button>
                    </form>
                    <Button>Save changes</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
