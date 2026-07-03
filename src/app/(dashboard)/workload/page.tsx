import { Users } from "lucide-react";
import { WorkloadBoard } from "@/components/workload/workload-board";
import { getWorkloadData } from "@/server/queries";

export const dynamic = "force-dynamic";

function workingDaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

export default async function WorkloadPage() {
  const users = await getWorkloadData();
  const now = new Date();
  const monthWorkingDays = workingDaysInMonth(now.getFullYear(), now.getMonth());
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  // allocatedHours stores days since the approval flow saves estimated days
  const totalAllocatedDays = users.reduce(
    (sum, u) => sum + u.assignments.reduce((s, a) => s + Number(a.allocatedHours), 0),
    0
  );
  const totalCapacityDays = users.length * monthWorkingDays;
  const teamUtilization = totalCapacityDays > 0
    ? Math.round((totalAllocatedDays / totalCapacityDays) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Workload
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capacity, reservations, and assignment load by person.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-mono text-xs text-muted-foreground">Team Utilization · {monthLabel}</p>
            <p className="font-display text-xl font-bold text-foreground">{teamUtilization}%</p>
          </div>
          <div className="ml-2 border-l border-border pl-3">
            <p className="font-mono text-xs text-muted-foreground">{users.length} members</p>
            <p className="font-mono text-xs text-muted-foreground">{totalAllocatedDays}d / {totalCapacityDays}d</p>
          </div>
        </div>
      </div>

      <WorkloadBoard users={users} />
    </div>
  );
}

