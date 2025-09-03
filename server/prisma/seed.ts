import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

function generateOrderNumber(n: number): string {
    return `ORD-${String(n).padStart(6, "0")}`;
}

async function main() {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    const hashPassword = await bcrypt.hash('password', 10);

    const user = await prisma.user.create({
        data: {
            name: 'kuzu',
            email: 'kuzu@pro.com',
            password: hashPassword,
            enabled: true,
        }
    });

    const products = await prisma.product.findMany({
        take: 2,
        include: { images: true }
    });
    if (products.length < 2) {
        throw new Error("Not enough products in DB to seeds orders");
    }

    const subtotal = products[0].price * 2 + products[1].price;
    const taxAmount = 0; // change if you want
    const total = subtotal + taxAmount;

    const orderCount = await prisma.order.count();
    const orderNumber = generateOrderNumber(orderCount + 1);

    await prisma.order.create({
        data: {
            userId: user.id,
            orderNumber,
            subtotal,
            taxAmount,
            total,
            paymentStatus: "PAID", // or PENDING
            orderStatus: "PROCESSING", // or PENDING
            items: {
                create: [
                    {
                        productId: products[0].id,
                        productSku: products[0].sku,
                        productTitle: products[0].title,
                        productImage: products[0].images[0]?.url ?? null,
                        price: products[0].price,
                        quantity: 2,
                        taxAmount: 0,
                    },
                    {
                        productId: products[1].id,
                        productSku: products[1].sku,
                        productTitle: products[1].title,
                        productImage: products[1].images[0]?.url ?? null,
                        price: products[1].price,
                        quantity: 1,
                        taxAmount: 0,
                    },
                ],
            },
        },
    });

    console.log('Seeded user and order');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});

