---
name: Obsidian Flux
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for deep focus and technical precision. It targets developers, data engineers, and system administrators who spend long hours monitoring complex database environments. The aesthetic is rooted in **Modern Corporate Minimalism** with a **High-Contrast Dark** overlay, prioritizing data legibility and reduced eye strain.

By utilizing a deep charcoal base with crisp, vibrant accents, the UI evokes a sense of stability and advanced technical capability. The emotional response is one of calm control and professional efficiency, where the interface recedes to let the data lead.

## Colors

This design system utilizes a hierarchical dark palette to establish depth without relying on heavy shadows. 

- **Primary:** The core blue (#2563eb) is reserved for high-priority actions and active states. 
- **Surface Strategy:** The background uses a deep charcoal (#0f172a). UI elements are layered using progressive lightening of the base hue to indicate elevation.
- **Accents:** Secondary sky blue is used for informational data points, while semantic colors (success, warning, error) must be tuned to high-vibrancy versions to remain accessible against dark backgrounds.
- **Contrast:** A minimum contrast ratio of 7:1 is maintained for all body text to ensure maximum readability in low-light environments.

## Typography

The typography system leverages the technical clarity of **Geist** for the majority of the interface, providing a clean, grotesque aesthetic that excels in high-density data views. 

**JetBrains Mono** is introduced for labels, metadata, and data values to emphasize the system's technical nature and ensure that alphanumeric strings (like database IDs) are easily distinguishable. All headings use a tighter letter-spacing to maintain a compact, modern feel.

## Layout & Spacing

This design system employs a **Fluid Grid** model built on an 8px base unit. 

- **Grid:** A 12-column layout is used for desktop views with 24px gutters. On mobile, the system collapses to a single column with 16px side margins.
- **Density:** To accommodate large datasets, vertical spacing is kept tight. Use `md` (16px) for standard grouping and `sm` (8px) for internal component spacing.
- **Alignment:** All containers must align to the 4px baseline grid to ensure vertical rhythm is maintained across disparate data columns.

## Elevation & Depth

In this dark-mode environment, depth is communicated through **Tonal Layering** rather than traditional drop shadows.

- **Level 0 (Base):** #0f172a - The main application canvas.
- **Level 1 (Card/Surface):** #1e293b - Used for primary content containers and navigation bars.
- **Level 2 (Popovers/Modals):** #334155 - Used for elements that sit above the main UI. These should include a subtle 1px border (#475569) to define edges against the dark background.
- **Focus States:** Elements receive a 2px outer glow using the primary blue at 30% opacity to indicate focus without breaking the flat aesthetic.

## Shapes

The shape language is **Soft** and disciplined. 

- **Standard Radius:** 0.25rem (4px) is applied to buttons, inputs, and small widgets to provide a subtle professional touch without feeling overly "bubbly."
- **Large Radius:** 0.5rem (8px) is reserved for cards and main content areas.
- **Strictness:** Interactive elements must never exceed these values; circular/pill shapes are prohibited to maintain the architectural, technical feel of the tracker.

## Components

### Buttons
- **Primary:** Solid #2563eb with white text. No gradient. 
- **Secondary:** Transparent background with #334155 border and #f8fafc text.
- **Ghost:** Transparent background, #94a3b8 text, appearing solid on hover.

### Inputs & Forms
- **Fields:** Background #1e293b, border #334155. Focus state uses a #2563eb border.
- **Labels:** Use `label-md` in #94a3b8, positioned 4px above the input field.

### Data Displays
- **Lists:** Rows should use alternating subtle fills or a 1px bottom border (#1e293b).
- **Chips:** Small, low-contrast pills (#334155) with `label-md` text. Use vibrant status dots (Green #10b981, Red #ef4444) for connectivity indicators.

### Cards
- **Structure:** Background #1e293b with no shadow. Define the container using a subtle border or a 1-step lighter background for header sections.