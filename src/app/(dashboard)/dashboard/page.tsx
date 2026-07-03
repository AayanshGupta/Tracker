import { CheckCircle2, Clock3, ListChecks, TrendingUp } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RequestTable } from "@/components/tracker/request-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, titleCase } from "@/lib/formatters";
import { getDashboardData } from "@/server/queries";

export const dynamic = "force-dynamic";

const eventTypeBadge: Record<string, "danger" | "info" | "success" | "warning" | "secondary"> = {
  DEADLINE: "danger",
  REVIEW: "info",
  LAUNCH: "success",
  OUT_OF_OFFICE: "warning",
  CAPACITY_HOLD: "secondary",
};

export default async function DashboardPage() {
  const session = await auth();
  const { requests, events, auditLogs } = await getDashboardData(session);
  const open = requests.filter((r) => !["COMPLETED", "CANCELLED"].includes(r.status)).length;

  const completed = requests.filter((r) => r.status === "COMPLETED").length;
  const dueSoon = requests.filter(
    (r) => r.dueDate.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 7 && r.status !== "COMPLETED"
  ).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Portfolio health, deadlines, and approval activity.
          </p>
        </div>
        <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
          <TrendingUp className="h-3.5 w-3.5" />
          Live · updated now
        </div>
      </div>

      {/* Metrics bento grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Open Requests"
          value={open}
          helper="Active demand in queue"
          icon={ListChecks}
          tone="blue"
        />
        <MetricCard
          label="Due This Week"
          value={dueSoon}
          helper="Needs delivery attention"
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Completed"
          value={completed}
          helper="Closed requests"
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Request table */}
        <RequestTable requests={requests.slice(0, 8)} />

        {/* Sidebar panels */}
        <div className="space-y-6">
          {/* Calendar Pulse */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle>Calendar Pulse</CardTitle>
              <Link
                href="/calendar"
                className="font-mono text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {events.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming events</p>
              )}
              {events.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30"
                >
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      event.type === "DEADLINE"
                        ? "bg-rose-500"
                        : event.type === "LAUNCH"
                          ? "bg-emerald-500"
                          : event.type === "REVIEW"
                            ? "bg-sky-500"
                            : event.type === "OUT_OF_OFFICE"
                              ? "bg-amber-500"
                              : "bg-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{event.title}</p>
                      <Badge variant={eventTypeBadge[event.type] ?? "secondary"} className="shrink-0 text-[10px]">
                        {titleCase(event.type)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      {formatDateTime(event.startsAt)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Approvals */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle>Recent Activity</CardTitle>
              <Link
                href="/audit"
                className="font-mono text-xs text-primary hover:underline"
              >
                View log →
              </Link>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {auditLogs.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No recent activity</p>
              )}
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold">{titleCase(log.action)}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {log.actor?.name ?? "System"} · {formatDateTime(log.createdAt)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
