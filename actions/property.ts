'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProperty(formData: FormData) {
    try {
        // 인증된 사용자 확인
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error('인증되지 않은 사용자입니다.');
        }

        const propertyType = formData.get('propertyType') as string;

        // Property 생성 + 유형별 정보 동시 생성 (Transaction)
        const property = await prisma.$transaction(async (tx) => {
            // 메인 Property 생성
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
                    userId: session.user.id,
                    status: 'AVAILABLE',
                },
            });

            // 중개사 정보
            const officeName = formData.get('officeName') as string;
            const phone = formData.get('phone') as string;
            if (officeName && phone) {
                await tx.agentInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        officeName,
                        phone,
                        registrationNo: formData.get('registrationNo') as string,
                    },
                });
            }

            // 유형별 정보 생성
            if (propertyType === 'COMMERCIAL') {
                await tx.commercialInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        premiumFee: formData.get('premiumFee') ? Number(formData.get('premiumFee')) : null,
                        businessRestrictions: formData.get('businessRestrictions') as string,
                        recommendedBusinesses: formData.get('recommendedBusinesses') as string,
                        monthlyRevenue: formData.get('monthlyRevenue') ? Number(formData.get('monthlyRevenue')) : null,
                        isOperating: formData.get('isOperating') === 'true',
                        isTransfer: formData.get('isTransfer') === 'true',
                    },
                });
            } else if (propertyType === 'LAND') {
                await tx.landInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        landCategory: formData.get('landCategory') as string,
                        zoning: formData.get('zoning') as string,
                        roadFacing: formData.get('roadFacing') as string,
                        topography: formData.get('topography') as string,
                        buildingCoverageRatio: formData.get('buildingCoverageRatio')
                            ? Number(formData.get('buildingCoverageRatio'))
                            : null,
                        floorAreaRatio: formData.get('floorAreaRatio')
                            ? Number(formData.get('floorAreaRatio'))
                            : null,
                    },
                });
            } else if (propertyType === 'OFFICE') {
                await tx.officeInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        meetingRooms: Number(formData.get('meetingRooms')) || 0,
                        deskCapacity: formData.get('deskCapacity') ? Number(formData.get('deskCapacity')) : null,
                        internetSpeed: formData.get('internetSpeed') as string,
                        hasSecurity: formData.get('hasSecurity') === 'true',
                        is24HourAccess: formData.get('is24HourAccess') === 'true',
                    },
                });
            } else if (propertyType === 'FACTORY') {
                await tx.factoryInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        ceilingHeight: formData.get('ceilingHeight') ? Number(formData.get('ceilingHeight')) : null,
                        electricCapacity: formData.get('electricCapacity') ? Number(formData.get('electricCapacity')) : null,
                        waterCapacity: formData.get('waterCapacity') ? Number(formData.get('waterCapacity')) : null,
                        hasCargoElevator: formData.get('hasCargoElevator') === 'true',
                        hasCrane: formData.get('hasCrane') === 'true',
                        hasEnvironmentalPermit: formData.get('hasEnvironmentalPermit') === 'true',
                    },
                });
            }

            return newProperty;
        });

        revalidatePath('/properties');
        redirect(`/properties/${property.id}`);
    } catch (error) {
        console.error('Failed to create property:', error);
        throw new Error('매물 등록에 실패했습니다.');
    }
}

export async function deleteProperty(id: number) {
    try {
        await prisma.property.delete({
            where: { id },
        });

        revalidatePath('/properties');
        redirect('/properties');
    } catch (error) {
        console.error('Failed to delete property:', error);
        throw new Error('매물 삭제에 실패했습니다.');
    }
}
