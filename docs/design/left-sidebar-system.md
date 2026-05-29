# Varguard Studio — Collapsible Enterprise Sidebar System

## Objective

Refactor the sidebar into a modern collapsible enterprise navigation system consistent with the current compact operational header.

The sidebar should behave similarly to:
- Databricks
- Linear
- Grafana Cloud
- Azure Portal
- Retool

The goal is to create a production-grade SaaS navigation experience for a compute infrastructure platform.

---

# Core Behavior

The sidebar must support two modes:

## Expanded Mode

Width:

```tsx
w-64
```

Show:
- logo
- tenant context
- workspace scope
- full navigation labels
- grouped sections

---

## Collapsed Mode

Width:

```tsx
w-[72px]
```

Show:
- icons only
- compact logo
- active state
- bottom account controls

Hide:
- large text labels
- large tenant cards
- descriptive metadata

When hovering an item:
- show tooltip/popover
- display menu label
- display submenu items if available

Behavior should feel smooth and enterprise-grade.

---

# Sidebar Philosophy

The sidebar should feel:
- operational
- compact
- low-noise
- infrastructure-oriented
- productivity-focused

Avoid:
- playful animations
- oversized cards
- glowing cyberpunk effects
- excessive borders
- floating layout

---

# Layout Structure

Expanded:

```text
┌──────────────────────┐
│ Logo                 │
├──────────────────────┤
│ Tenant Context       │
├──────────────────────┤
│ Navigation           │
│ - Overview           │
│ - Requests           │
│ - Tenant             │
│ - Provisioning       │
├──────────────────────┤
│ User / Sign Out      │
└──────────────────────┘
```

Collapsed:

```text
┌────┐
│ VG │
├────┤
│ ◫  │
│ ⌂  │
│ ☰  │
│ ⚙  │
├────┤
│ ☺  │
└────┘
```

---

# Sidebar Toggle

Add a sidebar collapse button.

Recommended location:
- top header left
OR
- top sidebar section

Behavior:
- animated width transition
- preserve active state
- preserve navigation hierarchy

Use:

```tsx
transition-all duration-200 ease-out
```

Avoid:
- dramatic animation
- sliding overlays
- delayed hover effects

---

# Tooltip System

When sidebar is collapsed:
- hovering a nav item should show tooltip
- tooltip appears right side
- tooltip contains:
  - menu name
  - optional submenu list

Example:

```text
Overview
Workspace Requests
Tenant Settings
```

Use:
- shadcn Tooltip
OR
- Popover

Tooltip style:
- dark
- compact
- small typography
- enterprise style

Recommended:

```tsx
text-xs
rounded-md
border border-zinc-800
bg-zinc-950
```

---

# Expanded Sidebar Style

Use:

```tsx
bg-zinc-950
border-r border-zinc-900
```

Navigation items:

```tsx
h-9
px-3
text-[13px]
rounded-md
```

Icons:

```tsx
w-4 h-4
```

Spacing:

```tsx
gap-1
space-y-1
```

Avoid:
- oversized nav rows
- thick borders
- excessive cyan glow
- large cards

---

# Collapsed Sidebar Style

Use:
- centered icons
- compact spacing
- visual clarity

Navigation item:

```tsx
h-9 w-9 justify-center rounded-md
```

Active item:

```tsx
bg-cyan-500/10
text-cyan-300
```

Avoid:
- full-width highlight
- giant active container

---

# Tenant Context Refactor

Expanded:
- compact tenant block

Collapsed:
- show only:
  - tenant icon
  - tenant initials
  - organization badge

Hover tooltip shows:
- tenant name
- environment
- role

---

# Header Integration

Sidebar and header must visually align.

Requirements:
- same spacing rhythm
- same border system
- same typography density
- same operational tone

The transition between sidebar and header should feel seamless.

---

# Animation

Use subtle transitions only.

Allowed:
- width transition
- opacity transition
- tooltip fade

Avoid:
- spring physics
- bounce animation
- floating transitions
- exaggerated motion

---

# Technical Requirements

Use:
- React state or context
- persistent collapsed state
- responsive layout

Recommended:

```tsx
const [collapsed, setCollapsed] = useState(false)
```

Persist state:
- localStorage
OR
- cookie

---

# Responsive Behavior

Desktop:
- collapsible fixed sidebar

Tablet:
- compact collapsed sidebar

Mobile:
- overlay drawer

---

# Accessibility

Required:
- keyboard accessible
- focus visible
- aria labels
- tooltip accessible
- proper hover/focus states

---

# Visual Direction

The sidebar should feel like:

```text
enterprise compute workspace navigation
```

NOT:
- admin template
- bootstrap sidebar
- generic shadcn demo
- startup dashboard

The final experience should resemble:
- Databricks workspace shell
- Grafana Cloud navigation
- Azure operational console
- modern infrastructure SaaS
