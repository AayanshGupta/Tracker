import { format, formatDistanceToNowStrict, isPast } from "date-fns";

export function formatDate(date: Date) {
  return format(date, "MMM d, yyyy");
}

export function formatDateTime(date: Date) {
  return format(date, "MMM d, yyyy h:mm a");
}

export function dueLabel(date: Date) {
  if (isPast(date)) return `Overdue by ${formatDistanceToNowStrict(date)}`;
  return `Due in ${formatDistanceToNowStrict(date)}`;
}

export function titleCase(value: string) {
  if (value === "CANCELLED") return "Dropped";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
