"use client";

import { Trash2 } from "lucide-react";

import { deleteRequestAction } from "@/app/(dashboard)/tracker/actions";
import { Button } from "@/components/ui/button";

export function DeleteRequestButton({ requestId, title }: { requestId: string; title: string }) {
  return (
    <form
      action={deleteRequestAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="requestId" value={requestId} />
      <Button type="submit" size="sm" variant="destructive">
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </form>
  );
}
