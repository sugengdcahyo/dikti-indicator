CREATE TABLE IF NOT EXISTS "dashboard_tab_connections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_email" TEXT NOT NULL,
  "dashboard_tab" TEXT NOT NULL,
  "source_id" TEXT NOT NULL,
  "source_label" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "dashboard_tab_connections_user_email_dashboard_tab_key" UNIQUE ("user_email", "dashboard_tab")
);

CREATE INDEX IF NOT EXISTS "dashboard_tab_connections_user_email_idx"
  ON "dashboard_tab_connections"("user_email");
