import { addDays, startOfWeek } from "date-fns";
import type { Session } from "next-auth";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

const adminLogFilter: Prisma.AuditLogWhereInput = {
  action: { notIn: ["MEMBER_CREATED", "MEMBER_UPDATED", "MEMBER_REMOVED"] }
};

const visibleTrackerFilter: Prisma.WorkRequestWhereInput = {
  requestedBy: { active: true },
  OR: [
    { assignments: { none: {} } },
    { assignments: { some: { status: { not: "PLANNED" }, assignee: { active: true } } } }
  ]
};

export async function getDashboardData(session?: Session | null) {
  const canManageUsers = hasPermission(session?.user, "USER_MANAGE");
  const [requests, capacity, events, auditLogs] = await Promise.all([
    prisma.workRequest.findMany({
      where: visibleTrackerFilter,
      include: {
        owner: true,
        requestedBy: true,
        team: true,
        assignments: {
          where: { assignee: { active: true } },
          include: { assignee: true }
        }
      },
      orderBy: [{ dueDate: "asc" }],
      take: 80
    }),
    prisma.capacityEntry.findMany({
      include: { user: { include: { team: true } } },
      orderBy: [{ weekStart: "desc" }, { user: { name: "asc" } }],
      take: 40
    }),
    prisma.calendarEvent.findMany({
      include: { request: true, user: true },
      where: { startsAt: { gte: addDays(new Date(), -7) } },
      orderBy: { startsAt: "asc" },
      take: 30
    }),
    prisma.auditLog.findMany({
      where: canManageUsers ? undefined : adminLogFilter,
      include: { actor: true, request: true },
      orderBy: { createdAt: "desc" },
      take: 25
    })
  ]);

  return { requests, capacity, events, auditLogs };
}

export async function getTrackerData(session?: Session | null) {
  const canManageUsers = hasPermission(session?.user, "USER_MANAGE");
  const visibilityFilter: Prisma.WorkRequestWhereInput = canManageUsers
    ? { requestedBy: { active: true } }
    : {
        requestedBy: { active: true },
        OR: [
          ...(session?.user?.id ? [{ requestedById: session.user.id }] : []),
          { assignments: { none: {} } },
          { assignments: { some: { status: { not: "PLANNED" as const }, assignee: { active: true } } } }
        ]
      };

  return prisma.workRequest.findMany({
    where: visibilityFilter,
    include: {
      requestedBy: true,
      owner: true,
      team: true,
      reports: true,
      assignments: {
        where: { assignee: { active: true } },
        include: { assignee: true }
      }
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }]
  });
}

export async function getMyPendingWork(userId: string) {
  return prisma.workRequest.findMany({
    where: {
      requestedBy: { active: true },
      assignments: { some: { assigneeId: userId, status: "PLANNED" } }
    },
    include: {
      requestedBy: true,
      owner: true,
      team: true,
      reports: true,
      assignments: {
        where: { assignee: { active: true } },
        include: { assignee: true }
      }
    },
    orderBy: [{ dueDate: "asc" }]
  });
}

export async function getAssignableUsers() {
  return prisma.user.findMany({
    where: {
      active: true,
      role: { in: ["ADMIN", "MANAGER", "LEAD", "ANALYST"] }
    },
    orderBy: [{ name: "asc" }]
  });
}

export async function getWorkloadData() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  return prisma.user.findMany({
    where: { active: true, role: { in: ["ADMIN", "MANAGER", "LEAD", "ANALYST"] } },
    include: {
      team: true,
      capacityEntries: {
        where: { weekStart: { gte: weekStart } },
        orderBy: { weekStart: "asc" },
        take: 4
      },
      assignments: {
        where: { endDate: { gte: weekStart } },
        include: { request: true },
        orderBy: { endDate: "asc" }
      }
    },
    orderBy: [{ team: { name: "asc" } }, { name: "asc" }]
  });
}

export async function getCalendarData() {
  return prisma.calendarEvent.findMany({
    include: { request: true, user: true },
    orderBy: { startsAt: "asc" },
    take: 100
  });
}

export async function getCalendarScheduleData(memberId?: string) {
  const [users, requests] = await Promise.all([
    prisma.user.findMany({
      where: { active: true },
      include: { team: true },
      orderBy: [{ name: "asc" }]
    }),
    prisma.workRequest.findMany({
      where: memberId
        ? {
            requestedBy: { active: true },
            assignments: {
              some: { assigneeId: memberId }
            }
          }
        : { requestedBy: { active: true } },
      include: {
        owner: true,
        assignments: {
          where: { assignee: { active: true } },
          include: { assignee: true }
        }
      },
      orderBy: [{ dueDate: "asc" }]
    })
  ]);

  return { users, requests };
}

export async function getAuditData(session?: Session | null) {
  const canManageUsers = hasPermission(session?.user, "USER_MANAGE");
  return prisma.auditLog.findMany({
    where: canManageUsers ? undefined : adminLogFilter,
    include: { actor: true, request: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function getMemberAdminData() {
  const [users, teams] = await Promise.all([
    prisma.user.findMany({
      where: { active: true },
      include: { team: true, permissions: true },
      orderBy: [{ role: "asc" }, { name: "asc" }]
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } })
  ]);

  return { users, teams };
}
