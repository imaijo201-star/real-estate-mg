import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Clear existing data
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
            name: '관리자',
            email: 'admin@example.com',
            phone: '010-1234-5678',
            role: 'ADMIN',
        },
    });

    console.log('Admin user created');

    // Property types and their variations
    const propertyTypes = ['APARTMENT', 'OFFICETEL', 'VILLA', 'HOUSE', 'ONE_ROOM', 'TWO_ROOM', 'COMMERCIAL', 'OFFICE', 'FACTORY', 'LAND'];
    const tradeTypes = ['SALE', 'JEONSE', 'MONTHLY'];
    const statuses = ['AVAILABLE', 'RESERVED', 'SOLD'];
    const cities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '수원', '성남'];
    const districts = ['중구', '종로구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구'];

    // Generate 1000 properties
    console.log('Generating 1000 properties...');
    const properties = [];

    for (let i = 1; i <= 1000; i++) {
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];

        const exclusiveArea = Math.floor(Math.random() * 150) + 20; // 20-170m²
        const salePrice = tradeType === 'SALE' ? Math.floor(Math.random() * 100000) + 10000 : null;
        const deposit = tradeType !== 'SALE' ? Math.floor(Math.random() * 50000) + 5000 : null;
        const monthlyRent = tradeType === 'MONTHLY' ? Math.floor(Math.random() * 300) + 50 : null;

        properties.push({
            title: `${city} ${district} ${propertyType === 'APARTMENT' ? '아파트' : propertyType === 'OFFICETEL' ? '오피스텔' : propertyType === 'VILLA' ? '빌라' : propertyType === 'HOUSE' ? '주택' : propertyType === 'ONE_ROOM' ? '원룸' : propertyType === 'TWO_ROOM' ? '투룸' : propertyType === 'COMMERCIAL' ? '상가' : propertyType === 'OFFICE' ? '사무실' : propertyType === 'FACTORY' ? '공장' : '토지'} ${i}`,
            address: `${city}시 ${district} ${Math.floor(Math.random() * 999) + 1}번지`,
            propertyType,
            tradeType,
            status,
            exclusiveArea,
            salePrice,
            deposit,
            monthlyRent,
            userId: admin.id,
        });

        // Insert in batches of 100
        if (i % 100 === 0) {
            await prisma.property.createMany({
                data: properties,
            });
            console.log(`Created ${i} properties...`);
            properties.length = 0; // Clear array
        }
    }

    // Insert remaining properties
    if (properties.length > 0) {
        await prisma.property.createMany({
            data: properties,
        });
    }

    console.log('✅ Seed completed! 1000 properties created.');
}

main()
    .catch((e) => {
        console.error('Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
