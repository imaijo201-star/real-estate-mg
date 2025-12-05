'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader, { UploadedImage } from '@/components/ui/ImageUploader';

interface EditPropertyFormProps {
    property: any;
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
    const router = useRouter();
    const [propertyType, setPropertyType] = useState(property.propertyType || 'APARTMENT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<UploadedImage[]>(
        property.images?.map((img: any, index: number) => ({
            id: img.id,
            url: img.url,
            order: img.order || index,
            isMain: img.isMain || false,
        })) || []
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // 이미지 데이터 추가
            images.forEach((img, index) => {
                formData.append('imageUrls', img.url);
                formData.append('imageIds', String(img.id || ''));
                formData.append('imageOrders', String(img.order));
            });

            const mainIndex = images.findIndex(img => img.isMain);
            formData.append('mainImageIndex', String(mainIndex !== -1 ? mainIndex : 0));

            const response = await fetch(`/api/properties/${property.id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ ' + data.message);
                router.push(`/admin/properties/${property.id}`);
                router.refresh();
            } else {
                alert('❌ ' + (data.error || '수정에 실패했습니다.'));
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('❌ 수정 중 오류가 발생했습니다.');
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
                        <i className="ti ti-edit me-2"></i>
                        매물 수정
                    </h1>
                    <nav className="app-breadcrumb" aria-label="breadcrumb">
                        <ol className="breadcrumb ms-0 text-muted mb-0">
                            <li className="breadcrumb-item"><Link href="/admin">대시보드</Link></li>
                            <li className="breadcrumb-item"><Link href="/admin/properties">매물 관리</Link></li>
                            <li className="breadcrumb-item"><Link href={`/admin/properties/${property.id}`}>{property.title}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">수정</li>
                        </ol>
                    </nav>
                </div>
                <Link href={`/admin/properties/${property.id}`} className="btn btn-outline-secondary">
                    <i className="ti ti-arrow-left me-1"></i>
                    돌아가기
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
                                    defaultValue={property.title}
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
                                <select name="tradeType" required defaultValue={property.tradeType} className="form-select form-select-lg">
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
                                    defaultValue={property.salePrice || ''}
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
                                    defaultValue={property.deposit || ''}
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
                                    defaultValue={property.monthlyRent || ''}
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
                                    주소 <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder="서울시 강남구 역삼동"
                                    defaultValue={property.address}
                                    className="form-control form-control-lg"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-600">
                                    상세 주소
                                </label>
                                <input
                                    type="text"
                                    name="addressDetail"
                                    placeholder="101동 1001호"
                                    defaultValue={property.addressDetail || ''}
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Building Info - except LAND */}
                {propertyType !== 'LAND' && (
                    <div className="card mb-3 border-warning">
                        <div className="card-header bg-warning-100">
                            <h5 className="card-title mb-0 text-warning-700 fw-600">
                                <i className="ti ti-building me-2"></i>
                                건물 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        전용면적 (m²) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="exclusiveArea"
                                        required
                                        placeholder="84.5"
                                        defaultValue={property.exclusiveArea}
                                        className="form-control form-control-lg"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">층수</label>
                                    <input
                                        type="number"
                                        name="floor"
                                        placeholder="10"
                                        defaultValue={property.floor || ''}
                                        className="form-control form-control-lg"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        방 개수 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="rooms"
                                        defaultValue={property.rooms}
                                        required
                                        className="form-control form-control-lg"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-600">
                                        욕실 개수 <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        defaultValue={property.bathrooms}
                                        required
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-600">관리비 (만원)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="maintenanceFee"
                                        placeholder="10"
                                        defaultValue={property.maintenanceFee || ''}
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="col-md-9">
                                    <label className="form-label fw-600">관리비 포함 항목</label>
                                    <input
                                        type="text"
                                        name="maintenanceIncludes"
                                        placeholder="예: 수도, 전기, 가스, 인터넷"
                                        defaultValue={property.maintenanceIncludes || ''}
                                        className="form-control form-control-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Commercial Info */}
                {propertyType === 'COMMERCIAL' && (
                    <div className="card mb-3 border-warning">
                        <div className="card-header bg-warning-100">
                            <h5 className="card-title mb-0 text-warning-700 fw-600">
                                <i className="ti ti-shopping-cart me-2"></i>
                                상가 추가 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">권리금 (만원)</label>
                                    <input type="number" name="premiumFee" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">월 평균 매출 (만원)</label>
                                    <input type="number" name="monthlyRevenue" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">업종 제한</label>
                                    <input type="text" name="businessRestrictions" placeholder="예: 유흥업소 불가" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label fw-600">추천 업종</label>
                                    <input type="text" name="recommendedBusinesses" placeholder="예: 카페, 음식점" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="isOperating" value="true" id="isOperating" />
                                        <label className="form-check-label" htmlFor="isOperating">영업 중</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="isTransfer" value="true" id="isTransfer" />
                                        <label className="form-check-label" htmlFor="isTransfer">양도</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Land Info */}
                {propertyType === 'LAND' && (
                    <div className="card mb-3 border-success">
                        <div className="card-header bg-success-100">
                            <h5 className="card-title mb-0 text-success-700 fw-600">
                                <i className="ti ti-map me-2"></i>
                                토지 추가 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">
                                        면적 (m²) <span className="text-danger">*</span>
                                    </label>
                                    <input type="number" step="0.01" name="exclusiveArea" required defaultValue={property.exclusiveArea} className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">지목</label>
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
                                    <label className="form-label fw-600">용도지역</label>
                                    <input type="text" name="zoning" placeholder="제2종일반주거지역" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">도로 접면</label>
                                    <select name="roadFacing" className="form-select form-select-lg">
                                        <option value="">선택</option>
                                        <option value="2면">2면</option>
                                        <option value="3면">3면</option>
                                        <option value="맹지">맹지</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">건폐율 (%)</label>
                                    <input type="number" step="0.1" name="buildingCoverageRatio" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">용적률 (%)</label>
                                    <input type="number" step="0.1" name="floorAreaRatio" className="form-control form-control-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Office Info */}
                {propertyType === 'OFFICE' && (
                    <div className="card mb-3 border-info">
                        <div className="card-header bg-info-100">
                            <h5 className="card-title mb-0 text-info-700 fw-600">
                                <i className="ti ti-building-skyscraper me-2"></i>
                                사무실 추가 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">회의실 수</label>
                                    <input type="number" name="meetingRooms" defaultValue="0" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">책상 수용 인원</label>
                                    <input type="number" name="deskCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">인터넷 속도</label>
                                    <input type="text" name="internetSpeed" placeholder="1Gbps" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasSecurity" value="true" id="hasSecurity" />
                                        <label className="form-check-label" htmlFor="hasSecurity">보안 시설</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="is24HourAccess" value="true" id="is24HourAccess" />
                                        <label className="form-check-label" htmlFor="is24HourAccess">24시간 출입</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Factory Info */}
                {propertyType === 'FACTORY' && (
                    <div className="card mb-3 border-danger">
                        <div className="card-header bg-danger-100">
                            <h5 className="card-title mb-0 text-danger-700 fw-600">
                                <i className="ti ti-factory me-2"></i>
                                공장 추가 정보
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-600">천장 높이 (m)</label>
                                    <input type="number" step="0.1" name="ceilingHeight" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">전기 용량 (kW)</label>
                                    <input type="number" name="electricCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-600">용수 용량 (톤/일)</label>
                                    <input type="number" name="waterCapacity" className="form-control form-control-lg" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasCargoElevator" value="true" id="hasCargoElevator" />
                                        <label className="form-check-label" htmlFor="hasCargoElevator">화물 엘리베이터</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasCrane" value="true" id="hasCrane" />
                                        <label className="form-check-label" htmlFor="hasCrane">크레인</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="hasEnvironmentalPermit" value="true" id="hasEnvironmentalPermit" />
                                        <label className="form-check-label" htmlFor="hasEnvironmentalPermit">환경 인허가</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="card mb-3 border-secondary">
                    <div className="card-header bg-secondary-100">
                        <h5 className="card-title mb-0 text-secondary-700 fw-600">
                            <i className="ti ti-file-description me-2"></i>
                            매물 설명
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-600">한줄 소개</label>
                                <input
                                    type="text"
                                    name="summary"
                                    placeholder="매물의 주요 특징을 한 줄로"
                                    defaultValue={property.summary || ''}
                                    className="form-control form-control-lg"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-600">상세 설명</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    placeholder="매물에 대한 상세한 설명을 입력하세요..."
                                    defaultValue={property.description || ''}
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Info */}
                <div className="card mb-3">
                    <div className="card-header">
                        <h5 className="card-title mb-0 fw-600">
                            <i className="ti ti-user-circle me-2"></i>
                            중개사 정보
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-600">중개사무소명</label>
                                <input
                                    type="text"
                                    name="officeName"
                                    placeholder="강남부동산"
                                    defaultValue={property.agentInfo?.officeName || ''}
                                    className="form-control form-control-lg"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-600">전화번호</label>
                                <input
                                    type="tel"
                                    name="agentPhone"
                                    placeholder="02-1234-5678"
                                    defaultValue={property.agentInfo?.phone || ''}
                                    className="form-control form-control-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-2 justify-content-end">
                    <Link href={`/admin/properties/${property.id}`} className="btn btn-outline-secondary btn-lg">
                        <i className="ti ti-x me-1"></i>
                        취소
                    </Link>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                수정 중...
                            </>
                        ) : (
                            <>
                                <i className="ti ti-check me-1"></i>
                                수정 완료
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
