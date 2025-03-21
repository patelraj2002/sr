// src/app/components/property/AmenityIcon.jsx
import { amenitiesIcons } from '@/app/utils/amenities';

export default function AmenityIcon({ type, className = '' }) {
  const amenity = amenitiesIcons[type];
  
  if (!amenity) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`} title={amenity.label}>
      <div className="w-6 h-6 text-primary-600">
        {amenity.icon}
      </div>
      <span className="text-sm text-gray-600">{amenity.label}</span>
    </div>
  );
}