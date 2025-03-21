// src/app/components/property/AmenitiesSelect.jsx
import { amenitiesIcons } from '@/app/utils/amenities';

export default function AmenitiesSelect({ selectedAmenities, onChange }) {
  const handleToggle = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(amenitiesIcons).map(([key, { label, icon }]) => (
        <button
          key={key}
          type="button"
          onClick={() => handleToggle(key)}
          className={`flex items-center gap-2 p-3 rounded-lg border ${
            selectedAmenities.includes(key)
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-200'
          }`}
        >
          <div className="w-6 h-6 text-primary-600">
            {icon}
          </div>
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
}