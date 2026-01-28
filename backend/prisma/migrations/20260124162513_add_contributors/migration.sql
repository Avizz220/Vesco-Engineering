/*
  Warnings:

  - Added the required column `contributors` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projects` ADD COLUMN `contributors` JSON NOT NULL;
