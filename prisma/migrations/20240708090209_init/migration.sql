-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(11) NOT NULL,
    `username` VARCHAR(15) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `user_phone` VARCHAR(13) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,
    `token` VARCHAR(100) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_user_phone_key`(`user_phone`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(20) NOT NULL,
    `product_type` ENUM('membership', 'field') NOT NULL,
    `price` INTEGER NOT NULL,
    `image_url` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `memberships` (
    `membership_id` VARCHAR(12) NOT NULL,
    `user_id` VARCHAR(11) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`membership_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `notification_id` VARCHAR(8) NOT NULL,
    `user_id` VARCHAR(11) NOT NULL,
    `message` VARCHAR(225) NOT NULL,
    `notification_date` DATETIME(3) NOT NULL,
    `status` ENUM('read', 'unread') NOT NULL,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `booking_id` VARCHAR(12) NOT NULL,
    `user_id` VARCHAR(11) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `status` ENUM('Ongoing', 'booked', 'pending', 'cancelled', 'completed') NOT NULL,
    `booking_date` VARCHAR(10) NOT NULL,
    `start_time` VARCHAR(5) NOT NULL,
    `end_time` VARCHAR(5) NOT NULL,

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `transaction_id` VARCHAR(12) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL,
    `metode_pembayaran` ENUM('gopay', 'mandiri', 'bca', 'shopeePay') NOT NULL,
    `status` ENUM('paid', 'pending', 'failed') NOT NULL,
    `discount` INTEGER NULL,
    `total_amount` INTEGER NOT NULL,

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_details` (
    `transaction_detail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(191) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` INTEGER NOT NULL,

    PRIMARY KEY (`transaction_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Help` (
    `help_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(60) NOT NULL,
    `message` VARCHAR(225) NOT NULL,

    PRIMARY KEY (`help_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
