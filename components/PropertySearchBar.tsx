'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function PropertySearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setSearchTerm(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        } else {
            params.delete('q');
        }

        // Reset to page 1 when searching
        params.delete('page');

        router.push(`/admin/properties?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchTerm('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        params.delete('page');
        router.push(`/admin/properties?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="input-group" style={{ maxWidth: '400px' }}>
                <span className="input-group-text bg-white border-end-0">
                    <i className="ti ti-search text-muted"></i>
                </span>
                <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="매물명, 주소로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="btn btn-link text-muted"
                        onClick={handleClear}
                        title="검색어 지우기"
                    >
                        <i className="ti ti-x"></i>
                    </button>
                )}
            </div>
            <button type="submit" className="btn btn-primary">
                <i className="ti ti-search me-1"></i>
                검색
            </button>
        </form>
    );
}
