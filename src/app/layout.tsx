import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Database Tracker",
  description: "Role-based work allocation, approvals, and schedule tracking."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
