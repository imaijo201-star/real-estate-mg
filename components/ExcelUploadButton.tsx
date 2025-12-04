'use client';

import { useState } from 'react';
import { uploadExcel } from '@/actions/bulk-upload';

export function ExcelUploadButton() {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState('');

    const handleFile = async (file: File) => {
        if (!file) return;

        // 파일 형식 체크
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!validTypes.includes(file.type)) {
            setMessage('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            return;
        }

        setUploading(true);
        setMessage('업로드 중...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadExcel(formData);
            setMessage(`성공! ${result.count}개의 매물이 등록되었습니다.`);

            // 3초 후 메시지 초기화
            setTimeout(() => {
                setMessage('');
                window.location.reload();
            }, 3000);
        } catch (error: any) {
            setMessage(`오류: ${error.message || '업로드 실패'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="d-inline-block">
            <label
                className={`btn ${dragActive ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2 ${uploading ? 'disabled' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
            >
                <svg className="sa-icon" width="16" height="16">
                    <use href="/icons/sprite.svg#upload" />
                </svg>
                <span>{uploading ? '업로드 중...' : '엑셀 업로드'}</span>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                />
            </label>

            {message && (
                <div className={`alert ${message.includes('성공') ? 'alert-success' : message.includes('오류') ? 'alert-danger' : 'alert-info'} mt-2 mb-0 fs-sm`}>
                    {message}
                </div>
            )}
        </div>
    );
}
