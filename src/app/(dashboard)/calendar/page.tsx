import { auth } from "@/auth";
import { CalendarList } from "@/components/calendar/calendar-list";
import { getCalendarScheduleData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function CalendarPage({ searchParams }: { searchParams?: Promise<{ memberId?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const selectedMemberId = params?.memberId || undefined;
  const { users, requests } = await getCalendarScheduleData(selectedMemberId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Calendar
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Task deadlines by default, with member color-coding for schedule review.
        </p>
      </div>
      <CalendarList requests={requests} users={users} selectedMemberId={selectedMemberId} currentUserId={session?.user?.id} />
    </div>
  );
}
