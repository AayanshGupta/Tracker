"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Permission, Role } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { allPermissions, hasPermission } from "@/lib/permissions";
import { writeAuditLog } from "@/server/audit";

const roles = ["ADMIN", "MANAGER", "LEAD", "ANALYST", "REQUESTER", "VIEWER"] as const;

async function requireUserManager() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user, "USER_MANAGE")) redirect("/dashboard");
  return session.user;
}

function permissionValues(formData: FormData) {
  const submitted = new Set(formData.getAll("permissions").map(String));
  return allPermissions.filter((permission) => submitted.has(permission));
}

async function replacePermissions(userId: string, permissions: Permission[], grantedBy: string) {
  await prisma.userPermission.deleteMany({ where: { userId } });
  if (permissions.length) {
    await prisma.userPermission.createMany({
      data: permissions.map((permission) => ({ userId, permission, grantedBy }))
    });
  }
}

const memberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(roles),
  password: z.string().min(8)
});

export async function createMemberAction(formData: FormData) {
  const actor = await requireUserManager();
  const parsed = memberSchema.parse(Object.fromEntries(formData));
  const passwordHash = await bcrypt.hash(parsed.password, 12);

  const user = await prisma.user.upsert({
    where: { email: parsed.email.toLowerCase() },
    update: {
      name: parsed.name,
      role: parsed.role as Role,
      passwordHash,
      active: true
    },
    create: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      role: parsed.role as Role,
      passwordHash,
      active: true
    }
  });

  await replacePermissions(user.id, permissionValues(formData), actor.id);
  await writeAuditLog({
    actorId: actor.id,
    action: "MEMBER_CREATED",
    entityType: "User",
    entityId: user.id,
    after: { email: user.email, role: user.role }
  });

  revalidatePath("/members");
  redirect("/members");
}

const updateSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(roles),
  password: z.string().optional(),
  active: z.string().optional()
});

export async function updateMemberAction(formData: FormData) {
  const actor = await requireUserManager();
  const parsed = updateSchema.parse(Object.fromEntries(formData));
  const password = parsed.password?.trim();

  const before = await prisma.user.findUnique({ where: { id: parsed.userId }, include: { permissions: true } });
  if (!before) redirect("/members");

  const user = await prisma.user.update({
    where: { id: parsed.userId },
    data: {
      name: parsed.name,
      email: parsed.email.toLowerCase(),
      role: parsed.role as Role,
      active: parsed.active === "on",
      ...(password ? { passwordHash: await bcrypt.hash(password, 12) } : {})
    }
  });

  const permissions = permissionValues(formData);
  await replacePermissions(user.id, permissions, actor.id);
  await writeAuditLog({
    actorId: actor.id,
    action: "MEMBER_UPDATED",
    entityType: "User",
    entityId: user.id,
    before: { email: before.email, role: before.role, active: before.active },
    after: { email: user.email, role: user.role, active: user.active, permissions }
  });

  revalidatePath("/members");
  redirect("/members");
}

export async function removeMemberAction(formData: FormData) {
  const actor = await requireUserManager();
  const userId = String(formData.get("userId") ?? "");
  if (!userId || userId === actor.id) redirect("/members");
  const now = new Date();

  await prisma.assignment.deleteMany({
    where: {
      assigneeId: userId,
      endDate: { gte: now }
    }
  });

  await prisma.calendarEvent.deleteMany({
    where: {
      userId,
      startsAt: { gte: now }
    }
  });

  await prisma.workRequest.updateMany({
    where: {
      ownerId: userId,
      dueDate: { gte: now },
      status: { notIn: ["COMPLETED", "CANCELLED"] }
    },
    data: { ownerId: null }
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      active: false,
      sessions: { deleteMany: {} }
    }
  });

  await writeAuditLog({
    actorId: actor.id,
    action: "MEMBER_REMOVED",
    entityType: "User",
    entityId: user.id,
    after: { active: false }
  });

  revalidatePath("/members");
  redirect("/members");
}
