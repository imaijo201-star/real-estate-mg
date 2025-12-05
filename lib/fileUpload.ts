import { writeFile, mkdir, rename, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'properties');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * 이미지 파일 유효성 검사
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // 파일 타입 검사
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: '지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)',
        };
    }

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: '파일 크기는 5MB를 초과할 수 없습니다.',
        };
    }

    return { valid: true };
}

/**
 * 안전한 파일명 생성
 */
function sanitizeFileName(fileName: string): string {
    // 특수문자 제거, 공백을 대시로 변경
    return fileName
        .replace(/[^\w\s.-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

/**
 * 고유 파일명 생성
 */
function generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const sanitized = sanitizeFileName(originalName);
    const ext = path.extname(sanitized);
    const nameWithoutExt = path.basename(sanitized, ext);

    return `${timestamp}-${random}-${nameWithoutExt}${ext}`;
}

/**
 * 파일을 temp 폴더에 저장
 */
export async function saveUploadedFile(file: File, folder: string = 'temp'): Promise<string> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 폴더 생성 (없으면)
        const targetDir = path.join(UPLOAD_DIR, folder);
        if (!existsSync(targetDir)) {
            await mkdir(targetDir, { recursive: true });
        }

        // 고유 파일명 생성
        const fileName = generateUniqueFileName(file.name);
        const filePath = path.join(targetDir, fileName);

        // 파일 저장
        await writeFile(filePath, buffer);

        // URL 반환 (public 기준 상대 경로)
        return `/uploads/properties/${folder}/${fileName}`;
    } catch (error) {
        console.error('File save error:', error);
        throw new Error('파일 저장에 실패했습니다.');
    }
}

/**
 * 파일 이동 (temp → propertyId 폴더)
 */
export async function moveUploadedFiles(urls: string[], propertyId: number): Promise<string[]> {
    const movedUrls: string[] = [];

    try {
        // propertyId 폴더 생성
        const targetDir = path.join(UPLOAD_DIR, String(propertyId));
        if (!existsSync(targetDir)) {
            await mkdir(targetDir, { recursive: true });
        }

        for (const url of urls) {
            // temp 폴더의 파일만 이동
            if (!url.includes('/temp/')) {
                movedUrls.push(url);
                continue;
            }

            const fileName = path.basename(url);
            const sourcePath = path.join(process.cwd(), 'public', url);
            const targetPath = path.join(targetDir, fileName);
            const newUrl = `/uploads/properties/${propertyId}/${fileName}`;

            // 파일 이동
            if (existsSync(sourcePath)) {
                await rename(sourcePath, targetPath);
                movedUrls.push(newUrl);
            } else {
                console.warn(`File not found: ${sourcePath}`);
                movedUrls.push(url); // 원래 URL 유지
            }
        }

        return movedUrls;
    } catch (error) {
        console.error('File move error:', error);
        throw new Error('파일 이동에 실패했습니다.');
    }
}

/**
 * 파일 삭제
 */
export async function deleteUploadedFile(url: string): Promise<void> {
    try {
        const filePath = path.join(process.cwd(), 'public', url);

        if (existsSync(filePath)) {
            await unlink(filePath);
        }
    } catch (error) {
        console.error('File delete error:', error);
        // 삭제 실패는 조용히 처리 (파일이 이미 없을 수도 있음)
    }
}

/**
 * 여러 파일 삭제
 */
export async function deleteUploadedFiles(urls: string[]): Promise<void> {
    await Promise.all(urls.map(url => deleteUploadedFile(url)));
}
