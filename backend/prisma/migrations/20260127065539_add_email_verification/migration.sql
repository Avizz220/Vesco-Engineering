/*
  Warnings:

  - A unique constraint covering the columns `[email_verification_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `email_verification_token` VARCHAR(191) NULL,
    ADD COLUMN `is_email_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verification_token_expiry` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_verification_token_key` ON `users`(`email_verification_token`);
