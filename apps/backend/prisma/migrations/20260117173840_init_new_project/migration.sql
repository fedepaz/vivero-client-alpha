/*
  Warnings:

  - You are about to drop the column `clerkId` on the `users` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users_clerkId_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `clerkId`,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL;
