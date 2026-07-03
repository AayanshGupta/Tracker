import bcrypt from "bcryptjs";

import { PrismaClient, type Permission } from "@prisma/client";

const prisma = new PrismaClient();

const password = "Password123!";
const adminEmail = "aayansh.gupta@asbl.in";
const adminPermissions: Permission[] = [
  "REQUEST_CREATE",
  "REQUEST_ASSIGN",
  "REQUEST_APPROVE",
  "REQUEST_EDIT_ALL",
  "WORKLOAD_VIEW",
  "CALENDAR_MANAGE",
  "AUDIT_VIEW",
  "USER_MANAGE"
];

const demoEmails = [
  "admin@company.com",
  "manager@company.com",
  "lead@company.com",
  "analyst.one@company.com",
  "analyst.two@company.com",
  "requester@company.com"
];

const demoReferences = ["REQ-2026-001", "REQ-2026-002", "REQ-2026-003", "REQ-2026-004"];
const demoTeamCodes = ["INS", "CRA", "FIN"];

async function ensureAayanshAdmin() {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Aayansh Gupta",
      role: "ADMIN",
      title: "Admin",
      active: true,
      teamId: null,
      passwordHash
    },
    create: {
      email: adminEmail,
      name: "Aayansh Gupta",
      role: "ADMIN",
      title: "Admin",
      active: true,
      passwordHash
    }
  });

  await prisma.userPermission.deleteMany({ where: { userId: user.id } });
  await prisma.userPermission.createMany({
    data: adminPermissions.map((permission) => ({
      userId: user.id,
      permission,
      grantedBy: "seed"
    }))
  });

  return user;
}

async function removeDemoData() {
  const demoRequests = await prisma.workRequest.findMany({
    where: { reference: { in: demoReferences } },
    select: { id: true }
  });
  const demoRequestIds = demoRequests.map((request) => request.id);

  if (demoRequestIds.length) {
    await prisma.auditLog.deleteMany({ where: { requestId: { in: demoRequestIds } } });
    await prisma.calendarEvent.deleteMany({ where: { requestId: { in: demoRequestIds } } });
    await prisma.reportDeliverable.deleteMany({ where: { requestId: { in: demoRequestIds } } });
    await prisma.assignment.deleteMany({ where: { requestId: { in: demoRequestIds } } });
    await prisma.workRequest.deleteMany({ where: { id: { in: demoRequestIds } } });
  }

  const demoUsers = await prisma.user.findMany({
    where: { email: { in: demoEmails } },
    select: { id: true }
  });
  const demoUserIds = demoUsers.map((user) => user.id);

  if (demoUserIds.length) {
    await prisma.auditLog.deleteMany({ where: { actorId: { in: demoUserIds } } });
    await prisma.calendarEvent.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.capacityEntry.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.assignment.deleteMany({ where: { assigneeId: { in: demoUserIds } } });
    await prisma.userPermission.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.session.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.account.deleteMany({ where: { userId: { in: demoUserIds } } });
    await prisma.workRequest.updateMany({
      where: { ownerId: { in: demoUserIds } },
      data: { ownerId: null }
    });
    await prisma.user.deleteMany({ where: { id: { in: demoUserIds } } });
  }

  await prisma.team.deleteMany({ where: { code: { in: demoTeamCodes } } });
}

async function main() {
  const admin = await ensureAayanshAdmin();
  await removeDemoData();

  console.log(`Seed complete. Login with ${admin.email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
