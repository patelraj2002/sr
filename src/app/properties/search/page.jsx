// src/app/properties/search/page.jsx
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import PropertyGrid from '@/app/components/property/PropertyGrid';

export const dynamic = 'force-dynamic';

export default async function SearchResults({ searchParams }) {
  const session = await getServerSession();

  // Get search parameters
  const { type, location, minPrice, maxPrice } = searchParams;

  // Build search query
  const where = {
    status: 'ACTIVE',
    ...(type && { type }),
    ...(location && {
      location: { contains: location, mode: 'insensitive' }
    }),
  };

  if (minPrice || maxPrice) {
    where.OR = [
      // For FLAT type
      {
        AND: [
          { type: 'FLAT' },
          { price: { gte: minPrice ? parseFloat(minPrice) : undefined } },
          { price: { lte: maxPrice ? parseFloat(maxPrice) : undefined } },
        ]
      },
      // For PG type
      {
        AND: [
          { type: 'PG' },
          {
            sharingOptions: {
              some: {
                price: {
                  gte: minPrice ? parseFloat(minPrice) : undefined,
                  lte: maxPrice ? parseFloat(maxPrice) : undefined
                }
              }
            }
          }
        ]
      }
    ];
  }

  const properties = await prisma.property.findMany({
    where,
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
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
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