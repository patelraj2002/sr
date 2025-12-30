// src/app/components/property/LocationInput.jsx
'use client';

import { useState } from 'react';
import { CITIES_BY_STATE, AREAS_BY_CITY } from '@/app/utils/locationData';

export default function LocationInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim()) {
      const newSuggestions = [];

      // Search in cities
      Object.entries(CITIES_BY_STATE).forEach(([state, cities]) => {
        cities.forEach(city => {
          if (city.toLowerCase().includes(inputValue.toLowerCase())) {
            newSuggestions.push(`${city}, ${state}`);
          }
        });
      });

      // Search in areas
      Object.entries(AREAS_BY_CITY).forEach(([city, areas]) => {
        if (Array.isArray(areas)) {
          areas.forEach(area => {
            if (area.toLowerCase().includes(inputValue.toLowerCase())) {
              newSuggestions.push(`${area}, ${city}`);
            }
          });
        }
      });

      setSuggestions(newSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter location (e.g., Satellite, Ahmedabad)"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}