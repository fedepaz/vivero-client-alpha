/*
  Warnings:

  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdByUserId` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `audit_logs` DROP FOREIGN KEY `audit_logs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_tenantId_fkey`;

-- DropIndex
DROP INDEX `user_permissions_userId_idx` ON `user_permissions`;

-- DropIndex
DROP INDEX `users_tenantId_idx` ON `users`;

-- AlterTable
ALTER TABLE `tenants` ADD COLUMN `createdByUserId` VARCHAR(191) NOT NULL,
    ADD COLUMN `deletedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `deletedByUserId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user_permissions` ADD COLUMN `deletedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `deletedByUserId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deletedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `deletedByUserId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `messages`;

-- CreateIndex
CREATE INDEX `tenants_deletedAt_idx` ON `tenants`(`deletedAt`);

-- CreateIndex
CREATE INDEX `user_permissions_userId_deletedAt_idx` ON `user_permissions`(`userId`, `deletedAt`);

-- CreateIndex
CREATE INDEX `users_tenantId_deletedAt_idx` ON `users`(`tenantId`, `deletedAt`);
