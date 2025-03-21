// src/app/components/dashboard/owner/PropertyList.jsx
import PropertyCard from '@/components/property/PropertyCard';

export default function PropertyList({ ownerId }) {
  // This would normally fetch properties based on ownerId
  const dummyProperties = [
    {
      id: 1,
      title: "Luxury PG in Koramangala",
      location: "Koramangala, Bangalore",
      price: "15,000",
      image: "https://example.com/image1.jpg"
    },
    // Add more dummy properties
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600">
          Add New Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}