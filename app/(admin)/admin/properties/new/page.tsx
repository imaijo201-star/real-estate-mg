'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader, { UploadedImage } from '@/components/ui/ImageUploader';

export default function NewPropertyPage() {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState('APARTMENT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<UploadedImage[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // 이미지 데이터 추가
            images.forEach((img, index) => {
                formData.append('imageUrls', img.url);
                formData.append('imageOrders', String(img.order));
            });

            const mainIndex = images.findIndex(img => img.isMain);
            formData.append('mainImageIndex', String(mainIndex !== -1 ? mainIndex : 0));

            const response = await fetch('/api/properties', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ ' + data.message);
                router.push(`/admin/properties/${data.propertyId}`);
                router.refresh();
            } else {
                alert('❌ ' + (data.error || '등록에 실패했습니다.'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('❌ 등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="content-wrapper">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h1 className="subheader-title mb-1">
                        <i className="ti ti-plus-circle me-2"></i>
                        매물 등록
                    </h1>
                    <nav className="app-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb ms-0 text-muted mb-0">
                            <li className="breadcrumb-item"><Link href="/admin">대시보드</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/properties">매물 관리</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">매물 등록</li>
                        </ol>
                    </nav>
                </div>
                <Link href="/admin/properties" className="btn btn-outline-secondary">
                    <i className="ti ti-list me-1"></i>
                    목록
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="main-content">
                {/* Basic Info */}
                <div className="card mb-3 border-primary">
                    <div className="card-header bg-primary-100">
                        <h5 className="card-title mb-0 text-primary-700 fw-600">
                            <i className="ti ti-file-text me-2"></i>
                            기본 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-600">
                                    매물명 <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="예: 강남 래미안 아파트 34평"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">매물을 대표하는 제목을 입력하세요</small>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-600">
                                    <i className="ti ti-category me-1 text-primary"></i>
                                    건물 유형 <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="propertyType"
                                    required
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="form-select form-select-lg"
                                >
                                    <option value="APARTMENT">🏢 아파트</option>
                                    <option value="OFFICETEL">🏬 오피스텔</option>
                                    <option value="VILLA">🏘️ 빌라</option>
                                    <option value="HOUSE">🏠 주택</option>
                                    <option value="ONE_ROOM">🚪 원룸</option>
                                    <option value="TWO_ROOM">🚪🚪 투룸</option>
                                    <option value="COMMERCIAL">🏪 상가</option>
                                    <option value="OFFICE">💼 사무실</option>
                                    <option value="FACTORY">🏭 공장</option>
                                    <option value="LAND">🌳 토지</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-600">
                                    <i className="ti ti-file-invoice me-1 text-success"></i>
                                    거래 유형 <span className="text-danger">*</span>
                                </label>
                                <select name="tradeType" required className="form-select form-select-lg">
                                    <option value="SALE">💰 매매</option>
                                    <option value="JEONSE">🏦 전세</option>
                                    <option value="MONTHLY">📅 월세</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Info */}
                <div className="card mb-3 border-success">
                    <div className="card-header bg-success-100">
                        <h5 className="card-title mb-0 text-success-700 fw-600">
                            <i className="ti ti-cash me-2"></i>
                            가격 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-coin me-1 text-success"></i>
                                    매매가 (만원)
                                </label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    placeholder="50000"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">매매 시 입력</small>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-wallet me-1 text-info"></i>
                                    보증금 (만원)
                                </label>
                                <input
                                    type="number"
                                    name="deposit"
                                    placeholder="10000"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">전세/월세 시 입력</small>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-calendar-dollar me-1 text-warning"></i>
                                    월세 (만원)
                                </label>
                                <input
                                    type="number"
                                    name="monthlyRent"
                                    placeholder="100"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">월세 시 입력</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="card mb-3 border-info">
                    <div className="card-header bg-info-100">
                        <h5 className="card-title mb-0 text-info-700 fw-600">
                            <i className="ti ti-photo me-2"></i>
                            매물 이미지
                        </h5>
                    </div>
                    <div className="card-body">
                        <ImageUploader
                            images={images}
                            onImagesChange={setImages}
                            maxImages={10}
                        />
                    </div>
                </div>

                {/* Location */}

                <div className="card mb-3 border-danger">
                    <div className="card-header bg-danger-100">
                        <h5 className="card-title mb-0 text-danger-700 fw-600">
                            <i className="ti ti-map-pin me-2"></i>
                            위치 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label fw-600">
                                    <i className="ti ti-map-2 me-1 text-danger"></i>
                                    주소 <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder="서울시 강남구 역삼동"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">도로명 또는 지번 주소</small>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-map-pin-filled me-1 text-info"></i>
                                    상세 주소
                                </label>
                                <input
                                    type="text"
                                    name="addressDetail"
                                    placeholder="101동 1001호"
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building Info - except LAND */}
                {propertyType !== 'LAND' && (
                    <div className="card mb-3 border-info">
                        <div className="card-header bg-info-100">
                            <h5 className="card-title mb-0 text-info-700 fw-600">
                                <i className="ti ti-building me-2"></i>
                                건물 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-dimensions me-1 text-info"></i>
                                        전용면적 (m²) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="exclusiveArea"
                                        required
                                        placeholder="84.5"
                                        className="form-control form-control-lg"
                                    />
                                    <small className="text-muted fs-sm">약 {propertyType !== 'LAND' ? '25.5평' : ''}</small>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-stairs me-1 text-warning"></i>
                                        층수
                                    </label>
                                    <input
                                        type="number"
                                        name="floor"
                                        placeholder="10"
                                        className="form-control form-control-lg"
                                    />
                                    <small className="text-muted fs-sm">해당 층</small>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-door me-1 text-success"></i>
                                        방 개수 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="rooms"
                                        defaultValue="1"
                                        required
                                        className="form-control form-control-lg"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-bath me-1 text-primary"></i>
                                        욕실 개수 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        defaultValue="1"
                                        required
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-coin-euro me-1 text-secondary"></i>
                                        관리비 (만원)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="maintenanceFee"
                                        placeholder="10"
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-9">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-list-check me-1 text-secondary"></i>
                                        관리비 포함 항목
                                    </label>
                                    <input
                                        type="text"
                                        name="maintenanceIncludes"
                                        placeholder="예: 수도, 전기, 가스, 인터넷"
                                        className="form-control form-control-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Amenities */}
                {propertyType !== 'LAND' && (
                    <div className="card mb-3 border-warning">
                        <div className="card-header bg-warning-100">
                            <h5 className="card-title mb-0 text-warning-700 fw-600">
                                <i className="ti ti-tools me-2"></i>
                                편의시설
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-elevator me-1 text-success"></i>
                                        엘리베이터
                                    </label>
                                    <select name="hasElevator" className="form-select form-select-lg">
                                        <option value="false">없음</option>
                                        <option value="true">있음</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-car me-1 text-info"></i>
                                        주차 공간
                                    </label>
                                    <input
                                        type="number"
                                        name="parkingSpaces"
                                        defaultValue="0"
                                        placeholder="1"
                                        className="form-control form-control-lg"
                                    />
                                    <small className="text-muted fs-sm">대수</small>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-flame me-1 text-danger"></i>
                                        난방 방식
                                    </label>
                                    <select name="heatingType" className="form-select form-select-lg">
                                        <option value="">선택</option>
                                        <option value="INDIVIDUAL">개별난방</option>
                                        <option value="CENTRAL">중앙난방</option>
                                        <option value="DISTRICT">지역난방</option>
                                    </select>
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-compass me-1 text-primary"></i>
                                        향
                                    </label>
                                    <select name="direction" className="form-select form-select-lg">
                                        <option value="">선택</option>
                                        <option value="SOUTH">남향</option>
                                        <option value="EAST">동향</option>
                                        <option value="WEST">서향</option>
                                        <option value="NORTH">북향</option>
                                        <option value="SOUTHEAST">남동향</option>
                                        <option value="SOUTHWEST">남서향</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-hammer me-1 text-secondary"></i>
                                        준공년도
                                    </label>
                                    <input
                                        type="number"
                                        name="buildYear"
                                        placeholder="2015"
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-building-skyscraper me-1 text-info"></i>
                                        전체 층수
                                    </label>
                                    <input
                                        type="number"
                                        name="totalFloors"
                                        placeholder="20"
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-ruler-measure me-1 text-warning"></i>
                                        공급면적 (m²)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="supplyArea"
                                        placeholder="110"
                                        className="form-control form-control-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Commercial Info */}
                {propertyType === 'COMMERCIAL' && (
                    <div className="card mb-3 border-warning shadow-sm">
                        <div className="card-header bg-warning-100">
                            <h5 className="card-title mb-0 text-warning-700 fw-600">
                                <i className="ti ti-shopping-cart me-2"></i>
                                상가 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-diamond me-1 text-warning"></i>
                                        권리금 (만원)
                                    </label>
                                    <input type="number" name="premiumFee" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-chart-line me-1 text-success"></i>
                                        월 평균 매출 (만원)
                                    </label>
                                    <input type="number" name="monthlyRevenue" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-ban me-1 text-danger"></i>
                                        업종 제한
                                    </label>
                                    <input type="text" name="businessRestrictions" placeholder="예: 유흥업소 불가" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-bulb me-1 text-info"></i>
                                        추천 업종
                                    </label>
                                    <input type="text" name="recommendedBusinesses" placeholder="예: 카페, 음식점" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="isOperating" value="true" id="isOperating" />
                                        <label className="form-check-label fw-600" htmlFor="isOperating">
                                            <i className="ti ti-check me-1 text-success"></i>영업 중
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="isTransfer" value="true" id="isTransfer" />
                                        <label className="form-check-label fw-600" htmlFor="isTransfer">
                                            <i className="ti ti-transfer me-1 text-primary"></i>양도
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Land Info */}
                {propertyType === 'LAND' && (
                    <div className="card mb-3 border-success shadow-sm">
                        <div className="card-header bg-success-100">
                            <h5 className="card-title mb-0 text-success-700 fw-600">
                                <i className="ti ti-map me-2"></i>
                                토지 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-dimensions me-1 text-success"></i>
                                        면적 (m²) <span className="text-danger">*</span>
                                    </label>
                                    <input type="number" step="0.01" name="exclusiveArea" required className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-category me-1 text-info"></i>
                                        지목
                                    </label>
                                    <select name="landCategory" className="form-select form-select-lg">
                                        <option value="">선택</option>
                                        <option value="대지">대지</option>
                                        <option value="전">전</option>
                                        <option value="답">답</option>
                                        <option value="임야">임야</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-building-community me-1 text-primary"></i>
                                        용도지역
                                    </label>
                                    <input type="text" name="zoning" placeholder="제2종일반주거지역" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-road me-1 text-warning"></i>
                                        도로 접면
                                    </label>
                                    <select name="roadFacing" className="form-select form-select-lg">
                                        <option value="">선택</option>
                                        <option value="2면">2면</option>
                                        <option value="3면">3면</option>
                                        <option value="맹지">맹지</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-percentage me-1 text-secondary"></i>
                                        건폐율 (%)
                                    </label>
                                    <input type="number" step="0.1" name="buildingCoverageRatio" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-chart-area-line me-1 text-danger"></i>
                                        용적률 (%)
                                    </label>
                                    <input type="number" step="0.1" name="floorAreaRatio" className="form-control form-control-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Office Info */}
                {propertyType === 'OFFICE' && (
                    <div className="card mb-3 border-primary shadow-sm">
                        <div className="card-header bg-primary-100">
                            <h5 className="card-title mb-0 text-primary-700 fw-600">
                                <i className="ti ti-building-skyscraper me-2"></i>
                                사무실 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-presentation me-1 text-primary"></i>
                                        회의실 수
                                    </label>
                                    <input type="number" name="meetingRooms" defaultValue="0" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-users me-1 text-success"></i>
                                        책상 수용 인원
                                    </label>
                                    <input type="number" name="deskCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-wifi me-1 text-info"></i>
                                        인터넷 속도
                                    </label>
                                    <input type="text" name="internetSpeed" placeholder="1Gbps" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasSecurity" value="true" id="hasSecurity" />
                                        <label className="form-check-label fw-600" htmlFor="hasSecurity">
                                            <i className="ti ti-shield-check me-1 text-success"></i>보안 시설
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="is24HourAccess" value="true" id="is24HourAccess" />
                                        <label className="form-check-label fw-600" htmlFor="is24HourAccess">
                                            <i className="ti ti-clock-24 me-1 text-primary"></i>24시간 출입
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Factory Info */}
                {propertyType === 'FACTORY' && (
                    <div className="card mb-3 border-info shadow-sm">
                        <div className="card-header bg-info-100">
                            <h5 className="card-title mb-0 text-info-700 fw-600">
                                <i className="ti ti-factory me-2"></i>
                                공장 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-arrows-vertical me-1 text-info"></i>
                                        천장 높이 (m)
                                    </label>
                                    <input type="number" step="0.1" name="ceilingHeight" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-bolt me-1 text-warning"></i>
                                        전기 용량 (kW)
                                    </label>
                                    <input type="number" name="electricCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        <i className="ti ti-droplet me-1 text-primary"></i>
                                        용수 용량 (톤/일)
                                    </label>
                                    <input type="number" name="waterCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasCargoElevator" value="true" id="hasCargoElevator" />
                                        <label className="form-check-label fw-600" htmlFor="hasCargoElevator">
                                            <i className="ti ti-truck-loading me-1 text-success"></i>화물 엘리베이터
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasCrane" value="true" id="hasCrane" />
                                        <label className="form-check-label fw-600" htmlFor="hasCrane">
                                            <i className="ti ti-crane me-1 text-info"></i>크레인
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasEnvironmentalPermit" value="true" id="hasEnvironmentalPermit" />
                                        <label className="form-check-label fw-600" htmlFor="hasEnvironmentalPermit">
                                            <i className="ti ti-leaf me-1 text-primary"></i>환경 인허가
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dates */}
                <div className="card mb-3 border-secondary">
                    <div className="card-header bg-secondary-100">
                        <h5 className="card-title mb-0 text-secondary-700 fw-600">
                            <i className="ti ti-calendar-event me-2"></i>
                            날짜 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-calendar-check me-1 text-success"></i>
                                    입주 가능일
                                </label>
                                <input
                                    type="date"
                                    name="availableFrom"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">빈칸 시 즉시 입주</small>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-file-certificate me-1 text-primary"></i>
                                    승인번호
                                </label>
                                <input
                                    type="text"
                                    name="approvalNo"
                                    placeholder="2023-서울강남-001"
                                    className="form-control form-control-lg"
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    <i className="ti ti-calendar-time me-1 text-info"></i>
                                    승인일자
                                </label>
                                <input
                                    type="date"
                                    name="confirmDate"
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="card mb-3">
                    <div className="card-header bg-light">
                        <h5 className="card-title mb-0 fw-600">
                            <i className="ti ti-notes me-2 text-dark"></i>
                            매물 설명
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-600">
                                    <i className="ti ti-message me-1 text-primary"></i>
                                    한줄 소개
                                </label>
                                <input
                                    type="text"
                                    name="summary"
                                    placeholder="매물의 주요 특징을 한 줄로"
                                    className="form-control form-control-lg"
                                />
                                <small className="text-muted fs-sm">고급 인테리어, 역세권, 풀옵션 등</small>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-600">
                                    <i className="ti ti-file-description me-1 text-secondary"></i>
                                    상세 설명
                                </label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    placeholder="매물에 대한 상세한 설명을 입력하세요...&#10;&#10;예시:&#10;- 위치: 강남역 5분 거리&#10;- 장점: 신축, 남향, 역세권&#10;- 특이사항: 주차 2대 가능"
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Info */}
                <div className="card mb-3 border-secondary">
                    <div className="card-header bg-secondary-100">
                        <h5 className="card-title mb-0 text-secondary-700 fw-600">
                            <i className="ti ti-user-circle me-2"></i>
                            중개사 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-600">
                                    <i className="ti ti-building-store me-1 text-info"></i>
                                    중개사무소명
                                </label>
                                <input
                                    type="text"
                                    name="officeName"
                                    placeholder="강남부동산"
                                    className="form-control form-control-lg"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-600">
                                    <i className="ti ti-phone me-1 text-success"></i>
                                    전화번호
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="02-1234-5678"
                                    className="form-control form-control-lg"
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label fw-600">
                                    <i className="ti ti-id me-1 text-warning"></i>
                                    등록번호
                                </label>
                                <input
                                    type="text"
                                    name="registrationNo"
                                    placeholder="서울-2023-001"
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="d-flex gap-3 justify-content-end">
                            <Link href="/admin/properties" className="btn btn-light btn-lg px-5">
                                <i className="ti ti-x me-2"></i>
                                취소
                            </Link>
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg px-5">
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        등록 중...
                                    </>
                                ) : (
                                    <>
                                        <i className="ti ti-check me-2"></i>
                                        매물 등록
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
