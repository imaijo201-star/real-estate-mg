'use client';

import { useState } from 'react';
import { createProperty } from '@/actions/property';
import Link from 'next/link';

export default function NewPropertyPage() {
    const [propertyType, setPropertyType] = useState('APARTMENT');

    return (
        <div className="container-fluid">
            {/* 페이지 헤더 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-1 fw-700">매물 등록</h2>
                    <p className="text-muted mb-0">새로운 매물 정보를 등록합니다</p>
                </div>
                <Link href="/admin/properties" className="btn btn-outline-secondary">
                    <svg className="sa-icon me-2" width="16" height="16">
                        <use href="/icons/sprite.svg#arrow-left" />
                    </svg>
                    목록으로
                </Link>
            </div>

            <form action={createProperty}>
                <div className="row">
                    <div className="col-12 col-lg-8">
                        {/* 기본 정보 */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary-600 text-white">
                                <h5 className="card-title mb-0">기본 정보</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-500">매물명 <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            placeholder="예: 강남 래미안 아파트 34평"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-500">건물 유형 <span className="text-danger">*</span></label>
                                        <select
                                            name="propertyType"
                                            required
                                            value={propertyType}
                                            onChange={(e) => setPropertyType(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="APARTMENT">아파트</option>
                                            <option value="OFFICETEL">오피스텔</option>
                                            <option value="VILLA">빌라</option>
                                            <option value="HOUSE">주택</option>
                                            <option value="ONE_ROOM">원룸</option>
                                            <option value="TWO_ROOM">투룸</option>
                                            <option value="COMMERCIAL">상가</option>
                                            <option value="OFFICE">사무실</option>
                                            <option value="FACTORY">공장</option>
                                            <option value="LAND">토지</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-500">거래 유형 <span className="text-danger">*</span></label>
                                        <select name="tradeType" required className="form-select">
                                            <option value="SALE">매매</option>
                                            <option value="JEONSE">전세</option>
                                            <option value="MONTHLY">월세</option>
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-500">매매가 (만원)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="salePrice"
                                                placeholder="50000"
                                                className="form-control"
                                            />
                                            <span className="input-group-text">만원</span>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-500">보증금 (만원)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="deposit"
                                                placeholder="10000"
                                                className="form-control"
                                            />
                                            <span className="input-group-text">만원</span>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-500">월세 (만원)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="monthlyRent"
                                                placeholder="100"
                                                className="form-control"
                                            />
                                            <span className="input-group-text">만원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 위치 정보 */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0 d-flex align-items-center">
                                    <svg className="sa-icon me-2 text-primary">
                                        <use href="/icons/sprite.svg#map-pin" />
                                    </svg>
                                    위치 정보
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-500">주소 <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            placeholder="서울시 강남구 역삼동"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-500">상세 주소</label>
                                        <input
                                            type="text"
                                            name="addressDetail"
                                            placeholder="101동 1001호"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 건물 상세 정보 - 토지가 아닐 때만 표시 */}
                        {propertyType !== 'LAND' && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-header">
                                    <h5 className="card-title mb-0 d-flex align-items-center">
                                        <svg className="sa-icon me-2 text-primary">
                                            <use href="/icons/sprite.svg#home" />
                                        </svg>
                                        건물 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">전용면적 (m²) <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="exclusiveArea"
                                                    required
                                                    placeholder="84.5"
                                                    className="form-control"
                                                />
                                                <span className="input-group-text">m²</span>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-500">층수</label>
                                            <input
                                                type="number"
                                                name="floor"
                                                placeholder="10"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-500">방 개수 <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                name="rooms"
                                                defaultValue="1"
                                                required
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-500">욕실 개수 <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                name="bathrooms"
                                                defaultValue="1"
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 상가 전용 필드 */}
                        {propertyType === 'COMMERCIAL' && (
                            <div className="card shadow-sm mb-4 border-warning">
                                <div className="card-header bg-warning-100">
                                    <h5 className="card-title mb-0 text-warning-800">
                                        <svg className="sa-icon me-2">
                                            <use href="/icons/sprite.svg#shopping-bag" />
                                        </svg>
                                        상가 전용 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">권리금 (만원)</label>
                                            <input type="number" name="premiumFee" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">월 평균 매출 (만원)</label>
                                            <input type="number" name="monthlyRevenue" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">업종 제한</label>
                                            <input type="text" name="businessRestrictions" placeholder="예: 유흥업소 불가" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">추천 업종</label>
                                            <input type="text" name="recommendedBusinesses" placeholder="예: 카페, 음식점" className="form-control" />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="isOperating" value="true" className="form-check-input" id="isOperating" />
                                                <label className="form-check-label" htmlFor="isOperating">영업 중</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="isTransfer" value="true" className="form-check-input" id="isTransfer" />
                                                <label className="form-check-label" htmlFor="isTransfer">양도</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 토지 전용 필드 */}
                        {propertyType === 'LAND' && (
                            <div className="card shadow-sm mb-4 border-success">
                                <div className="card-header bg-success-100">
                                    <h5 className="card-title mb-0 text-success-800">
                                        <svg className="sa-icon me-2">
                                            <use href="/icons/sprite.svg#layers" />
                                        </svg>
                                        토지 전용 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">면적 (m²) <span className="text-danger">*</span></label>
                                            <input type="number" step="0.01" name="exclusiveArea" required className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">지목</label>
                                            <select name="landCategory" className="form-select">
                                                <option value="">선택</option>
                                                <option value="대지">대지</option>
                                                <option value="전">전</option>
                                                <option value="답">답</option>
                                                <option value="임야">임야</option>
                                                <option value="기타">기타</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">용도지역</label>
                                            <input type="text" name="zoning" placeholder="제2종일반주거지역" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">도로 접면</label>
                                            <select name="roadFacing" className="form-select">
                                                <option value="">선택</option>
                                                <option value="2면">2면</option>
                                                <option value="3면">3면</option>
                                                <option value="맹지">맹지</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">건폐율 (%)</label>
                                            <input type="number" step="0.1" name="buildingCoverageRatio" className="form-control" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-500">용적률 (%)</label>
                                            <input type="number" step="0.1" name="floorAreaRatio" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 사무실 전용 필드 */}
                        {propertyType === 'OFFICE' && (
                            <div className="card shadow-sm mb-4 border-info">
                                <div className="card-header bg-info-100">
                                    <h5 className="card-title mb-0 text-info-800">
                                        <svg className="sa-icon me-2">
                                            <use href="/icons/sprite.svg#briefcase" />
                                        </svg>
                                        사무실 전용 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">회의실 수</label>
                                            <input type="number" name="meetingRooms" defaultValue="0" className="form-control" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">책상 수용 인원</label>
                                            <input type="number" name="deskCapacity" className="form-control" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">인터넷 속도</label>
                                            <input type="text" name="internetSpeed" placeholder="1Gbps" className="form-control" />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="hasSecurity" value="true" className="form-check-input" id="hasSecurity" />
                                                <label className="form-check-label" htmlFor="hasSecurity">보안 시설</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="is24HourAccess" value="true" className="form-check-input" id="is24HourAccess" />
                                                <label className="form-check-label" htmlFor="is24HourAccess">24시간 출입</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 공장 전용 필드 */}
                        {propertyType === 'FACTORY' && (
                            <div className="card shadow-sm mb-4 border-danger">
                                <div className="card-header bg-danger-100">
                                    <h5 className="card-title mb-0 text-danger-800">
                                        <svg className="sa-icon me-2">
                                            <use href="/icons/sprite.svg#package" />
                                        </svg>
                                        공장 전용 정보
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">천장 높이 (m)</label>
                                            <input type="number" step="0.1" name="ceilingHeight" className="form-control" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">전기 용량 (kW)</label>
                                            <input type="number" name="electricCapacity" className="form-control" />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-500">용수 용량 (톤/일)</label>
                                            <input type="number" name="waterCapacity" className="form-control" />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="hasCargoElevator" value="true" className="form-check-input" id="hasCargoElevator" />
                                                <label className="form-check-label" htmlFor="hasCargoElevator">화물 엘리베이터</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="hasCrane" value="true" className="form-check-input" id="hasCrane" />
                                                <label className="form-check-label" htmlFor="hasCrane">크레인</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input type="checkbox" name="hasEnvironmentalPermit" value="true" className="form-check-input" id="hasEnvironmentalPermit" />
                                                <label className="form-check-label" htmlFor="hasEnvironmentalPermit">환경 인허가</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 설명 */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">매물 설명</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-500">한줄 소개</label>
                                    <input
                                        type="text"
                                        name="summary"
                                        placeholder="매물의 주요 특징을 한 줄로"
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label fw-500">상세 설명</label>
                                    <textarea
                                        name="description"
                                        rows={5}
                                        placeholder="매물에 대한 상세한 설명을 입력하세요..."
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 */}
                    <div className="col-12 col-lg-4">
                        {/* 중개사 정보 */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header">
                                <h5 className="card-title mb-0">중개사 정보</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label fw-500">중개사무소명</label>
                                    <input
                                        type="text"
                                        name="officeName"
                                        placeholder="강남부동산"
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label fw-500">전화번호</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="02-1234-5678"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 등록 버튼 */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                                >
                                    <svg className="sa-icon" width="20" height="20">
                                        <use href="/icons/sprite.svg#check-circle" />
                                    </svg>
                                    <span>매물 등록</span>
                                </button>
                                <p className="text-muted fs-xs text-center mt-3 mb-0">
                                    * 표시는 필수 입력 항목입니다
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
