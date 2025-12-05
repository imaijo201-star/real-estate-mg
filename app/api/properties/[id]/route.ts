import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moveUploadedFiles, deleteUploadedFiles } from '@/lib/fileUpload';

// Helper function to safely parse FormData
function getFormValue(formData: FormData, key: string): string | null {
    const value = formData.get(key) as string;
    return value && value.trim() !== '' ? value : null;
}

function getNumberValue(formData: FormData, key: string): number | null {
    const value = getFormValue(formData, key);
    return value ? Number(value) : null;
}

function getDateValue(formData: FormData, key: string): Date | null {
    const value = getFormValue(formData, key);
    return value ? new Date(value) : null;
}

// PUT /api/properties/[id] - Update property
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        const formData = await request.formData();
        const propertyType = formData.get('propertyType') as string;

        // Property 업데이트
        await prisma.$transaction(async (tx) => {
            await tx.property.update({
                where: { id },
                data: {
                    title: formData.get('title') as string,
                    tradeType: formData.get('tradeType') as string,
                    salePrice: getNumberValue(formData, 'salePrice'),
                    deposit: getNumberValue(formData, 'deposit'),
                    monthlyRent: getNumberValue(formData, 'monthlyRent'),
                    address: formData.get('address') as string,
                    addressDetail: getFormValue(formData, 'addressDetail'),
                    exclusiveArea: Number(formData.get('exclusiveArea')),
                    supplyArea: getNumberValue(formData, 'supplyArea'),
                    propertyType,
                    floor: getNumberValue(formData, 'floor'),
                    totalFloors: getNumberValue(formData, 'totalFloors'),
                    rooms: getNumberValue(formData, 'rooms') || 1,
                    bathrooms: getNumberValue(formData, 'bathrooms') || 1,
                    direction: getFormValue(formData, 'direction'),
                    buildYear: getNumberValue(formData, 'buildYear'),
                    hasElevator: formData.get('hasElevator') === 'true',
                    parkingSpaces: getNumberValue(formData, 'parkingSpaces') || 0,
                    heatingType: getFormValue(formData, 'heatingType'),
                    availableFrom: getDateValue(formData, 'availableFrom'),
                    maintenanceFee: getNumberValue(formData, 'maintenanceFee'),
                    maintenanceIncludes: getFormValue(formData, 'maintenanceIncludes'),
                    summary: getFormValue(formData, 'summary'),
                    description: getFormValue(formData, 'description'),
                    approvalNo: getFormValue(formData, 'approvalNo'),
                    confirmDate: getDateValue(formData, 'confirmDate'),
                },
            });

            // 중개사 정보 업데이트
            if (formData.get('officeName') || formData.get('agentPhone')) {
                await tx.agentInfo.upsert({
                    where: { propertyId: id },
                    create: {
                        propertyId: id,
                        officeName: formData.get('officeName') as string,
                        phone: formData.get('agentPhone') as string,
                        registrationNo: formData.get('registrationNo') as string,
                    },
                    update: {
                        officeName: formData.get('officeName') as string,
                        phone: formData.get('agentPhone') as string,
                        registrationNo: formData.get('registrationNo') as string,
                    },
                });
            }

            // 이미지 처리
            const imageUrls = formData.getAll('imageUrls') as string[];
            const imageIds = formData.getAll('imageIds') as string[];
            const imageOrders = formData.getAll('imageOrders') as string[];
            const mainImageIndex = formData.get('mainImageIndex') as string;

            if (imageUrls.length > 0) {
                // 기존 이미지 조회
                const existingImages = await tx.image.findMany({
                    where: { propertyId: id },
                });

                // 삭제할 이미지 찾기 (기존에 있었지만 현재 imageIds에 없는 것)
                const currentImageIds = imageIds.map(id => Number(id)).filter(id => !isNaN(id));
                const imagesToDelete = existingImages.filter(
                    img => !currentImageIds.includes(img.id)
                );

                // 이미지 파일 삭제
                if (imagesToDelete.length > 0) {
                    await deleteUploadedFiles(imagesToDelete.map(img => img.url));
                    await tx.image.deleteMany({
                        where: {
                            id: { in: imagesToDelete.map(img => img.id) }
                        }
                    });
                }

                // 새 이미지와 기존 이미지 분리
                const newImages: string[] = [];
                const updateImages: Array<{ id: number; url: string; order: number; isMain: boolean }> = [];

                imageUrls.forEach((url, index) => {
                    const imageId = imageIds[index];
                    const order = Number(imageOrders[index]) || index;
                    const isMain = index === Number(mainImageIndex);

                    if (imageId && imageId !== '') {
                        // 기존 이미지 업데이트
                        updateImages.push({
                            id: Number(imageId),
                            url,
                            order,
                            isMain
                        });
                    } else {
                        // 새 이미지
                        newImages.push(url);
                    }
                });

                // 새 이미지 생성
                if (newImages.length > 0) {
                    await tx.image.createMany({
                        data: newImages.map((url, index) => ({
                            url,
                            order: imageUrls.indexOf(url),
                            isMain: imageUrls.indexOf(url) === Number(mainImageIndex),
                            propertyId: id,
                        })),
                    });
                }

                // 기존 이미지 업데이트
                for (const img of updateImages) {
                    await tx.image.update({
                        where: { id: img.id },
                        data: {
                            order: img.order,
                            isMain: img.isMain,
                        }
                    });
                }
            }
        });

        // 파일 이동 (temp → propertyId)
        const imageUrls = formData.getAll('imageUrls') as string[];
        if (imageUrls.length > 0) {
            try {
                const movedUrls = await moveUploadedFiles(imageUrls, id);

                // 이동된 URL로 업데이트
                const images = await prisma.image.findMany({
                    where: { propertyId: id },
                    orderBy: { order: 'asc' },
                });

                for (let i = 0; i < images.length && i < movedUrls.length; i++) {
                    // temp URL을 가진 이미지만 업데이트
                    if (images[i].url.includes('/temp/')) {
                        await prisma.image.update({
                            where: { id: images[i].id },
                            data: { url: movedUrls[i] },
                        });
                    }
                }
            } catch (error) {
                console.error('File move error:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: '매물이 성공적으로 수정되었습니다.',
        });
    } catch (error) {
        console.error('[API] Update Property Error:', error);
        return NextResponse.json(
            { success: false, error: '매물 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        // 이미지 파일 삭제 (CASCADE로 DB는 자동 삭제되지만 파일은 수동 삭제 필요)
        const images = await prisma.image.findMany({
            where: { propertyId: id },
        });

        if (images.length > 0) {
            await deleteUploadedFiles(images.map(img => img.url));
        }

        // Property 삭제 (CASCADE로 관련 데이터 자동 삭제)
        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: '매물이 성공적으로 삭제되었습니다.',
        });
    } catch (error) {
        console.error('[API] Delete Property Error:', error);
        return NextResponse.json(
            { success: false, error: '매물 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
