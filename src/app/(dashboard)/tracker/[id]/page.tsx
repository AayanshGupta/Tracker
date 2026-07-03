import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, titleCase } from "@/lib/formatters";
import { hasPermission } from "@/lib/permissions";
import { priorityVariant, statusVariant } from "@/lib/status";
import { prisma } from "@/lib/prisma";
import { acceptAssignmentAction, cancelRequestAction, updateRequestStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const request = await prisma.workRequest.findUnique({
    where: { id },
    include: {
      requestedBy: true,
      owner: true,
      team: true,
      assignments: {
        where: { assignee: { active: true } },
        include: { assignee: true }
      },
      reports: true,
      auditLogs: { include: { actor: true }, orderBy: { createdAt: "desc" } }
    }
  });

  if (!request) notFound();
  const currentUserAssignment = request.assignments.find((assignment) => assignment.assigneeId === session?.user?.id);
  const canEditAll = hasPermission(session?.user, "REQUEST_EDIT_ALL");
  const canUpdateStatus = canEditAll || currentUserAssignment?.status === "ACTIVE" || currentUserAssignment?.status === "PAUSED";
  const isPendingAssignee = currentUserAssignment?.status === "PLANNED";
  const canCancelRequest = session?.user?.id === request.requestedById && request.status !== "COMPLETED" && request.status !== "CANCELLED";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">{request.reference}</p>
        <h1 className="text-2xl font-bold tracking-normal">{request.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Badge variant={statusVariant(request.status)}>{titleCase(request.status)}</Badge>
            <Badge variant={priorityVariant(request.priority)}>{titleCase(request.priority)}</Badge>
            <p className="text-sm text-muted-foreground">Due {formatDate(request.dueDate)}</p>
            {canUpdateStatus ? (
              <form action={updateRequestStatusAction} className="space-y-2 pt-2">
                <input type="hidden" name="requestId" value={request.id} />
                <select name="status" defaultValue={request.status} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="IN_REVIEW">In Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="UPDATE_NEEDED">Update Needed</option>
                  <option value="ON_HOLD">On hold</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <Button size="sm">Update status</Button>
              </form>
            ) : null}
            {canCancelRequest ? (
              <form action={cancelRequestAction} className="pt-2">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="reason" value="Cancelled by requestee" />
                <Button size="sm" variant="destructive">Cancel request</Button>
              </form>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Output</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{request.outputType}</p>
            <p className="text-muted-foreground">{titleCase(request.priority)} priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>People</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Requester: {request.requestedBy.name}</p>
            <p>Assignees: {request.assignments.map((item) => item.assignee.name).join(", ") || "None"}</p>
          </CardContent>
        </Card>
      </div>
      {isPendingAssignee ? (
        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle>Assignee Approval</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review the request and indicate how many days you estimate this task will require.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Days estimate — shared by both approve and reject forms via a JS-free approach */}
            <div className="space-y-2">
              <label htmlFor="estimatedDays" className="text-sm font-medium leading-none">
                Estimated Days Required <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="estimatedDays"
                  min={1}
                  max={365}
                  defaultValue={1}
                  step={1}
                  className="h-10 w-28 rounded-md border border-input bg-background px-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  form="approveForm"
                  name="estimatedDays"
                />
                <span className="text-sm text-muted-foreground">day(s)</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <form id="approveForm" action={acceptAssignmentAction}>
                <input type="hidden" name="requestId" value={request.id} />
                <Button>Approve</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader><CardTitle>Approval Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {request.auditLogs.map((log) => (
            <div key={log.id} className="rounded-md border p-3 text-sm">
              <p className="font-semibold">{titleCase(log.action)}</p>
              <p className="text-xs text-muted-foreground">{log.actor?.name ?? "System"} · {formatDate(log.createdAt)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
