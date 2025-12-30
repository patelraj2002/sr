// src/app/components/common/LocationAutocomplete.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { CITIES_BY_STATE, AREAS_BY_CITY } from '@/app/utils/locationData';

export default function LocationAutocomplete({ initialValue = '', onSelect }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      let newSuggestions = [];
      
      // Search states
      Object.keys(CITIES_BY_STATE).forEach(state => {
        if (state.toLowerCase().includes(value.toLowerCase())) {
          newSuggestions.push({ type: 'state', value: state });
        }
      });

      // Search cities
      Object.entries(CITIES_BY_STATE).forEach(([state, cities]) => {
        cities.forEach(city => {
          if (city.toLowerCase().includes(value.toLowerCase())) {
            newSuggestions.push({ type: 'city', value: city, state });
          }
        });
      });

      // Search areas
      Object.entries(AREAS_BY_CITY).forEach(([city, areaData]) => {
        if (Array.isArray(areaData)) {
          // Flat structure
          areaData.forEach(area => {
            if (area.toLowerCase().includes(value.toLowerCase())) {
              newSuggestions.push({
                type: 'area',
                value: area,
                city,
                region: 'General'
              });
            }
          });
        } else {
          // Nested structure
          Object.entries(areaData).forEach(([region, areas]) => {
            areas.forEach(area => {
              if (area.toLowerCase().includes(value.toLowerCase())) {
                newSuggestions.push({
                  type: 'area',
                  value: area,
                  city,
                  region
                });
              }
            });
          });
        }
      });

      setSuggestions(newSuggestions.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let selectedValue = '';
    let locationData = {
      fullAddress: '',
      city: '',
      state: '',
      area: ''
    };
    
    switch (suggestion.type) {
      case 'state':
        selectedValue = suggestion.value;
        locationData = {
          fullAddress: suggestion.value,
          state: suggestion.value,
          city: '',
          area: ''
        };
        break;
      case 'city':
        selectedValue = `${suggestion.value}, ${suggestion.state}`;
        locationData = {
          fullAddress: selectedValue,
          state: suggestion.state,
          city: suggestion.value,
          area: ''
        };
        break;
      case 'area':
        selectedValue = suggestion.region === 'General'
          ? `${suggestion.value}, ${suggestion.city}`
          : `${suggestion.value}, ${suggestion.region}, ${suggestion.city}`;
        locationData = {
          fullAddress: selectedValue,
          state: suggestion.state || '',
          city: suggestion.city,
          area: suggestion.value,
          region: suggestion.region
        };
        break;
      default:
        selectedValue = suggestion.value;
    }

    setInputValue(selectedValue);
    onSelect(locationData);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Location*
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        placeholder="Enter location (state, city, or area)"
        required
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.type === 'area' ? (
                <div>
                  <span className="font-medium">{suggestion.value}</span>
                  <span className="text-gray-500 text-sm">
                    {suggestion.region === 'General' 
                      ? ` - ${suggestion.city}`
                      : ` - ${suggestion.region}, ${suggestion.city}`}
                  </span>
                </div>
              ) : suggestion.type === 'city' ? (
                <div>
                  <span className="font-medium">{suggestion.value}</span>
                  <span className="text-gray-500 text-sm"> in {suggestion.state}</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium">{suggestion.value}</span>
                  <span className="text-gray-500 text-sm"> (State)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}