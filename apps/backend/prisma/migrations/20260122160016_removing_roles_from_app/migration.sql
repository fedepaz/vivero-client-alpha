/*
  Warnings:

  - You are about to drop the column `roleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `locales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_locale_code_fkey`;

-- DropForeignKey
ALTER TABLE `user_preferences` DROP FOREIGN KEY `user_preferences_preferred_locale_code_fkey`;

-- DropForeignKey
ALTER TABLE `user_preferences` DROP FOREIGN KEY `user_preferences_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_roleId_fkey`;

-- DropIndex
DROP INDEX `users_roleId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `roleId`;

-- DropTable
DROP TABLE `locales`;

-- DropTable
DROP TABLE `roles`;

-- DropTable
DROP TABLE `user_preferences`;
