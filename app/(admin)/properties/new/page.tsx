'use client';

import { useState } from 'react';
import { createProperty } from '@/actions/property';

export default function NewPropertyPage() {
    const [propertyType, setPropertyType] = useState('APARTMENT');

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">매물 등록</h1>

            <form action={createProperty} className="space-y-8">
                {/* 기본 정보 */}
                <section className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">매물명 *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="예: 강남 래미안 아파트 34평"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">건물 유형 *</label>
                            <select
                                name="propertyType"
                                required
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full border rounded px-3 py-2"
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

                        <div>
                            <label className="block text-sm font-medium mb-1">거래 유형 *</label>
                            <select name="tradeType" required className="w-full border rounded px-3 py-2">
                                <option value="SALE">매매</option>
                                <option value="JEONSE">전세</option>
                                <option value="MONTHLY">월세</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">매매가 (만원)</label>
                            <input
                                type="number"
                                name="salePrice"
                                placeholder="50000"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">보증금 (만원)</label>
                            <input
                                type="number"
                                name="deposit"
                                placeholder="10000"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">월세 (만원)</label>
                            <input
                                type="number"
                                name="monthlyRent"
                                placeholder="100"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </section>

                {/* 위치 정보 */}
                <section className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">주소 *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                placeholder="서울시 강남구 역삼동"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">상세 주소</label>
                            <input
                                type="text"
                                name="addressDetail"
                                placeholder="101동 1001호"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </section>

                {/* 건물 상세 정보 - 토지가 아닐 때만 표시 */}
                {propertyType !== 'LAND' && (
                    <section className="bg-white p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">건물 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">전용면적 (m²) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="exclusiveArea"
                                    required
                                    placeholder="84.5"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">층수</label>
                                <input
                                    type="number"
                                    name="floor"
                                    placeholder="10"
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">방 개수 *</label>
                                <input
                                    type="number"
                                    name="rooms"
                                    defaultValue="1"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">욕실 개수 *</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    defaultValue="1"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* 상가 전용 필드 */}
                {propertyType === 'COMMERCIAL' && (
                    <section className="bg-white p-6 rounded-lg border border-orange-200 bg-orange-50">
                        <h2 className="text-xl font-semibold mb-4 text-orange-700">상가 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">권리금 (만원)</label>
                                <input type="number" name="premiumFee" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">월 평균 매출 (만원)</label>
                                <input type="number" name="monthlyRevenue" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">업종 제한</label>
                                <input type="text" name="businessRestrictions" placeholder="예: 유흥업소 불가" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">추천 업종</label>
                                <input type="text" name="recommendedBusinesses" placeholder="예: 카페, 음식점" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input type="checkbox" name="isOperating" value="true" className="mr-2" />
                                    영업 중
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" name="isTransfer" value="true" className="mr-2" />
                                    양도
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {/* 토지 전용 필드 */}
                {propertyType === 'LAND' && (
                    <section className="bg-white p-6 rounded-lg border border-green-200 bg-green-50">
                        <h2 className="text-xl font-semibold mb-4 text-green-700">토지 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">면적 (m²) *</label>
                                <input type="number" step="0.01" name="exclusiveArea" required className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">지목</label>
                                <select name="landCategory" className="w-full border rounded px-3 py-2">
                                    <option value="">선택</option>
                                    <option value="대지">대지</option>
                                    <option value="전">전</option>
                                    <option value="답">답</option>
                                    <option value="임야">임야</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">용도지역</label>
                                <input type="text" name="zoning" placeholder="제2종일반주거지역" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">도로 접면</label>
                                <select name="roadFacing" className="w-full border rounded px-3 py-2">
                                    <option value="">선택</option>
                                    <option value="2면">2면</option>
                                    <option value="3면">3면</option>
                                    <option value="맹지">맹지</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">건폐율 (%)</label>
                                <input type="number" step="0.1" name="buildingCoverageRatio" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">용적률 (%)</label>
                                <input type="number" step="0.1" name="floorAreaRatio" className="w-full border rounded px-3 py-2" />
                            </div>
                        </div>
                    </section>
                )}

                {/* 사무실 전용 필드 */}
                {propertyType === 'OFFICE' && (
                    <section className="bg-white p-6 rounded-lg border border-blue-200 bg-blue-50">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">사무실 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">회의실 수</label>
                                <input type="number" name="meetingRooms" defaultValue="0" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">책상 수용 인원</label>
                                <input type="number" name="deskCapacity" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">인터넷 속도</label>
                                <input type="text" name="internetSpeed" placeholder="1Gbps" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center">
                                    <input type="checkbox" name="hasSecurity" value="true" className="mr-2" />
                                    보안 시설
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" name="is24HourAccess" value="true" className="mr-2" />
                                    24시간 출입
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {/* 공장 전용 필드 */}
                {propertyType === 'FACTORY' && (
                    <section className="bg-white p-6 rounded-lg border border-purple-200 bg-purple-50">
                        <h2 className="text-xl font-semibold mb-4 text-purple-700">공장 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">천장 높이 (m)</label>
                                <input type="number" step="0.1" name="ceilingHeight" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">전기 용량 (kW)</label>
                                <input type="number" name="electricCapacity" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">용수 용량 (톤/일)</label>
                                <input type="number" name="waterCapacity" className="w-full border rounded px-3 py-2" />
                            </div>
                            <div className="md:col-span-2 flex gap-4">
                                <label className="flex items-center">
                                    <input type="checkbox" name="hasCargoElevator" value="true" className="mr-2" />
                                    화물 엘리베이터
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" name="hasCrane" value="true" className="mr-2" />
                                    크레인
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" name="hasEnvironmentalPermit" value="true" className="mr-2" />
                                    환경 인허가
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {/* 설명 */}
                <section className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">매물 설명</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">한줄 소개</label>
                            <input
                                type="text"
                                name="summary"
                                placeholder="매물의 주요 특징을 한 줄로"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">상세 설명</label>
                            <textarea
                                name="description"
                                rows={5}
                                placeholder="매물에 대한 상세한 설명을 입력하세요..."
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </section>

                {/* 중개사 정보 */}
                <section className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">중개사 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">중개사무소명</label>
                            <input
                                type="text"
                                name="officeName"
                                placeholder="강남부동산"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">전화번호</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="02-1234-5678"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </section>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-lg"
                >
                    매물 등록
                </button>
            </form>
        </div>
    );
}
