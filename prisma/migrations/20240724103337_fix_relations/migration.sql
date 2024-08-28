/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[booking_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `booking_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `notifications`;

-- CreateIndex
CREATE UNIQUE INDEX `transactions_booking_id_key` ON `transactions`(`booking_id`);

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE SET NULL ON UPDATE CASCADE;
