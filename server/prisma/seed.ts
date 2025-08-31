import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

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

    const products = await prisma.product.findMany({ take: 2 });
    if (products.length < 2) {
        throw new Error("Not enough products in DB to seeds orders");
    }

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            subtotal: products[0].price * 2 + products[1].price,
            taxAmount: 0,
            total: products[0].price * 2 + products[1].price,
            status: "PENDING",
            items: {
                create: [
                    {
                        productId: products[0].id,
                        productTitle: products[0].title,
                        price: products[0].price,
                        quantity: 2,
                    },
                    {
                        productId: products[1].id,
                        productTitle: products[1].title,
                        price: products[1].price,
                        quantity: 1,
                    }
                ]
            }
        }
    });

    console.log('Seeded user and order');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});

