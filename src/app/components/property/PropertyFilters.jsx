// src/app/components/property/PropertyFilters.jsx
'use client';

import { useState } from 'react';
import { amenitiesData } from '@/app/utils/amenities';

export default function PropertyFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    type: 'ALL',
    gender: 'ALL',
    priceMin: '',
    priceMax: '',
    location: '',
    furnished: false,
    amenities: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Reset gender when property type changes
    if (name === 'type' && value !== 'PG') {
      setFilters(prev => ({
        ...prev,
        [name]: newValue,
        gender: 'ALL'
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
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
      gender: 'ALL',
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

        {/* Gender Filter (Only for PG) */}
        {filters.type === 'PG' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender Preference
            </label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="ALL">All</option>
              <option value="BOYS">Boys Only</option>
              <option value="GIRLS">Girls Only</option>
              <option value="ANY">Any Gender</option>
            </select>
          </div>
        )}

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(amenitiesData).map(([key, { label, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleAmenityToggle(key)}
              className={`flex items-center p-2 rounded-md border transition-colors
                ${filters.amenities.includes(key)
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

      {/* Active Filters Display */}
      {(filters.type !== 'ALL' || 
        filters.gender !== 'ALL' || 
        filters.priceMin || 
        filters.priceMax || 
        filters.location || 
        filters.furnished || 
        filters.amenities.length > 0) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.type !== 'ALL' && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                {filters.type}
              </span>
            )}
            {filters.type === 'PG' && filters.gender !== 'ALL' && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                {filters.gender}
              </span>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                ₹{filters.priceMin || '0'} - ₹{filters.priceMax || '∞'}
              </span>
            )}
            {filters.location && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                📍 {filters.location}
              </span>
            )}
            {filters.furnished && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                Furnished
              </span>
            )}
            {filters.amenities.map(amenity => (
              <span key={amenity} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                {amenitiesData[amenity].icon} {amenitiesData[amenity].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
