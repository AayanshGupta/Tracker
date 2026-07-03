import Link from "next/link";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import type { Assignment, Team, User, WorkRequest } from "@prisma/client";

import { CalendarStatusSelect } from "@/components/calendar/calendar-status-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { titleCase } from "@/lib/formatters";
import { statusVariant } from "@/lib/status";
import { cn } from "@/lib/utils";

type CalendarUser = User & { team: Team | null };
type CalendarRequest = WorkRequest & {
  owner: User | null;
  assignments: Array<Assignment & { assignee: User }>;
};

const memberColors = [
  "border-[#2b78d0] bg-[#96C5F7] text-[#10243d]",
  "border-[#43624a] bg-[#6C756B] text-white",
  "border-[#577785] bg-[#93ACB5] text-[#172327]",
  "border-[#467eb5] bg-[#A9D3FF] text-[#10243d]",
  "border-[#8b6f2d] bg-[#f3c96f] text-[#33260a]",
  "border-[#b24a60] bg-[#f4a6b8] text-[#3b111b]"
];

function colorForUser(userId: string | undefined, users: CalendarUser[]) {
  if (!userId) return "border-[#93ACB5] bg-[#F2F4FF] text-[#2f352e]";
  const index = Math.max(0, users.findIndex((user) => user.id === userId));
  return memberColors[index % memberColors.length];
}

export function CalendarList({
  requests,
  users,
  selectedMemberId,
  currentUserId
}: {
  requests: CalendarRequest[];
  users: CalendarUser[];
  selectedMemberId?: string;
  currentUserId?: string;
}) {
  const month = new Date();
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month))
  });
  const selectedUser = users.find((user) => user.id === selectedMemberId);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-normal">{format(month, "MMMM yyyy")}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedUser ? `${selectedUser.name}'s schedule` : "Task deadlines across all members"}
          </p>
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" action="/calendar">
          <select name="memberId" defaultValue={selectedMemberId ?? ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All task deadlines</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name ?? user.email}</option>
            ))}
          </select>
          <Button type="submit">Filter</Button>
          <Button asChild variant="outline">
            <Link href="/calendar">Reset</Link>
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {users.slice(0, 8).map((user) => (
          <Badge key={user.id} variant="outline" className={cn("gap-2", colorForUser(user.id, users))}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {user.name ?? user.email}
          </Badge>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold uppercase text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7">
            {days.map((day) => {
              const dayRequests = requests.filter((request) => isSameDay(request.dueDate, day));

              return (
                <div key={day.toISOString()} className={cn("min-h-36 border-b border-r p-3", !isSameMonth(day, month) && "bg-muted/20 text-muted-foreground")}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className={cn("text-sm font-semibold", isToday(day) && "rounded-full bg-primary px-2 py-1 text-primary-foreground")}>
                      {format(day, "d")}
                    </span>
                    {dayRequests.length ? <span className="text-xs text-muted-foreground">{dayRequests.length} due</span> : null}
                  </div>
                  <div className="space-y-2">
                    {dayRequests.slice(0, 4).map((request) => {
                      const assignee = request.assignments[0]?.assignee ?? request.owner;
                      const canUpdateStatus = request.assignments.some((assignment) => assignment.assigneeId === currentUserId);
                      return (
                        <div key={request.id} className={cn("rounded-md border px-2 py-1.5 text-xs", colorForUser(assignee?.id, users))}>
                          <p className="truncate font-semibold">{request.title}</p>
                          <p className="truncate opacity-80">{request.outputType} · {assignee?.name ?? "Unassigned"}</p>
                          {canUpdateStatus && request.status !== "CANCELLED" ? (
                            <CalendarStatusSelect requestId={request.id} status={request.status} />
                          ) : (
                            <Badge variant={statusVariant(request.status)} className="mt-2 max-w-full">
                              {titleCase(request.status)}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {requests.slice(0, 9).map((request) => {
          const canUpdateStatus = request.assignments.some((assignment) => assignment.assigneeId === currentUserId);
          return (
          <Card key={request.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{request.title}</p>
                <Badge variant="outline">{titleCase(request.priority)}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {format(request.dueDate, "MMM d")} · {request.outputType} · {request.assignments[0]?.assignee.name ?? request.owner?.name ?? "Unassigned"}
              </p>
              {canUpdateStatus && request.status !== "CANCELLED" ? (
                <CalendarStatusSelect requestId={request.id} status={request.status} />
              ) : (
                <Badge variant={statusVariant(request.status)} className="mt-2">{titleCase(request.status)}</Badge>
              )}
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
