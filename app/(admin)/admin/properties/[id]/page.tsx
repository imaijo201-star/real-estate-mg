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

    if (!property) return <div>매물을 찾을 수 없습니다.</div>;

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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{property.title}</h2>
                <div className="flex gap-2">
                    <Link
                        href="/properties"
                        className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium"
                    >
                        목록으로
                    </Link>
                    <form action={deleteProperty.bind(null, property.id)}>
                        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                            삭제
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                            {property.propertyType}
                        </span>
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${property.status === 'AVAILABLE'
                                ? 'bg-green-100 text-green-700'
                                : property.status === 'RESERVED'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {property.status}
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {getPriceDisplay()}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">주소</label>
                            <p className="font-medium">{property.address}</p>
                            {property.addressDetail && <p className="text-sm text-gray-600">{property.addressDetail}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">면적</label>
                            <p className="font-medium">{property.exclusiveArea}m² (전용)</p>
                            {property.supplyArea && <p className="text-sm text-gray-600">{property.supplyArea}m² (공급)</p>}
                        </div>
                        {property.floor && (
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">층수</label>
                                <p className="font-medium">{property.floor}층 / {property.totalFloors}층</p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm text-gray-500 block mb-1">방/욕실</label>
                            <p className="font-medium">{property.rooms}개 / {property.bathrooms}개</p>
                        </div>
                    </div>

                    {/* 한줄 소개 */}
                    {property.summary && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-blue-900 font-medium">{property.summary}</p>
                        </div>
                    )}

                    {/* 상세 설명 */}
                    <div>
                        <label className="text-sm text-gray-500 block mb-1">상세 설명</label>
                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {property.description || '설명이 없습니다.'}
                        </p>
                    </div>

                    {/* 유형별 정보 */}
                    {property.commercialInfo && (
                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-3 text-orange-700">상가 정보</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {property.commercialInfo.premiumFee && (
                                    <div><span className="text-gray-500">권리금:</span> {property.commercialInfo.premiumFee.toLocaleString()}만원</div>
                                )}
                                {property.commercialInfo.monthlyRevenue && (
                                    <div><span className="text-gray-500">월 매출:</span> {property.commercialInfo.monthlyRevenue.toLocaleString()}만원</div>
                                )}
                                {property.commercialInfo.recommendedBusinesses && (
                                    <div className="col-span-2"><span className="text-gray-500">추천 업종:</span> {property.commercialInfo.recommendedBusinesses}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {property.landInfo && (
                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-3 text-green-700">토지 정보</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {property.landInfo.landCategory && <div><span className="text-gray-500">지목:</span> {property.landInfo.landCategory}</div>}
                                {property.landInfo.zoning && <div><span className="text-gray-500">용도지역:</span> {property.landInfo.zoning}</div>}
                                {property.landInfo.buildingCoverageRatio && <div><span className="text-gray-500">건폐율:</span> {property.landInfo.buildingCoverageRatio}%</div>}
                                {property.landInfo.floorAreaRatio && <div><span className="text-gray-500">용적률:</span> {property.landInfo.floorAreaRatio}%</div>}
                            </div>
                        </div>
                    )}

                    {/* 중개사 정보 */}
                    {property.agentInfo && (
                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-3">중개사 정보</h3>
                            <div className="text-sm space-y-1">
                                <p><span className="text-gray-500">사무소:</span> {property.agentInfo.officeName}</p>
                                <p><span className="text-gray-500">전화:</span> {property.agentInfo.phone}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-400 pt-4 border-t">
                        등록일: {new Date(property.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                </div>
            </div>
        </div>
    );
}
