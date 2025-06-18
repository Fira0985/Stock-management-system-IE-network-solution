const { PrismaClient, RoleType } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash('yourpassword', 10); 

    await prisma.user.create({
        data: {
            id: 10,
            username: 'Firafis',
            email: 'firafisberhanu4@gmail.com',
            password_hash: hashed,
            phone: '0985703516',
            role: RoleType.OWNER,
        },
    });

    console.log('Database seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
