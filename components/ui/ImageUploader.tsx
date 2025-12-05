'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

export interface UploadedImage {
    id?: number;        // DB ID (기존 이미지)
    file?: File;        // 새 업로드 파일
    url: string;        // 미리보기 URL
    order: number;      // 순서
    isMain: boolean;    // 대표 이미지
}

interface ImageUploaderProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    maxImages?: number;
}

export default function ImageUploader({
    images,
    onImagesChange,
    maxImages = 10
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
    };

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        await handleFiles(files);

        // 파일 입력 리셋
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFiles = async (files: File[]) => {
        // 최대 개수 확인
        if (images.length + files.length > maxImages) {
            alert(`최대 ${maxImages}장까지만 업로드할 수 있습니다.`);
            return;
        }

        setIsUploading(true);

        try {
            // FormData 생성
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            // API 호출
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                // 새 이미지 추가
                const newImages: UploadedImage[] = data.urls.map((url: string, index: number) => ({
                    url,
                    order: images.length + index,
                    isMain: images.length === 0 && index === 0, // 첫 이미지를 대표로
                }));

                onImagesChange([...images, ...newImages]);
            } else {
                alert(data.error || '이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSetMain = (index: number) => {
        const updatedImages = images.map((img, i) => ({
            ...img,
            isMain: i === index,
        }));
        onImagesChange(updatedImages);
    };

    const handleRemove = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);

        // 순서 재조정
        updatedImages.forEach((img, i) => {
            img.order = i;
        });

        // 대표 이미지가 삭제되었으면 첫 번째를 대표로
        if (updatedImages.length > 0 && !updatedImages.some(img => img.isMain)) {
            updatedImages[0].isMain = true;
        }

        onImagesChange(updatedImages);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;

        const updatedImages = [...images];
        [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]];

        // 순서 재조정
        updatedImages.forEach((img, i) => {
            img.order = i;
        });

        onImagesChange(updatedImages);
    };

    const handleMoveDown = (index: number) => {
        if (index === images.length - 1) return;

        const updatedImages = [...images];
        [updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]];

        // 순서 재조정
        updatedImages.forEach((img, i) => {
            img.order = i;
        });

        onImagesChange(updatedImages);
    };

    return (
        <div>
            {/* 업로드 영역 */}
            <div
                className={`border-2 border-dashed rounded p-4 text-center transition-colors ${isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="d-none"
                    id="image-upload-input"
                />

                {isUploading ? (
                    <div className="py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">업로드 중...</span>
                        </div>
                        <p className="mt-3 text-muted mb-0">이미지 업로드 중...</p>
                    </div>
                ) : (
                    <>
                        <i className="ti ti-cloud-upload fs-1 text-primary mb-3 d-block"></i>
                        <p className="mb-2">
                            <label htmlFor="image-upload-input" className="btn btn-primary">
                                <i className="ti ti-photo me-1"></i>
                                파일 선택
                            </label>
                        </p>
                        <p className="text-muted fs-sm mb-0">
                            또는 여기에 이미지를 드래그하세요
                        </p>
                        <p className="text-muted fs-sm mb-0">
                            최대 {maxImages}장, 파일당 5MB 이하 (JPEG, PNG, WebP, GIF)
                        </p>
                    </>
                )}
            </div>

            {/* 이미지 목록 */}
            {images.length > 0 && (
                <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="mb-0">
                            <i className="ti ti-photo me-1"></i>
                            업로드된 이미지 ({images.length}/{maxImages})
                        </h6>
                        <small className="text-muted">
                            <i className="ti ti-star me-1"></i>
                            별표를 클릭하여 대표 이미지를 설정하세요
                        </small>
                    </div>

                    <div className="row g-3">
                        {images.map((image, index) => (
                            <div key={index} className="col-md-3 col-sm-4 col-6">
                                <div className={`card h-100 ${image.isMain ? 'border-warning shadow-sm' : ''}`}>
                                    <div className="position-relative" style={{ height: '150px' }}>
                                        <img
                                            src={image.url}
                                            alt={`이미지 ${index + 1}`}
                                            className="w-100 h-100 object-fit-cover"
                                        />

                                        {/* 대표 이미지 배지 */}
                                        {image.isMain && (
                                            <div className="position-absolute top-0 start-0 m-2">
                                                <span className="badge bg-warning text-dark">
                                                    <i className="ti ti-star-filled me-1"></i>
                                                    대표
                                                </span>
                                            </div>
                                        )}

                                        {/* 순서 번호 */}
                                        <div className="position-absolute top-0 end-0 m-2">
                                            <span className="badge bg-dark">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-body p-2">
                                        <div className="d-flex gap-1">
                                            {/* 대표 이미지 설정 */}
                                            <button
                                                type="button"
                                                onClick={() => handleSetMain(index)}
                                                className={`btn btn-sm flex-fill ${image.isMain ? 'btn-warning' : 'btn-outline-warning'
                                                    }`}
                                                title="대표 이미지로 설정"
                                            >
                                                <i className={`ti ${image.isMain ? 'ti-star-filled' : 'ti-star'}`}></i>
                                            </button>

                                            {/* 위로 이동 */}
                                            <button
                                                type="button"
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                className="btn btn-sm btn-outline-secondary"
                                                title="위로 이동"
                                            >
                                                <i className="ti ti-arrow-up"></i>
                                            </button>

                                            {/* 아래로 이동 */}
                                            <button
                                                type="button"
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === images.length - 1}
                                                className="btn btn-sm btn-outline-secondary"
                                                title="아래로 이동"
                                            >
                                                <i className="ti ti-arrow-down"></i>
                                            </button>

                                            {/* 삭제 */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                className="btn btn-sm btn-outline-danger"
                                                title="삭제"
                                            >
                                                <i className="ti ti-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
