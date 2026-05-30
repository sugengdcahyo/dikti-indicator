CREATE TABLE IF NOT EXISTS "data_source_connections" (
  "id" TEXT NOT NULL,
  "user_email" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "files" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "data_source_connections_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "data_source_connections_user_email_idx"
  ON "data_source_connections"("user_email");
