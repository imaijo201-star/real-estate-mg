'use client';

import * as XLSX from 'xlsx';

export function ExcelTemplateButton() {
    const handleDownload = () => {
        // 템플릿 데이터 (예시 1개 행 포함)
        const templateData = [
            {
                '제목': '강남 래미안 아파트 34평',
                '건물유형': 'APARTMENT',
                '거래유형': 'SALE',
                '주소': '서울시 강남구 역삼동',
                '상세주소': '101동 1001호',
                '전용면적': 84.5,
                '매매가': 50000,
                '보증금': 0,
                '월세': 0,
                '층수': 10,
                '방개수': 3,
                '욕실개수': 2,
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "매물등록템플릿");

        // 컬럼 너비 설정
        ws['!cols'] = [
            { wch: 20 }, // 제목
            { wch: 12 }, // 건물유형
            { wch: 10 }, // 거래유형
            { wch: 25 }, // 주소
            { wch: 15 }, // 상세주소
            { wch: 10 }, // 전용면적
            { wch: 10 }, // 매매가
            { wch: 10 }, // 보증금
            { wch: 10 }, // 월세
            { wch: 8 },  // 층수
            { wch: 8 },  // 방개수
            { wch: 8 },  // 욕실개수
        ];

        XLSX.writeFileXLSX(wb, '매물등록_템플릿.xlsx');
    };

    return (
        <button
            onClick={handleDownload}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            type="button"
        >
            <svg className="sa-icon" width="16" height="16">
                <use href="/icons/sprite.svg#file-text" />
            </svg>
            <span>템플릿 다운로드</span>
        </button>
    );
}
