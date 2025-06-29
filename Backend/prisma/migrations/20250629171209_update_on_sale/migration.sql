/*
  Warnings:

  - You are about to alter the column `unit` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `sale_customer_id_fkey`;

-- DropIndex
DROP INDEX `category_name_key` ON `category`;

-- DropIndex
DROP INDEX `product_name_key` ON `product`;

-- DropIndex
DROP INDEX `sale_customer_id_fkey` ON `sale`;

-- AlterTable
ALTER TABLE `product` MODIFY `unit` INTEGER NULL;

-- AlterTable
ALTER TABLE `sale` MODIFY `discount_amount` DOUBLE NULL,
    MODIFY `customer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `sale` ADD CONSTRAINT `sale_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `NonUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
