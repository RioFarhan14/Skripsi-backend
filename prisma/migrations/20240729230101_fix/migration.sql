/*
  Warnings:

  - You are about to alter the column `user_id` on the `notification_reads` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.
  - You are about to alter the column `user_id` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.
  - You are about to alter the column `title` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `user_id` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.

*/
-- DropForeignKey
ALTER TABLE `notification_reads` DROP FOREIGN KEY `notification_reads_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_user_id_fkey`;

-- AlterTable
ALTER TABLE `notification_reads` MODIFY `user_id` VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `user_id` VARCHAR(11) NULL,
    MODIFY `title` VARCHAR(50) NOT NULL,
    MODIFY `message` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `user_id` VARCHAR(11) NOT NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_reads` ADD CONSTRAINT `notification_reads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
