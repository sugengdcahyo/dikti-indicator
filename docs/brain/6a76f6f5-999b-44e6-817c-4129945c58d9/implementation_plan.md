# Implementation Plan - Dockerization and Git Ignore Setup

We will configure Varguard Metadata Hub for containerized production deployments by:
1. Configuring Next.js to use `output: "standalone"` in `next.config.ts` to enable ultra-lightweight Docker images.
2. Creating a **multi-stage production Dockerfile** using official Node.js Alpine images.
3. Creating a `.dockerignore` file to prevent heavy cache files and local dependencies from leaking into the container build context.
4. Upgrading `.gitignore` with robust definitions (including SQLite, OS files, and editor specific metadata).

## User Review Required

> [!NOTE]
> The multi-stage build automatically runs dependency installation, production compiles, and setups a lightweight node runner. The final image size will be reduced by up to 85% (~120MB).

## Proposed Changes

### Configuration Files

---

#### [MODIFY] [next.config.ts](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/next.config.ts)
- Add `output: "standalone"` to the configuration.

#### [MODIFY] [.gitignore](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/.gitignore)
- Append missing rules for SQLite DB files, IDE logs (VSCode, JetBrains), and swap files.

#### [NEW] [.dockerignore](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/.dockerignore)
- Ignore `node_modules`, `.next`, `.git`, local env files, and logs.

#### [NEW] [Dockerfile](file:///Users/pabrik/working/mekarsa/products/varguard/metadata-hub/Dockerfile)
- Create a multi-stage Alpine Dockerfile (Deps -> Builder -> Runner) optimized for Next.js standalone deployment.

## Verification Plan

### Automated Tests
- Build the docker image locally:
  ```bash
  docker build -t metadata-hub .
  ```
