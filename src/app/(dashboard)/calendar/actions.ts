"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/server/audit";

const calendarStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum(["SUBMITTED", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "UPDATE_NEEDED", "ON_HOLD", "DELAYED"])
});

const assignmentStatusByRequestStatus = {
  SUBMITTED: "ACTIVE",
  IN_PROGRESS: "ACTIVE",
  UPDATE_NEEDED: "ACTIVE",
  ON_HOLD: "PAUSED",
  DELAYED: "PAUSED",
  IN_REVIEW: "ACTIVE",
  COMPLETED: "DONE"
} as const;

export async function updateCalendarRequestStatusAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = calendarStatusSchema.parse(Object.fromEntries(formData));
  const assignment = await prisma.assignment.findFirst({
    where: {
      requestId: parsed.requestId,
      assigneeId: session.user.id
    },
    include: { request: { select: { status: true } } }
  });

  if (!assignment) redirect("/calendar");

  await prisma.$transaction([
    prisma.workRequest.update({
      where: { id: parsed.requestId },
      data: {
        status: parsed.status,
        completedAt: parsed.status === "COMPLETED" ? new Date() : null
      }
    }),
    prisma.assignment.update({
      where: { id: assignment.id },
      data: {
        status: assignmentStatusByRequestStatus[parsed.status],
        roleNote: parsed.status === "COMPLETED" ? "Done" : "Status updated from calendar"
      }
    })
  ]);

  await writeAuditLog({
    actorId: session.user.id,
    requestId: parsed.requestId,
    action: "STATUS_UPDATED",
    entityType: "WorkRequest",
    entityId: parsed.requestId,
    before: { status: assignment.request.status },
    after: { status: parsed.status }
  });

  revalidatePath("/dashboard");
  revalidatePath("/tracker");
  revalidatePath("/calendar");
}
