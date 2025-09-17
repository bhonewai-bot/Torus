import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

function generateOrderNumber(n: number): string {
  return `${String(n).padStart(4, "0")}`;
}

async function main() {
  // Clean up
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  const hashPassword = await bcrypt.hash("password", 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: "kuzu",
      email: "kuzu@pro.com",
      password: hashPassword,
      enabled: true,
    },
  });

  // Create shipping address
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      firstName: "Kuzu",
      lastName: "Pro",
      addressLine1: "123 Main St",
      city: "City",
      state: "State",
      postalCode: "11111",
      country: "Country",
      isDefault: true,
    },
  });

  // Grab products
  const products = await prisma.product.findMany({
    take: 2,
    include: { images: true },
  });
  if (products.length < 2) {
    throw new Error("❌ Not enough products in DB to seed orders");
  }

  const taxRate = 0; // change if you want

  for (let i = 0; i < 12; i++) {
    const orderItems = [
      { product: products[0], quantity: 2 },
      { product: products[1], quantity: 1 },
    ];

    let subtotal = 0;
    let taxAmount = 0;

    const itemData = orderItems.map(({ product, quantity }) => {
      const lineSubtotal = product.price * quantity;
      const lineTaxAmount = lineSubtotal * taxRate;
      const lineTotal = lineSubtotal + lineTaxAmount;

      subtotal += lineSubtotal;
      taxAmount += lineTaxAmount;

      return {
        productId: product.id,
        productSku: product.sku,
        productTitle: product.title,
        productImage: product.images[0]?.url ?? null,
        unitPrice: product.price,
        quantity,
        lineTotal,
      };
    });

    const total = subtotal + taxAmount;

    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount + 1);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        subtotal,
        taxAmount,
        total,
        orderStatus: "PROCESSING",
        shippingAddressId: address.id,
        items: {
          create: itemData,
        },
      },
      include: { items: true },
    });

    // Create payment for order
    await prisma.payment.create({
      data: {
        userId: user.id,
        orderId: order.id,
        method: "CREDIT_CARD",
        provider: "stripe",
        transactionId: `txn_${Date.now()}`,
        amount: order.total,
        currency: "THB",
        status: "PAID",
      },
    });
  }

  console.log("✅ Seeded user, address, and 2 orders with payments");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });