import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Support email must be set via NEXT_PUBLIC_SUPPORT_EMAIL environment variable
const adminEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "";


export default function ForgotPasswordPage() {
  return (
    <main className="premium-bg flex min-h-dvh items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-normal">Password Reset</h1>
        <p className="mt-3 text-sm text-muted-foreground">Password reset requests go to the admin account.</p>
        {adminEmail ? (
          <Button asChild className="mt-6 w-full">
            <Link href={`mailto:${adminEmail}?subject=Task Tracker Password Reset`}>
              Contact admin
            </Link>
          </Button>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Please contact your system administrator directly.
          </p>
        )}
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </Card>
    </main>
  );
}
