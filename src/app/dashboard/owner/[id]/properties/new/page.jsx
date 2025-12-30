// src/app/dashboard/owner/[id]/properties/new/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import PropertyForm from '@/app/components/property/PropertyForm';

export default async function NewProperty({ params }) {
  const session = await getServerSession();
  const { id } = await params;

  if (!session || session.id !== id) {
    redirect('/auth/signin');
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <PropertyForm ownerId={id} />
    </div>
  );
}