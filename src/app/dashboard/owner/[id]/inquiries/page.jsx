// src/app/dashboard/owner/[id]/inquiries/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import InquiryList from '@/app/components/dashboard/InquiryList';

export default async function OwnerInquiries({ params }) {
  const session = await getServerSession();
  
  if (!session || session.id !== params.id) {
    redirect('/auth/signin');
  }

  const inquiries = await prisma.inquiry.findMany({
    where: {
      property: {
        ownerId: params.id
      }
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          type: true,
          images: {
            where: { isMain: true },
            take: 1
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Property Inquiries</h1>
      <InquiryList inquiries={inquiries} ownerId={params.id} />
    </div>
  );
}