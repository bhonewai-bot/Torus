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

  // Create main admin user
  const user = await prisma.user.create({
    data: {
      avatar: "http://localhost:8000/uploads/products/677b182e-5282-4ffc-a950-9a42db26d9fb-1758531847499-kiss.jpg",
      name: "Bhone Wai",
      email: "bhonewai@bot.com",
      password: hashPassword,
      phone: "+66-800-932-347",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // Create 3 additional test users
  const testUsers = await Promise.all([
    // Regular active user
    prisma.user.create({
      data: {
        avatar: null,
        name: "John Doe",
        email: "john.doe@test.com",
        password: hashPassword,
        role: "USER",
        status: "ACTIVE",
      },
    }),
    // Regular user that can be banned (for testing ban functionality)
    prisma.user.create({
      data: {
        avatar: null,
        name: "Jane Smith",
        email: "jane.smith@test.com",
        password: hashPassword,
        role: "USER",
        status: "ACTIVE",
      },
    }),
    // Already banned user (for testing unban functionality)
    prisma.user.create({
      data: {
        avatar: null,
        name: "Bob Johnson",
        email: "bob.johnson@test.com",
        password: hashPassword,
        role: "USER",
        status: "BANNED",
      },
    })
  ]);

  console.log(`✅ Created ${testUsers.length + 1} users:`, {
    admin: { id: user.id, name: user.name, email: user.email },
    testUsers: testUsers.map(u => ({ 
      id: u.id, 
      name: u.name, 
      email: u.email, 
      role: u.role, 
      status: u.status 
    }))
  });

  // Create shipping address for main user
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      firstName: "Bhone",
      lastName: "Wai",
      addressLine1: "123 Main St",
      city: "City",
      state: "State",
      postalCode: "11111",
      country: "Country",
      isDefault: true,
    },
  });

  // Create addresses for test users (optional)
  await Promise.all(
    testUsers.map((testUser, index) =>
      prisma.address.create({
        data: {
          userId: testUser.id,
          firstName: testUser.name.split(' ')[0],
          lastName: testUser.name.split(' ')[1] || 'User',
          addressLine1: `${100 + index} Test St`,
          city: "Test City",
          state: "Test State",
          postalCode: `1000${index}`,
          country: "Test Country",
          isDefault: true,
        },
      })
    )
  );

  // Rest of your existing order seeding logic...
  const products = await prisma.product.findMany({
    take: 2,
    include: { images: true },
  });
  if (products.length < 2) {
    throw new Error("❌ Not enough products in DB to seed orders");
  }

  const taxRate = 0;

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("✅ Seeded users, addresses, and orders with payments");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });