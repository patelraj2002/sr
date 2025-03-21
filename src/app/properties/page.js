// src/app/properties/page.js
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import PropertyGrid from '@/app/components/property/PropertyGrid';

export default async function PropertiesPage() {
  const session = await getServerSession();

  const properties = await prisma.property.findMany({
    where: {
      status: 'ACTIVE'
    },
    include: {
      images: true,
      sharingOptions: true,
      owner: {
        select: {
          id: true,
          name: true,
          phone: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>
      <PropertyGrid
        properties={properties}
        isAuthenticated={!!session}
        userType={session?.userType || 'SEEKER'}
        isOwner={session?.userType === 'OWNER'}
        userId={session?.id}
      />
    </div>
  );
}