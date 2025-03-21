// src/app/components/property/PropertyFilters.jsx
'use client';

import { useState } from 'react';

export default function PropertyFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: 'ALL',
    priceMin: '',
    priceMax: '',
    location: '',
    furnished: false,
    amenities: []
  });

  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: '📶' },
    { key: 'ac', label: 'AC', icon: '❄️' },
    { key: 'parking', label: 'Parking', icon: '🅿️' },
    { key: 'laundry', label: 'Laundry', icon: '🧺' },
    { key: 'security', label: '24/7 Security', icon: '👮' },
    { key: 'gym', label: 'Gym', icon: '💪' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      type: 'ALL',
      priceMin: '',
      priceMax: '',
      location: '',
      furnished: false,
      amenities: []
    });
    onFilterChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">All Types</option>
            <option value="PG">PG</option>
            <option value="FLAT">Flat</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Furnished Checkbox */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="furnished"
            checked={filters.furnished}
            onChange={handleChange}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Furnished Only</span>
        </label>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {amenitiesList.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleAmenityToggle(key)}
              className={`flex items-center p-2 rounded-md border ${
                filters.amenities.includes(key)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-200'
              }`}
            >
              <span className="mr-2">{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}