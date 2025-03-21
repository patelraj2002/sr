// src/app/components/dashboard/seeker/MyInquiries.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MyInquiries({ inquiries }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESPONDED: 'bg-green-100 text-green-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!inquiries?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Inquiries</h2>
        <div className="text-center py-6">
          <p className="text-gray-500">No inquiries yet</p>
          <Link
            href="/properties"
            className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Inquiries</h2>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border rounded-lg p-4"
            >
              <div className="flex items-start space-x-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={inquiry.property.image || '/images/placeholder.jpg'}
                    alt={inquiry.property.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link
                      href={`/properties/${inquiry.property.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary-600"
                    >
                      {inquiry.property.title}
                    </Link>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Inquired on {formatDate(inquiry.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {inquiry.message}
                  </p>
                  {inquiry.response && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700">Response:</p>
                      <p className="text-sm text-gray-600 mt-1">{inquiry.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}