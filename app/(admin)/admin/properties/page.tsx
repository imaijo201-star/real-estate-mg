import { prisma } from '@/lib/prisma';
import { ExcelExportButton } from '@/components/ExcelExportButton';
import { PropertySearchBar } from '@/components/PropertySearchBar';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default async function PropertyListPage({
    searchParams,
}: {
    searchParams: { q?: string; propertyType?: string; status?: string; page?: string };
}) {
    const currentPage = Number(searchParams.page) || 1;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    const where = {
        AND: [
            searchParams.q ? {
                OR: [
                    { title: { contains: searchParams.q } },
                    { address: { contains: searchParams.q } },
                ]
            } : {},
            searchParams.propertyType ? { propertyType: searchParams.propertyType } : {},
            searchParams.status ? { status: searchParams.status } : {},
        ]
    };

    // Get total count for pagination
    const totalCount = await prisma.property.count({ where });
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const properties = await prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE,
    });

    // 매물 유형 한글 변환
    const getPropertyTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'APARTMENT': '아파트',
            'OFFICETEL': '오피스텔',
            'VILLA': '빌라',
            'HOUSE': '주택',
            'ONE_ROOM': '원룸',
            'TWO_ROOM': '투룸',
            'COMMERCIAL': '상가',
            'OFFICE': '사무실',
            'FACTORY': '공장',
            'LAND': '토지',
        };
        return labels[type] || type;
    };

    // 상태 한글 변환
    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'AVAILABLE': '판매중',
            'RESERVED': '예약중',
            'SOLD': '거래완료',
        };
        return labels[status] || status;
    };

    // 상태 배지 클래스
    const getStatusBadgeClass = (status: string) => {
        if (status === 'AVAILABLE') return 'bg-success';
        if (status === 'RESERVED') return 'bg-warning text-dark';
        return 'bg-danger';
    };

    // 매물 유형별 배지 색상
    const getPropertyTypeBadgeClass = (type: string) => {
        const badges: Record<string, string> = {
            'APARTMENT': 'badge rounded-pill badge-outline-primary',
            'OFFICETEL': 'badge rounded-pill badge-outline-success',
            'VILLA': 'badge rounded-pill badge-outline-info',
            'HOUSE': 'badge rounded-pill badge-outline-warning',
            'ONE_ROOM': 'badge rounded-pill badge-outline-secondary',
            'TWO_ROOM': 'badge rounded-pill badge-outline-secondary',
            'COMMERCIAL': 'badge rounded-pill badge-outline-danger',
            'OFFICE': 'badge rounded-pill badge-outline-dark',
            'FACTORY': 'badge rounded-pill badge-outline-purple',
            'LAND': 'badge rounded-pill badge-outline-secondary',
        };
        return badges[type] || 'badge rounded-pill badge-outline-primary';
    };

    // 가격 표시
    const getPriceDisplay = (property: any) => {
        if (property.tradeType === 'SALE' && property.salePrice) {
            return `${property.salePrice.toLocaleString()}만원`;
        } else if (property.tradeType === 'JEONSE' && property.deposit) {
            return `전세 ${property.deposit.toLocaleString()}만원`;
        } else if (property.tradeType === 'MONTHLY') {
            return `${property.deposit?.toLocaleString() || 0}/${property.monthlyRent?.toLocaleString() || 0}`;
        }
        return '-';
    };

    // Generate pagination URL
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    // Pagination range
    const getPageRange = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="content-wrapper">
            {/* Page Header */}
            <h1 className="subheader-title mb-2">매물 관리</h1>

            {/* Breadcrumb */}
            <nav className="app-breadcrumb" aria-label="breadcrumb">
                <ol className="breadcrumb ms-0 text-muted mb-0">
                    <li className="breadcrumb-item">관리</li>
                    <li className="breadcrumb-item active" aria-current="page">매물 관리</li>
                </ol>
            </nav>

            {/* Description & Search */}
            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                <h6 className="fst-italic mb-0">
                    등록된 모든 매물을 테이블 형태로 한눈에 확인하세요. (총 {totalCount}개)
                </h6>
                <PropertySearchBar />
            </div>

            {/* Active Filters */}
            {(searchParams.q || searchParams.propertyType || searchParams.status) && (
                <div className="card mb-3 border-primary">
                    <div className="card-body py-2">
                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <span className="text-muted fw-600 me-2">
                                <i className="ti ti-filter me-1"></i>
                                적용된 필터:
                            </span>
                            {searchParams.q && (
                                <Link
                                    href={`?${new URLSearchParams({
                                        ...(searchParams.propertyType && { propertyType: searchParams.propertyType }),
                                        ...(searchParams.status && { status: searchParams.status }),
                                        ...(searchParams.page && { page: searchParams.page })
                                    }).toString()}`}
                                    className="badge bg-info-100 text-info-600 text-decoration-none d-inline-flex align-items-center"
                                >
                                    <i className="ti ti-search me-1"></i>
                                    "{searchParams.q}"
                                    <i className="ti ti-x ms-1"></i>
                                </Link>
                            )}
                            {searchParams.propertyType && (
                                <Link
                                    href={`?${new URLSearchParams({
                                        ...(searchParams.q && { q: searchParams.q }),
                                        ...(searchParams.status && { status: searchParams.status }),
                                        ...(searchParams.page && { page: searchParams.page })
                                    }).toString()}`}
                                    className="badge bg-primary-100 text-primary-600 text-decoration-none d-inline-flex align-items-center"
                                >
                                    {getPropertyTypeLabel(searchParams.propertyType)}
                                    <i className="ti ti-x ms-1"></i>
                                </Link>
                            )}
                            {searchParams.status && (
                                <Link
                                    href={`?${new URLSearchParams({
                                        ...(searchParams.q && { q: searchParams.q }),
                                        ...(searchParams.propertyType && { propertyType: searchParams.propertyType }),
                                        ...(searchParams.page && { page: searchParams.page })
                                    }).toString()}`}
                                    className="badge bg-success-100 text-success-600 text-decoration-none d-inline-flex align-items-center"
                                >
                                    {getStatusLabel(searchParams.status)}
                                    <i className="ti ti-x ms-1"></i>
                                </Link>
                            )}
                            <Link
                                href="/admin/properties"
                                className="badge bg-danger-100 text-danger-600 text-decoration-none d-inline-flex align-items-center ms-2"
                            >
                                <i className="ti ti-x me-1"></i>
                                모든 필터 제거
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="main-content">
                {/* Actions Bar */}
                <div className="card mb-g">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <ExcelExportButton data={properties} />
                                <Link href="/admin/properties/new" className="btn btn-primary">
                                    <i className="ti ti-plus me-1"></i>
                                    매물 등록
                                </Link>
                            </div>
                            <div className="text-muted">
                                페이지 <strong>{currentPage}</strong> / {totalPages}
                                <span className="ms-2">
                                    (총 <strong>{totalCount}</strong>개 매물)
                                </span>
                            </div>
                        </div>

                        {/* Quick Filter Buttons */}
                        <div className="border-top pt-3">
                            {/* Status Filters */}
                            <div className="mb-2">
                                <h6 className="text-muted fw-600 mb-2 fs-sm">
                                    <i className="ti ti-flag me-1"></i>
                                    상태별
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                    <Link
                                        href="/admin/properties"
                                        className={`btn btn-sm ${!searchParams.status ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    >
                                        전체
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.propertyType && { propertyType: searchParams.propertyType }),
                                            status: 'AVAILABLE'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.status === 'AVAILABLE' ? 'btn-success' : 'btn-outline-success'}`}
                                    >
                                        <i className="ti ti-filter me-1"></i>
                                        판매중
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.propertyType && { propertyType: searchParams.propertyType }),
                                            status: 'RESERVED'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.status === 'RESERVED' ? 'btn-warning' : 'btn-outline-warning'}`}
                                    >
                                        <i className="ti ti-clock me-1"></i>
                                        예약중
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.propertyType && { propertyType: searchParams.propertyType }),
                                            status: 'SOLD'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.status === 'SOLD' ? 'btn-info' : 'btn-outline-info'}`}
                                    >
                                        <i className="ti ti-circle-check me-1"></i>
                                        거래완료
                                    </Link>
                                </div>
                            </div>

                            {/* Property Type Filters */}
                            <div>
                                <h6 className="text-muted fw-600 mb-2 fs-sm">
                                    <i className="ti ti-building me-1"></i>
                                    유형별
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status })
                                        }).toString()}`}
                                        className={`btn btn-sm ${!searchParams.propertyType ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    >
                                        전체
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'APARTMENT'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'APARTMENT' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    >
                                        <i className="ti ti-building-skyscraper me-1"></i>
                                        아파트
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'OFFICETEL'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'OFFICETEL' ? 'btn-success' : 'btn-outline-success'}`}
                                    >
                                        <i className="ti ti-building me-1"></i>
                                        오피스텔
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'VILLA'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'VILLA' ? 'btn-info' : 'btn-outline-info'}`}
                                    >
                                        <i className="ti ti-home me-1"></i>
                                        빌라
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'HOUSE'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'HOUSE' ? 'btn-warning' : 'btn-outline-warning'}`}
                                    >
                                        <i className="ti ti-home-2 me-1"></i>
                                        주택
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'ONE_ROOM'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'ONE_ROOM' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    >
                                        <i className="ti ti-door me-1"></i>
                                        원룸
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'TWO_ROOM'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'TWO_ROOM' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    >
                                        <i className="ti ti-layout me-1"></i>
                                        투룸
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'COMMERCIAL'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'COMMERCIAL' ? 'btn-danger' : 'btn-outline-danger'}`}
                                    >
                                        <i className="ti ti-shopping-cart me-1"></i>
                                        상가
                                    </Link>
                                    <Link
                                        href={`?${new URLSearchParams({
                                            ...(searchParams.status && { status: searchParams.status }),
                                            propertyType: 'OFFICE'
                                        }).toString()}`}
                                        className={`btn btn-sm ${searchParams.propertyType === 'OFFICE' ? 'btn-dark' : 'btn-outline-dark'}`}
                                    >
                                        <i className="ti ti-briefcase me-1"></i>
                                        사무실
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Table */}
                {properties.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <i className="ti ti-inbox fs-1 text-muted mb-3"></i>
                            <p className="text-muted fs-lg mb-0">등록된 매물이 없습니다.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped mb-0">
                                        <thead className="bg-primary-600 text-white">
                                            <tr>
                                                <th className="text-center" style={{ width: '60px' }}>No</th>
                                                <th>매물명</th>
                                                <th>주소</th>
                                                <th className="text-center">유형</th>
                                                <th className="text-end">가격</th>
                                                <th className="text-center">면적</th>
                                                <th className="text-center">상태</th>
                                                <th className="text-center" style={{ width: '120px' }}>관리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {properties.map((property, index) => (
                                                <tr key={property.id}>
                                                    <td className="text-center text-muted fw-500">
                                                        {totalCount - skip - index}
                                                    </td>
                                                    <td>
                                                        <div className="fw-600">{property.title}</div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="ti ti-map-pin text-muted me-1"></i>
                                                            <span className="text-truncate" style={{ maxWidth: '250px' }}>
                                                                {property.address}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={getPropertyTypeBadgeClass(property.propertyType)}>
                                                            {getPropertyTypeLabel(property.propertyType)}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <span className="fw-600 text-primary-600">
                                                            {getPriceDisplay(property)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center text-muted">
                                                        {property.exclusiveArea}m²
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${getStatusBadgeClass(property.status)}`}>
                                                            {getStatusLabel(property.status)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex gap-1 justify-content-center">
                                                            <Link
                                                                href={`/admin/properties/${property.id}`}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="상세보기"
                                                            >
                                                                <i className="ti ti-eye"></i>
                                                            </Link>
                                                            <Link
                                                                href={`/admin/properties/${property.id}/edit`}
                                                                className="btn btn-sm btn-outline-secondary"
                                                                title="수정"
                                                            >
                                                                <i className="ti ti-edit"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="card mt-3">
                                <div className="card-body">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-center mb-0">
                                            {/* Previous Button */}
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <Link
                                                    href={createPageURL(currentPage - 1)}
                                                    className="page-link"
                                                    aria-label="Previous"
                                                >
                                                    <span aria-hidden="true">&laquo;</span>
                                                </Link>
                                            </li>

                                            {/* Page Numbers */}
                                            {getPageRange().map((page, index) => (
                                                page === '...' ? (
                                                    <li key={`dots-${index}`} className="page-item disabled">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                ) : (
                                                    <li
                                                        key={page}
                                                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                                                    >
                                                        <Link
                                                            href={createPageURL(page as number)}
                                                            className="page-link"
                                                        >
                                                            {page}
                                                        </Link>
                                                    </li>
                                                )
                                            ))}

                                            {/* Next Button */}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <Link
                                                    href={createPageURL(currentPage + 1)}
                                                    className="page-link"
                                                    aria-label="Next"
                                                >
                                                    <span aria-hidden="true">&raquo;</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
