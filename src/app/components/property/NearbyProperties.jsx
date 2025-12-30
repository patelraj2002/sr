// src/app/components/property/NearbyProperties.jsx
'use client';

import { useState, useEffect } from 'react';
import { calculateDistance } from '@/app/utils/distance';
import PropertyCard from './PropertyCard';

export default function NearbyProperties({ currentProperty }) {
  const [nearbyProperties, setNearbyProperties] = useState([]);

  useEffect(() => {
    fetchNearbyProperties();
  }, []);

  const fetchNearbyProperties = async () => {
    try {
      const response = await fetch('/api/properties/available');
      const data = await response.json();

      // Filter and sort by distance
      const nearby = data
        .filter(prop => prop.id !== currentProperty.id)
        .map(prop => ({
          ...prop,
          distance: calculateDistance(
            currentProperty.latitude,
            currentProperty.longitude,
            prop.latitude,
            prop.longitude
          )
        }))
        .filter(prop => prop.distance <= 5) // Within 5km
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // Show top 3

      setNearbyProperties(nearby);
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
    }
  };

  if (nearbyProperties.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Nearby Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nearbyProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}