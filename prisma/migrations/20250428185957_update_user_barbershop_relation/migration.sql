/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Barbershop` table. All the data in the column will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_ownerId_fkey";

-- AlterTable
ALTER TABLE "Barbershop" DROP COLUMN "ownerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Owner";

-- AddForeignKey
ALTER TABLE "Barbershop" ADD CONSTRAINT "Barbershop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
