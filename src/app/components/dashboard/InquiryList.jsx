// src/app/components/dashboard/InquiryList.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import ResponseModal from './ResponseModal';

export default function InquiryList({ inquiries, ownerId }) {
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const handleResponse = async (inquiryId, response) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) {
        throw new Error('Failed to send response');
      }

      // Close modal and refresh data
      setIsResponseModalOpen(false);
      setSelectedInquiry(null);
      // You might want to implement a refresh mechanism here
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response. Please try again.');
    }
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquirer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 relative flex-shrink-0">
                      <Image
                        src={inquiry.property.images[0]?.url || '/images/placeholder.jpg'}
                        alt={inquiry.property.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.property.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.property.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{inquiry.name}</div>
                  <div className="text-sm text-gray-500">{inquiry.email}</div>
                  <div className="text-sm text-gray-500">{inquiry.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setIsResponseModalOpen(true);
                    }}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inquiries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        )}
      </div>

      {selectedInquiry && (
        <ResponseModal
          isOpen={isResponseModalOpen}
          onClose={() => {
            setIsResponseModalOpen(false);
            setSelectedInquiry(null);
          }}
          inquiry={selectedInquiry}
          onSubmit={handleResponse}
        />
      )}
    </div>
  );
}