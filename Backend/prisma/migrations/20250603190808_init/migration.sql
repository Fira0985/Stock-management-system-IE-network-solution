/*
  Warnings:

  - You are about to drop the column `parent_category_id` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `category_parent_category_id_fkey`;

-- DropIndex
DROP INDEX `category_parent_category_id_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `parent_category_id`;
