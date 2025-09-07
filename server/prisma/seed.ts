import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

function generateOrderNumber(n: number): string {
    return `${String(n).padStart(4, "0")}`;
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

    const taxRate = 0; // change if you want

    for (let i = 0; i < 2; i++) {
        const orderItems = [
            { product: products[0], quantity: 2 },
            { product: products[1], quantity: 1 }
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
                price: product.price,
                quantity,
                taxAmount: lineTaxAmount,
                lineTotal,
            };
        });

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
                paymentStatus: "PAID",
                orderStatus: "PROCESSING",
                shippingAddress: "123 Main St, City, Country",
                billingAddress: "123 Main St, City, Country",
                notes: "Leave at front door",
                items: {
                    create: itemData,
                },
            },
        });
    }
    console.log("✅ Seeded user and 2 orders");
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
