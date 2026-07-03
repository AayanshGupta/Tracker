Database Tracker - Design Documentation
Architecture Overview
Database Tracker is a production-ready work intake, allocation, and workload planning system built with a modern full-stack JavaScript/TypeScript stack. The application supports role-based access control, audit logging, calendar management, and capacity planning for teams.
Tech Stack


Frontend Framework: Next.js 15 (App Router)

Language: TypeScript (strict mode)

Styling: Tailwind CSS with HSL color variables

UI Components: shadcn/ui-style components with Radix UI primitives

Database: PostgreSQL

ORM: Prisma

Authentication: Auth.js (credentials provider) with Prisma adapter

Icons: Lucide React

Form Handling: React Hook Form + Zod validation

Date Utilities: date-fns
Design Patterns & Architecture
1. Layered Architecture
├── Presentation Layer (React Components)
│   ├── Pages (App Router routes)
│   ├── Components (UI, Feature, Layout)
│   └── Hooks (Custom logic)
├── Business Logic Layer
│   ├── Server Actions
│   ├── API Routes
│   └── Utilities
├── Data Access Layer
│   ├── Prisma Client
│   └── Database
└── Authentication & Authorization
    ├── Auth.js Middleware
    ├── Permission Helpers
    └── Role-Based Access Control

2. Authentication & Authorization
Authentication Flow:


Credentials-based login via Auth.js

Password hashing with bcryptjs

Session management through Prisma adapter

Protected routes enforce authentication
Authorization Model:


Role-Based: Users have a role (ADMIN, MANAGER, LEAD, ANALYST, REQUESTER)

Permission-Based: Fine-grained permissions granted per user (REQUEST_CREATE, REQUEST_ASSIGN, REQUEST_APPROVE, etc.)

Direct Grants: Permissions can be granted directly to users regardless of role
Permission Types:


REQUEST_CREATE — Create new work requests

REQUEST_ASSIGN — Assign requests to team members

REQUEST_APPROVE — Approve requests

REQUEST_EDIT_ALL — Edit any request (not just own)

WORKLOAD_VIEW — Access workload screens

CALENDAR_MANAGE — Create/manage calendar events

AUDIT_VIEW — Access audit log

USER_MANAGE — Manage users and permissions
Data Model
Core Entities
User
- id (PK)
- email (unique)
- name
- role (ADMIN, MANAGER, LEAD, ANALYST, REQUESTER)
- title
- teamId (FK → Team)
- passwordHash
- active (boolean)
- createdAt, updatedAt

Team
- id (PK)
- code (e.g., "CRA", "FIN", "INS")
- name
- description
- active
- createdAt, updatedAt

WorkRequest
- id (PK)
- reference (unique, e.g., "REQ-2026-001")
- title
- description
- status (DRAFT, SUBMITTED, APPROVED, IN_PROGRESS, COMPLETED, CLOSED)
- priority (LOW, MEDIUM, HIGH, CRITICAL)
- ownerId (FK → User)
- teamId (FK → Team)
- dueDate
- completionDate
- createdAt, updatedAt

Assignment
- id (PK)
- requestId (FK → WorkRequest)
- assigneeId (FK → User)
- status (PENDING, ACCEPTED, IN_PROGRESS, SUBMITTED, APPROVED, COMPLETED)
- allocationPercentage
- startDate, endDate
- notes
- createdAt, updatedAt

ReportDeliverable
- id (PK)
- requestId (FK → WorkRequest)
- assignmentId (FK → Assignment)
- title
- format (PDF, XLSX, POWERPOINT, DASHBOARD)
- status (PENDING, IN_PROGRESS, COMPLETED, SUBMITTED)
- dueDate
- submittedDate
- notes
- createdAt, updatedAt

CalendarEvent
- id (PK)
- userId (FK → User)
- requestId (FK → WorkRequest, optional)
- type (DEADLINE, REVIEW, CAPACITY_HOLD, LEAVE, LAUNCH)
- title
- description
- startDate, endDate
- allDay
- createdAt, updatedAt

CapacityEntry
- id (PK)
- userId (FK → User)
- month (YYYY-MM)
- allocatedPercentage (0-100)
- notes
- createdAt, updatedAt

UserPermission
- id (PK)
- userId (FK → User)
- permission (enum of permission types)
- grantedBy (user email or "seed")
- createdAt

AuditLog
- id (PK)
- actorId (FK → User)
- action (string describing the change)
- entityType (WorkRequest, Assignment, User, etc.)
- entityId
- requestId (FK → WorkRequest, optional)
- metadata (JSON for additional context)
- createdAt

Component Architecture
Page Structure (App Router)
src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── logout/route.ts
├── (dashboard)/
│   ├── layout.tsx (authenticated layout)
│   ├── page.tsx (dashboard)
│   ├── requests/
│   │   ├── page.tsx (request list)
│   │   ├── [id]/page.tsx (request detail)
│   │   └── new/page.tsx (create request)
│   ├── workload/page.tsx
│   ├── calendar/page.tsx
│   ├── audit/page.tsx
│   └── settings/page.tsx
└── api/
    ├── auth/ (Auth.js routes)
    └── ...

Component Organization
src/components/
├── ui/ (Radix UI + Tailwind primitives)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── tabs.tsx
│   └── avatar.tsx
├── layout/
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── navigation.tsx
│   └── authenticated-layout.tsx
├── features/
│   ├── requests/
│   │   ├── request-list.tsx
│   │   ├── request-card.tsx
│   │   ├── request-form.tsx
│   │   └── request-detail.tsx
│   ├── workload/
│   │   ├── workload-grid.tsx
│   │   ├── utilization-chart.tsx
│   │   └── assignment-card.tsx
│   ├── calendar/
│   │   ├── calendar-view.tsx
│   │   ├── event-item.tsx
│   │   └── event-form.tsx
│   ├── audit/
│   │   ├── audit-table.tsx
│   │   └── audit-filters.tsx
│   └── dashboard/
│       ├── metrics-panel.tsx
│       ├── request-snapshot.tsx
│       ├── calendar-pulse.tsx
│       └── audit-feed.tsx
└── common/
    ├── loading.tsx
    ├── error-boundary.tsx
    └── status-badge.tsx

Styling Strategy
Color System
The application uses HSL CSS variables for theming, supporting both light and dark modes:
--border: 214 31% 89%
--input: 214 32% 91%
--ring: 217 91% 60%
--background: 0 0% 100%
--foreground: 222 84% 5%
--primary: 217 91% 60%
--primary-foreground: 210 40% 98%
--secondary: 217 32% 17%
--secondary-foreground: 210 40% 98%
--muted: 210 11% 71%
--muted-foreground: 215 14% 34%
--accent: 217 91% 60%
--accent-foreground: 210 40% 98%
--destructive: 0 84% 60%
--destructive-foreground: 210 40% 98%
--card: 0 0% 100%
--card-foreground: 222 84% 5%

Dark Mode
Dark mode is enabled via the class strategy:
// tailwind.config.ts
darkMode: ["class"]

Apply dark mode by adding dark class to root element.
Spacing & Typography


Radius: --radius (customizable, default ~0.5rem)

Shadow: soft: 0 18px 60px rgb(15 23 42 / 0.08)

Font Stack: System defaults (configured in global CSS)
Component Styling Philosophy


Base Components: Use shadcn/ui style (Radix UI + Tailwind)

Consistent Classes: Use clsx and tailwind-merge for conditional styling

Semantic HTML: Maintain accessibility standards

Responsive Design: Mobile-first with md:, lg:, xl: breakpoints

Dark Mode Ready: All components support dark: utilities
Key Features & Workflows
1. Request Management
Workflow:


Requester creates a WorkRequest (title, description, priority, due date)

Request enters DRAFT status

Manager/Admin can SUBMIT, APPROVE, or REJECT

Once approved, request enters IN_PROGRESS

Team members are assigned deliverables

Assignments progress: PENDING → ACCEPTED → IN_PROGRESS → SUBMITTED → APPROVED → COMPLETED

Request closes when all deliverables complete
Key Business Logic:


Only authorized users can create/edit/assign requests

Due dates cascade to assignments and deliverables

Audit logs track all status changes and edits
2. Workload Management
Features:


View capacity by user (allocation percentage per month)

Display current assignments and utilization

Show available capacity windows

Flag over-allocation scenarios
Screens:


Utilization chart (team overview)

Individual workload cards (person view)

Capacity planning calendar
3. Calendar & Scheduling
Event Types:


DEADLINE — Request or deliverable due date

REVIEW — Approval/review session

CAPACITY_HOLD — Reserved for planned work

LEAVE — Team member unavailable

LAUNCH — Project go-live or milestone
Features:


Multi-view (month, week, day)

Color-coded by event type

Conflict detection (overlapping capacity holds)

Filter by team or person
4. Audit & Compliance
Logged Actions:


Request created/updated/approved

Assignments accepted/completed

Deliverables submitted

Permissions granted

User account changes
Audit Entry Structure:
{
  actorId: string
  action: "Request Approved" | "Assignment Completed" | ...
  entityType: "WorkRequest" | "Assignment" | "User" | ...
  entityId: string
  requestId?: string
  metadata?: {
    previousStatus?: string
    newStatus?: string
    [key]: any
  }
  createdAt: Date
}

Access Control:


Only AUDIT_VIEW permission holders can view audit logs

Audit logs are immutable (append-only)
5. Role & Permission System
Default Roles:
Role Typical Permissions Purpose ADMIN All System administration MANAGER REQUEST_CREATE, REQUEST_ASSIGN, REQUEST_APPROVE, WORKLOAD_VIEW, CALENDAR_MANAGE Team coordination LEAD REQUEST_CREATE, REQUEST_ASSIGN, WORKLOAD_VIEW Project leadership ANALYST REQUEST_CREATE, WORKLOAD_VIEW Individual contributor REQUESTER REQUEST_CREATE Business stakeholder
Permission Flexibility:


Roles are templates; individual permissions are the source of truth

Any permission can be granted/revoked directly on a user record

Enables granular access control without role proliferation
Development Patterns
Server Actions
// lib/actions/request.ts
"use server"

export async function createRequest(data: CreateRequestInput) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  
  // Verify permission
  const hasPermission = await canUserCreateRequest(session.user.id)
  if (!hasPermission) throw new Error("Forbidden")
  
  // Create and audit
  const request = await prisma.workRequest.create({ data })
  await auditLog(session.user.id, "Request Created", "WorkRequest", request.id)
  
  return request
}

Permission Helpers
// lib/permissions.ts
export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const userPerms = await prisma.userPermission.findMany({
    where: { userId, permission }
  })
  return userPerms.length > 0
}

export async function requirePermission(
  userId: string | undefined,
  permission: Permission
): Promise<void> {
  if (!userId) throw new Error("Unauthorized")
  const has = await hasPermission(userId, permission)
  if (!has) throw new Error("Insufficient permissions")
}

Audit Logging
// lib/audit.ts
export async function auditLog(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  requestId?: string,
  metadata?: Record<string, any>
) {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      entityType,
      entityId,
      requestId,
      metadata: metadata || {}
    }
  })
}

Form Validation
// lib/schemas.ts
import { z } from "zod"

export const createRequestSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.date(),
  teamId: z.string().uuid()
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>

Naming Conventions
Files & Directories


Components: PascalCase (e.g., RequestCard.tsx)

Pages: kebab-case (e.g., request-detail.tsx)

Utilities: camelCase (e.g., formatDate.ts)

Directories: kebab-case (e.g., ui/, features/, lib/)
Variables & Functions


Constants: UPPER_SNAKE_CASE (e.g., MAX_REQUESTS)

Functions: camelCase (e.g., getUserPermissions())

Types/Interfaces: PascalCase (e.g., WorkRequest, User)

Enums: PascalCase items (e.g., Permission.REQUEST_CREATE)
API/Routes


Server Actions: verb-noun (e.g., createRequest, approveAssignment)

API Routes: lowercase, hyphenated (e.g., /api/requests, /api/users)
Performance Considerations
Database Queries


N+1 Prevention: Use Prisma include and select to fetch related data

Pagination: Implement cursor-based or offset pagination for large lists

Indexes: Add indexes on frequently queried fields (email, status, teamId, dueDate)
Caching Strategy


Static Generation: Dashboard metrics can be ISR (Incremental Static Regeneration)

Session Caching: Auth.js handles session caching

Client-Side: Use React hooks for local state; SWR/React Query for remote
Bundle Optimization


Dynamic Imports: Use Next.js dynamic() for heavy features (calendar, charts)

Tree Shaking: Ensure utility imports are specific (not import *)

Code Splitting: Page routes automatically code-split in Next.js App Router
Security Best Practices


Authentication


Always verify session with auth() before sensitive operations

Use requirePermission() guard in server actions

Clear sessions on logout

Authorization


Check permissions server-side, never trust client-side

Implement role-based defaults with permission overrides

Audit all permission changes

Data Protection


Hash passwords with bcryptjs (rounds ≥ 10)

Never log sensitive fields in audit records

Use environment variables for secrets (DATABASE_URL, AUTH_SECRET)

Input Validation


Validate all form inputs with Zod schemas

Sanitize user content before display

Use parameterized queries (Prisma handles this)

Error Handling


Don't leak sensitive info in error messages

Log errors server-side with context

Show user-friendly error messages
Testing Strategy
Unit Tests


Utility functions, permission helpers, validation schemas

Use Jest + TypeScript
Integration Tests


Server actions, API routes, Prisma queries

Use test database or in-memory SQLite
E2E Tests


Critical workflows (login → create request → assign → complete)

Use Playwright or Cypress
Accessibility Tests


Keyboard navigation, screen reader support

Use axe or jest-axe
Deployment Checklist


[ ] Set environment variables (DATABASE_URL, AUTH_SECRET, AUTH_URL)

[ ] Run npm run db:deploy for database migrations

[ ] Build with npm run build

[ ] Test with npm start

[ ] Configure reverse proxy (Nginx/Cloudflare) for HTTPS

[ ] Set up monitoring and error tracking (Sentry, DataDog)

[ ] Configure backups for PostgreSQL

[ ] Enable audit logging for compliance
Future Enhancements


OAuth Integration — Add Google/Microsoft OAuth for easier login

Rich Notifications — Email/Slack alerts for request approvals, due dates

Reporting & Analytics — Burndown charts, team utilization reports, SLA tracking

Advanced Scheduling — Resource leveling, constraint-based scheduling

Mobile App — React Native companion for on-the-go task management

Integrations — Sync with Jira, Asana, or other PM tools

Real-time Collaboration — WebSocket updates for live dashboard

Custom Workflows — Define request approval chains dynamically