const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Creating admin users...');

    const hashedPassword = await bcrypt.hash('admin1234', 10);

    // 총괄 매니저
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@realestate.com',
            name: '총괄관리자',
            phone: '010-1234-5678',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin user created:', admin.username);

    // 수석 매니저 (선택사항)
    const seniorManager = await prisma.user.upsert({
        where: { username: 'senior' },
        update: {},
        create: {
            username: 'senior',
            email: 'senior@realestate.com',
            name: '수석매니저',
            phone: '010-2345-6789',
            password: hashedPassword,
            role: 'SENIOR_MANAGER',
        },
    });

    console.log('Senior manager created:', seniorManager.username);

    // 매니저 (선택사항)
    const manager = await prisma.user.upsert({
        where: { username: 'manager' },
        update: {},
        create: {
            username: 'manager',
            email: 'manager@realestate.com',
            name: '매니저',
            phone: '010-3456-7890',
            password: hashedPassword,
            role: 'MANAGER',
        },
    });

    console.log('Manager created:', manager.username);

    console.log('All admin users created successfully!');
    console.log('Default password for all users: admin1234');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
