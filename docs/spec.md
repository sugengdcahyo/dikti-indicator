# Varguard Metadata Hub — Product & Engineering Specification

## 1. Product Overview

**Varguard Metadata Hub** adalah platform metadata governance untuk mengelola metadata statistik, dataset registry, indicator registry, lineage, quality metadata, dan integrasi domain data untuk kebutuhan pemerintahan, SPBE, ETL, serta Enterprise Architecture.

Platform ini menjadi metadata backbone untuk:

- Varguard Studio
- Varguard Enterprise Architecture
- ETL dan lakehouse pipeline
- Metadata statistik pemerintahan
- SPBE / TOGAF domain data artifact
- SSOT initiative
- API service untuk integrasi lintas aplikasi

---

## 2. Existing Design System Context

Project ini harus menggunakan ulang aset UI yang sudah ada dari Varguard Studio dan Varguard Enterprise Architecture:

- shared component folder
- global.css
- Tailwind configuration
- shared layout patterns
- reusable cards
- sidebar
- top header
- dialogs
- forms
- tables
- badges
- button system

### Prinsip UI

Jangan redesign dari nol.

Pertahankan:

- enterprise-grade layout
- compact tetapi tetap readable
- clean typography
- proportional spacing
- reusable component
- semantic color dari global.css
- konsistensi dengan Studio dan EA

Hindari:

- flashy UI
- glassmorphism berlebihan
- hardcoded color
- komponen sekali pakai yang sulit dirawat

---

## 3. Architecture Decision

Arsitektur yang digunakan:

```txt
Next.js Monorepo = Core Application Platform
PostgreSQL Neon  = Primary Metadata Database
FastAPI          = Data Processing Agent Only
```

### Prinsip Utama

Next.js menjadi pusat aplikasi dan logic bisnis utama.

FastAPI hanya digunakan untuk proses data yang membutuhkan kemampuan Python, seperti:

- schema scanning
- data profiling
- MDM matching
- deduplication
- lineage extraction
- quality check berat
- data sample analysis
- semantic enrichment di masa depan

FastAPI tidak menangani:

- CRUD metadata biasa
- user management
- tenant management
- approval workflow
- dashboard
- registry management
- UI logic

---

## 4. High-Level Architecture

```txt
User
 ↓
Next.js Metadata Hub
 ↓
Neon PostgreSQL

Next.js
 ↓
FastAPI Data Agent
 ↓
External Database / File / API Source
```

### Metadata CRUD Flow

```txt
User
 ↓
Next.js
 ↓
Neon PostgreSQL
```

### Data Scanning Flow

```txt
User
 ↓
Next.js
 ↓
FastAPI Data Agent
 ↓
Source DB / File
 ↓
FastAPI Result
 ↓
Next.js
 ↓
Neon PostgreSQL
```

### Studio ETL Lineage Flow

```txt
Varguard Studio ETL
 ↓
Next.js Metadata API
 ↓
Neon PostgreSQL
```

Jika lineage membutuhkan parsing kompleks:

```txt
Varguard Studio ETL
 ↓
Next.js Metadata API
 ↓
FastAPI Data Agent
 ↓
Neon PostgreSQL
```

---

## 5. Recommended Monorepo Structure

```txt
varguard-metadata-hub/
├── apps/
│   └── metadata-hub/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       ├── server/
│       └── styles/
│
├── packages/
│   ├── shared-ui/
│   ├── shared-config/
│   ├── shared-types/
│   ├── db/
│   ├── auth/
│   └── metadata-core/
│
├── services/
│   └── data-agent/
│       ├── app/
│       ├── scanners/
│       ├── profiling/
│       ├── mdm/
│       ├── lineage/
│       └── quality/
│
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

---

## 6. Stack Function Mapping

| Stack | Fungsi Utama | Tanggung Jawab |
|---|---|---|
| Next.js App Router | core application | UI, routing, server actions, API routes |
| TypeScript | application typing | DTO, schema, reusable type |
| Tailwind + shadcn/ui | UI system | consistent enterprise UI |
| Shared UI | component reuse | Studio/EA visual consistency |
| Neon PostgreSQL | primary metadata store | registry, governance, lineage, audit |
| Prisma / Drizzle | database ORM | schema, migration, query |
| FastAPI | data agent | scan, profile, MDM, lineage processing |
| pandas | data processing | file inspection, profiling |
| rapidfuzz | MDM matching | fuzzy matching and duplicate detection |
| networkx | lineage graph | graph dependency processing |
| Redis | optional | queue, cache, async jobs |
| Object Storage | optional | profiling outputs, uploaded sample files |

---

## 7. Core Application Responsibility

### Next.js Handles

```txt
Next.js Metadata Hub
├── Dashboard
├── Dataset Registry
├── Indicator Registry
├── Variable Registry
├── Classification Registry
├── Governance Workflow
├── User/Tenant/Auth
├── Approval & Versioning
├── API for Studio
├── API for EA
├── Metadata CRUD
├── Audit Log
├── Integration Config
└── Data Agent Invocation
```

### FastAPI Data Agent Handles

```txt
FastAPI Data Agent
├── Database schema scanner
├── CSV/Excel/JSON/Parquet scanner
├── Data profiling
├── Heavy quality rule execution
├── MDM fuzzy matching
├── Deduplication suggestion
├── Lineage extraction
├── Data sample analysis
└── Future AI/semantic enrichment
```

---

## 8. Core Product Modules

## 8.1 Dashboard

Dashboard menampilkan ringkasan metadata governance.

### Metrics

- total datasets
- total indicators
- total variables
- metadata completeness score
- quality issue count
- lineage coverage
- dataset by domain
- recent updates
- pending approval
- source system status
- Studio integration status
- EA integration status

### UI Components

- summary cards
- chart cards
- recent activity table
- metadata quality panel
- source system status panel
- pending validation list

---

## 8.2 Dataset Registry

Mengelola metadata dataset.

### Fields

```txt
dataset_id
tenant_id
workspace_id
organization_id
code
name
description
domain
category
source_system
source_type
storage_location
owner
walidata
produsen_data
classification_level
update_frequency
retention_policy
sensitivity_level
status
version
valid_from
valid_to
created_at
updated_at
created_by
updated_by
```

### Pages

```txt
/datasets
/datasets/[id]
```

### Detail Tabs

- overview
- schema
- variables
- lineage
- quality
- indicators
- governance
- API usage
- audit log

---

## 8.3 Indicator Registry

Mengelola indikator statistik pemerintahan.

### Fields

```txt
indicator_id
tenant_id
code
name
definition
objective
formula
unit
frequency
aggregation_method
calculation_method
interpretation
dataset_id
owner
walidata
produsen_data
quality_status
status
version
valid_from
valid_to
```

### Pages

```txt
/indicators
/indicators/[id]
```

### Features

- indicator catalog
- formula editor
- methodology notes
- dataset relation
- variable mapping
- quality summary
- governance workflow

---

## 8.4 Variable Registry

Mengelola variabel atau field statistik.

### Fields

```txt
variable_id
tenant_id
dataset_id
name
code
definition
data_type
unit
nullable
default_value
allowed_values
classification_id
validation_rule
sensitivity_level
status
version
```

### Features

- variable explorer
- validation rule editor
- sensitivity tagging
- classification relation
- dataset relation

---

## 8.5 Classification & Dimension Registry

Mengelola klasifikasi dan dimensi statistik.

### Examples

- provinsi
- kabupaten/kota
- kecamatan
- gender
- kelompok umur
- tingkat pendidikan
- unit organisasi
- periode waktu

### Fields

```txt
classification_id
tenant_id
code
name
type
description
parent_id
hierarchy_level
valid_from
valid_to
status
version
```

### UI

- tree hierarchy
- expandable node
- hierarchy editor
- import/export classification
- relation to dataset/indicator

---

## 8.6 Metadata Quality

Mengelola kualitas metadata dan hasil validasi.

### Quality Dimensions

- completeness
- consistency
- timeliness
- uniqueness
- validity
- conformity

### Fields

```txt
quality_rule_id
tenant_id
target_type
target_id
rule_name
rule_type
severity
expression
validation_result
last_checked_at
```

### UI

- quality dashboard
- rule list
- issue list
- quality score
- failed validation
- recommendation panel

---

## 8.7 Lineage

Mengelola hubungan asal-usul data.

### Scope MVP

Gunakan dataset-level lineage terlebih dahulu.

Jangan implementasikan column-level lineage pada MVP.

### Lineage Types

- source to target dataset
- ETL pipeline lineage
- notebook lineage
- query lineage
- source system lineage
- EA artifact relation

### Fields

```txt
lineage_node_id
lineage_edge_id
tenant_id
source_dataset_id
target_dataset_id
pipeline_name
job_name
transformation_type
created_at
```

### UI

- lineage graph
- upstream explorer
- downstream explorer
- dependency graph
- ETL relation graph

Gunakan React Flow.

---

## 8.8 Lightweight MDM

MDM pada MVP dibuat ringan, bukan full enterprise MDM.

### Initial Entities

- organization
- unit kerja
- dataset owner
- walidata
- produsen data
- source system

### Functions

- fuzzy matching
- duplicate detection
- normalization
- golden record suggestion

### FastAPI Endpoints

```txt
POST /mdm/match
POST /mdm/deduplicate
POST /mdm/normalize
POST /mdm/golden-record/suggest
```

### Response

Harus berisi:

- match score
- matched entity
- reason
- suggested golden record
- confidence level

---

## 8.9 Metadata Scanner

Metadata scanner berada pada FastAPI Data Agent.

### Supported Sources

- PostgreSQL
- MySQL
- DuckDB
- CSV
- Excel
- JSON
- Parquet

### Extracted Metadata

- schema
- table
- column
- datatype
- nullable
- row count
- sample values
- unique count
- null rate
- candidate primary key
- candidate dimension
- candidate classification

### Flow

```txt
Database / File
 ↓
FastAPI Data Agent
 ↓
Scan Result
 ↓
Next.js
 ↓
Neon PostgreSQL
```

---

## 8.10 ETL Lineage Event API

API ini digunakan oleh Varguard Studio.

### Endpoint

```txt
POST /api/lineage/events
```

### Example Payload

```json
{
  "pipeline": "etl-kemiskinan",
  "source_dataset": "raw_kemiskinan",
  "target_dataset": "fact_kemiskinan",
  "transformation": [
    "drop null",
    "normalize province"
  ],
  "run_id": "run-20260527-001",
  "workspace_id": "ws-001"
}
```

---

## 8.11 EA Integration

Metadata Hub harus bisa menghubungkan domain data dengan artifact EA.

### Supported Relations

```txt
Business Process
Application
Service
Dataset
Indicator
Technology
Organization Unit
```

### Example Relation

```txt
Business Process
 ↓
Application
 ↓
Dataset
 ↓
Indicator
```

### API Endpoints

```txt
GET  /api/ea/data-artifacts
POST /api/ea/artifact-link
GET  /api/ea/application-dataset-relations
GET  /api/ea/business-process-dataset-relations
```

---

## 9. Main Pages

```txt
/dashboard
/datasets
/datasets/[id]
/indicators
/indicators/[id]
/variables
/classifications
/quality
/lineage
/mdm
/governance
/integrations
/settings
```

---

## 10. Governance Workflow

Metadata lifecycle:

```txt
draft
submitted
reviewed
approved
published
archived
```

### Required Fields

```txt
approval_status
reviewer_id
approved_by
approved_at
change_reason
review_note
```

---

## 11. Versioning

Semua metadata entity utama harus mendukung versioning.

### Required Fields

```txt
version
valid_from
valid_to
change_log
change_reason
```

---

## 12. Multi-Tenant Design

Semua major entity harus mendukung:

```txt
tenant_id
workspace_id
organization_id
```

Jangan hardcode organisasi tertentu.

---

## 13. Neon PostgreSQL Data Model

Buat tabel berikut:

```txt
tenants
organizations
users

metadata_datasets
metadata_indicators
metadata_variables
metadata_classifications

metadata_quality_rules
metadata_quality_results

metadata_lineage_nodes
metadata_lineage_edges

metadata_source_systems
metadata_api_contracts

metadata_owners
metadata_governance_workflows

ea_artifact_links

mdm_entities
mdm_match_results

audit_logs
```

Semua tabel utama harus memiliki:

```txt
id
tenant_id
created_at
updated_at
created_by
updated_by
status
version
```

---

## 14. Next.js API Design

Buat REST-like API routes atau server actions untuk:

```txt
GET    /api/datasets
GET    /api/datasets/:id
POST   /api/datasets
PATCH  /api/datasets/:id
DELETE /api/datasets/:id

GET    /api/indicators
POST   /api/indicators

GET    /api/variables
POST   /api/variables

GET    /api/classifications
POST   /api/classifications

POST   /api/quality/check
POST   /api/lineage/events

POST   /api/data-agent/scan
POST   /api/data-agent/profile
POST   /api/data-agent/mdm-match
```

API harus mendukung:

- pagination
- filtering
- sorting
- search
- tenant scoping
- audit log

---

## 15. FastAPI Data Agent API

FastAPI hanya untuk pemrosesan data.

### Endpoints

```txt
POST /scan/database
POST /scan/file
POST /profile/dataset
POST /quality/execute
POST /mdm/match
POST /mdm/deduplicate
POST /mdm/normalize
POST /lineage/extract
```

---

## 16. UI/UX Principles

Gunakan:

- tables for registry
- tabs for detail
- side panel/drawer for edit
- badges for status
- graph canvas for lineage
- summary cards for dashboard
- reusable shared components

Hindari:

- UI terlalu kosong
- dashboard terlalu dekoratif
- hardcoded spacing
- komponen tidak reusable
- business logic di komponen UI

---

## 17. Environment Variables

```env
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
DATA_AGENT_URL=
DATA_AGENT_TOKEN=
JWT_SECRET=
REDIS_URL=
```

---

## 18. Docker Compose

Buat service:

```txt
metadata-web
data-agent
redis
```

PostgreSQL menggunakan Neon, jadi tidak wajib menjalankan Postgres lokal.

Namun boleh menyediakan optional local Postgres profile untuk development offline.

```txt
postgres-local
```

---

## 19. MVP Scope

Prioritaskan:

1. app shell
2. dashboard
3. dataset registry
4. indicator registry
5. variable registry
6. classification hierarchy
7. governance workflow sederhana
8. lightweight lineage graph
9. quality dashboard
10. ETL lineage event ingestion
11. lightweight MDM
12. FastAPI data agent
13. Neon PostgreSQL schema
14. shared UI integration

Jangan over-engineer:

- full enterprise MDM
- column-level lineage
- complex workflow engine
- API marketplace
- knowledge graph penuh
- advanced AI assistant

---

## 20. Engineering Principles

- Use Next.js as the main application platform.
- Keep core logic in the monorepo.
- Use FastAPI only for data-processing specialization.
- Use typed schemas across frontend, API, and database.
- Keep components modular.
- Avoid business logic in UI components.
- Use server-side validation.
- Preserve existing Varguard design system.
- Keep API contracts clean.
- Prepare for future Studio and EA integration.
- Make metadata model configurable.
- Ensure every major action creates audit logs.
