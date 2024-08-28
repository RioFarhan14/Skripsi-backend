/*
  Warnings:

  - The values [booked,pending,cancelled,completed] on the enum `bookings_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `transaction_id` on the `transaction_details` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(12)`.
  - You are about to drop the column `metode_pembayaran` on the `transactions` table. All the data in the column will be lost.
  - The values [paid,pending,failed] on the enum `transactions_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `transaction_details` DROP FOREIGN KEY `transaction_details_transaction_id_fkey`;

-- AlterTable
ALTER TABLE `bookings` MODIFY `status` ENUM('Ongoing', 'Booked', 'Pending', 'Cancelled', 'Completed') NOT NULL;

-- AlterTable
ALTER TABLE `transaction_details` MODIFY `transaction_id` VARCHAR(12) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `metode_pembayaran`,
    ADD COLUMN `payment` VARCHAR(20) NULL,
    ADD COLUMN `snap_redirect_url` VARCHAR(255) NULL,
    ADD COLUMN `snap_token` VARCHAR(255) NULL,
    MODIFY `status` ENUM('PAID', 'PENDING', 'CANCELLED') NOT NULL;

-- AddForeignKey
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
