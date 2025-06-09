/*
  Warnings:

  - Added the required column `category_id` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by_id` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_deleted_by_id_fkey` FOREIGN KEY (`deleted_by_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
