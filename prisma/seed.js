const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const propertyTypes = ['APARTMENT', 'OFFICETEL', 'VILLA', 'HOUSE', 'ONE_ROOM', 'TWO_ROOM', 'COMMERCIAL', 'OFFICE', 'FACTORY', 'LAND'];
const tradeTypes = ['SALE', 'JEONSE', 'MONTHLY'];
const directions = ['SOUTH', 'EAST', 'WEST', 'NORTH', 'SOUTHEAST', 'SOUTHWEST'];
const heatingTypes = ['INDIVIDUAL', 'CENTRAL', 'DISTRICT'];

const seoulDistricts = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '성동구', '광진구', '동대문구', '중랑구'];
const cities = ['서울시', '경기도', '인천시', '부산시', '대구시'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function main() {
    console.log('Starting seed...');

    // 기존 데이터 삭제
    await prisma.factoryInfo.deleteMany();
    await prisma.officeInfo.deleteMany();
    await prisma.landInfo.deleteMany();
    await prisma.commercialInfo.deleteMany();
    await prisma.agentInfo.deleteMany();
    await prisma.image.deleteMany();
    await prisma.property.deleteMany();


    // Admin 사용자 조회 (seed-admin.js에서 생성됨)
    const user = await prisma.user.findUnique({
        where: { username: 'admin' },
    });

    if (!user) {
        throw new Error('Admin user not found. Please run: node prisma/seed-admin.js first');
    }

    console.log('Using admin user:', user.name);

    // 100개 매물 생성
    for (let i = 0; i < 100; i++) {
        const propertyType = getRandomElement(propertyTypes);
        const tradeType = propertyType === 'LAND' ? 'SALE' : getRandomElement(tradeTypes);
        const city = getRandomElement(cities);
        const district = city === '서울시' ? getRandomElement(seoulDistricts) : '수원시';

        const baseData = {
            title: `${propertyType === 'APARTMENT' ? '아파트' :
                propertyType === 'VILLA' ? '빌라' :
                    propertyType === 'OFFICETEL' ? '오피스텔' :
                        propertyType === 'HOUSE' ? '주택' :
                            propertyType === 'ONE_ROOM' ? '원룸' :
                                propertyType === 'TWO_ROOM' ? '투룸' :
                                    propertyType === 'COMMERCIAL' ? '상가' :
                                        propertyType === 'OFFICE' ? '사무실' :
                                            propertyType === 'FACTORY' ? '공장' : '토지'} ${i + 1}`,
            tradeType,
            salePrice: tradeType === 'SALE' ? getRandomFloat(10000, 100000, 0) : null,
            deposit: tradeType !== 'SALE' ? getRandomFloat(1000, 50000, 0) : null,
            monthlyRent: tradeType === 'MONTHLY' ? getRandomFloat(50, 500, 0) : null,
            address: `${city} ${district} ${getRandomInt(1, 999)}`,
            addressDetail: propertyType !== 'LAND' ? `${getRandomInt(1, 20)}동 ${getRandomInt(101, 2001)}호` : null,
            exclusiveArea: getRandomFloat(20, 200),
            supplyArea: getRandomFloat(25, 250),
            propertyType,
            floor: propertyType !== 'LAND' ? getRandomInt(1, 30) : null,
            totalFloors: propertyType !== 'LAND' ? getRandomInt(5, 40) : null,
            rooms: getRandomInt(1, 5),
            bathrooms: getRandomInt(1, 3),
            direction: propertyType !== 'LAND' ? getRandomElement(directions) : null,
            buildYear: getRandomInt(1990, 2024),
            hasElevator: Math.random() > 0.5,
            parkingSpaces: getRandomInt(0, 3),
            heatingType: getRandomElement(heatingTypes),
            maintenanceFee: getRandomFloat(5, 50),
            summary: `좋은 위치의 ${propertyType} 매물입니다.`,
            description: `교통이 편리하고 주변 환경이 쾌적한 매물입니다. 즉시 입주 가능합니다.`,
            userId: user.id,
            status: getRandomElement(['AVAILABLE', 'RESERVED', 'SOLD']),
        };

        const property = await prisma.property.create({
            data: baseData,
        });

        // 중개사 정보 (50% 확률)
        if (Math.random() > 0.5) {
            await prisma.agentInfo.create({
                data: {
                    propertyId: property.id,
                    officeName: `${district} 부동산`,
                    phone: `02-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
                    registrationNo: `11200-${getRandomInt(2010, 2024)}-${String(getRandomInt(1, 99999)).padStart(5, '0')}`,
                },
            });
        }

        // 유형별 특화 정보
        if (propertyType === 'COMMERCIAL') {
            await prisma.commercialInfo.create({
                data: {
                    propertyId: property.id,
                    premiumFee: getRandomFloat(0, 10000, 0),
                    businessRestrictions: '유흥업소 불가',
                    recommendedBusinesses: '카페, 음식점, 편의점',
                    monthlyRevenue: getRandomFloat(500, 5000, 0),
                    isOperating: Math.random() > 0.5,
                    isTransfer: Math.random() > 0.7,
                },
            });
        } else if (propertyType === 'LAND') {
            await prisma.landInfo.create({
                data: {
                    propertyId: property.id,
                    landCategory: getRandomElement(['대지', '전', '답', '임야', '기타']),
                    zoning: getRandomElement(['제1종일반주거지역', '제2종일반주거지역', '준주거지역', '상업지역', '공업지역']),
                    roadFacing: getRandomElement(['2면', '3면', '맹지']),
                    topography: getRandomElement(['평지', '경사지']),
                    buildingCoverageRatio: getRandomFloat(40, 80),
                    floorAreaRatio: getRandomFloat(100, 400),
                },
            });
        } else if (propertyType === 'OFFICE') {
            await prisma.officeInfo.create({
                data: {
                    propertyId: property.id,
                    meetingRooms: getRandomInt(0, 5),
                    deskCapacity: getRandomInt(10, 100),
                    internetSpeed: getRandomElement(['100Mbps', '500Mbps', '1Gbps', '10Gbps']),
                    hasSecurity: Math.random() > 0.5,
                    is24HourAccess: Math.random() > 0.5,
                },
            });
        } else if (propertyType === 'FACTORY') {
            await prisma.factoryInfo.create({
                data: {
                    propertyId: property.id,
                    ceilingHeight: getRandomFloat(3, 12),
                    electricCapacity: getRandomFloat(100, 2000, 0),
                    waterCapacity: getRandomFloat(10, 500, 0),
                    hasCargoElevator: Math.random() > 0.5,
                    hasCrane: Math.random() > 0.7,
                    hasEnvironmentalPermit: Math.random() > 0.6,
                },
            });
        }

        if ((i + 1) % 10 === 0) {
            console.log(`${i + 1}개 매물 생성 완료...`);
        }
    }

    console.log('✅ 100개 매물 데이터 생성 완료!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
