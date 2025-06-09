/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `credit_limit` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `purchase` DROP FOREIGN KEY `purchase_supplier_id_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_created_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_deleted_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `sale_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_role_id_fkey`;

-- DropIndex
DROP INDEX `purchase_supplier_id_fkey` ON `purchase`;

-- DropIndex
DROP INDEX `sale_customer_id_fkey` ON `sale`;

-- DropIndex
DROP INDEX `user_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    DROP COLUMN `credit_limit`,
    DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('OWNER', 'CLERK', 'AUDITOR') NOT NULL;

-- DropTable
DROP TABLE `role`;

-- CreateTable
CREATE TABLE `NonUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `credit_limit` DOUBLE NULL,
    `type` VARCHAR(191) NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sale` ADD CONSTRAINT `sale_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `NonUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase` ADD CONSTRAINT `purchase_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `NonUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
