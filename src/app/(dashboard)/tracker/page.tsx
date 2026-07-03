import { Filter, Plus } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { RequestTable } from "@/components/tracker/request-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/permissions";
import { getMyPendingWork, getTrackerData } from "@/server/queries";

export const dynamic = "force-dynamic";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Update Needed", value: "UPDATE_NEEDED" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Delayed", value: "DELAYED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "My Work", value: "PENDING" },
];

export default async function TrackerPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const requests = await getTrackerData(session);
  const pendingWork = session?.user?.id ? await getMyPendingWork(session.user.id) : [];
  const sourceRequests = params?.status === "PENDING" ? pendingWork : requests;
  const canDeleteRequests = hasPermission(session?.user, "USER_MANAGE");
  const q = params?.q?.toLowerCase() ?? "";
  const filtered = sourceRequests.filter((request) => {
    const statusMatch =
      params?.status && params.status !== "PENDING"
        ? request.status === params.status
        : true;
    const searchMatch = q
      ? [request.title, request.reference, request.outputType, request.owner?.name ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q)
      : true;
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Request Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track intake, assignments, report deliverables, and approvals.
          </p>
        </div>
        <Button asChild>
          <Link href="/tracker/new">
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((filter) => {
          const active = (params?.status ?? "") === filter.value;
          return (
            <Link key={filter.value} href={`/tracker?status=${filter.value}&q=${q}`}>
              <Badge
                variant={active ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1 text-xs transition-all hover:opacity-90"
              >
                {filter.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form
        className="flex gap-2 rounded-xl border border-border/60 bg-card p-3"
        action="/tracker"
      >
        {params?.status ? (
          <input type="hidden" name="status" value={params.status} />
        ) : null}
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search by title, output type, owner, or reference ID..."
            defaultValue={params?.q ?? ""}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Table */}
      <RequestTable requests={filtered} canDeleteRequests={canDeleteRequests} />
    </div>
  );
}
