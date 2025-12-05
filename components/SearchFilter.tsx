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
        <div className="card mb-4">
            <div className="card-body">
                <div className="row g-3">
                    {/* Search Input */}
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <svg className="sa-icon sa-icon-sm">
                                    <use href="/icons/sprite.svg#search" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="지역, 건물명 검색..."
                                className="form-control"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type Select */}
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            defaultValue={searchParams.get('type') || ''}
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
                            <option value="ONE_ROOM">원룸</option>
                            <option value="OFFICETEL">오피스텔</option>
                            <option value="COMMERCIAL">상가</option>
                            <option value="OFFICE">사무실</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setTerm('');
                                router.replace('/admin/properties');
                            }}
                        >
                            초기화
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
