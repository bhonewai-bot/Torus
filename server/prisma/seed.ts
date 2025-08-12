import bcrypt from 'bcrypt';
import prisma from "../src/config/prisma";
import users from "../src/routes/admin/users";

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

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            total: 671.69,
            status: 'PENDING',
            items: {
                create: [
                    {
                        productId: 'fa037c1a-05ec-4912-983e-ff7528b94659',
                        price: 329,
                        quantity: 2,
                    },
                    {
                        productId: 'cb249feb-23ed-4f9d-ac81-b894c93ad404',
                        price: 13.69,
                        quantity: 1
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

