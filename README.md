# Database Tracker

Production-ready starter for internal work intake, allocation, report delivery, workload planning, calendar tracking, approvals, and role-based access control.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- PostgreSQL
- Prisma
- Auth.js with credentials provider

## Local Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`.
2. Install dependencies with npm.
3. Run `npm run db:generate`.
4. Run `npm run db:migrate`.
5. Run `npm run db:seed`.
6. Start the app with `npm run dev`.

Seed login:

- Email: `aayansh.gupta@asbl.in`
- Password: `Password123!`

## Implemented Areas

- Prisma schema and SQL migration for users, teams, requests, assignments, deliverables, capacity, calendar, permissions, and audit logs.
- Auth.js credentials authentication with Prisma adapter and protected routes.
- Role-based permission helper with direct user permission grants.
- Dashboard with operational metrics, request snapshot, calendar pulse, and recent audit feed.
- Request tracker with status, priority, due dates, assignees, and deliverable counts.
- Workload screen with utilization and current assignments.
- Calendar view for deadlines, reviews, capacity holds, leave windows, and launches.
- Audit logging table and audit writer helper.
- Seed data for teams, users, permissions, requests, assignments, reports, capacity, events, and audit history.
# Tracker
# Tracker
