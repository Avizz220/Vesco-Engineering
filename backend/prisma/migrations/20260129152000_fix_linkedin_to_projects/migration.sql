-- Ensure linkedInUrl exists on projects (idempotent for production repair)
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "linkedInUrl" TEXT;
