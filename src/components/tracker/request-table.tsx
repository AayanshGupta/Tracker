import type { Assignment, Team, User, WorkRequest } from "@prisma/client";
import Link from "next/link";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteRequestButton } from "@/components/tracker/delete-request-button";
import { dueLabel, formatDate, titleCase } from "@/lib/formatters";
import { priorityVariant, statusVariant } from "@/lib/status";

type RequestRow = WorkRequest & {
  requestedBy: User;
  owner: User | null;
  team: Team | null;
  assignments: Array<Assignment & { assignee: User }>;
};

export function RequestTable({
  requests,
  canDeleteRequests = false,
}: {
  requests: RequestRow[];
  canDeleteRequests?: boolean;
}) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-muted-foreground">No requests found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a new request or adjust your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Request Tracker</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">{requests.length} records</span>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              {["Request", "Output / Priority", "Assignee", "Due", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="group align-top transition-colors hover:bg-muted/30"
              >
                {/* Title + ref */}
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">{request.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {request.reference}
                  </p>
                </td>

                {/* Output + priority */}
                <td className="px-5 py-4">
                  <p className="font-medium">{request.outputType}</p>
                  <Badge variant={priorityVariant(request.priority)} className="mt-1 text-[10px]">
                    {titleCase(request.priority)}
                  </Badge>
                </td>

                {/* Assignees */}
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {request.assignments.length ? (
                      request.assignments.map((assignment) => (
                        <Badge key={assignment.id} variant="outline">
                          {assignment.assignee.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </td>

                {/* Due */}
                <td className="px-5 py-4">
                  <p className="font-mono text-xs font-medium">{formatDate(request.dueDate)}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {dueLabel(request.dueDate)}
                  </p>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <Badge variant={statusVariant(request.status)}>
                    {titleCase(request.status)}
                  </Badge>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/tracker/${request.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </Button>
                    {canDeleteRequests && (
                      <DeleteRequestButton requestId={request.id} title={request.title} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
