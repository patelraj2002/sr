// src/app/properties/[id]/page.jsx
import { notFound } from 'next/navigation';
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import PropertyMap from '@/app/components/property/PropertyMap';
import PropertyActions from '@/app/components/property/PropertyActions';

export default async function PropertyPage({ params: { id } }) {
  const session = await getServerSession();
  
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      sharingOptions: {
        orderBy: {
          persons: 'asc'
        }
      },
      inquiries: true
    }
  });

  if (!property) {
    notFound();
  }

  const isOwner = session?.id === property.ownerId;

  // Check if the property is saved by the current user
  let isSaved = false;
  if (session && !isOwner) {
    const savedProperty = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: session.id,
          propertyId: id
        }
      }
    });
    isSaved = !!savedProperty;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={isOwner ? `/dashboard/owner/${session?.id}/properties` : '/properties'}
            className="text-primary-600 hover:text-primary-700 flex items-center text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {isOwner ? 'My Properties' : 'Properties'}
          </Link>
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-square">
              <Image
                src={property.images[0]?.url || '/images/placeholder.jpg'}
                alt={property.title}
                fill
                className="object-cover rounded-lg"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {property.images.slice(1, 5).map((image, index) => (
                <div key={image.id} className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={`${property.title} - ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="text-lg sm:text-xl text-gray-600 mt-2">{property.location}</p>
                  {property.googleAddress && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{property.googleAddress}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${property.type === 'PG' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {property.type}
                  </span>
                  {property.furnished && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Furnished
                    </span>
                  )}
                </div>
              </div>

              <div className="prose max-w-none text-sm sm:text-base">
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Property stats cards */}
                {[
                  { label: 'Rooms', value: property.rooms },
                  { label: 'Bathrooms', value: property.bathrooms },
                  { label: 'Available From', value: new Date(property.available).toLocaleDateString() },
                  { label: 'Status', value: property.status }
                ].map(({ label, value }) => (
                  <div key={label} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <span className="text-xs sm:text-sm text-gray-500">{label}</span>
                    <p className="mt-1 font-semibold text-sm sm:text-base">{value}</p>
                  </div>
                ))}
              </div>

              {/* PG Sharing Options */}
              {property.type === 'PG' && property.sharingOptions.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Sharing Options</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {property.sharingOptions.map((option) => (
                      <div key={option.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="font-medium text-sm sm:text-base">{option.persons} Person Sharing</h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {option.available} out of {option.total} beds available
                            </p>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-primary-600">
                            {formatPrice(option.price)}
                            <span className="text-xs sm:text-sm text-gray-500">/person</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2 text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              {property.rules?.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">House Rules</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                    {property.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location Map */}
              {property.latitude && property.longitude && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Location</h3>
                  <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                    <PropertyMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      height="100%"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="text-center">
                {property.type === 'PG' ? (
                  <>
                    <p className="text-sm sm:text-base text-gray-600">Starting from</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">
                      {formatPrice(Math.min(...property.sharingOptions.map(opt => opt.price)))}
                      <span className="text-sm sm:text-base text-gray-600">/person</span>
                    </p>
                  </>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                    <span className="text-sm sm:text-base text-gray-600">/month</span>
                  </p>
                )}
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Property Owner</h3>
              <div className="space-y-2">
                <p className="flex items-center text-sm sm:text-base">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 mr-2">👤</span>
                  {property.owner.name}
                </p>
                {session && (
                  <>
                    <p className="flex items-center text-sm sm:text-base">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 mr-2">📧</span>
                      {property.owner.email}
                    </p>
                    <p className="flex items-center text-sm sm:text-base">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 mr-2">📞</span>
                      {property.owner.phone}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <PropertyActions
              property={property}
              isOwner={isOwner}
              isAuthenticated={!!session}
              initialSaved={isSaved}
              userId={session?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
