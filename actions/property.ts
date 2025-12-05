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
                    status: 'AVAILABLE',
                    userId: session.user.id,
                },
            });

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
            }

            if (propertyType === 'LAND') {
                await tx.landInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        landCategory: formData.get('landCategory') as string,
                        zoning: formData.get('zoning') as string,
                        roadFacing: formData.get('roadFacing') as string,
                        topography: formData.get('topography') as string,
                        buildingCoverageRatio: formData.get('buildingCoverageRatio') ? Number(formData.get('buildingCoverageRatio')) : null,
                        floorAreaRatio: formData.get('floorAreaRatio') ? Number(formData.get('floorAreaRatio')) : null,
                    },
                });
            }

            if (propertyType === 'OFFICE') {
                await tx.officeInfo.create({
                    data: {
                        propertyId: newProperty.id,
                        meetingRooms: formData.get('meetingRooms') ? Number(formData.get('meetingRooms')) : null,
                        deskCapacity: formData.get('deskCapacity') ? Number(formData.get('deskCapacity')) : null,
                        internetSpeed: formData.get('internetSpeed') as string,
                        hasSecurity: formData.get('hasSecurity') === 'true',
                        is24HourAccess: formData.get('is24HourAccess') === 'true',
                    },
                });
            }

            if (propertyType === 'FACTORY') {
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

            // 중개사 정보 생성
            await tx.agentInfo.create({
                data: {
                    propertyId: newProperty.id,
                    officeName: formData.get('officeName') as string,
                    phone: formData.get('agentPhone') as string,
                    registrationNo: formData.get('registrationNo') as string,
                },
            });

            return newProperty;
        });

        revalidatePath('/admin/properties');
    } catch (error) {
        console.error('[CREATE] Property Error:', error);
        throw error;
    }

    redirect('/admin/properties');
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

export async function updateProperty(id: number, formData: FormData) {
    try {
        const propertyType = formData.get('propertyType') as string;

        // Property 업데이트 + 유형별 정보 동시 업데이트 (Transaction)
        await prisma.$transaction(async (tx) => {
            // 메인 Property 업데이트
            await tx.property.update({
                where: { id },
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
                    status: formData.get('status') as string,
                },
            });

            // 유형별 정보 업데이트 (upsert 사용)
            if (propertyType === 'COMMERCIAL') {
                await tx.commercialInfo.upsert({
                    where: { propertyId: id },
                    create: {
                        propertyId: id,
                        premiumFee: formData.get('premiumFee') ? Number(formData.get('premiumFee')) : null,
                        businessRestrictions: formData.get('businessRestrictions') as string,
                        recommendedBusinesses: formData.get('recommendedBusinesses') as string,
                        monthlyRevenue: formData.get('monthlyRevenue') ? Number(formData.get('monthlyRevenue')) : null,
                        isOperating: formData.get('isOperating') === 'true',
                        isTransfer: formData.get('isTransfer') === 'true',
                    },
                    update: {
                        premiumFee: formData.get('premiumFee') ? Number(formData.get('premiumFee')) : null,
                        businessRestrictions: formData.get('businessRestrictions') as string,
                        recommendedBusinesses: formData.get('recommendedBusinesses') as string,
                        monthlyRevenue: formData.get('monthlyRevenue') ? Number(formData.get('monthlyRevenue')) : null,
                        isOperating: formData.get('isOperating') === 'true',
                        isTransfer: formData.get('isTransfer') === 'true',
                    },
                });
            }

            if (propertyType === 'LAND') {
                await tx.landInfo.upsert({
                    where: { propertyId: id },
                    create: {
                        propertyId: id,
                        landCategory: formData.get('landCategory') as string,
                        zoning: formData.get('zoning') as string,
                        roadFacing: formData.get('roadFacing') as string,
                        topography: formData.get('topography') as string,
                        buildingCoverageRatio: formData.get('buildingCoverageRatio') ? Number(formData.get('buildingCoverageRatio')) : null,
                        floorAreaRatio: formData.get('floorAreaRatio') ? Number(formData.get('floorAreaRatio')) : null,
                    },
                    update: {
                        landCategory: formData.get('landCategory') as string,
                        zoning: formData.get('zoning') as string,
                        roadFacing: formData.get('roadFacing') as string,
                        topography: formData.get('topography') as string,
                        buildingCoverageRatio: formData.get('buildingCoverageRatio') ? Number(formData.get('buildingCoverageRatio')) : null,
                        floorAreaRatio: formData.get('floorAreaRatio') ? Number(formData.get('floorAreaRatio')) : null,
                    },
                });
            }

            if (propertyType === 'OFFICE') {
                await tx.officeInfo.upsert({
                    where: { propertyId: id },
                    create: {
                        propertyId: id,
                        meetingRooms: formData.get('meetingRooms') ? Number(formData.get('meetingRooms')) : null,
                        deskCapacity: formData.get('deskCapacity') ? Number(formData.get('deskCapacity')) : null,
                        internetSpeed: formData.get('internetSpeed') as string,
                        hasSecurity: formData.get('hasSecurity') === 'true',
                        is24HourAccess: formData.get('is24HourAccess') === 'true',
                    },
                    update: {
                        meetingRooms: formData.get('meetingRooms') ? Number(formData.get('meetingRooms')) : null,
                        deskCapacity: formData.get('deskCapacity') ? Number(formData.get('deskCapacity')) : null,
                        internetSpeed: formData.get('internetSpeed') as string,
                        hasSecurity: formData.get('hasSecurity') === 'true',
                        is24HourAccess: formData.get('is24HourAccess') === 'true',
                    },
                });
            }

            if (propertyType === 'FACTORY') {
                await tx.factoryInfo.upsert({
                    where: { propertyId: id },
                    create: {
                        propertyId: id,
                        ceilingHeight: formData.get('ceilingHeight') ? Number(formData.get('ceilingHeight')) : null,
                        electricCapacity: formData.get('electricCapacity') ? Number(formData.get('electricCapacity')) : null,
                        waterCapacity: formData.get('waterCapacity') ? Number(formData.get('waterCapacity')) : null,
                        hasCargoElevator: formData.get('hasCargoElevator') === 'true',
                        hasCrane: formData.get('hasCrane') === 'true',
                        hasEnvironmentalPermit: formData.get('hasEnvironmentalPermit') === 'true',
                    },
                    update: {
                        ceilingHeight: formData.get('ceilingHeight') ? Number(formData.get('ceilingHeight')) : null,
                        electricCapacity: formData.get('electricCapacity') ? Number(formData.get('electricCapacity')) : null,
                        waterCapacity: formData.get('waterCapacity') ? Number(formData.get('waterCapacity')) : null,
                        hasCargoElevator: formData.get('hasCargoElevator') === 'true',
                        hasCrane: formData.get('hasCrane') === 'true',
                        hasEnvironmentalPermit: formData.get('hasEnvironmentalPermit') === 'true',
                    },
                });
            }

            // 중개사 정보 업데이트
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
        });

        revalidatePath('/admin/properties');
        revalidatePath(`/admin/properties/${id}`);
    } catch (error) {
        console.error('[UPDATE] Property Error:', error);
        throw error;
    }

    redirect(`/admin/properties/${id}`);
}
