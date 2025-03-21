// src/app/components/dashboard/seeker/MyInquiries.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function MyInquiries({ inquiries: initialInquiries }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [activeTab, setActiveTab] = useState('ALL');

  const filterInquiries = (status) => {
    setActiveTab(status);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESPONDED: 'bg-green-100 text-green-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredInquiries = activeTab === 'ALL' 
    ? inquiries
    : inquiries.filter(inquiry => inquiry.status === activeTab);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Inquiries</h2>

        {/* Status Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {['ALL', 'PENDING', 'RESPONDED', 'SCHEDULED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => filterInquiries(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === status
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No inquiries found
            </p>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={inquiry.property.images[0]?.url || '/images/placeholder.jpg'}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Inquired {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}