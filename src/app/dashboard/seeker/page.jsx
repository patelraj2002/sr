// src/app/dashboard/seeker/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyGrid from '@/app/components/property/PropertyGrid';
import PropertyFilters from '@/app/components/property/PropertyFilters';

export default function SeekerPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication and load data
    const userString = localStorage.getItem('user');
    if (!userString) {
      router.push('/auth/signin');
      return;
    }

    const userData = JSON.parse(userString);
    if (userData.userType !== 'SEEKER') {
      router.push('/unauthorized');
      return;
    }

    setUser(userData);

    // Fetch properties
    async function loadData() {
      try {
        const response = await fetch('/api/properties?status=ACTIVE');
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const displayProperties = isFiltering ? filteredProperties : properties;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Available Properties</h1>
          {user && user.userType === 'SEEKER' && (
            <Link
              href={`/dashboard/seeker/${user.id}/saved`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              My Dashboard
            </Link>
          )}
        </div>
        <p className="text-gray-600">
          {displayProperties.length} {displayProperties.length === 1 ? 'Property' : 'Properties'} Found
        </p>
      </div>

      <PropertyFilters onFilterChange={handleFilterChange} />

      {displayProperties.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">
            {isFiltering 
              ? "No properties match your filters" 
              : "No properties available"
            }
          </p>
        </div>
      ) : (
        <PropertyGrid
          properties={displayProperties}
          isAuthenticated={!!user}
          userType={user?.userType || 'SEEKER'}
          userId={user?.id}
        />
      )}

      {/* Floating Dashboard Button for Mobile */}
      {user && user.userType === 'SEEKER' && (
        <div className="fixed bottom-4 right-4 md:hidden">
          <Link
            href={`/dashboard/seeker/${user.id}/saved`}
            className="flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}