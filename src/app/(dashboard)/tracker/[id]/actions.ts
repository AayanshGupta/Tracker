"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/server/audit";

async function requireRequestAccess(requestId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const request = await prisma.workRequest.findUnique({
    where: { id: requestId },
    include: { assignments: true }
  });
  if (!request) redirect("/tracker");

  const isAssignee = request.assignments.some((assignment) => assignment.assigneeId === session.user.id);
  const canEditAll = hasPermission(session.user, "REQUEST_EDIT_ALL");
  if (!isAssignee && !canEditAll) redirect(`/tracker/${requestId}`);

  return { session, request };
}

export async function acceptAssignmentAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const { session } = await requireRequestAccess(requestId);

  const estimatedDays = Math.max(1, Number(formData.get("estimatedDays") ?? 1) || 1);

  await prisma.assignment.updateMany({
    where: { requestId, assigneeId: session.user.id, status: "PLANNED" },
    data: { status: "ACTIVE", roleNote: "Accepted", allocatedHours: estimatedDays }
  });
  await prisma.workRequest.update({
    where: { id: requestId },
    data: { status: "IN_PROGRESS" }
  });
  await writeAuditLog({
    actorId: session.user.id,
    requestId,
    action: "ASSIGNMENT_ACCEPTED",
    entityType: "WorkRequest",
    entityId: requestId,
    after: { status: "IN_PROGRESS", estimatedDays }
  });

  revalidatePath("/tracker");
  revalidatePath(`/tracker/${requestId}`);
  redirect(`/tracker/${requestId}`);
}

export async function requestExtensionAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const { session } = await requireRequestAccess(requestId);

  await prisma.assignment.updateMany({
    where: { requestId, assigneeId: session.user.id, status: "PLANNED" },
    data: { status: "PAUSED", roleNote: "Time extension requested" }
  });
  await prisma.workRequest.update({
    where: { id: requestId },
    data: { status: "BLOCKED" }
  });
  await writeAuditLog({
    actorId: session.user.id,
    requestId,
    action: "EXTENSION_REQUESTED",
    entityType: "WorkRequest",
    entityId: requestId,
    after: { status: "BLOCKED" }
  });

  revalidatePath("/tracker");
  revalidatePath(`/tracker/${requestId}`);
  redirect(`/tracker/${requestId}`);
}

const statusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["IN_PROGRESS", "BLOCKED", "IN_REVIEW", "COMPLETED", "UPDATE_NEEDED", "ON_HOLD", "DELAYED"])
});

export async function updateRequestStatusAction(formData: FormData) {
  const parsed = statusSchema.parse(Object.fromEntries(formData));
  const { session } = await requireRequestAccess(parsed.requestId);

  await prisma.workRequest.update({
    where: { id: parsed.requestId },
    data: {
      status: parsed.status,
      completedAt: parsed.status === "COMPLETED" ? new Date() : null
    }
  });
  await writeAuditLog({
    actorId: session.user.id,
    requestId: parsed.requestId,
    action: "STATUS_UPDATED",
    entityType: "WorkRequest",
    entityId: parsed.requestId,
    after: { status: parsed.status }
  });

  revalidatePath("/tracker");
  revalidatePath(`/tracker/${parsed.requestId}`);
  redirect(`/tracker/${parsed.requestId}`);
}

export async function cancelRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const requestId = String(formData.get("requestId") ?? "");
  const request = await prisma.workRequest.findUnique({
    where: { id: requestId },
    select: { id: true, requestedById: true, status: true }
  });

  if (!request || request.requestedById !== session.user.id) redirect(`/tracker/${requestId}`);

  await prisma.workRequest.update({
    where: { id: requestId },
    data: {
      status: "CANCELLED",
      completedAt: new Date()
    }
  });
  await writeAuditLog({
    actorId: session.user.id,
    requestId,
    action: "REQUEST_CANCELLED",
    entityType: "WorkRequest",
    entityId: requestId,
    before: { status: request.status },
    after: { status: "CANCELLED", reason: "Cancelled by requestee" }
  });

  revalidatePath("/dashboard");
  revalidatePath("/tracker");
  revalidatePath("/calendar");
  revalidatePath(`/tracker/${requestId}`);
  redirect(`/tracker/${requestId}`);
}
