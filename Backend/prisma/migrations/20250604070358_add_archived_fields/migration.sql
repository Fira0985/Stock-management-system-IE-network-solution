-- AlterTable
ALTER TABLE `category` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `product` MODIFY `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `purchase_item` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sale` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sale_item` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false;
