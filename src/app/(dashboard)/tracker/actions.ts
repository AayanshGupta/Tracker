"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/server/audit";

export async function deleteRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user, "USER_MANAGE")) redirect("/tracker");

  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) redirect("/tracker");

  const request = await prisma.workRequest.findUnique({
    where: { id: requestId },
    select: { id: true, reference: true, title: true, status: true }
  });
  if (!request) redirect("/tracker");

  await prisma.$transaction([
    prisma.auditLog.updateMany({
      where: { requestId },
      data: { requestId: null }
    }),
    prisma.workRequest.delete({ where: { id: requestId } })
  ]);

  await writeAuditLog({
    actorId: session.user.id,
    action: "REQUEST_DELETED",
    entityType: "WorkRequest",
    entityId: requestId,
    before: request
  });

  revalidatePath("/dashboard");
  revalidatePath("/tracker");
  revalidatePath("/calendar");
}
