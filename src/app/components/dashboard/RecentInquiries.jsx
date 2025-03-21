// src/app/components/dashboard/RecentInquiries.jsx
'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'; // This should work now after installing

export default function RecentInquiries({ inquiries, ownerId }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Inquiries</h2>
          <Link
            href={`/dashboard/owner/${ownerId}/inquiries`}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No inquiries received yet
            </p>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-gray-600">{inquiry.property.title}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {inquiry.message}
                </p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    inquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    inquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}