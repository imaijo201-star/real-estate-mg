import { prisma } from '@/lib/prisma';
import { deleteProperty } from '@/actions/property';
import Link from 'next/link';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = await prisma.property.findUnique({
        where: { id: Number(params.id) },
        include: {
            agentInfo: true,
            commercialInfo: true,
            landInfo: true,
            officeInfo: true,
            factoryInfo: true,
        },
    });

    if (!property) {
        return (
            <div className="container-fluid">
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <svg className="sa-icon sa-icon-5x text-muted mb-3">
                            <use href="/icons/sprite.svg#alert-circle" />
                        </svg>
                        <p className="text-muted">매물을 찾을 수 없습니다.</p>
                        <Link href="/admin/properties" className="btn btn-primary mt-3">
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

    return (
        <div className="container-fluid">
            {/* 페이지 헤더 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-1 fw-700">{property.title}</h2>
                    <p className="text-muted mb-0">
                        <svg className="sa-icon sa-icon-sm me-1" style={{ verticalAlign: 'middle' }}>
                            <use href="/icons/sprite.svg#map-pin" />
                        </svg>
                        {property.address}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/admin/properties" className="btn btn-outline-secondary">
                        <svg className="sa-icon me-2" width="16" height="16">
                            <use href="/icons/sprite.svg#arrow-left" />
                        </svg>
                        목록으로
                    </Link>
                    <form action={deleteProperty.bind(null, property.id)}>
                        <button className="btn btn-danger">
                            <svg className="sa-icon me-2" width="16" height="16">
                                <use href="/icons/sprite.svg#trash-2" />
                            </svg>
                            삭제
                        </button>
                    </form>
                </div>
            </div>

            <div className="row">
                {/* 메인 콘텐츠 */}
                <div className="col-lg-8">
                    {/* 가격 및 상태 */}
                    <div className="card shadow-sm mb-4 border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fs-nano text-muted mb-1">가격</div>
                                    <div className="h2 mb-0 fw-700 text-primary-600">
                                        {getPriceDisplay()}
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-primary-600 fs-sm">
                                        {getPropertyTypeLabel(property.propertyType)}
                                    </span>
                                    <span className={`badge fs-sm ${property.status === 'AVAILABLE' ? 'bg-success' :
                                            property.status === 'RESERVED' ? 'bg-warning' :
                                                'bg-danger'
                                        }`}>
                                        {getStatusLabel(property.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 한줄 소개 */}
                    {property.summary && (
                        <div className="alert alert-info mb-4">
                            <svg className="sa-icon me-2">
                                <use href="/icons/sprite.svg#info" />
                            </svg>
                            {property.summary}
                        </div>
                    )}

                    {/* 기본 정보 */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">기본 정보</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <svg className="sa-icon text-primary me-2 mt-1">
                                            <use href="/icons/sprite.svg#map-pin" />
                                        </svg>
                                        <div>
                                            <div className="fs-sm text-muted mb-1">주소</div>
                                            <div className="fw-500">{property.address}</div>
                                            {property.addressDetail && (
                                                <div className="fs-sm text-muted">{property.addressDetail}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <svg className="sa-icon text-primary me-2 mt-1">
                                            <use href="/icons/sprite.svg#maximize" />
                                        </svg>
                                        <div>
                                            <div className="fs-sm text-muted mb-1">면적</div>
                                            <div className="fw-500">{property.exclusiveArea}m² (전용)</div>
                                            {property.supplyArea && (
                                                <div className="fs-sm text-muted">{property.supplyArea}m² (공급)</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {property.floor && (
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <svg className="sa-icon text-primary me-2 mt-1">
                                                <use href="/icons/sprite.svg#layers" />
                                            </svg>
                                            <div>
                                                <div className="fs-sm text-muted mb-1">층수</div>
                                                <div className="fw-500">{property.floor}층 / {property.totalFloors}층</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <svg className="sa-icon text-primary me-2 mt-1">
                                            <use href="/icons/sprite.svg#home" />
                                        </svg>
                                        <div>
                                            <div className="fs-sm text-muted mb-1">방 / 욕실</div>
                                            <div className="fw-500">{property.rooms}개 / {property.bathrooms}개</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 상세 설명 */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header">
                            <h5 className="card-title mb-0">상세 설명</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {property.description || '상세 설명이 없습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* 유형별 정보 - 상가 */}
                    {property.commercialInfo && (
                        <div className="card shadow-sm mb-4 border-warning">
                            <div className="card-header bg-warning-100">
                                <h5 className="card-title mb-0 text-warning-800">
                                    <svg className="sa-icon me-2">
                                        <use href="/icons/sprite.svg#shopping-bag" />
                                    </svg>
                                    상가 정보
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {property.commercialInfo.premiumFee && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">권리금</div>
                                            <div className="fw-500">{property.commercialInfo.premiumFee.toLocaleString()}만원</div>
                                        </div>
                                    )}
                                    {property.commercialInfo.monthlyRevenue && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">월 매출</div>
                                            <div className="fw-500">{property.commercialInfo.monthlyRevenue.toLocaleString()}만원</div>
                                        </div>
                                    )}
                                    {property.commercialInfo.recommendedBusinesses && (
                                        <div className="col-12">
                                            <div className="fs-sm text-muted">추천 업종</div>
                                            <div className="fw-500">{property.commercialInfo.recommendedBusinesses}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 유형별 정보 - 토지 */}
                    {property.landInfo && (
                        <div className="card shadow-sm mb-4 border-success">
                            <div className="card-header bg-success-100">
                                <h5 className="card-title mb-0 text-success-800">
                                    <svg className="sa-icon me-2">
                                        <use href="/icons/sprite.svg#layers" />
                                    </svg>
                                    토지 정보
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {property.landInfo.landCategory && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">지목</div>
                                            <div className="fw-500">{property.landInfo.landCategory}</div>
                                        </div>
                                    )}
                                    {property.landInfo.zoning && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">용도지역</div>
                                            <div className="fw-500">{property.landInfo.zoning}</div>
                                        </div>
                                    )}
                                    {property.landInfo.buildingCoverageRatio && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">건폐율</div>
                                            <div className="fw-500">{property.landInfo.buildingCoverageRatio}%</div>
                                        </div>
                                    )}
                                    {property.landInfo.floorAreaRatio && (
                                        <div className="col-md-6">
                                            <div className="fs-sm text-muted">용적률</div>
                                            <div className="fw-500">{property.landInfo.floorAreaRatio}%</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 사이드바 */}
                <div className="col-lg-4">
                    {/* 중개사 정보 */}
                    {property.agentInfo && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">중개사 정보</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <div className="fs-sm text-muted mb-1">사무소</div>
                                    <div className="fw-500">{property.agentInfo.officeName}</div>
                                </div>
                                <div>
                                    <div className="fs-sm text-muted mb-1">전화번호</div>
                                    <a href={`tel:${property.agentInfo.phone}`} className="fw-500 text-primary">
                                        {property.agentInfo.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 등록 정보 */}
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="card-title mb-0">등록 정보</h5>
                        </div>
                        <div className="card-body">
                            <div className="fs-sm">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">등록일</span>
                                    <span className="fw-500">{new Date(property.createdAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">수정일</span>
                                    <span className="fw-500">{new Date(property.updatedAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
