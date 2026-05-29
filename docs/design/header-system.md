# Varguard Studio — Enterprise Header System

## Objective

Refactor the current application header into a compact enterprise-grade operational command bar inspired by:

- Databricks
- Grafana Cloud
- Azure Portal
- Linear
- Retool
- Vercel Dashboard

The current implementation feels:
- too tall
- too fragmented
- too many boxed widgets
- visually noisy
- duplicated branding
- closer to a prototype than a production SaaS

The new header must feel:
- operational
- compact
- stable
- dense
- enterprise-oriented
- infrastructure-grade

---

# Header Philosophy

The sidebar owns:
- branding
- primary navigation
- tenant context

The header owns:
- operational controls
- search
- quick actions
- workspace switching
- notifications
- user controls

Do not duplicate branding across both sidebar and header.

---

# Header Layout

Use a single horizontal operational topbar.

Example structure:

```text
[Workspace Switcher]
[Global Search................................]
[Status]
[Usage]
[Notifications]
[User Menu]
```

The layout must feel like:
- command center
- compute workspace
- infrastructure console

NOT:
- landing page navbar
- widget collection
- floating card toolbar

---

# Technical Layout Requirements

Use:

```tsx
<header className="h-14 border-b bg-background flex items-center px-4 gap-3">
```

Main content shell:

```tsx
<div className="flex h-14 items-center gap-3 px-4">
```

Avoid:
- oversized padding
- large vertical spacing
- multiple stacked cards
- rounded container wrappers

---

# Header Height

Required:

```tsx
h-14
```

Preferred:
- compact vertical rhythm
- dense operational spacing

Avoid:
- h-16
- h-20
- py-4
- py-6

---

# Workspace Switcher

The workspace selector should be compact.

Good example:

```text
Varguard Labs ▾
```

Use:
- h-8
- text-xs or text-sm
- compact horizontal padding
- subtle border
- muted background

Do NOT:
- use large cards
- show large multi-line labels
- duplicate logo block
- create oversized tenant widgets

---

# Search System

Search is the primary operational element.

Requirements:
- centered
- compact
- dominant horizontally
- not visually heavy

Recommended style:

```tsx
className="h-8 text-sm flex-1 max-w-xl"
```

Placeholder:

```text
Search workspaces, requests, members...
```

Search should feel:
- fast
- operational
- IDE-like
- command-oriented

---

# Command Palette

Do not create a large separate command palette button.

Preferred:
- small keyboard hint
- integrated into search
- icon-only trigger

Example:

```text
⌘K
```

Avoid:
- large boxed CTA
- oversized command widgets

---

# Status Indicator

Status indicators should be minimal operational pills.

Example:

```text
● Healthy
```

Use:
- h-7
- text-xs
- rounded-full
- subtle border
- muted background

Avoid:
- metric cards
- large status containers
- stacked labels

---

# Usage Indicator

Usage should be compact.

Good:

```text
Usage 42%
```

Bad:
- large two-line card
- large quota widgets
- billing dashboard inside header

Use:
- text-xs
- h-7
- compact pill layout

---

# Notifications

Notifications should be icon-only.

Recommended:

```tsx
<Button size="icon" className="h-8 w-8" />
```

Avoid:
- labeled notification buttons
- oversized alert panels

---

# User Menu

User controls must be compact.

Preferred:
- avatar + short label
- dropdown trigger

Example:

```text
SU ▾
```

or:

```text
Sugeng ▾
```

Do not show:
- full email
- multi-line profile card
- large account container

Full account information belongs inside dropdown menu.

---

# Typography

Use dense enterprise typography.

Recommended:
- text-xs
- text-sm

Avoid:
- text-lg in topbar
- oversized labels
- excessive uppercase usage

---

# Spacing System

Recommended:
- gap-2
- gap-3
- px-3
- px-4

Avoid:
- gap-6
- px-8
- oversized whitespace

---

# Visual Direction

The header should visually resemble:
- Databricks workspace topbar
- Grafana Cloud command header
- Azure Portal top navigation
- enterprise infrastructure consoles

The interface should feel:
- compact
- engineered
- operational
- production-grade

NOT:
- startup marketing SaaS
- admin template
- wireframe prototype

---

# Remove These Patterns

Remove:
- duplicated Varguard logo in header
- giant tenant card
- large command palette card
- full email card
- multiple boxed widgets
- stacked operational cards
- floating rounded toolbar containers

---

# Final Expected Result

The final header must feel like:

```text
enterprise compute operations command bar
```

The user should immediately understand:
- this is a serious infrastructure platform
- this is a managed compute workspace
- this is not a generic dashboard template
