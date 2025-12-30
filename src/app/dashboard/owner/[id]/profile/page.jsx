import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import ProfileForm from '@/app/components/dashboard/ProfileForm';
import AccountSettings from '@/app/components/dashboard/AccountSettings';
import DeleteAccount from '@/app/components/dashboard/DeleteAccount';

export default async function OwnerProfile({ params: { id } }) {
  try {
    const session = await getServerSession();

    if (!session || session.id !== id) {
      redirect('/auth/signin');
    }

    const owner = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        alternatePhone: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            properties: true
          }
        }
      }
    });

    if (!owner) {
      redirect('/404');
    }

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">
                    {owner.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{owner.name}</h2>
                <p className="text-gray-600">{owner.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(owner.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Properties Listed</span>
                  <span className="font-semibold">{owner._count.properties}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-sm text-gray-500">
                    {owner.lastLoginAt 
                      ? new Date(owner.lastLoginAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form and Settings */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileForm user={owner} />
            <AccountSettings userId={owner.id} />
            <DeleteAccount userId={owner.id} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Profile error:', error);
    redirect('/auth/signin');
  }
}
