// src/app/dashboard/owner/[id]/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import StatsCard from '@/app/components/dashboard/StatsCard';
import RecentInquiries from '@/app/components/dashboard/RecentInquiries';
import RecentProperties from '@/app/components/dashboard/RecentProperties';

export default async function OwnerDashboard({ params }) {
  const session = await getServerSession();
  const { id } = await params;

  if (!session || session.id !== id) {
    redirect('/auth/signin');
  }

  // Fetch owner's stats and data
  const stats = await prisma.$transaction([
    // Total properties
    prisma.property.count({
      where: { ownerId: id }
    }),
    // Active properties
    prisma.property.count({
      where: {
        ownerId: id,
        status: 'ACTIVE'
      }
    }),
    // Total inquiries
    prisma.inquiry.count({
      where: {
        property: {
          ownerId: id
        }
      }
    }),
    // Recent inquiries
    prisma.inquiry.findMany({
      where: {
        property: {
          ownerId: id
        }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    }),
    // Recent properties
    prisma.property.findMany({
      where: { ownerId: params.id },
      include: {
        images: true,
        inquiries: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })
  ]);

  const [
    totalProperties,
    activeProperties,
    totalInquiries,
    recentInquiries,
    recentProperties
  ] = stats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {session.name}</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon="🏠"
          href={`/dashboard/owner/${id}/properties`}
        />
        <StatsCard
          title="Active Listings"
          value={activeProperties}
          icon="✨"
          href={`/dashboard/owner/${id}/properties`}
        />
        <StatsCard
          title="Total Inquiries"
          value={totalInquiries}
          icon="📫"
          href={`/dashboard/owner/${id}/inquiries`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <RecentProperties
          properties={recentProperties}
          ownerId={id}
        />

        {/* Recent Inquiries */}
        <RecentInquiries
          inquiries={recentInquiries}
          ownerId={id}
        />
      </div >
    </div >
  );
}