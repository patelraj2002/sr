// src/app/components/dashboard/ResponseModal.jsx
'use client';

import { useState } from 'react';

export default function ResponseModal({ isOpen, onClose, inquiry, onSubmit }) {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(inquiry.id, response);
      onClose();
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 p-6">
        <h3 className="text-lg font-medium mb-4">
          Respond to Inquiry
        </h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600">From: {inquiry.name}</p>
          <p className="text-sm text-gray-600">Property: {inquiry.property.title}</p>
          <p className="mt-2 text-gray-700">{inquiry.message}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Response
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}