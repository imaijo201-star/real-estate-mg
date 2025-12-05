'use client';

import { useEffect } from 'react';

/**
 * SmartAdmin 클라이언트 초기화 컴포넌트
 * 브라우저에서 SmartAdmin JavaScript 기능 활성화
 */
export function SmartAdminInit() {
    useEffect(() => {
        // SmartAdmin 초기화는 이미 로드된 스크립트에서 자동으로 실행됨
        // 필요시 추가 초기화 로직 여기에 작성

        // 예: 툴팁 초기화, 드롭다운 등
        if (typeof window !== 'undefined') {
            // Bootstrap 컴포넌트 초기화가 필요한 경우 여기서 처리
            console.log('SmartAdmin initialized');
        }
    }, []);

    return null; // 렌더링 없음
}
