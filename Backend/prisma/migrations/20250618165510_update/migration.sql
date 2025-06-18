-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetCode_expireAt` DATETIME(3) NULL,
    ADD COLUMN `reset_code` VARCHAR(191) NULL,
    ADD COLUMN `verfiyCode_expireAt` DATETIME(3) NULL,
    ADD COLUMN `verfiy_code` VARCHAR(191) NULL;
