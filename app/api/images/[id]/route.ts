import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { deleteUploadedFiles } from '@/lib/fileUpload';

/**
 * DELETE /api/images/:id - 개별 이미지 삭제
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 인증 확인
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: '인증되지 않은 사용자입니다.' },
                { status: 401 }
            );
        }

        const imageId = Number(params.id);

        // Image 레코드 조회 (URL 가져오기)
        const { prisma } = await import('@/lib/prisma');
        const image = await prisma.image.findUnique({
            where: { id: imageId },
            include: {
                property: {
                    select: { userId: true }
                }
            }
        });

        if (!image) {
            return NextResponse.json(
                { success: false, error: '이미지를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 권한 확인 (본인 매물의 이미지만 삭제 가능)
        if (image.property.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다.' },
                { status: 403 }
            );
        }

        // 파일 삭제
        await deleteUploadedFiles([image.url]);

        // DB 레코드 삭제
        await prisma.image.delete({
            where: { id: imageId }
        });

        return NextResponse.json({
            success: true,
            message: '이미지가 삭제되었습니다.',
        });
    } catch (error) {
        console.error('[API] Delete Image Error:', error);
        return NextResponse.json(
            { success: false, error: '이미지 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
