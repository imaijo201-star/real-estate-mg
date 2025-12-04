'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

export async function uploadExcel(formData: FormData) {
    try {
        const file = formData.get('file') as File;

        if (!file) {
            throw new Error('파일이 선택되지 않았습니다.');
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            throw new Error('엑셀 파일에 데이터가 없습니다.');
        }

        // 데이터 변환 및 검증
        const properties = data.map((row: any, index: number) => {
            const title = String(row['제목'] || row['매물명'] || '');
            if (!title) {
                throw new Error(`${index + 2}행: 제목은 필수입니다.`);
            }

            const address = String(row['주소'] || '');
            if (!address) {
                throw new Error(`${index + 2}행: 주소는 필수입니다.`);
            }

            const exclusiveArea = Number(row['전용면적'] || row['면적'] || 0);
            if (exclusiveArea <= 0) {
                throw new Error(`${index + 2}행: 전용면적은 필수입니다.`);
            }

            return {
                title,
                tradeType: String(row['거래유형'] || 'SALE'),
                salePrice: row['매매가'] ? Number(row['매매가']) : null,
                deposit: row['보증금'] ? Number(row['보증금']) : null,
                monthlyRent: row['월세'] ? Number(row['월세']) : null,
                address,
                addressDetail: String(row['상세주소'] || ''),
                exclusiveArea,
                supplyArea: row['공급면적'] ? Number(row['공급면적']) : null,
                propertyType: String(row['건물유형'] || row['유형'] || 'APARTMENT'),
                floor: row['층수'] ? Number(row['층수']) : null,
                totalFloors: row['전체층수'] ? Number(row['전체층수']) : null,
                rooms: Number(row['방개수'] || 1),
                bathrooms: Number(row['욕실개수'] || 1),
                direction: row['향'] || null,
                buildYear: row['준공년도'] ? Number(row['준공년도']) : null,
                hasElevator: row['엘리베이터'] === 'Y' || row['엘리베이터'] === true || row['엘리베이터'] === '예',
                parkingSpaces: Number(row['주차'] || 0),
                heatingType: row['난방'] || null,
                maintenanceFee: row['관리비'] ? Number(row['관리비']) : null,
                summary: row['한줄소개'] || null,
                description: row['설명'] || row['상세설명'] || null,
                userId: 'temp-user', // TODO: 실제 인증 구현 시 변경
                status: 'AVAILABLE',
            };
        });

        // DB에 저장
        const result = await prisma.property.createMany({
            data: properties,
            skipDuplicates: true,
        });

        revalidatePath('/admin/properties');

        return {
            success: true,
            count: result.count,
            message: `${result.count}개의 매물이 성공적으로 등록되었습니다.`
        };
    } catch (error: any) {
        console.error('Excel upload error:', error);
        throw new Error(error.message || '엑셀 업로드 중 오류가 발생했습니다.');
    }
}
