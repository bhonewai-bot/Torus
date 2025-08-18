/*
  Warnings:

  - You are about to drop the column `refunded` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "refunded",
ADD COLUMN     "subtotal" DOUBLE PRECISION,
ADD COLUMN     "taxAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productTitle" TEXT,
ADD COLUMN     "taxAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categories",
DROP COLUMN "images",
DROP COLUMN "name",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "regularPrice" DOUBLE PRECISION,
ADD COLUMN     "salePrice" DOUBLE PRECISION,
ADD COLUMN     "taxInclude" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxRate" DOUBLE PRECISION,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
