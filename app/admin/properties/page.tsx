import { prisma } from '@/lib/prisma';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilter } from '@/components/SearchFilter';
import { ExcelExportButton } from '@/components/ExcelExportButton';
import { ExcelUploadButton } from '@/components/ExcelUploadButton';
import { ExcelTemplateButton } from '@/components/ExcelTemplateButton';
import Link from 'next/link';

export default async function PropertyListPage({
    searchParams,
}: {
    searchParams: { q?: string; type?: string };
}) {
    const where = {
        AND: [
            searchParams.q ? {
                OR: [
                    { title: { contains: searchParams.q } },
                    { address: { contains: searchParams.q } },
                ]
            } : {},
            searchParams.type ? { propertyType: searchParams.type } : {},
        ]
    };

    const properties = await prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            {/* 페이지 헤더 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-1 fw-700">매물 관리</h2>
                    <p className="text-muted mb-0">총 {properties.length}개의 매물</p>
                </div>
                <div className="d-flex gap-2">
                    <ExcelTemplateButton />
                    <ExcelUploadButton />
                    <ExcelExportButton data={properties} />
                    <Link
                        href="/admin/properties/new"
                        className="btn btn-primary d-flex align-items-center gap-2"
                    >
                        <svg className="sa-icon" width="16" height="16">
                            <use href="/icons/sprite.svg#plus-circle" />
                        </svg>
                        <span>매물 등록</span>
                    </Link>
                </div>
            </div>

            {/* 검색 필터 */}
            <div className="mb-4">
                <SearchFilter />
            </div>

            {/* 매물 목록 */}
            {properties.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <svg className="sa-icon sa-icon-5x text-muted mb-3">
                            <use href="/icons/sprite.svg#home" />
                        </svg>
                        <p className="text-muted mb-0">등록된 매물이 없습니다.</p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {properties.map((property) => (
                        <div key={property.id} className="col-12 col-md-6 col-lg-4">
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
