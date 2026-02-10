-- AlterTable
ALTER TABLE "team_members" ADD COLUMN "user_id" TEXT;

-- CreateIndex
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");
