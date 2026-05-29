# Varguard Studio UI Redesign Instruction

Redesign the current Varguard Studio dashboard into a premium enterprise SaaS interface inspired by Databricks, Modal, RunPod, Vercel, Linear, and Grafana Cloud.

The current UI is too flat, too pale, too wireframe-like, and looks like an internal admin prototype. Replace it with a stronger, more polished SaaS visual system.

## Visual Direction

The product should feel like:

- Managed GPU compute platform
- Enterprise AI workspace
- Secure Jupyter cloud
- Infrastructure command center
- Premium developer platform

It must look closer to Databricks / Modal / RunPod, not a plain CRUD admin dashboard.

## Required Style

Use a modern dark-first interface.

Primary layout:
- dark sidebar
- light or dark main content depending on theme
- premium top navigation
- dense but polished dashboard cards
- strong typography hierarchy
- better spacing and visual rhythm
- professional SaaS landing/dashboard quality

## Color System

Use:
- background: zinc-950 / slate-950 for dark mode
- panel: zinc-900 / neutral-900
- border: zinc-800
- text: zinc-100
- muted text: zinc-400
- accent: cyan-400 or blue-500
- success: emerald
- warning: amber
- danger: rose

Avoid:
- pale cyan outlines everywhere
- thin wireframe-only cards
- washed-out light UI
- excessive grid background
- low contrast text

## Layout Requirements

Dashboard should contain:

1. Strong left sidebar
   - dark background
   - compact navigation
   - clear active state
   - Varguard Studio logo area
   - tenant selector

2. Header
   - breadcrumb
   - environment badge
   - search / command input
   - user profile menu

3. Main overview
   - headline: “Compute Workspace Control”
   - subheadline explaining managed notebooks and GPU compute
   - primary CTA: “New Workspace”
   - secondary CTA: “View Requests”

4. Metric cards
   Show:
   - Active Workspaces
   - Pending Requests
   - GPU Profiles
   - Storage Allocated

5. Workspace table
   Must look like enterprise infrastructure table:
   - workspace name
   - compute profile
   - status badge
   - storage
   - requester
   - created date
   - actions

6. Right-side operational panel
   Show:
   - Tenant status
   - Provisioning boundary
   - Next integration milestones
   - Activity feed

## Component Style

Cards:
- rounded-xl or rounded-2xl
- strong background
- subtle border
- soft shadow
- no plain white wireframe look

Buttons:
- primary button with strong accent color
- clear hover state
- compact height

Badges:
- pill style
- colored by status

Forms:
- compact
- professional
- strong input focus state

Tables:
- polished
- dense
- clear row hover
- readable headers
- not spreadsheet-like

## Brand Feel

The interface must feel:
- stable
- solid
- compact
- premium
- infrastructure-grade
- enterprise-ready

Avoid:
- academic prototype feel
- default shadcn look
- bare Tailwind layout
- weak typography
- too much empty grid background
- overly pale cyan styling

## Implementation Task

Refactor the existing dashboard UI only.
Keep the current business logic, routes, authentication, Prisma schema, and data flow.

Focus on visual redesign:
- layout
- components
- theme
- sidebar
- dashboard cards
- workspace request form
- workspace table
- admin review page

Make the result look like a serious SaaS product ready for investor demo.

Important:
Light Theme as a primary theme.
Do not create a wireframe.
Do not create a pale internal tool.
Do not use a white grid-paper background as the dominant visual.
The final UI must look production-grade and premium.
