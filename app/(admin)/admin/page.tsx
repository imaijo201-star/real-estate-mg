import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
    // Get statistics
    const totalProperties = await prisma.property.count();
    const availableProperties = await prisma.property.count({
        where: { status: 'AVAILABLE' }
    });
    const reservedProperties = await prisma.property.count({
        where: { status: 'RESERVED' }
    });
    const soldProperties = await prisma.property.count({
        where: { status: 'SOLD' }
    });

    // This month's new properties
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newThisMonth = await prisma.property.count({
        where: {
            createdAt: { gte: startOfMonth }
        }
    });

    // Last month's count for comparison
    const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const newLastMonth = await prisma.property.count({
        where: {
            createdAt: {
                gte: startOfLastMonth,
                lt: startOfMonth
            }
        }
    });

    // Calculate growth rate
    const growthRate = newLastMonth > 0
        ? ((newThisMonth - newLastMonth) / newLastMonth * 100).toFixed(1)
        : newThisMonth > 0 ? '100' : '0';

    // Average price calculation
    const properties = await prisma.property.findMany({
        where: {
            salePrice: { not: null }
        },
        select: { salePrice: true }
    });
    const avgPrice = properties.length > 0
        ? Math.round(properties.reduce((sum, p) => sum + (p.salePrice || 0), 0) / properties.length)
        : 0;

    // Completion rate
    const completionRate = totalProperties > 0
        ? ((soldProperties / totalProperties) * 100).toFixed(1)
        : '0';

    // Popular locations (top 3)
    const locationGroups = await prisma.property.groupBy({
        by: ['address'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 3
    });

    // Get property type distribution
    const propertyTypes = await prisma.property.groupBy({
        by: ['propertyType'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
    });

    // Get recent properties with images
    const recentProperties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: {
            images: {
                where: { isMain: true },
                take: 1
            }
        }
    });

    // Type labels
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

    // Badge color classes for property types
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

    // Format relative time
    const getRelativeTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return new Date(date).toLocaleDateString('ko-KR');
    };

    return (
        <div className="content-wrapper">
            {/* Page Header */}
            <h1 className="subheader-title mb-2">대시보드</h1>

            {/* Breadcrumb */}
            <nav className="app-breadcrumb" aria-label="breadcrumb">
                <ol className="breadcrumb ms-0 text-muted mb-0">
                    <li className="breadcrumb-item active" aria-current="page">대시보드</li>
                </ol>
            </nav>

            {/* Description */}
            <h6 className="mt-3 mb-4 fst-italic">
                매물 관리 시스템의 주요 지표와 최근 활동을 한눈에 확인하세요.
            </h6>

            {/* Main Content */}
            <div className="main-content">
                {/* Primary Statistics Cards */}
                <div className="row g-3 mb-g">
                    {/* Total Properties */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-white bg-opacity-25 text-white rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ti ti-home fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-white text-opacity-75 text-uppercase mb-1">전체 매물</div>
                                        <div className="fs-2 fw-700 text-white">{totalProperties.toLocaleString()}</div>
                                        <div className="fs-sm text-white text-opacity-75 mt-1">
                                            <i className="ti ti-trending-up me-1"></i>
                                            전체 등록 매물
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100" style={{ background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-white bg-opacity-25 text-white rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ti ti-check fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-white text-opacity-75 text-uppercase mb-1">판매중</div>
                                        <div className="fs-2 fw-700 text-white">{availableProperties.toLocaleString()}</div>
                                        <div className="fs-sm text-white text-opacity-75 mt-1">
                                            <i className="ti ti-circle-check me-1"></i>
                                            {totalProperties > 0 ? ((availableProperties / totalProperties) * 100).toFixed(0) : 0}% 판매 중
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reserved */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100())' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-white bg-opacity-25 text-white rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ti ti-clock fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-white text-opacity-75 text-uppercase mb-1">예약중</div>
                                        <div className="fs-2 fw-700 text-white">{reservedProperties.toLocaleString()}</div>
                                        <div className="fs-sm text-white text-opacity-75 mt-1">
                                            <i className="ti ti-hourglass me-1"></i>
                                            거래 진행중
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sold */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-white bg-opacity-25 text-white rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ti ti-circle-check fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-white text-opacity-75 text-uppercase mb-1">거래완료</div>
                                        <div className="fs-2 fw-700 text-white">{soldProperties.toLocaleString()}</div>
                                        <div className="fs-sm text-white text-opacity-75 mt-1">
                                            <i className="ti ti-medal me-1"></i>
                                            완료율 {completionRate}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Statistics */}
                <div className="row g-3 mb-g">
                    {/* New This Month */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-primary-100 text-primary-600 rounded p-3">
                                            <i className="ti ti-calendar-plus fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-muted text-uppercase mb-1">이번 달 신규</div>
                                        <div className="fs-2 fw-700 text-primary-600">{newThisMonth}</div>
                                        <div className="fs-sm mt-1">
                                            <span className={`badge ${Number(growthRate) >= 0 ? 'bg-success' : 'bg-danger'}`}>
                                                <i className={`ti ti-trending-${Number(growthRate) >= 0 ? 'up' : 'down'} me-1`}></i>
                                                {growthRate}%
                                            </span>
                                            <span className="text-muted ms-2">전월 대비</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Average Price */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-success-100 text-success-600 rounded p-3">
                                            <i className="ti ti-credit-card fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-muted text-uppercase mb-1">평균 매물 가격</div>
                                        <div className="fs-2 fw-700 text-success-600">{avgPrice.toLocaleString()}</div>
                                        <div className="fs-sm text-muted mt-1">만원</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div className="bg-warning-100 text-warning-600 rounded p-3">
                                            <i className="ti ti-chart-line fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-muted text-uppercase mb-1">거래 완료율</div>
                                        <div className="fs-2 fw-700 text-warning-600">{completionRate}%</div>
                                        <div className="progress mt-2" style={{ height: '6px' }}>
                                            <div
                                                className="progress-bar bg-warning-600"
                                                style={{ width: `${completionRate}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Popular Location */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm hover-lift h-100">
                            <div className="card-body">
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0">
                                        <div className="bg-danger-100 text-danger-600 rounded p-3">
                                            <i className="ti ti-map-pin fs-1"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="fs-nano text-muted text-uppercase mb-2">인기 지역 TOP 3</div>
                                        {locationGroups.slice(0, 3).map((loc, idx) => (
                                            <div key={idx} className="mb-1">
                                                <span className="badge bg-danger-600 text-white me-1">{idx + 1}</span>
                                                <span className="fs-sm text-truncate d-inline-block" style={{ maxWidth: '140px' }}>
                                                    {loc.address.split(' ').slice(0, 2).join(' ')}
                                                </span>
                                                <span className="badge bg-secondary ms-1">{loc._count.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    {/* Property Type Distribution */}
                    <div className="col-xl-4">
                        <div className="card h-100">
                            <div className="card-header bg-primary-600 text-white">
                                <h5 className="card-title mb-0">
                                    <i className="ti ti-chart-pie me-2"></i>
                                    매물 유형별 분포
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>유형</th>
                                                <th className="text-end">개수</th>
                                                <th className="text-end">비율</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {propertyTypes.map((item) => {
                                                const percentage = ((item._count.id / totalProperties) * 100).toFixed(1);
                                                return (
                                                    <tr key={item.propertyType}>
                                                        <td>
                                                            <span className={getPropertyTypeBadgeClass(item.propertyType)}>
                                                                {getPropertyTypeLabel(item.propertyType)}
                                                            </span>
                                                        </td>
                                                        <td className="text-end fw-600">{item._count.id.toLocaleString()}</td>
                                                        <td className="text-end">
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <div className="progress flex-grow-1 me-2" style={{ height: '6px', maxWidth: '80px' }}>
                                                                    <div
                                                                        className="progress-bar bg-primary-600"
                                                                        style={{ width: `${percentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-muted fs-sm">{percentage}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Properties with Images */}
                    <div className="col-xl-8">
                        <div className="card h-100">
                            <div className="card-header bg-success-600 text-white d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">
                                    <i className="ti ti-clock me-2"></i>
                                    최근 등록 매물
                                </h5>
                                <Link href="/admin/properties" className="btn btn-sm btn-light">
                                    전체보기
                                </Link>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {recentProperties.map((property) => (
                                        <div key={property.id} className="col-md-6 col-lg-4">
                                            <Link
                                                href={`/admin/properties/${property.id}`}
                                                className="text-decoration-none"
                                            >
                                                <div className="card h-100 hover-lift border">
                                                    {property.images[0] ? (
                                                        <img
                                                            src={property.images[0].url}
                                                            className="card-img-top"
                                                            alt={property.title}
                                                            style={{ height: '120px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="card-img-top bg-secondary-100 d-flex align-items-center justify-content-center"
                                                            style={{ height: '120px' }}
                                                        >
                                                            <i className="ti ti-photo text-secondary fs-1"></i>
                                                        </div>
                                                    )}
                                                    <div className="card-body p-2">
                                                        <h6 className="card-title mb-1 text-truncate fw-600" style={{ fontSize: '0.875rem' }}>
                                                            {property.title}
                                                        </h6>
                                                        <p className="card-text mb-1 text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                                                            <i className="ti ti-map-pin me-1"></i>
                                                            {property.address}
                                                        </p>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="badge bg-primary-100 text-primary-600" style={{ fontSize: '0.7rem' }}>
                                                                {getPropertyTypeLabel(property.propertyType)}
                                                            </span>
                                                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                {getRelativeTime(property.createdAt)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card mt-g border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            <i className="ti ti-bolt me-2 text-warning"></i>
                            빠른 작업
                        </h5>

                        {/* Action Buttons */}
                        <div className="mb-3">
                            <h6 className="text-muted fw-600 mb-2 fs-sm">
                                <i className="ti ti-settings me-1"></i>
                                일반 작업
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                <Link href="/admin/properties/new" className="btn btn-primary">
                                    <i className="ti ti-plus me-1"></i>
                                    매물 등록
                                </Link>
                                <Link href="/admin/properties" className="btn btn-outline-primary">
                                    <i className="ti ti-list me-1"></i>
                                    매물 목록
                                </Link>
                            </div>
                        </div>

                        {/* Status Filter Buttons */}
                        <div className="mb-3">
                            <h6 className="text-muted fw-600 mb-2 fs-sm">
                                <i className="ti ti-flag me-1"></i>
                                상태별 매물
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                <Link href="/admin/properties?status=AVAILABLE" className="btn btn-outline-success">
                                    <i className="ti ti-filter me-1"></i>
                                    판매중 매물
                                </Link>
                                <Link href="/admin/properties?status=RESERVED" className="btn btn-outline-warning">
                                    <i className="ti ti-clock me-1"></i>
                                    예약중 매물
                                </Link>
                                <Link href="/admin/properties?status=SOLD" className="btn btn-outline-info">
                                    <i className="ti ti-circle-check me-1"></i>
                                    거래완료 매물
                                </Link>
                            </div>
                        </div>

                        {/* Property Type Filter Buttons */}
                        <div>
                            <h6 className="text-muted fw-600 mb-2 fs-sm">
                                <i className="ti ti-building me-1"></i>
                                유형별 매물
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                <Link href="/admin/properties?propertyType=APARTMENT" className="btn btn-outline-primary btn-sm">
                                    <i className="ti ti-building-skyscraper me-1"></i>
                                    아파트
                                </Link>
                                <Link href="/admin/properties?propertyType=OFFICETEL" className="btn btn-outline-success btn-sm">
                                    <i className="ti ti-building me-1"></i>
                                    오피스텔
                                </Link>
                                <Link href="/admin/properties?propertyType=VILLA" className="btn btn-outline-info btn-sm">
                                    <i className="ti ti-home me-1"></i>
                                    빌라
                                </Link>
                                <Link href="/admin/properties?propertyType=HOUSE" className="btn btn-outline-warning btn-sm">
                                    <i className="ti ti-home-2 me-1"></i>
                                    주택
                                </Link>
                                <Link href="/admin/properties?propertyType=ONE_ROOM" className="btn btn-outline-secondary btn-sm">
                                    <i className="ti ti-door me-1"></i>
                                    원룸
                                </Link>
                                <Link href="/admin/properties?propertyType=TWO_ROOM" className="btn btn-outline-secondary btn-sm">
                                    <i className="ti ti-layout me-1"></i>
                                    투룸
                                </Link>
                                <Link href="/admin/properties?propertyType=COMMERCIAL" className="btn btn-outline-danger btn-sm">
                                    <i className="ti ti-shopping-cart me-1"></i>
                                    상가
                                </Link>
                                <Link href="/admin/properties?propertyType=OFFICE" className="btn btn-outline-dark btn-sm">
                                    <i className="ti ti-briefcase me-1"></i>
                                    사무실
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
