import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPropertyForm from './EditPropertyForm';

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
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
        notFound();
    }

    return <EditPropertyForm property={property} />;
}
