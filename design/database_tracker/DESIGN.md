---
name: Database Tracker
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
  border: hsl(214, 31%, 89%)
  input: hsl(214, 32%, 91%)
  ring: hsl(217, 91%, 60%)
  muted: hsl(210, 11%, 71%)
  destructive: hsl(0, 84%, 60%)
  success: '#10B981'
  warning: '#F59E0B'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system for this application is rooted in the **Corporate / Modern** aesthetic, specifically following the "shadcn/ui" philosophy. This approach prioritizes utility, clarity, and precision, essential for a system managing work intake, audit logs, and capacity planning. 

The brand personality is **reliable, systematic, and transparent**. It aims to evoke a sense of professional control and institutional trust. The interface uses a clean, high-contrast framework with a focus on data density without sacrificing legibility. 

**Key Principles:**
- **Clarity over Decoration:** Visual elements exist to organize information, not to distract.
- **Systematic Consistency:** Every component follows a strict logic to ensure the user feels grounded in a secure, production-ready environment.
- **Functional Sophistication:** Subtle use of micro-interactions and refinements (like fine borders and soft shadows) to indicate quality and modern tech-stack foundations.

## Colors

The palette is built on a foundation of high-contrast neutrals and a professional "Blue 600" primary. It is designed to work seamlessly across light and dark modes by utilizing HSL variables for dynamic shifting.

- **Primary (Blue 600):** Used for primary actions, active states, and focus rings. It signals progress and interactivity.
- **Secondary (Slate 900):** Provides deep grounding. In light mode, it is used for heavy text and headers; in dark mode, it forms the base of the UI structure.
- **Neutral/Muted:** A range of slates and grays used for borders, secondary text, and background surfaces to create a clear visual hierarchy.
- **Semantic Colors:** 
    - **Destructive:** Bright red for high-risk actions and "Critical" priority requests.
    - **Warning:** Amber for "High" priority and over-allocation alerts.
    - **Success:** Emerald for "Completed" or "Approved" statuses.

## Typography

This design system uses a functional, multi-font strategy to differentiate between content types:

- **Headlines (Hanken Grotesk):** Chosen for its sharp, contemporary geometry. It provides a modern "SaaS" feel to the application's page headers and dashboard metrics.
- **Body (Inter):** The workhorse of the UI. Highly legible, neutral, and optimized for screen reading. Used for all long-form text and UI controls.
- **Data & Labels (JetBrains Mono):** A technical monospaced font used specifically for IDs (e.g., "REQ-2026-001"), Audit Log timestamps, and status tags. This reinforces the "database" and "audit" nature of the product.

**Scale Rules:**
- Use `headline-xl` only for main dashboard overviews.
- Use `label-sm` for secondary metadata in cards and table headers.
- All interactive elements (buttons, inputs) should default to `body-sm` (14px) for high information density.

## Layout & Spacing

The system employs a **Fluid Grid** model built on a 4px baseline rhythm.

- **Desktop:** 12-column grid with a maximum container width of 1280px. Standard gutters are 24px (1.5rem).
- **Sidebar:** A fixed-width sidebar (280px) on desktop, transitioning to a collapsible drawer on mobile.
- **Dashboards:** Use a bento-box style layout for metrics panels where cards can span 3, 4, or 6 columns depending on the data complexity (e.g., Workload Charts require at least 6 columns).
- **Spacing Rhythm:** Use `stack-sm` (8px) for internal component elements (label to input), `stack-md` (16px) for spacing between cards, and `stack-lg` (32px) for section padding.

## Elevation & Depth

To maintain the clean "shadcn" aesthetic, this design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Levels:** 
    - **Background (Base):** Pure white (light) or deep slate (dark).
    - **Card/Surface:** A subtle contrast using a 1px border (`--border`) and a very soft, diffused shadow to indicate lift.
- **Shadow Profile:** The "Soft" shadow (0 18px 60px rgb(15 23 42 / 0.08)) is reserved for floating elements like Modals, Popovers, and Dropdown Menus.
- **Depth via Border:** Components like Input Fields and Data Tables use a 1px solid border in `--input` color. Active states are signaled by a 2px ring using the `--ring` variable.

## Shapes

The shape language is **Rounded**, striking a balance between approachable and professional.

- **Standard Radius:** 0.5rem (8px). This is applied to all Buttons, Input Fields, and Request Cards.
- **Large Radius:** 1rem (16px). Applied to the main Dashboard Container and Modal overlays.
- **Status Badges:** Use a full pill-shape (9999px) for status indicators (e.g., "APPROVED", "DRAFT") to distinguish them from interactive buttons.

## Components

### Request Cards
- **Structure:** Header with ID (Monospace) and Priority Badge. Body with Title and truncated Description. Footer with Progress bar and Assignee Avatar.
- **Visuals:** 1px border, white/dark-slate background, subtle hover transition (slight border-color shift).

### Data Tables (Audit Logs)
- **Header:** Sticky, muted background, 12px monospace text.
- **Rows:** Alternating "Zebra" stripes are avoided; use thin bottom borders instead. 
- **Cells:** Action-based text (e.g., "Request Approved") should be semi-bold.

### Workload Charts
- **Style:** Clean line or bar charts using the Primary Blue. Over-allocation ( > 100%) should be highlighted in Destructive Red.
- **Interaction:** Use tooltips with the "Soft Shadow" elevation and 0.5rem roundedness.

### Buttons & Controls
- **Primary:** Solid Primary Blue with Primary-Foreground text.
- **Secondary/Ghost:** Transparent background with `--secondary` text, turning to a light gray/slate on hover.
- **Inputs:** High-contrast focus state using `--ring`. Labels always use `body-sm` weight 500 for clarity.

### Status Badges
- **Draft:** Gray background/Dark Gray text.
- **In Progress:** Blue background/Blue text (low opacity BG).
- **Critical Priority:** Destructive Red background/White text.