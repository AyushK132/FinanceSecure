/*
  Warnings:

  - You are about to drop the column `plaidInstitutionId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `plaidInstitutionName` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `plaidCategory` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `plaidPending` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `plaidTransactionId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccessToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plaidInstitutionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plaidInstitutionName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plaidItemId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "transactions_plaidTransactionId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "plaidInstitutionId",
DROP COLUMN "plaidInstitutionName",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "plaidItemId" TEXT;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "plaidAccountId",
DROP COLUMN "plaidCategory",
DROP COLUMN "plaidPending",
DROP COLUMN "plaidTransactionId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "plaidAccessToken",
DROP COLUMN "plaidInstitutionId",
DROP COLUMN "plaidInstitutionName",
DROP COLUMN "plaidItemId";
