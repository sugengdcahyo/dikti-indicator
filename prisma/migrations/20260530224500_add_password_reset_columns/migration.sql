ALTER TABLE "app_users"
ADD COLUMN IF NOT EXISTS "reset_token_hash" TEXT,
ADD COLUMN IF NOT EXISTS "reset_token_expires_at" TIMESTAMPTZ(6);

CREATE INDEX IF NOT EXISTS "app_users_reset_token_hash_idx" ON "app_users"("reset_token_hash");
