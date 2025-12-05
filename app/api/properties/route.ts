import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { moveUploadedFiles } from '@/lib/fileUpload';

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
    try {
        // 인증 확인 - request를 auth()에 전달
        const session = await auth();

        console.log('Session:', JSON.stringify(session, null, 2)); // 디버깅용

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }

        // userId 추출 - 다양한 경로 시도
        const userId = (session.user as any).id || session.user.email || (session.user as any).sub;

        console.log('Extracted userId:', userId);

        if (!userId) {
            console.error('Failed to extract userId from session:', session);
            return NextResponse.json(
                { success: false, error: '사용자 ID를 찾을 수 없습니다.' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const propertyType = formData.get('propertyType') as string;

        // Property 생성
        const property = await prisma.$transaction(async (tx) => {
            const newProperty = await tx.property.create({
                data: {
                    title: formData.get('title') as string,
                    tradeType: formData.get('tradeType') as string,
                    salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : null,
                    deposit: formData.get('deposit') ? Number(formData.get('deposit')) : null,
                    monthlyRent: formData.get('monthlyRent') ? Number(formData.get('monthlyRent')) : null,
                    address: formData.get('address') as string,
                    addressDetail: formData.get('addressDetail') as string,
                    exclusiveArea: Number(formData.get('exclusiveArea')),
                    supplyArea: formData.get('supplyArea') ? Number(formData.get('supplyArea')) : null,
                    propertyType,
                    floor: formData.get('floor') ? Number(formData.get('floor')) : null,
                    totalFloors: formData.get('totalFloors') ? Number(formData.get('totalFloors')) : null,
                    rooms: Number(formData.get('rooms')) || 1,
                    bathrooms: Number(formData.get('bathrooms')) || 1,
                    direction: formData.get('direction') as string,
                    buildYear: formData.get('buildYear') ? Number(formData.get('buildYear')) : null,
                    hasElevator: formData.get('hasElevator') === 'true',
                    parkingSpaces: Number(formData.get('parkingSpaces')) || 0,
                    heatingType: formData.get('heatingType') as string,
                    availableFrom: formData.get('availableFrom')
                        ? new Date(formData.get('availableFrom') as string)
                        : null,
                    maintenanceFee: formData.get('maintenanceFee') ? Number(formData.get('maintenanceFee')) : null,
                    maintenanceIncludes: formData.get('maintenanceIncludes') as string,
                    summary: formData.get('summary') as string,
                    description: formData.get('description') as string,
                    approvalNo: formData.get('approvalNo') as string,
                    confirmDate: formData.get('confirmDate')
                        ? new Date(formData.get('confirmDate') as string)
                        : null,
                    status: 'AVAILABLE',
                    user: {
                        connect: { id: userId }
                    }
                },
            });

            // 중개사 정보 생성
            if (formData.get('officeName') || formData.get('agentPhone')) {
                await tx.agentInfo.create({
                    data: {
                        officeName: formData.get('officeName') as string,
                        phone: formData.get('agentPhone') as string,
                        registrationNo: formData.get('registrationNo') as string,
                        property: {
                            connect: { id: newProperty.id }
                        }
                    },
                });
            }

            // 이미지 저장
            const imageUrls = formData.getAll('imageUrls') as string[];
            const imageOrders = formData.getAll('imageOrders') as string[];
            const mainImageIndex = formData.get('mainImageIndex');

            if (imageUrls.length > 0) {
                // 이미지 레코드 생성
                await tx.image.createMany({
                    data: imageUrls.map((url, index) => ({
                        url, // 나중에 moveUploadedFiles에서 업데이트될 예정
                        order: Number(imageOrders[index]) || index,
                        isMain: index === Number(mainImageIndex),
                        propertyId: newProperty.id,
                    })),
                });
            }

            return newProperty;
        });

        // 파일 이동 및 URL 업데이트 (트랜잭션 외부에서 처리)
        const imageUrls = formData.getAll('imageUrls') as string[];
        if (imageUrls.length > 0) {
            try {
                // temp 폴더에서 propertyId 폴더로 파일 이동
                const movedUrls = await moveUploadedFiles(imageUrls, property.id);

                // 이동된 URL로 데이터베이스 업데이트
                const images = await prisma.image.findMany({
                    where: { propertyId: property.id },
                    orderBy: { order: 'asc' },
                });

                for (let i = 0; i < images.length && i < movedUrls.length; i++) {
                    await prisma.image.update({
                        where: { id: images[i].id },
                        data: { url: movedUrls[i] },
                    });
                }
            } catch (error) {
                console.error('File move error:', error);
                // 파일 이동 실패해도 매물 등록은 성공으로 처리
            }
        }

        return NextResponse.json({

            success: true,
            propertyId: property.id,
            message: '매물이 성공적으로 등록되었습니다.',
        });
    } catch (error) {
        console.error('[API] Create Property Error:', error);
        return NextResponse.json(
            { success: false, error: '매물 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
