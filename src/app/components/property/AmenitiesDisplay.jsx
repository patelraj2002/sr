// src/app/components/property/AmenitiesDisplay.jsx
import { amenitiesIcons } from '@/app/utils/amenities';

export default function AmenitiesDisplay({ amenities, className = '' }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {amenities.map((amenity) => {
        const amenityData = amenitiesIcons[amenity];
        if (!amenityData) return null;

        return (
          <div
            key={amenity}
            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white"
          >
            <div className="w-8 h-8 flex items-center justify-center text-primary-600">
              {amenityData.icon}
            </div>
            <span className="text-sm text-gray-700">{amenityData.label}</span>
          </div>
        );
      })}
    </div>
  );
}