/*
  Warnings:

  - You are about to drop the column `note` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `received_by_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `credit` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `is_fully_paid` on the `sale` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `sale` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `payment_status` on the `sale` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_received_by_id_fkey`;

-- DropIndex
DROP INDEX `payment_received_by_id_fkey` ON `payment`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `note`,
    DROP COLUMN `received_by_id`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by_id` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `credit`,
    DROP COLUMN `is_fully_paid`,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `payment_status` VARCHAR(191) NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `role_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_deleted_by_id_fkey` FOREIGN KEY (`deleted_by_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
