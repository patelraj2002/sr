'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CITIES_BY_STATE, AREAS_BY_CITY } from '@/app/utils/locationData';
import LocationPicker from './LocationPicker';
import ImageUpload from '../common/ImageUpload';
import { amenitiesData } from '@/app/utils/amenities';

export default function PropertyForm({ ownerId, initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableStates] = useState(Object.keys(CITIES_BY_STATE));
  const [availableCities, setAvailableCities] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'PG',
    gender: initialData?.gender || 'ANY',
    location: initialData?.location || '',
    googleAddress: initialData?.googleAddress || '',
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    furnished: initialData?.furnished || false,
    rooms: initialData?.rooms || 1,
    bathrooms: initialData?.bathrooms || 1,
    amenities: initialData?.amenities || [],
    rules: initialData?.rules || [],
    available: initialData?.available || new Date().toISOString().split('T')[0],
    images: initialData?.images || [],
    price: initialData?.price || '',
    sharingOptions: initialData?.sharingOptions || [
      { persons: 1, price: '', available: 0, total: 0 },
      { persons: 2, price: '', available: 0, total: 0 },
      { persons: 3, price: '', available: 0, total: 0 }
    ],
    address: initialData?.address || {
      street: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (formData.address.state) {
      setAvailableCities(CITIES_BY_STATE[formData.address.state] || []);
    }
  }, [formData.address.state]);

  useEffect(() => {
    if (formData.address.city) {
      setAvailableAreas(AREAS_BY_CITY[formData.address.city] || []);
    }
  }, [formData.address.city]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      googleAddress: location.address,
      address: {
        ...prev.address,
        street: location.address.split(',')[0],
        city: location.city || '',
        state: location.state || '',
        pincode: location.pincode || ''
      }
    }));
  };

  const handleSharingOptionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sharingOptions: prev.sharingOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const addSharingOption = () => {
    if (formData.sharingOptions.length < 6) {
      const nextPersons = formData.sharingOptions.length + 1;
      setFormData(prev => ({
        ...prev,
        sharingOptions: [
          ...prev.sharingOptions,
          { 
            persons: nextPersons,
            price: '',
            available: 0,
            total: 0
          }
        ]
      }));
    }
  };

  const removeSharingOption = (index) => {
  setFormData(prev => ({
    ...prev,
    sharingOptions: prev.sharingOptions.filter((_, i) => i !== index)
  }));
};


  const handleImageChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleRulesChange = (e) => {
    const rules = e.target.value.split('\n').filter(rule => rule.trim());
    setFormData(prev => ({ ...prev, rules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Property title is required');
      }

      if (!formData.location) {
        throw new Error('Property location is required');
      }

      if (!formData.latitude || !formData.longitude) {
        throw new Error('Please select a valid location on the map');
      }

      if (formData.images.length === 0) {
        throw new Error('At least one property image is required');
      }

      if (formData.type === 'PG') {
        // Validate PG sharing options
        const validSharingOptions = formData.sharingOptions.filter(
          option => option.price && option.total > 0
        );
        
        if (validSharingOptions.length === 0) {
          throw new Error('Please add at least one valid sharing option');
        }

        formData.sharingOptions.forEach((option, index) => {
          if (option.available > option.total) {
            throw new Error(`Available beds cannot exceed total beds in ${option.persons}-sharing option`);
          }
          if (option.price <= 0) {
            throw new Error(`Please enter a valid price for ${option.persons}-sharing option`);
          }
        });
      } else {
        // Validate FLAT price
        if (!formData.price || formData.price <= 0) {
          throw new Error('Please enter a valid rent amount');
        }
      }

      // Validate rent payment date and deposit
      if (!formData.rentPaymentDate || formData.rentPaymentDate < 1 || formData.rentPaymentDate > 31) {
        throw new Error('Please enter a valid rent payment date (1-31)');
      }

      if (!formData.advanceDeposit || formData.advanceDeposit < 1) {
        throw new Error('Please enter a valid number of months for advance deposit');
      }

      // Prepare data for API
      const propertyData = {
        ...formData,
        ownerId,
        price: formData.type === 'FLAT' ? parseFloat(formData.price) : null,
        address: {
          ...formData.address,
          area: formData.address.area || formData.address.street,
        },
        rooms: parseInt(formData.rooms),
        bathrooms: parseInt(formData.bathrooms),
        rentPaymentDate: parseInt(formData.rentPaymentDate),
        advanceDeposit: parseInt(formData.advanceDeposit),
        sharingOptions: formData.type === 'PG' 
          ? formData.sharingOptions.map(opt => ({
              persons: parseInt(opt.persons),
              price: parseFloat(opt.price),
              available: parseInt(opt.available),
              total: parseInt(opt.total)
            }))
          : []
      };

      const endpoint = initialData 
        ? `/api/properties/${initialData.id}`
        : '/api/properties/new';

      const response = await fetch(endpoint, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save property');
      }

      router.push(`/dashboard/owner/${ownerId}/properties`);
      router.refresh();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded animate-fade-in">
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title*
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type*
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
            >
              <option value="PG">PG</option>
              <option value="FLAT">Flat</option>
            </select>
          </div>

          {/* Gender Selection for PG */}
          {formData.type === 'PG' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender Preference*
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                required
              >
                <option value="ANY">Any</option>
                <option value="BOYS">Boys Only</option>
                <option value="GIRLS">Girls Only</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-primary-500 focus:ring-primary-500
              text-sm sm:text-base py-2 px-3"
            required
          />
        </div>
      </div>

      {/* Detailed Address */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Detailed Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address*
            </label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              placeholder="Enter street address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.address.landmark}
              onChange={handleAddressChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              placeholder="Near landmark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State*
            </label>
            <select
              name="state"
              value={formData.address.state}
              onChange={(e) => {
                const selectedState = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    state: selectedState,
                    city: ''
                  }
                }));
                setAvailableCities(CITIES_BY_STATE[selectedState] || []);
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            >
              <option value="">Select State</option>
              {availableStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <select
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            >
              <option value="">Select City</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area*
            </label>
            <input
              type="text"
              name="area"
              value={formData.address.area}
              onChange={handleAddressChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              placeholder="Enter area name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode*
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleAddressChange}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              placeholder="Enter pincode"
              pattern="[0-9]{6}"
              required
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Location*</h2>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={initialData ? {
            latitude: initialData.latitude,
            longitude: initialData.longitude,
            address: initialData.location
          } : null}
        />
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Property Details</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rooms*
            </label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms*
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available From*
            </label>
            <input
              type="date"
              name="available"
              value={formData.available}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500
                text-sm sm:text-base py-2 px-3"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 
                focus:ring-primary-500 w-5 h-5"
            />
            <span className="ml-2 text-sm sm:text-base text-gray-700">Furnished</span>
          </label>
        </div>
      </div>

      {/* PG Sharing Options */}
      {/* PG Sharing Options */}
{formData.type === 'PG' && (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
      <h2 className="text-lg sm:text-xl font-medium">Sharing Options*</h2>
      {formData.sharingOptions.length < 6 && (
        <button
          type="button"
          onClick={addSharingOption}
          className="text-primary-600 hover:text-primary-700
            text-sm sm:text-base py-1 px-2 rounded transition-colors"
        >
          + Add Sharing Option
        </button>
      )}
    </div>

    <div className="space-y-4">
      {formData.sharingOptions.map((option, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h4 className="font-medium text-sm sm:text-base">
              {option.persons}-Sharing Option
            </h4>
            <button
              type="button"
              onClick={() => removeSharingOption(index)}
              className="text-red-600 hover:text-red-700 text-sm sm:text-base
                py-1 px-2 rounded transition-colors"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Person*
              </label>
              <input
                type="number"
                value={option.price}
                onChange={(e) => handleSharingOptionChange(index, 'price', e.target.value)}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Beds*
              </label>
              <input
                type="number"
                value={option.available}
                onChange={(e) => handleSharingOptionChange(index, 'available', e.target.value)}
                min="0"
                max={option.total}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Beds*
              </label>
              <input
                type="number"
                value={option.total}
                onChange={(e) => handleSharingOptionChange(index, 'total', e.target.value)}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                required
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    {formData.sharingOptions.length === 0 && (
      <div className="mt-4 text-yellow-700 bg-yellow-50 p-4 rounded-lg">
        Please add at least one sharing option.
      </div>
    )}
  </div>
)}

      {/* Rent Details */}
      {(formData.type === 'FLAT' || formData.type === 'PG') && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-medium mb-4">Rent Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {formData.type === 'FLAT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm 
                      focus:border-primary-500 focus:ring-primary-500
                      text-sm sm:text-base py-2 px-3"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rent Payment Date*
              </label>
              <input
                type="number"
                name="rentPaymentDate"
                value={formData.rentPaymentDate}
                onChange={handleChange}
                min="1"
                max="31"
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                placeholder="Enter day of month (1-31)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Deposit (in months)*
              </label>
              <input
                type="number"
                name="advanceDeposit"
                value={formData.advanceDeposit}
                onChange={handleChange}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-primary-500 focus:ring-primary-500
                  text-sm sm:text-base py-2 px-3"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Amenities */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(amenitiesData).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                const newAmenities = formData.amenities.includes(key)
                  ? formData.amenities.filter(a => a !== key)
                  : [...formData.amenities, key];
                setFormData(prev => ({ ...prev, amenities: newAmenities }));
              }}
              className={`flex items-center p-3 rounded-lg border transition-colors
                ${formData.amenities.includes(key)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200'
                } text-sm sm:text-base`}
            >
              <span className="mr-2">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Property Rules</h2>
        <textarea
          value={formData.rules.join('\n')}
          onChange={handleRulesChange}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500
            text-sm sm:text-base py-2 px-3"
          placeholder="Enter each rule on a new line"
        />
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Property Images*</h2>
        <ImageUpload
          images={formData.images}
          onChange={handleImageChange}
          maxImages={5}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 
            rounded-md hover:bg-gray-200 transition-colors
            text-sm sm:text-base font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto px-6 py-2 bg-primary-600 text-white 
            rounded-md hover:bg-primary-700 transition-colors
            text-sm sm:text-base font-medium
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : (initialData ? 'Update Property' : 'Add Property')}
        </button>
      </div>
    </form>
  );
}