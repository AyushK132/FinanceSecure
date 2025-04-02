/*
  Warnings:

  - A unique constraint covering the columns `[plaidTransactionId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'BANK';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "plaidAccountId" TEXT,
ADD COLUMN     "plaidCategory" TEXT,
ADD COLUMN     "plaidPending" BOOLEAN DEFAULT false,
ADD COLUMN     "plaidTransactionId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "plaidAccessToken" TEXT,
ADD COLUMN     "plaidInstitutionId" TEXT,
ADD COLUMN     "plaidInstitutionName" TEXT,
ADD COLUMN     "plaidItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_plaidTransactionId_key" ON "transactions"("plaidTransactionId");
