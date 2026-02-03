-- AlterTable
ALTER TABLE "achievements" DROP COLUMN "position";
ALTER TABLE "achievements" ADD COLUMN "categories" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "achievements" ADD COLUMN "participants" JSONB NOT NULL DEFAULT '[]';
