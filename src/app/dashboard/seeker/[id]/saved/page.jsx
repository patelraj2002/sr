// src/app/dashboard/seeker/[id]/saved/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/app/lib/db';
import PropertyGrid from '@/app/components/property/PropertyGrid';

export default async function SavedProperties({ params }) {
  const session = await getServerSession();
  
  if (!session || session.id !== params.id) {
    redirect('/auth/signin');
  }

  const savedProperties = await prisma.savedProperty.findMany({
    where: {
      userId: params.id
    },
    include: {
      property: {
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
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const properties = savedProperties.map(sp => sp.property);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Saved Properties</h1>
        <Link
          href="/properties"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse More Properties
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mb-4">
            <span className="text-4xl">📌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No Saved Properties Yet
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            When you find properties you're interested in, save them here to track and compare them later.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <span className="mr-2">🔍</span>
            Start Browsing Properties
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </p>
          <PropertyGrid
            properties={properties}
            isAuthenticated={true}
            userType="SEEKER"
            isOwner={false}
            userId={session.id}
          />
        </div>
      )}
    </div>
  );
}