// src/app/components/property/AmenitiesList.jsx
import AmenityIcon from './AmenityIcon';

export default function AmenitiesList({ amenities }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {amenities.map((amenity) => (
        <AmenityIcon key={amenity} type={amenity} />
      ))}
    </div>
  );
}