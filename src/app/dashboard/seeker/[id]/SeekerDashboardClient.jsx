// src/app/dashboard/seeker/[id]/SeekerDashboardClient.jsx
'use client';

import { useState } from 'react';
import SavedProperties from '@/app/components/dashboard/seeker/SavedProperties';
import PropertyFilters from '@/app/components/property/PropertyFilters';

export default function SeekerDashboardClient({ session, initialProperties }) {
  const [properties] = useState(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = (filters) => {
    if (!filters) {
      setIsFiltering(false);
      setFilteredProperties([]);
      return;
    }

    setIsFiltering(true);
    const filtered = properties.filter(property => {
      // Type filter
      if (filters.type !== 'ALL' && property.type !== filters.type) {
        return false;
      }

      // Price filter
      if (property.type === 'FLAT') {
        if (filters.priceMin && property.price < filters.priceMin) return false;
        if (filters.priceMax && property.price > filters.priceMax) return false;
      } else if (property.type === 'PG' && property.sharingOptions.length > 0) {
        const minPrice = Math.min(...property.sharingOptions.map(opt => opt.price));
        if (filters.priceMin && minPrice < filters.priceMin) return false;
        if (filters.priceMax && minPrice > filters.priceMax) return false;
      }

      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Furnished filter
      if (filters.furnished && !property.furnished) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    setFilteredProperties(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, {session.name}
        </h1>
        <p className="text-gray-600">
          {properties.length} Saved {properties.length === 1 ? 'Property' : 'Properties'}
        </p>
      </div>

      <PropertyFilters onFilterChange={handleFilterChange} />
      
      {properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No saved properties yet.</p>
          <a 
            href="/properties" 
            className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Browse Properties
          </a>
        </div>
      ) : (
        <SavedProperties 
          properties={isFiltering ? filteredProperties : properties}
          emptyMessage={
            isFiltering 
              ? "No properties match your filters"
              : "No saved properties found"
          }
        />
      )}
    </div>
  );
}