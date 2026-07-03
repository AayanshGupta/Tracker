import type { AuditLog, User, WorkRequest } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, titleCase } from "@/lib/formatters";

type AuditRow = AuditLog & {
  actor: User | null;
  request: WorkRequest | null;
};

export function AuditTable({ logs }: { logs: AuditRow[] }) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-muted-foreground">No audit logs found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            System activity and approvals will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Approval Trail</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">{logs.length} events</span>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              {["Action", "Actor", "Entity", "Request", "Timestamp"].map((h) => (
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
            {logs.map((log) => {
              const actionBadge = log.action.includes("CREATE")
                ? "success"
                : log.action.includes("DELETE") || log.action.includes("REMOVE")
                  ? "danger"
                  : log.action.includes("UPDATE")
                    ? "info"
                    : "secondary";

              return (
                <tr key={log.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <Badge variant={actionBadge} className="text-[10px]">
                      {titleCase(log.action)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {log.actor?.name ?? "System"}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{titleCase(log.entityType)}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      ID: {log.entityId}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {log.request ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {log.request.reference}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
