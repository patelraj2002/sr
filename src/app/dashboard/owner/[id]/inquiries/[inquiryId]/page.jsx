// src/app/dashboard/owner/[id]/inquiries/[inquiryId]/page.jsx
import { getServerSession } from '@/app/utils/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import InquiryResponseForm from '@/app/components/dashboard/InquiryResponseForm';

export default async function InquiryDetail({ params }) {
  const session = await getServerSession();
  
  if (!session || session.id !== params.id) {
    redirect('/auth/signin');
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id: params.inquiryId
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          type: true,
          ownerId: true,
          images: {
            where: { isMain: true },
            take: 1
          }
        }
      }
    }
  });

  if (!inquiry || inquiry.property.ownerId !== session.id) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inquiry Details</h1>
        <Link
          href={`/dashboard/owner/${params.id}/inquiries`}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Inquiries
        </Link>
      </div>

      {/* Inquiry Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-4">
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image
              src={inquiry.property.images[0]?.url || '/images/placeholder.jpg'}
              alt={inquiry.property.title}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{inquiry.property.title}</h2>
            <p className="text-gray-500">{inquiry.property.type}</p>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">From:</span> {inquiry.name}</p>
              <p><span className="font-medium">Email:</span> {inquiry.email}</p>
              <p><span className="font-medium">Phone:</span> {inquiry.phone}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                  inquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  inquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {inquiry.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Inquiry Message */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Inquiry Message:</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p>{inquiry.message}</p>
          </div>
        </div>

        {/* Visit Date if available */}
        {inquiry.visitDate && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Requested Visit Date:</h3>
            <p>{new Date(inquiry.visitDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* Response History */}
        {inquiry.response && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Your Response:</h3>
            <div className="bg-blue-50 p-4 rounded-md">
              <p>{inquiry.response}</p>
              <p className="text-sm text-gray-500 mt-2">
                Responded on: {new Date(inquiry.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Response Form if inquiry is pending */}
        {inquiry.status === 'PENDING' && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Respond to Inquiry</h3>
            <InquiryResponseForm 
              inquiryId={inquiry.id}
              ownerId={params.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}