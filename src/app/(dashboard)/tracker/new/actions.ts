"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/server/audit";

const requestSchema = z.object({
  title: z.string().min(4),
  description: z.string().trim().optional(),
  outputType: z.string().min(2),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().min(10),
  assigneeId: z.string().optional()
});

export async function createRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user, "REQUEST_CREATE")) redirect("/dashboard");

  const parsed = requestSchema.parse(Object.fromEntries(formData));
  const count = await prisma.workRequest.count();
  const reference = `REQ-2026-${String(count + 1).padStart(3, "0")}`;
  const fallbackTeam = await prisma.team.findFirst({ orderBy: { name: "asc" } });
  const assigneeId = parsed.assigneeId || null;

  const request = await prisma.workRequest.create({
    data: {
      reference,
      title: parsed.title,
      description: parsed.description || "No additional details provided.",
      outputType: parsed.outputType,
      reportType: "AD_HOC",
      priority: parsed.priority,
      dueDate: new Date(parsed.dueDate),
      estimatedHours: 1,
      requestedById: session.user.id,
      ownerId: assigneeId,
      teamId: session.user.teamId ?? fallbackTeam?.id,
      tags: [],
      ...(assigneeId
        ? {
            assignments: {
              create: {
                assigneeId,
                allocatedHours: 1,
                startDate: new Date(),
                endDate: new Date(parsed.dueDate),
                status: "PLANNED",
                roleNote: "Pending acceptance"
              }
            }
          }
        : {})
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    requestId: request.id,
    action: "REQUEST_CREATED",
    entityType: "WorkRequest",
    entityId: request.id,
    after: {
      reference: request.reference,
      status: request.status,
      priority: request.priority
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/tracker");
  revalidatePath("/calendar");
  redirect("/tracker");
}
