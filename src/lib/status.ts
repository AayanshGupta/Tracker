import type { RequestPriority, RequestStatus } from "@prisma/client";

export function statusVariant(status: RequestStatus) {
  if (status === "COMPLETED") return "success";
  if (status === "BLOCKED" || status === "CANCELLED" || status === "DELAYED") return "danger";
  if (status === "IN_REVIEW" || status === "IN_PROGRESS") return "info";
  if (status === "TRIAGED" || status === "UPDATE_NEEDED" || status === "ON_HOLD") return "warning";
  return "secondary";
}

export function priorityVariant(priority: RequestPriority) {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "secondary";
}
