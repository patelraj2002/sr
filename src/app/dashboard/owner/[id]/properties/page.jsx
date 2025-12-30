// src/app/dashboard/owner/[id]/properties/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import PropertyGrid from '@/app/components/property/PropertyGrid';
import Link from 'next/link';

export default async function OwnerProperties({ params }) {
  const session = await getServerSession();
  const { id } = await params;

  if (!session || session.id !== id) {
    redirect('/auth/signin');
  }

  const properties = await prisma.property.findMany({
    where: {
      ownerId: id
    },
    include: {
      images: true,
      inquiries: true,
      sharingOptions: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link
          href={`/dashboard/owner/${id}/properties/new`}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Add New Property
        </Link>
      </div>

      <PropertyGrid
        properties={properties}
        isAuthenticated={true}
        userType="OWNER"
        isOwner={true}
        userId={session.id}
      />
    </div>
  );
}
