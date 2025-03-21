// src/app/dashboard/seeker/[id]/layout.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import SeekerNavigation from '../SeekerNavigation';

export default async function SeekerDashboardLayout({ children, params: { id } }) {
  const session = await getServerSession();

  if (!session || session.userType !== 'SEEKER' || session.id !== id) {
    redirect('/auth/signin?type=SEEKER');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SeekerNavigation userId={id} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}