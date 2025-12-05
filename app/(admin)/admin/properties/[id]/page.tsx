import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from './DeleteButton';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = await prisma.property.findUnique({
        where: { id: Number(params.id) },
        include: {
            images: {
                orderBy: { order: 'asc' },
            },
            agentInfo: true,
            commercialInfo: true,
            landInfo: true,
            officeInfo: true,
            factoryInfo: true,
        },
    });

    if (!property) {
        notFound();
    }

    const getPropertyTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            APARTMENT: '아파트',
            OFFICETEL: '오피스텔',
            VILLA: '빌라',
            HOUSE: '주택',
            ONE_ROOM: '원룸',
            TWO_ROOM: '투룸',
            COMMERCIAL: '상가',
            OFFICE: '사무실',
            FACTORY: '공장',
            LAND: '토지',
        };
        return labels[type] || type;
    };

    const getStatusLabel = (status: string) => {
        const labels: { [key: string]: string } = {
            AVAILABLE: '판매중',
            RESERVED: '예약됨',
            SOLD: '거래완료',
        };
        return labels[status] || status;
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('ko-KR');
    };

    // 가격 표시 로직
    const getPriceDisplay = () => {
        if (property.tradeType === 'SALE' && property.salePrice) {
            return `매매 ${property.salePrice.toLocaleString()}만원`;
        } else if (property.tradeType === 'JEONSE' && property.deposit) {
            return `전세 ${property.deposit.toLocaleString()}만원`;
        } else if (property.tradeType === 'MONTHLY') {
            return `월세 ${property.deposit?.toLocaleString() || 0}/${property.monthlyRent?.toLocaleString() || 0}만원`;
        }
        return '가격 미정';
    };

    const getStatusBadgeClass = (status: string) => {
        if (status === 'AVAILABLE') return 'bg-success';
        if (status === 'RESERVED') return 'bg-warning text-dark';
        return 'bg-danger';
    };

    return (
        <div className="content-wrapper">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="subheader-title mb-1">{property.title}</h1>
                    <nav className="app-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb ms-0 text-muted mb-0">
                            <li className="breadcrumb-item"><Link href="/admin">대시보드</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/properties">매물 관리</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
                        </ol>
                    </nav>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/admin/properties" className="btn btn-outline-secondary">
                        <i className="ti ti-list me-1"></i>
                        목록
                    </Link>
                    <Link href={`/admin/properties/${property.id}/edit`} className="btn btn-primary">
                        <i className="ti ti-edit me-1"></i>
                        수정
                    </Link>
                    <DeleteButton propertyId={property.id} />
                </div>
            </div>

            <div className="row g-3">
                {/* Left Column - Image Gallery */}
                <div className="col-lg-8">
                    {/* Image Gallery */}
                    {property.images && property.images.length > 0 ? (
                        <div className="card mb-3 overflow-hidden">
                            <div className="position-relative" style={{ height: '400px' }}>
                                <img
                                    src={property.images.find(img => img.isMain)?.url || property.images[0].url}
                                    alt={property.title}
                                    className="w-100 h-100 object-fit-cover"
                                />

                                {/* 이미지 개수 배지 */}
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className="badge bg-dark bg-opacity-75 fs-sm px-3 py-2">
                                        <i className="ti ti-photo me-1"></i>
                                        {property.images.length}장
                                    </span>
                                </div>

                                {/* 대표 이미지 배지 */}
                                {property.images.find(img => img.isMain) && (
                                    <div className="position-absolute top-0 start-0 m-3">
                                        <span className="badge bg-warning text-dark fs-sm px-3 py-2">
                                            <i className="ti ti-star-filled me-1"></i>
                                            대표 이미지
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Navigation */}
                            {property.images.length > 1 && (
                                <div className="bg-light p-3">
                                    <div className="d-flex gap-2 overflow-auto">
                                        {property.images.map((img, index) => (
                                            <div key={img.id} className="flex-shrink-0">
                                                <img
                                                    src={img.url}
                                                    alt={`${property.title} ${index + 1}`}
                                                    className={`rounded border ${img.isMain ? 'border-warning border-3' : 'border-light'
                                                        }`}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                {img.isMain && (
                                                    <div className="text-center">
                                                        <i className="ti ti-star-filled text-warning fs-xs"></i>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card mb-3 overflow-hidden">
                            <div
                                className="bg-primary-100 d-flex align-items-center justify-content-center"
                                style={{ height: '400px' }}
                            >
                                <div className="text-center">
                                    <i className="ti ti-photo fs-1 text-primary-600 mb-3"></i>
                                    <h5 className="text-primary-600 mb-2">매물 이미지</h5>
                                    <p className="text-muted fs-sm mb-0">등록된 이미지가 없습니다</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Property Details Card */}
                    <div className="card mb-3">
                        <div className="card-header bg-white border-bottom">
                            <h5 className="card-title mb-0 fw-600">
                                <i className="ti ti-info-circle me-2 text-primary"></i>
                                매물 상세 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* 주소 */}
                            <div className="alert alert-light mb-3">
                                <div className="d-flex align-items-start">
                                    <i className="ti ti-map-pin text-danger fs-4 me-2 mt-1"></i>
                                    <div>
                                        <div className="fw-600 mb-1">{property.address}</div>
                                        {property.addressDetail && <div className="text-muted fs-sm">{property.addressDetail}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* 면적 정보 */}
                            <h6 className="fw-600 mb-3 mt-4">
                                <i className="ti ti-ruler-2 me-2 text-primary"></i>
                                면적 정보
                            </h6>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <div className="text-muted fs-sm mb-1">전용면적</div>
                                        <div className="fs-4 fw-600 text-primary">{property.exclusiveArea}m²</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <div className="text-muted fs-sm mb-1">공급면적</div>
                                        <div className="fs-4 fw-600 text-primary">{property.supplyArea || '-'}m²</div>
                                    </div>
                                </div>
                            </div>

                            {/* 건물 정보 */}
                            <h6 className="fw-600 mb-3 mt-4">
                                <i className="ti ti-building me-2 text-primary"></i>
                                건물 정보
                            </h6>
                            <div className="row g-3 mb-4">
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-stairs text-muted me-2 fs-4"></i>
                                        <div>
                                            <div className="text-muted fs-xs">층수</div>
                                            <div className="fw-600">{property.floor || '-'}층 / {property.totalFloors || '-'}층</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-bed text-muted me-2 fs-4"></i>
                                        <div>
                                            <div className="text-muted fs-xs">방 개수</div>
                                            <div className="fw-600">{property.rooms}개</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-bath text-muted me-2 fs-4"></i>
                                        <div>
                                            <div className="text-muted fs-xs">욕실</div>
                                            <div className="fw-600">{property.bathrooms}개</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-calendar text-muted me-2 fs-4"></i>
                                        <div>
                                            <div className="text-muted fs-xs">건축년도</div>
                                            <div className="fw-600">{property.buildYear || '-'}년</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 편의시설 */}
                            <h6 className="fw-600 mb-3 mt-4">
                                <i className="ti ti-tools me-2 text-primary"></i>
                                편의시설
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                                {property.hasElevator && (
                                    <span className="badge bg-success-100 text-success-700 fs-sm px-3 py-2">
                                        <i className="ti ti-elevator me-1"></i>
                                        엘리베이터
                                    </span>
                                )}
                                {property.parkingSpaces > 0 && (
                                    <span className="badge bg-info-100 text-info-700 fs-sm px-3 py-2">
                                        <i className="ti ti-car me-1"></i>
                                        주차 {property.parkingSpaces}대
                                    </span>
                                )}
                                {property.heatingType && (
                                    <span className="badge bg-warning-100 text-warning-700 fs-sm px-3 py-2">
                                        <i className="ti ti-flame me-1"></i>
                                        {property.heatingType}
                                    </span>
                                )}
                                {property.direction && (
                                    <span className="badge bg-primary-100 text-primary-700 fs-sm px-3 py-2">
                                        <i className="ti ti-compass me-1"></i>
                                        {property.direction}
                                    </span>
                                )}
                            </div>

                            {/* 설명 */}
                            {property.summary && (
                                <>
                                    <hr className="my-4" />
                                    <div className="alert alert-info">
                                        <i className="ti ti-info-circle me-2"></i>
                                        <strong>한줄 요약:</strong> {property.summary}
                                    </div>
                                </>
                            )}

                            {property.description && (
                                <>
                                    <h6 className="fw-600 mb-2 mt-4">
                                        <i className="ti ti-file-text me-2 text-primary"></i>
                                        상세 설명
                                    </h6>
                                    <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{property.description}</p>
                                </>
                            )}
                        </div>
                        <div className="card-footer bg-light text-muted fs-sm">
                            <div className="d-flex justify-content-between">
                                <span><i className="ti ti-calendar-plus me-1"></i>등록일: {formatDate(property.createdAt)}</span>
                                <span><i className="ti ti-calendar-edit me-1"></i>수정일: {formatDate(property.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Key Info */}
                <div className="col-lg-4">
                    {/* Price & Status Card */}
                    <div className="card mb-3 border-primary">
                        <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0 fw-bold">
                                <i className="ti ti-cash me-2"></i>
                                가격 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-3">
                                <div className="fs-1 fw-bold text-primary mb-2">{getPriceDisplay()}</div>
                                <span className={`badge ${getStatusBadgeClass(property.status)} fs-md px-3 py-2`}>
                                    {getStatusLabel(property.status)}
                                </span>
                            </div>
                            {property.maintenanceFee && (
                                <div className="border-top pt-3 mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">
                                            <i className="ti ti-receipt me-1"></i>
                                            관리비
                                        </span>
                                        <span className="fw-600">{property.maintenanceFee}만원</span>
                                    </div>
                                    {property.maintenanceIncludes && (
                                        <div className="text-muted fs-sm">
                                            <i className="ti ti-check me-1"></i>
                                            {property.maintenanceIncludes}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Key Stats Cards */}
                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <div className="card bg-primary-100 border-0">
                                <div className="card-body text-center">
                                    <i className="ti ti-category text-primary fs-2 mb-2"></i>
                                    <div className="text-muted fs-xs mb-1">매물 유형</div>
                                    <div className="fw-600 text-primary">{getPropertyTypeLabel(property.propertyType)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card bg-success-100 border-0">
                                <div className="card-body text-center">
                                    <i className="ti ti-dimensions text-success fs-2 mb-2"></i>
                                    <div className="text-muted fs-xs mb-1">전용면적</div>
                                    <div className="fw-600 text-success">{property.exclusiveArea}m²</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card bg-info-100 border-0">
                                <div className="card-body text-center">
                                    <i className="ti ti-stairs text-info fs-2 mb-2"></i>
                                    <div className="text-muted fs-xs mb-1">층수</div>
                                    <div className="fw-600 text-info">{property.floor || '-'}/{property.totalFloors || '-'}층</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card bg-warning-100 border-0">
                                <div className="card-body text-center">
                                    <i className="ti ti-door text-warning fs-2 mb-2"></i>
                                    <div className="text-muted fs-xs mb-1">구조</div>
                                    <div className="fw-600 text-warning">{property.rooms}R/{property.bathrooms}B</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 부동산 정보 - 항상 표시 */}
                    <div className="card mb-3 border-secondary">
                        <div className="card-header bg-secondary-100">
                            <h6 className="card-title mb-0 fw-600">
                                <i className="ti ti-file-certificate me-2 text-secondary"></i>
                                부동산 등록 정보
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="text-muted fs-xs mb-1">승인번호</div>
                                <div className="fw-600 fs-sm font-monospace">
                                    {property.approvalNo || <span className="text-muted">등록 예정</span>}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted fs-xs mb-1">승인일자</div>
                                <div className="fw-600">
                                    <i className="ti ti-calendar-check me-1 text-success"></i>
                                    {property.confirmDate ? formatDate(property.confirmDate) : <span className="text-muted">승인 대기</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 날짜 정보 */}
                    {property.availableFrom && (
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="card-title mb-3">
                                    <i className="ti ti-calendar-event me-2 text-primary"></i>
                                    입주 가능일
                                </h6>
                                <div className="fs-4 fw-600 text-primary text-center">
                                    {formatDate(property.availableFrom)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 중개사 정보 - 항상 표시 */}
                    <div className="card">
                        <div className="card-header bg-secondary-100">
                            <h6 className="card-title mb-0 fw-600">
                                <i className="ti ti-user-circle me-2 text-secondary"></i>
                                중개사 정보
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <div className="text-muted fs-xs mb-1">중개사무소</div>
                                <div className="fw-600">
                                    {property.agentInfo?.officeName || <span className="text-muted">정보 없음</span>}
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="text-muted fs-xs mb-1">연락처</div>
                                <div className="fw-600">
                                    <i className="ti ti-phone me-1 text-success"></i>
                                    {property.agentInfo?.phone || <span className="text-muted">정보 없음</span>}
                                </div>
                            </div>
                            {property.agentInfo?.registrationNo && (
                                <div>
                                    <div className="text-muted fs-xs mb-1">등록번호</div>
                                    <div className="fw-600 fs-sm">{property.agentInfo.registrationNo}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Specialized Info Cards - Full Width Below */}
            {(property.commercialInfo || property.landInfo || property.officeInfo || property.factoryInfo) && (
                <div className="row g-3 mt-2">
                    {/* 상가 정보 */}
                    {property.commercialInfo && (
                        <div className="col-lg-6">
                            <div className="card border-warning">
                                <div className="card-header bg-warning-100">
                                    <h5 className="card-title mb-0 text-warning-700 fw-600">
                                        <i className="ti ti-shopping-cart me-2"></i>
                                        상가 추가 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">권리금</div>
                                            <div className="fs-5 fw-600">{property.commercialInfo.premiumFee ? `${property.commercialInfo.premiumFee.toLocaleString()}만원` : '-'}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">월 매출</div>
                                            <div className="fs-5 fw-600">{property.commercialInfo.monthlyRevenue ? `${property.commercialInfo.monthlyRevenue.toLocaleString()}만원` : '-'}</div>
                                        </div>
                                        <div className="col-12">
                                            <div className="text-muted fs-sm mb-1">추천 업종</div>
                                            <div className="fw-600">{property.commercialInfo.recommendedBusinesses || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 토지 정보 */}
                    {property.landInfo && (
                        <div className="col-lg-6">
                            <div className="card border-success">
                                <div className="card-header bg-success-100">
                                    <h5 className="card-title mb-0 text-success-700 fw-600">
                                        <i className="ti ti-map me-2"></i>
                                        토지 추가 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">지목</div>
                                            <div className="fw-600">{property.landInfo.landCategory || '-'}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">용도지역</div>
                                            <div className="fw-600">{property.landInfo.zoning || '-'}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">건폐율</div>
                                            <div className="fw-600">{property.landInfo.buildingCoverageRatio || '-'}%</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">용적률</div>
                                            <div className="fw-600">{property.landInfo.floorAreaRatio || '-'}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 사무실 정보 */}
                    {property.officeInfo && (
                        <div className="col-lg-6">
                            <div className="card border-info">
                                <div className="card-header bg-info-100">
                                    <h5 className="card-title mb-0 text-info-700 fw-600">
                                        <i className="ti ti-building-skyscraper me-2"></i>
                                        사무실 추가 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">회의실 수</div>
                                            <div className="fw-600">{property.officeInfo.meetingRooms || 0}개</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">인터넷 속도</div>
                                            <div className="fw-600">{property.officeInfo.internetSpeed || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 공장 정보 */}
                    {property.factoryInfo && (
                        <div className="col-lg-6">
                            <div className="card border-danger">
                                <div className="card-header bg-danger-100">
                                    <h5 className="card-title mb-0 text-danger-700 fw-600">
                                        <i className="ti ti-factory me-2"></i>
                                        공장 추가 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">천장 높이</div>
                                            <div className="fw-600">{property.factoryInfo.ceilingHeight || '-'}m</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">전기 용량</div>
                                            <div className="fw-600">{property.factoryInfo.electricCapacity || '-'}kW</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">화물 엘리베이터</div>
                                            <div className="fw-600">{property.factoryInfo.hasCargoElevator ? '있음' : '없음'}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="text-muted fs-sm mb-1">크레인</div>
                                            <div className="fw-600">{property.factoryInfo.hasCrane ? '있음' : '없음'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
