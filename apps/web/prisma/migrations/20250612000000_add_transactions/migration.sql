-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `qualification` ENUM('ESSENTIAL', 'IMPORTANT', 'SUPERFLUOUS', 'INVESTMENT', 'DEBT', 'EMERGENCY') NULL,
    `paymentMethod` ENUM('PIX', 'CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'BANK_SLIP', 'BANK_TRANSFER', 'OTHER') NULL,
    `notes` VARCHAR(500) NULL,
    `isRecurring` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_date_idx`(`date`),
    INDEX `transactions_type_idx`(`type`),
    INDEX `transactions_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
