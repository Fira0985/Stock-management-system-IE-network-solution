-- AlterTable
ALTER TABLE `sale` ADD COLUMN `balance_due` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `credit` DOUBLE NULL,
    ADD COLUMN `due_date` DATETIME(3) NULL,
    ADD COLUMN `is_fully_paid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `paid_amount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `payment_status` ENUM('PAID', 'PARTIAL', 'UNPAID', 'OVERDUE') NOT NULL DEFAULT 'UNPAID';

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `paid_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` ENUM('CASH', 'CHEQUE', 'TRANSFER', 'CARD', 'OTHER') NOT NULL DEFAULT 'CASH',
    `note` VARCHAR(191) NULL,
    `sale_id` INTEGER NOT NULL,
    `received_by_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_received_by_id_fkey` FOREIGN KEY (`received_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
