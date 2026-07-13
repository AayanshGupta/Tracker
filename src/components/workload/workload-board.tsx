import type { Assignment, CapacityEntry, Team, User, WorkRequest } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, titleCase } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type WorkloadUser = User & {
  team: Team | null;
  capacityEntries: CapacityEntry[];
  assignments: Array<Assignment & { request: WorkRequest }>;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Count working days (Mon–Fri) in a given month */
function workingDaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

export function WorkloadBoard({ users }: { users: WorkloadUser[] }) {
  const now = new Date();
  const totalWorkingDays = workingDaysInMonth(now.getFullYear(), now.getMonth());
  // Label e.g. "June 2026"
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {users.map((user) => {
        // allocatedHours field now stores days (1 unit = 1 day) after the approval change
        const allocatedDays = user.assignments.reduce(
          (sum, item) => sum + Number(item.allocatedHours),
          0
        );

        const utilization = Math.min(
          100,
          totalWorkingDays > 0
            ? Math.round((allocatedDays / totalWorkingDays) * 100)
            : 0
        );

        const utilizationBadge =
          utilization > 90 ? "danger" : utilization > 75 ? "warning" : "success";

        return (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {getInitials(user.name)}
                </div>
                <div>
                  <CardTitle className="text-sm">{user.name}</CardTitle>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {user.title ?? titleCase(user.role)} · {user.team?.name ?? "No team"}
                  </p>
                </div>
              </div>
              <Badge variant={utilizationBadge}>
                {utilization}% used
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/40">
                <div
                  className={cn("h-full w-full flex-1 transition-all duration-500", utilization > 90 ? "bg-rose-500" : utilization > 75 ? "bg-amber-500" : "bg-primary")}
                  style={{ transform: `translateX(-${100 - utilization}%)` }}
                />
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/30 p-3">
                {[
                  { label: "Capacity", value: `${totalWorkingDays}d`, sub: monthLabel },
                  {
                    label: "Allocated",
                    value: `${allocatedDays}d`,
                    sub: `${user.assignments.length} task${user.assignments.length !== 1 ? "s" : ""}`,
                    danger: allocatedDays > totalWorkingDays * 0.9,
                  },
                ].map(({ label, value, sub, danger }) => (
                  <div key={label} className="text-center">
                    <p
                      className={cn(
                        "font-mono text-base font-bold tabular-nums",
                        danger ? "text-rose-600" : "text-foreground"
                      )}
                    >
                      {value}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
                    {sub && (
                      <p className="font-mono text-[10px] text-muted-foreground/70">{sub}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Assignments */}
              {user.assignments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    Active Assignments
                  </p>
                  {user.assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">
                          {assignment.request.title}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {formatDate(assignment.startDate)} → {formatDate(assignment.endDate)}
                        </p>
                      </div>
                      <span className="ml-2 shrink-0 font-mono text-xs font-bold text-primary">
                        {Number(assignment.allocatedHours)}d
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {user.assignments.length === 0 && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  No active assignments
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
