import { prisma } from '@/lib/prisma';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilter } from '@/components/SearchFilter';
import { ExcelExportButton } from '@/components/ExcelExportButton';
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">매물 관리</h2>
                <div className="flex gap-2">
                    <ExcelExportButton data={properties} />
                    <Link
                        href="/properties/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                        매물 등록
                    </Link>
                </div>
            </div>

            <SearchFilter />

            {properties.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-lg border">
                    등록된 매물이 없습니다.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}
