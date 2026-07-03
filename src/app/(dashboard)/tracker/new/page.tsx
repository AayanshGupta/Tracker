import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasPermission } from "@/lib/permissions";
import { getAssignableUsers } from "@/server/queries";
import { OutputTypeSelect } from "@/components/tracker/output-type-select";
import { createRequestAction } from "./actions";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export const dynamic = "force-dynamic";

export default async function NewRequestPage() {
  const session = await auth();
  if (!hasPermission(session?.user, "REQUEST_CREATE")) redirect("/dashboard");
  const assignableUsers = await getAssignableUsers();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          New Request
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture the output, deadline, and delivery context.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Intake</CardTitle>
          <p className="text-sm text-muted-foreground">
            All fields marked are required. Reference ID will be auto-generated.
          </p>
        </CardHeader>
        <CardContent>
          <form action={createRequestAction} className="grid gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Request Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Weekly campaign pacing report"
                className="h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Details & Context
              </Label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Add notes, links, source data, or approval context…"
              />
            </div>

            {/* Two-col grid */}
            <div className="grid gap-5 md:grid-cols-2">
              <OutputTypeSelect />

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="font-medium">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Input id="dueDate" name="dueDate" type="date" required className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigneeId" className="font-medium">
                  Assign To
                </Label>
                <select
                  id="assigneeId"
                  name="assigneeId"
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="">Unassigned</option>
                  {assignableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name ?? user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="font-medium">
                  Priority
                </Label>
                <select
                  id="priority"
                  name="priority"
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0) + priority.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Link href="/tracker" className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-accent hover:text-accent-foreground active:scale-[0.98]">
                Cancel
              </Link>
              <Button type="submit" className="min-w-32">
                Create Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
