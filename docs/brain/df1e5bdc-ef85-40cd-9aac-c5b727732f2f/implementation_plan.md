# Implementation Plan — Varguard Metadata Hub MVP

We will build the **Varguard Metadata Hub** as a high-fidelity Next.js application using the provided shared components, semantic token styles in `app/globals.css`, and `tailwind.config.ts`. To ensure it works perfectly out-of-the-box and provides a stunning, interactive operational experience, we will create a robust local/in-memory mock database layer that simulates the PostgreSQL storage, FastAPI Data Agent, and ETL lineage/EA events.

---

## User Review Required

> [!IMPORTANT]
> **Dependency Installation Required**
> The project needs three primary dependencies to support the design system components and graph canvas:
> 1. `lucide-react` — for rich, professional infrastructure icons.
> 2. `clsx` & `tailwind-merge` — required by `shared/design-system/utils/cn.ts` to merge Tailwind classes.
> 3. `@xyflow/react` — required for the Lineage React Flow graph as specified in `docs/spec.md` (Section 8.7).
> 
> *Action:* We will run `npm install lucide-react clsx tailwind-merge @xyflow/react` upon plan approval.

> [!NOTE]
> **Self-Contained Mock Architecture**
> To allow offline development and instant interactive demonstration of all MVP features (like scanning databases, running MDM fuzzy matching, registering indicators, mapping variable classification hierarchy, and lineage generation), we will build a client-server simulation layer. This layer implements the API contracts from Section 14 and 15 of `docs/spec.md` so that the UI is 100% operational, and it can easily be swapped with real database adapters and FastAPI endpoints in the future.

---

## Proposed Changes

### 1. Project Infrastructure & Layout Component

We will implement a premium, enterprise-grade dark sidebar, light/dark responsive workspace panel, environment selector, and metadata quick-search.

#### [NEW] [layout.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/layout.tsx) (Update/Replace)
- Establish structural layouts: Sidebar navigation for `/dashboard`, `/datasets`, `/indicators`, `/variables`, `/classifications`, `/quality`, `/lineage`, `/mdm`, `/governance`, `/integrations`, `/settings`.
- Integrate IBM Plex Sans / Mono fonts, standard HTML shell, and global toast notification.

#### [NEW] [nav-sidebar.tsx](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/components/nav-sidebar.tsx)
- Premium dark sidebar containing Logo, Tenant/Workspace Selector, and compact menu items.

---

### 2. Core Mock Database & Data Agent Simulators

We will build a local registry layer that stores mock schemas, datasets, indicators, variables, lineages, quality rules, and MDM nodes.

#### [NEW] [mock-db.ts](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/lib/mock-db.ts)
- Comprehensive datasets: SPBE registry, Kemenkeu/BPS statistical standards, variable definitions, and organizational tenants.
- Persistence helpers in local memory / local storage for fully operational CRUD (add, update, delete, version, approve workflows).

#### [NEW] [data-agent-sim.ts](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/lib/data-agent-sim.ts)
- Simulates the FastAPI Data Agent scanning engine, profiling metrics (row counts, null rate, candidate keys), and fuzzy matching logic using local Levenshtein-like algorithms (for lightweight MDM suggestions).

---

### 3. API Routes for Integrations & Workflows

We will construct standard API routes satisfying `docs/spec.md` Section 14 and 15:

#### [NEW] [route.ts (Datasets)](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/api/datasets/route.ts)
- `GET` with filtering/search, `POST` to create datasets.

#### [NEW] [route.ts (Studio Lineage Events)](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/api/lineage/events/route.ts)
- Receives Studio ETL lineage logs and registers new pipeline lineage connections dynamically.

#### [NEW] [route.ts (EA Artifact Link)](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/api/ea/artifact-link/route.ts)
- Exposes links between Business Process -> Application -> Dataset -> Indicator.

#### [NEW] [route.ts (Data Agent Scan/Profile/MDM)](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/api/data-agent/scan/route.ts) & [profile/route.ts](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/api/data-agent/profile/route.ts)
- Connects Next.js to our FastAPI Data Agent simulator.

---

### 4. Interactive MVP Pages

We will create pages styled exactly as instructed (stable, dense, operational, no wireframes, strong color harmonies, and using `shared/design-system` components).

#### [NEW] [dashboard page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/dashboard/page.tsx)
- Summary KPIs (Completeness, Quality Issues, Dataset domains), Source system health panels, and Recent Activity Feed.

#### [NEW] [datasets page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/datasets/page.tsx) & [detail page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/datasets/[id]/page.tsx)
- Dense data table of datasets.
- Tab-based detailed view: Overview, Schema, Variables, Quality, Lineage, Governance, API Integration.
- Integrates scanning simulator and profiling trigger.

#### [NEW] [indicators page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/indicators/page.tsx)
- Statistical indicators register, formula editor dialog, and association to datasets.

#### [NEW] [variables page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/variables/page.tsx)
- Variable explorer with datatype filters, classification references, and sensitive tags.

#### [NEW] [classifications page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/classifications/page.tsx)
- Tree-hierarchy rendering (Provinsi -> Kabupaten/Kota -> Kecamatan) with detail side-panel.

#### [NEW] [lineage page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/lineage/page.tsx)
- Custom dataset-level flow canvas utilizing `@xyflow/react` with interactive node status, upstream/downstream filters.

#### [NEW] [mdm page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/mdm/page.tsx)
- Golden record matching dashboard, interactive entity merge recommendations, and match score display.

#### [NEW] [quality page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/quality/page.tsx)
- Rules repository, failed checks log, and data completeness metric panel.

#### [NEW] [governance page](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/app/governance/page.tsx)
- Approval queue for submitted metadata definitions with version diffs and review log actions.

---

## Verification Plan

### Automated Verification
- Run `npm run build` to confirm TypeScript correctness and build generation.
- Perform compilation checks on Next.js standard paths.

### Manual Verification
1. **Dashboard Check**: Confirm information density, sidebar aesthetic, and active navigation indicators.
2. **Interactive Scan & Profile**: Click "Trigger Database Scan" on dataset view; observe schema loading dynamically with simulated column analytics.
3. **Lineage Flow Graph**: Verify lineage renders using `@xyflow/react` showing dataset relations.
4. **MDM Suggestions**: Run "Golden Record Match Finder" and merge proposed records.
