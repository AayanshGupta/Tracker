import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuditTable } from "@/components/audit/audit-table";
import { hasPermission } from "@/lib/permissions";
import { getAuditData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function ApprovalPage() {
  const session = await auth();
  if (!hasPermission(session?.user, "AUDIT_VIEW")) redirect("/dashboard");

  const logs = await getAuditData(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Approval
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review approval history, request decisions, and member access changes.
        </p>
      </div>
      <AuditTable logs={logs} />
    </div>
  );
}
