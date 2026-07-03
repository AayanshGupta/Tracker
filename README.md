# Task Tracker

A production-ready internal work tracker for managing creative requests, team assignments, workload planning, report delivery, calendar events, approvals, and role-based access control.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui-style components |
| Database | PostgreSQL via Prisma ORM |
| Auth | Auth.js v5 (credentials provider + JWT) |
| Runtime | Node.js ≥ 20 |

---

## Project Structure

```
task-tracker/
├── design/                  ← Figma exports & design artefacts (not deployed)
├── prisma/
│   ├── migrations/          ← SQL migration history
│   ├── schema.prisma        ← Database schema
│   └── seed.ts              ← Development seed data
├── src/
│   ├── app/
│   │   ├── (auth)/          ← Login, forgot-password pages
│   │   ├── (dashboard)/     ← Protected app routes
│   │   │   ├── approval/
│   │   │   ├── audit/
│   │   │   ├── calendar/
│   │   │   ├── dashboard/
│   │   │   ├── members/
│   │   │   ├── tracker/
│   │   │   └── workload/
│   │   └── api/             ← API routes (auth handlers)
│   ├── components/          ← Feature UI components
│   ├── lib/                 ← Utilities, permissions, Prisma client
│   ├── server/              ← Server-side data queries
│   ├── types/               ← TypeScript type augmentations
│   └── auth.ts              ← NextAuth configuration
├── middleware.ts             ← Edge-layer route protection
├── .env.example             ← Environment variable template (safe to commit)
├── .env.production.example  ← Production deployment checklist
└── next.config.ts           ← Next.js config with security headers
```

---

## Local Development Setup

### Prerequisites
- Node.js ≥ 20
- PostgreSQL running locally (or Docker)

### Steps

```bash
# 1. Clone and install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set DATABASE_URL, AUTH_SECRET, AUTH_URL

# 3. Generate Prisma client
npm run db:generate

# 4. Run database migrations
npm run db:migrate

# 5. Seed development data
npm run db:seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Seed credentials are listed separately and shared by the project maintainer. Do not commit login credentials to the repository.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (development) |
| `npm run db:deploy` | Run migrations (production) |
| `npm run db:seed` | Seed development database |

---

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in the Vercel dashboard (see `.env.production.example`)
3. The build command is already configured: `prisma generate && next build`
4. Run `npm run db:deploy` once against your production database before the first deploy

### Other Platforms (Railway, Fly.io, Docker)

See `.env.production.example` for required environment variables and security notes.

**Before deploying:**
- [ ] Generate a strong `AUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set `DATABASE_URL` with `sslmode=require`
- [ ] Set `AUTH_URL` to your production domain
- [ ] Run `npm run db:deploy` to apply migrations

---

## Features

- **Request Tracker** — Intake, status tracking, priority, due dates, assignees, deliverables
- **Workload Board** — Team utilization and current assignment overview
- **Calendar** — Deadlines, reviews, capacity holds, leave windows, launches
- **Audit Log** — Full action history with role-based visibility
- **Approvals** — Report deliverable approval workflow
- **Members & Teams** — User management with fine-grained permissions
- **Auth** — Credentials-based login with bcrypt, JWT sessions, protected routes

---

## Security

- All routes under `/dashboard/*` require authentication (enforced at the edge via `middleware.ts`)
- Passwords are hashed with bcrypt
- Input is validated with Zod before any database query
- Prisma only logs errors in production (no query logging)
- Security HTTP headers applied via `next.config.ts`
