import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';

export default async function OwnerDashboardLayout({ children, params }) {
  try {
    const session = await getServerSession();
    const { id } = params; // Don't await params directly

    if (!session) {
      redirect('/auth/signin');
    }

    // Verify owner is accessing their own dashboard
    if (session.id !== id || session.userType !== 'OWNER') {
      redirect('/unauthorized');
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    );
  } catch (error) {
    console.error('Layout error:', error);
    redirect('/auth/signin');
  }
}
