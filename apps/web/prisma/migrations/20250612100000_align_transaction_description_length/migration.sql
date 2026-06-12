-- AlignTransactionDescriptionLength
ALTER TABLE `transactions` MODIFY `description` VARCHAR(120) NOT NULL;
