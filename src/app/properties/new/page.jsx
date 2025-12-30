'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/common/header';
import Image from 'next/image';
import { CITIES_BY_STATE, AREAS_BY_CITY } from '@/app/utils/locationData';
import LocationPicker from '@/app/components/property/LocationPicker';

export default function NewProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'PG',
    furnished: false,
    rooms: 1,
    bathrooms: 1,
    amenities: [],
    rules: '',
    available: new Date().toISOString().split('T')[0],
    images: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    latitude: null,
    longitude: null,
    googleAddress: '',
    sharingOptions: [
      { persons: '', price: '', available: '', total: '' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableAmenities = [
    'WiFi', 'AC', 'TV', 'Parking', 'Laundry',
    'Security', 'Power Backup', 'Water Supply',
    'Gym', 'Lift', 'CCTV', 'Food'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/signin?redirect=/properties/new');
      return;
    }

    const user = JSON.parse(userData);
    if (user.userType !== 'OWNER') {
      router.push('/auth/signup?type=owner');
      return;
    }
  }, [router]);

  const handleSharingOptionChange = (index, field, value) => {
    setFormData(prev => {
      const newSharingOptions = [...prev.sharingOptions];
      newSharingOptions[index] = {
        ...newSharingOptions[index],
        [field]: value
      };
      return {
        ...prev,
        sharingOptions: newSharingOptions
      };
    });
  };

  const addSharingOption = () => {
    setFormData(prev => ({
      ...prev,
      sharingOptions: [
        ...prev.sharingOptions,
        { persons: '', price: '', available: '', total: '' }
      ]
    }));
  };

  const handleLocationInputChange = (e) => {
    const inputValue = e.target.value;
    setFormData(prev => ({ ...prev, location: inputValue }));
  
    if (inputValue.trim()) {
      let newSuggestions = [];
  
      Object.entries(CITIES_BY_STATE).forEach(([state, cities]) => {
        cities.forEach(city => {
          if (city.toLowerCase().includes(inputValue.toLowerCase())) {
            newSuggestions.push(`${city}, ${state}`);
          }
        });
      });
  
      Object.keys(AREAS_BY_CITY).forEach(city => {
        const areas = AREAS_BY_CITY[city];
        if (Array.isArray(areas)) {
          areas.forEach(area => {
            if (area.toLowerCase().includes(inputValue.toLowerCase())) {
              newSuggestions.push(`${area}, ${city}`);
            }
          });
        }
      });
  
      newSuggestions = [...new Set(newSuggestions)].slice(0, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ 
      ...prev, 
      location,
      address: {
        ...prev.address,
        city: location.split(',')[0].trim(),
        state: location.split(',')[1]?.trim() || ''
      }
    }));
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'amenities') {
        const updatedAmenities = checked
          ? [...formData.amenities, value]
          : formData.amenities.filter(item => item !== value);
        setFormData(prev => ({
          ...prev,
          amenities: updatedAmenities
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError('');
  
    try {
      if (images.length + files.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
  
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
  
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload image');
        }
  
        return await response.json();
      });
  
      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
  
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Please sign in to list a property');
      }
  
      const user = JSON.parse(userData);
  
      const propertyData = {
        ...formData,
        type: formData.propertyType,
        rules: Array.isArray(formData.rules) ? formData.rules : [],
        images: images.map(img => ({
          url: img.url,
          publicId: img.filename || img.url.split('/').pop(),
          isMain: false
        })),
        ownerId: user.id,
        latitude: formData.latitude,
        longitude: formData.longitude,
        googleAddress: formData.googleAddress,
        address: {
          ...formData.address,
          location: formData.location
        },
        ...(formData.propertyType === 'PG' && {
          sharingOptions: formData.sharingOptions.filter(option => 
            option.persons && option.price && option.available && option.total
          )
        })
      };
  
      const response = await fetch('/api/properties/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property');
      }
  
      router.push('/dashboard/owner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Property</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Basic Information */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="PG">PG</option>
              <option value="FLAT">Flat</option>
            </select>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={handleLocationInputChange}
                onFocus={() => formData.location.trim() && setShowSuggestions(true)}
                placeholder="Enter location (e.g., Satellite, Ahmedabad)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Maps Location Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Exact Location
              </label>
              <LocationPicker
                onLocationSelect={(location) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    googleAddress: location.address
                  }));
                }}
                initialLocation={
                  formData.latitude && formData.longitude
                    ? {
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                        address: formData.googleAddress
                      }
                    : null
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailed Address
              </label>
              <textarea
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="Enter complete property address"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.address.landmark}
                  onChange={handleAddressChange}
                  placeholder="Nearby landmark"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  placeholder="6-digit PIN code"
                  pattern="[0-9]{6}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sharing Options Section */}
          {formData.propertyType === 'PG' && (
            <div className="border-t border-gray-200 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Sharing Options</h2>
                <button
                  type="button"
                  onClick={addSharingOption}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  + Add Option
                </button>
              </div>
              
              {formData.sharingOptions.map((option, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Persons per Room
                      </label>
                      <select
                        value={option.persons}
                        onChange={(e) => handleSharingOptionChange(index, 'persons', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Select</option>
                        {[2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} Sharing</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price per Person
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) => handleSharingOptionChange(index, 'price', e.target.value)}
                          className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Available Beds
                      </label>
                      <input
                        type="number"
                        value={option.available}
                        onChange={(e) => handleSharingOptionChange(index, 'available', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Beds
                      </label>
                      <input
                        type="number"
                        value={option.total}
                        onChange={(e) => handleSharingOptionChange(index, 'total', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          sharingOptions: prev.sharingOptions.filter((_, i) => i !== index)
                        }));
                      }}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rooms
              </label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Available From
            </label>
            <input
              type="date"
              name="available"
              value={formData.available}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">Furnished</span>
            </label>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Rules */}
          <div>
            <label htmlFor="rules" className="block text-sm font-medium text-gray-700">
              Rules
            </label>
            <textarea
              name="rules"
              id="rules"
              rows={3}
              value={formData.rules}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter property rules (optional)"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className={`px-4 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 ${
                (loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}