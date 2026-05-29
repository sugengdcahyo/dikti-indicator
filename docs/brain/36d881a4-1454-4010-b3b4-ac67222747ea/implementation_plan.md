# Varguard Design System Refactoring and Expansion

This plan outlines the systematic refactoring and expansion of the Varguard Shared Design System (`shared/design-system`). We will:
1. Eliminate all remaining hardcoded hex colors and transparent borders from existing shared components and map them to standard semantic CSS variables.
2. Build 5 new interactive and feedback primitives to support dashboard operations (`DsSwitch`, `DsTooltip`, `DsDialog`, `DsSkeleton`, `DsTabs`).
3. Update design system entrypoints and documentation.
4. Integrate the new primitives into the Design System showcase page so they can be viewed and verified interactively.

## User Review Required

> [!IMPORTANT]
> **Adherence to Semantic Tokens**
> All refactored and new components will strictly adhere to the Varguard flat `0px` border-radius policy, high contrast typography, and use the custom Tailwind v4 theme variables defined in `app/globals.css` (e.g. `bg-primary`, `border-border`, `bg-secondary`, `bg-card`, `bg-popover`, `text-foreground`). No third-party UI library dependencies (like Radix or headlessui) are added; all components are written as standard, lightweight, pure React and Tailwind/Lucide systems.

---

## Proposed Changes

We will execute the plan in 4 logical phases:

### Phase 1: Semantic Refactoring of Existing Components
We will swap all inline HEX codes (`#E72822`, `#0A0A0C`, etc.) and `rgba(...)` borders inside the shared design-system components with semantic utilities.

#### [MODIFY] [button.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/button.tsx)
* Replace raw colors and border-transparent wrappers with semantic Tailwind classes (`bg-primary`, `text-primary-foreground`, `border-border`, `bg-secondary`, `text-foreground`, `hover:bg-primary/90`, `active:bg-primary/80`).
* Replace `#E72822` ring colors with `ring-primary/50`.

#### [MODIFY] [card.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/card.tsx)
* Replace deep background raw colors with `bg-card text-foreground border-border`.
* Standardize Card Header, Title, and Description.

#### [MODIFY] [badge.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/badge.tsx)
* Swap specific hex codes (`#7BDCB5`, `#FF6900`, `#E72822`) with `success`, `warning`, and `destructive` theme variants.
* Example success badge class: `border-success/20 bg-success/10 text-success`.

#### [MODIFY] [input.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/input.tsx)
#### [MODIFY] [password-input.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/password-input.tsx)
#### [MODIFY] [textarea.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/textarea.tsx)
* Map all error states and standard states to use semantic boundaries and soft backgrounds:
  * Error state: `border-destructive bg-destructive-soft focus:border-destructive`
  * Standard state: `border-border bg-secondary focus:border-border/80 focus:bg-muted`
* Swap raw white text `text-[#FFFFFF]` with `text-foreground`.

#### [MODIFY] [label.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/label.tsx)
* Swap `text-[#FFFFFF]` with `text-foreground`.

#### [MODIFY] [select.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/select.tsx)
* Map trigger background, borders, and active highlights to use `border-border`, `bg-secondary`, `bg-muted`, `border-primary/20 bg-primary/10 text-primary` (selected item), `border-primary bg-primary text-primary-foreground` (multi-select checkmark indicator).
* Swap dropdown background `#0A0A0C` with `bg-popover border-border`.

---

### Phase 2: Building 5 New Interactive & Feedback Primitives
We will create lightweight, fully functional components in `shared/design-system/components/`.

#### [NEW] [switch.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/switch.tsx)
* Implement `DsSwitch` as a premium binary switch toggle conforming to our sharp-angle flat style.
* Standard states: checked (Cyber Red background or Cyber Green) and unchecked (Muted panel/border) with smooth transition slider behavior.

#### [NEW] [tooltip.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/tooltip.tsx)
* Implement `DsTooltip` as a lightweight mouse-hover listener overlay.
* Uses modern pure-CSS tooltips or simple absolute-positioned React hover portal elements to ensure zero library overhead.

#### [NEW] [dialog.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/dialog.tsx)
* Implement `DsDialog` as a premium dark overlay modal wrapper.
* Handles overlay backdrop blur, `Escape` key close, lock screen body scroll, and action buttons footer.

#### [NEW] [skeleton.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/skeleton.tsx)
* Implement `DsSkeleton` as a customizable pulsing dark panel to build zero layout shift loaders.

#### [NEW] [tabs.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/tabs.tsx)
* Implement `DsTabs`, `DsTabsList`, `DsTabsTrigger`, and `DsTabsContent` as standard, flexible navigation elements.
* Standardizes active bottom-border highlight states across all page modules.

---

### Phase 3: Export & Documentation Sync

#### [MODIFY] [index.ts](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/components/index.ts)
* Export all 5 new components so they can be consumed via single unified exports.

#### [MODIFY] [adoption-checklist.md](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/shared/design-system/adoption-checklist.md)
* Correct the font references to match actual project settings (swap `IBM Plex Sans / Mono` reference with `Barlow` and `DM Mono`).

---

### Phase 4: Showcasing in Enterprise Design System Page

#### [MODIFY] [enterprise-design-system.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/frontpage/app/design-system/_components/enterprise-design-system.tsx)
* Insert structured showcase sections for:
  * **Switch / Toggle**: demonstrate checked, unchecked, and disabled configurations.
  * **Tooltip**: demonstrate hover indicators on metrik CVE severity CVSS.
  * **Dialog / Modal**: render a button "Trigger High-Severity Action Modal" which opens a beautiful dialog with actions.
  * **Skeleton Loader**: render a mock threat-table loader using skeleton rows.
  * **Tabs**: render a simple nested tab showcase demonstrating standard horizontal navigation tabs.

---

## Verification Plan

### Automated Tests
* We will verify the TSX compilation and type-safety validity by running:
  ```bash
  npm run build
  ```

### Manual Verification
* Run the local development server:
  ```bash
  npm run dev
  ```
* Open the browser and visit `http://localhost:3000/design-system` to test the dynamic transitions, tooltips, dialog visibility, skeleton pulsation, and tabs navigation directly.
