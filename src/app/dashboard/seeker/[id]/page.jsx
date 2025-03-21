// src/app/dashboard/seeker/[id]/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import SeekerDashboardClient from './SeekerDashboardClient';

export default async function SeekerDashboardPage({ params: { id } }) {
  const session = await getServerSession();
  
  if (!session || session.id !== id) {
    redirect('/auth/signin');
  }

  const savedProperties = await prisma.savedProperty.findMany({
    where: { userId: id },
    include: {
      property: {
        include: {
          images: true,
          sharingOptions: true,
          owner: {
            select: {
              name: true,
              phone: true
            }
          }
        }
      }
    }
  });

  return (
    <SeekerDashboardClient 
      session={session}
      initialProperties={savedProperties.map(sp => sp.property)}
    />
  );
}