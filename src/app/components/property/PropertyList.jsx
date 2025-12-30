// src/app/components/property/PropertyList.jsx
'use client';

import PropertyCard from './PropertyCard';

export default function PropertyList({ properties, isOwner = true }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">No properties listed yet.</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          isOwner={isOwner}
        />
      ))}
    </div>
  );
}