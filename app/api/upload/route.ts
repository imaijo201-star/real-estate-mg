import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { saveUploadedFile, validateImageFile } from '@/lib/fileUpload';

/**
 * POST /api/upload - 이미지 파일 업로드
 */
export async function POST(request: NextRequest) {
    try {
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, error: '업로드할 파일이 없습니다.' },
                { status: 400 }
            );
        }

        // 파일 유효성 검사
        const validationErrors: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const validation = validateImageFile(file);
            if (!validation.valid) {
                validationErrors.push(`파일 ${i + 1}: ${validation.error}`);
            }
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { success: false, error: validationErrors.join(', ') },
                { status: 400 }
            );
        }

        // 파일 저장 (temp 폴더에)
        const urls: string[] = [];
        for (const file of files) {
            const url = await saveUploadedFile(file, 'temp');
            urls.push(url);
        }

        return NextResponse.json({
            success: true,
            urls,
            message: `${files.length}개의 이미지가 업로드되었습니다.`,
        });
    } catch (error) {
        console.error('[API] Upload Error:', error);
        return NextResponse.json(
            { success: false, error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
