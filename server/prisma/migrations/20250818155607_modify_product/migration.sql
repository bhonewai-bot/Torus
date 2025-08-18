/*
  Warnings:

  - The values [REFUNDED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `taxInclude` on the `Product` table. All the data in the column will be lost.
  - Made the column `subtotal` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taxAmount` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productTitle` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "subtotal" SET NOT NULL,
ALTER COLUMN "taxAmount" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "productTitle" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "taxInclude",
ADD COLUMN     "taxIncluded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "title" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
