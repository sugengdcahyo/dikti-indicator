# Varguard Studio — Global UI Standardization System

## Objective

Refactor and standardize the entire dashboard UI using the existing global design token system.

The project already defines:
- color variables
- radius variables
- spacing variables
- typography scales
- semantic tokens
- theme tokens

Do NOT hardcode visual values repeatedly inside components.

Instead:
- reuse the existing global variables
- unify all dashboard components under the same token system
- ensure visual consistency across all pages

The result should feel:
- compact
- operational
- enterprise-grade
- infrastructure-oriented
- visually systematic

Inspired by:
- Databricks
- Grafana Cloud
- Azure Portal
- Linear

---

# Important Rules

## Do NOT hardcode:

Avoid repeatedly writing:

```tsx
border-zinc-800
rounded-xl
bg-zinc-950
text-zinc-400
```

inside individual components.

Instead:
- use existing semantic variables
- use design token classes
- extend the token system if needed

---

# Required Refactor Direction

Move visual consistency into:
- global CSS variables
- Tailwind theme extension
- semantic utility classes
- reusable UI primitives

The dashboard should behave like a real design system.

---

# Design Token Philosophy

The platform must use semantic styling such as:

```tsx
bg-card
border-border
text-muted-foreground
bg-background
text-foreground
rounded-lg
```

instead of repeated raw zinc/slate utility chains.

---

# Required Token Categories

Ensure the design system defines and consistently uses:

## Colors

- background
- foreground
- card
- card-foreground
- muted
- muted-foreground
- border
- input
- accent
- primary
- secondary
- destructive
- success
- warning

---

## Radius

Standardize radius tokens globally to be compact (size `sm`), matching the dense infrastructure feel:

| Semantic Usage | Radius |
|---|---|
| Buttons | sm |
| Inputs | sm |
| Cards | sm |
| Tables | sm |
| Modals | sm |
| Popovers | sm |
| Badges | full |

Use tokenized radius values. Avoid large rounded corners.

---

## Shadows

Use only:
- subtle operational shadows
- minimal elevation

Prefer semantic shadow utilities:
- shadow-sm
- shadow-card
- shadow-panel

Avoid:
- random custom shadow values
- large floating shadows

---

# Border System

All borders must use semantic border tokens.

Use:

```tsx
border-border
```

Avoid:
- arbitrary zinc border values
- inconsistent gray tones
- multiple border intensity systems

The entire dashboard should visually align.

---

# Component Standardization

Apply tokenized styling consistently to:

- cards
- tables
- buttons
- inputs
- selects
- filters
- modals
- sidebar
- topbar
- popovers
- workspace cards
- operational panels

---

# Card Standard

Operational cards should use reusable primitives.

Example:

```tsx
<Card className="rounded-card border-border bg-card shadow-card">
```

Avoid:
- repeated inline utility chains
- inconsistent card styling
- custom one-off border values

---

# Button Standard

Buttons must inherit from shared button variants.

Primary:
- operational accent
- compact height
- consistent radius

Secondary:
- subtle border
- compact density

Do not create page-specific button styling.

---

# Table Standard

Tables must use:
- shared table container styles
- shared row density
- shared header hierarchy

The user management page and workspace page must feel like part of the same product.

---

# Badge Standard

Operational badges should use semantic variants:

Examples:
- success
- warning
- neutral
- destructive

Preferred operational format:

```text
● Active
● Ready
● Pending
● Suspended
```

Badges should feel:
- compact
- operational
- low-noise

Avoid:
- oversized pills
- glowing badges
- decorative gradients

---

# Typography Density

Use compact enterprise typography globally.

Recommended:
- text-xs
- text-sm

Avoid:
- oversized startup typography
- excessive whitespace
- marketing-style scaling

---

# Spacing System

Use consistent spacing tokens:
- gap-2
- gap-3
- gap-4
- p-3
- p-4

Avoid:
- random spacing
- oversized gaps
- inconsistent layout rhythm

---

# Dashboard Consistency

All dashboard pages must visually align:

- Workspaces
- Usage
- User Management
- Security
- Cloud Resources
- Settings
- Future Admin Pages

The interface must feel like:
- one product
- one design system
- one operational platform

NOT:
- separate page implementations
- isolated styling approaches
- mixed component aesthetics

---

# Refactor Goal

Convert the current UI into:
- a semantic token-driven design system
- reusable enterprise SaaS primitives
- consistent operational interface

The result should resemble:
- Databricks workspace shell
- enterprise compute console
- modern infrastructure platform

NOT:
- generic Tailwind admin template
- random shadcn demo styling
- inconsistent utility-first experimentation
