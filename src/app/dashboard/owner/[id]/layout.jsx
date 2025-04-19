// src/app/dashboard/owner/[id]/layout.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import OwnerNavigation from '@/app/components/dashboard/OwnerNavigation';

export default async function OwnerDashboardLayout({ children, params }) {
  const session = await getServerSession();
  const id = params?.id;
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Verify owner is accessing their own dashboard
  if (session.id !== params.id || session.userType !== 'OWNER') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <OwnerNavigation userId={id} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}