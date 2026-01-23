-- DropIndex
DROP INDEX `users_email_idx` ON `users`;

-- CreateIndex
CREATE INDEX `users_username_idx` ON `users`(`username`);
