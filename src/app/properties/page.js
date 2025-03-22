// src/app/properties/page.js
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import PropertyGrid from '@/app/components/property/PropertyGrid';
import Link from 'next/link';

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Properties</h1>
        {session?.userType === 'SEEKER' && (
          <Link
            href={`/dashboard/seeker/${session.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 
              bg-primary-100 text-primary-600 rounded-md 
              hover:bg-primary-200 transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            My Dashboard
          </Link>
        )}
      </div>

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