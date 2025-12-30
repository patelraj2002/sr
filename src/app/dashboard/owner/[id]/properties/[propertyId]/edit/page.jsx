// src/app/dashboard/owner/[id]/properties/[propertyId]/edit/page.jsx
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import PropertyForm from '@/app/components/property/PropertyForm';

export default async function EditProperty({ params }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const property = await prisma.property.findUnique({
    where: { 
      id: params.propertyId,
      ownerId: params.id // Ensure owner is accessing their own property
    },
    include: {
      images: true,
      address: true,
      sharingOptions: true
    }
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <PropertyForm 
        ownerId={params.id}
        initialData={property}
      />
    </div>
  );
}