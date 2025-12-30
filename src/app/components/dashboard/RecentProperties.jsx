// src/app/components/dashboard/RecentProperties.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function RecentProperties({ properties, ownerId }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Properties</h2>
        <Link
          href={`/dashboard/owner/${ownerId}/properties`}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {properties.map(property => (
          <div key={property.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="relative w-20 h-20">
              <Image
                src={property.images[0]?.url || '/images/placeholder.jpg'}
                alt={property.title}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{property.title}</h3>
              <p className="text-sm text-gray-600">
                {property.type === 'PG' ? 'PG' : 'Flat'} • {property.inquiries.length} inquiries
              </p>
            </div>
            <Link
              href={`/dashboard/owner/${ownerId}/properties/${property.id}`}
              className="text-primary-600 hover:text-primary-700"
            >
              View
            </Link>
          </div>
        ))}

        {properties.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No properties listed yet
          </p>
        )}
      </div>
    </div>
  );
}