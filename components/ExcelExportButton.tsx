'use client';

import * as XLSX from 'xlsx';

export function ExcelExportButton({ data }: { data: any[] }) {
    const handleExport = () => {
        try {
            console.log('Excel export started', data.length, 'items');

            // 데이터를 워크시트로 변환
            const ws = XLSX.utils.json_to_sheet(data);

            // 워크북 생성
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "매물목록");

            // 파일명 생성
            const fileName = `매물목록_${new Date().toISOString().slice(0, 10)}.xlsx`;

            // 파일 다운로드 (브라우저 환경)
            XLSX.writeFileXLSX(wb, fileName);

            console.log('Excel file download triggered:', fileName);
        } catch (error) {
            console.error('Excel export error:', error);
            alert('엑셀 다운로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <button
            onClick={handleExport}
            className="btn btn-success d-flex align-items-center gap-2"
            type="button"
        >
            <svg className="sa-icon" width="16" height="16" fill="currentColor">
                <use href="/icons/sprite.svg#download" />
            </svg>
            <span>엑셀 다운로드</span>
        </button>
    );
}
