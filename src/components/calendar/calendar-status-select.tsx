"use client";

import type { RequestStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateCalendarRequestStatusAction } from "@/app/(dashboard)/calendar/actions";
import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/formatters";
import { statusVariant } from "@/lib/status";

const statusOptions: Array<{ label: string; value: RequestStatus }> = [
  { label: "Pending", value: "SUBMITTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Update Needed", value: "UPDATE_NEEDED" },
  { label: "On hold", value: "ON_HOLD" },
  { label: "Delayed", value: "DELAYED" },
  { label: "Review", value: "IN_REVIEW" },
  { label: "Done", value: "COMPLETED" }
];

export function CalendarStatusSelect({
  requestId,
  status
}: {
  requestId: string;
  status: RequestStatus;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-2 space-y-1.5" onClick={(event) => event.stopPropagation()}>
      <Badge variant={statusVariant(currentStatus)} className="max-w-full">
        {titleCase(currentStatus)}
      </Badge>
      <select
        aria-label="Update task status"
        value={currentStatus}
        disabled={isPending}
        className="h-8 w-full rounded-md border border-current/30 bg-white/80 px-2 text-xs font-semibold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-current/30 disabled:opacity-60"
        onChange={(event) => {
          const nextStatus = event.target.value as RequestStatus;
          setCurrentStatus(nextStatus);
          const formData = new FormData();
          formData.set("requestId", requestId);
          formData.set("status", nextStatus);
          startTransition(() => {
            void updateCalendarRequestStatusAction(formData).then(() => router.refresh());
          });
        }}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
