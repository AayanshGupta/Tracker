import type { Permission, Role, User } from "@prisma/client";

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    "REQUEST_CREATE",
    "REQUEST_ASSIGN",
    "REQUEST_APPROVE",
    "REQUEST_EDIT_ALL",
    "WORKLOAD_VIEW",
    "CALENDAR_MANAGE",
    "AUDIT_VIEW",
    "USER_MANAGE"
  ],
  MANAGER: ["REQUEST_CREATE", "REQUEST_ASSIGN", "REQUEST_APPROVE", "REQUEST_EDIT_ALL", "WORKLOAD_VIEW", "CALENDAR_MANAGE", "AUDIT_VIEW"],
  LEAD: ["REQUEST_CREATE", "REQUEST_ASSIGN", "REQUEST_APPROVE", "WORKLOAD_VIEW", "CALENDAR_MANAGE"],
  ANALYST: ["REQUEST_CREATE", "WORKLOAD_VIEW"],
  REQUESTER: ["REQUEST_CREATE"],
  VIEWER: ["WORKLOAD_VIEW"]
};

type PermissionUser = Pick<User, "role"> & {
  permissions?: Array<{ permission: Permission } | Permission>;
};

export function hasPermission(user: PermissionUser | null | undefined, permission: Permission) {
  if (!user) return false;
  const direct = user.permissions?.some((grant) => (typeof grant === "string" ? grant : grant.permission) === permission);
  return Boolean(direct || rolePermissions[user.role].includes(permission));
}

export const allPermissions: Permission[] = [
  "REQUEST_CREATE",
  "REQUEST_ASSIGN",
  "REQUEST_APPROVE",
  "REQUEST_EDIT_ALL",
  "WORKLOAD_VIEW",
  "CALENDAR_MANAGE",
  "AUDIT_VIEW",
  "USER_MANAGE"
];

export function roleLabel(role: Role) {
  if (role === "ANALYST") return "Employee";
  if (role === "REQUESTER") return "User";

  return role
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
