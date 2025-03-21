// src/app/components/dashboard/owner/OwnerStats.jsx
export default function OwnerStats({ ownerId }) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Properties</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Inquiries</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Response Rate</h3>
          <p className="mt-2 text-3xl font-bold text-secondary-600">92%</p>
        </div>
      </div>
    );
  }