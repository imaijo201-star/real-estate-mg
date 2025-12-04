import Link from 'next/link';
import { Property } from '@prisma/client';

export function PropertyCard({ property }: { property: Property }) {
    // 가격 표시 로직
    const getPriceDisplay = () => {
        if (property.tradeType === 'SALE' && property.salePrice) {
            return `${property.salePrice.toLocaleString()}만원`;
        } else if (property.tradeType === 'JEONSE' && property.deposit) {
            return `전세 ${property.deposit.toLocaleString()}만원`;
        } else if (property.tradeType === 'MONTHLY') {
            return `${property.deposit?.toLocaleString() || 0}/${property.monthlyRent?.toLocaleString() || 0}만원`;
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
        <div className="card shadow-sm hover-lift">
            <div className="card-body p-4">
                {/* 헤더: 매물 유형 & 상태 */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary-600 fs-xs">
                        {getPropertyTypeLabel(property.propertyType)}
                    </span>
                    <span className={`badge fs-xs ${property.status === 'AVAILABLE' ? 'bg-success' :
                            property.status === 'RESERVED' ? 'bg-warning' :
                                'bg-danger'
                        }`}>
                        {getStatusLabel(property.status)}
                    </span>
                </div>

                {/* 제목 */}
                <h5 className="card-title text-truncate mb-2 fw-600">
                    {property.title}
                </h5>

                {/* 주소 */}
                <p className="text-muted fs-sm text-truncate mb-3">
                    <svg className="sa-icon sa-icon-sm me-1" style={{ verticalAlign: 'middle' }}>
                        <use href="/icons/sprite.svg#map-pin" />
                    </svg>
                    {property.address}
                </p>

                {/* 가격 & 면적 */}
                <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                        <div className="fs-nano text-muted mb-1">가격</div>
                        <div className="fs-lg fw-700 text-primary-600">
                            {getPriceDisplay()}
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="fs-nano text-muted mb-1">면적</div>
                        <div className="fs-md fw-600">
                            {property.exclusiveArea}m²
                        </div>
                    </div>
                </div>

                {/* 상세보기 버튼 */}
                <Link
                    href={`/admin/properties/${property.id}`}
                    className="btn btn-sm btn-outline-primary w-100"
                >
                    상세보기
                </Link>
            </div>
        </div>
    );
}
