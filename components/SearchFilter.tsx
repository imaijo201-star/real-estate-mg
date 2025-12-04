'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function SearchFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [term, setTerm] = useState(searchParams.get('q') || '');

    // Debounce 처리
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (term) {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            router.replace(`?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [term, router, searchParams]);

    return (
        <div className="flex gap-2 mb-6">
            <input
                type="text"
                placeholder="지역, 건물명 검색..."
                className="flex-1 border rounded px-4 py-2"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <select
                className="border rounded px-4 py-2"
                onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.value) params.set('type', e.target.value);
                    else params.delete('type');
                    router.replace(`?${params.toString()}`);
                }}
            >
                <option value="">전체 유형</option>
                <option value="APARTMENT">아파트</option>
                <option value="VILLA">빌라</option>
                <option value="STUDIO">원룸</option>
                <option value="OFFICETEL">오피스텔</option>
            </select>
        </div>
    );
}
