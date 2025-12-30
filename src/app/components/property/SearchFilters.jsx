'use client';

import { useState, useEffect } from 'react';

export default function SearchFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: 'ALL',
    furnished: 'ALL',
    sharing: 'all',
  });

  // Show sharing options only for PG type
  const [showSharingOptions, setShowSharingOptions] = useState(false);

  useEffect(() => {
    setShowSharingOptions(filters.type === 'PG');
    // Reset sharing filter when switching from PG to other types
    if (filters.type !== 'PG') {
      setFilters(prev => ({ ...prev, sharing: 'all' }));
    }
  }, [filters.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset price filters when switching between PG and non-PG
      ...(name === 'type' && {
        minPrice: '',
        maxPrice: ''
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      type: 'ALL',
      furnished: 'ALL',
      sharing: 'all',
    });
    onFilter({}); // Reset filters in parent component
  };

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FilterInput
              label="Location"
              name="location"
              placeholder="Enter location"
            />

            <FilterInput
              label="Property Type"
              name="type"
              type="select"
              options={[
                { value: 'ALL', label: 'All Types' },
                { value: 'PG', label: 'PG' },
                { value: 'FLAT', label: 'Flat' },
              ]}
            />

            {showSharingOptions && (
              <FilterInput
                label="Sharing Type"
                name="sharing"
                type="select"
                options={[
                  { value: 'all', label: 'Any Sharing' },
                  { value: '2', label: '2 Sharing' },
                  { value: '3', label: '3 Sharing' },
                  { value: '4', label: '4 Sharing' },
                  { value: '5', label: '5 Sharing' },
                  { value: '6', label: '6 Sharing' },
                ]}
              />
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="Min ₹"
                  className="w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 
                           shadow-sm text-sm py-2"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="Max ₹"
                  className="w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 
                           shadow-sm text-sm py-2"
                />
              </div>
            </div>

            <FilterInput
              label="Furnished Status"
              name="furnished"
              type="select"
              options={[
                { value: 'ALL', label: 'All' },
                { value: 'true', label: 'Furnished' },
                { value: 'false', label: 'Unfurnished' },
              ]}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                       text-sm font-medium transition-colors duration-200"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
                       text-sm font-medium transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-primary-500 text-white p-4 rounded-full shadow-lg 
                   hover:bg-primary-600 transition-colors duration-200"
        >
          <FiFilter size={24} />
        </button>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 md:hidden">
          <div className="fixed inset-0 transform transition-transform duration-300">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md">
                  <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white shadow-xl">
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button
                          type="button"
                          onClick={() => setShowMobileFilters(false)}
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <FiX size={24} />
                        </button>
                      </div>

                      <div className="px-4 sm:px-6 space-y-6">
                        {/* Mobile Filter Inputs */}
                        <FilterInput
                          label="Location"
                          name="location"
                          placeholder="Enter location"
                        />

                        <FilterInput
                          label="Property Type"
                          name="type"
                          type="select"
                          options={[
                            { value: 'ALL', label: 'All Types' },
                            { value: 'PG', label: 'PG' },
                            { value: 'FLAT', label: 'Flat' },
                          ]}
                        />

                        {showSharingOptions && (
                          <FilterInput
                            label="Sharing Type"
                            name="sharing"
                            type="select"
                            options={[
                              { value: 'all', label: 'Any Sharing' },
                              { value: '2', label: '2 Sharing' },
                              { value: '3', label: '3 Sharing' },
                              { value: '4', label: '4 Sharing' },
                              { value: '5', label: '5 Sharing' },
                              { value: '6', label: '6 Sharing' },
                            ]}
                          />
                        )}

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Price Range
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              name="minPrice"
                              value={filters.minPrice}
                              onChange={handleChange}
                              placeholder="Min ₹"
                              className="w-full rounded-md border-gray-300 focus:border-primary-500 
                                       focus:ring-primary-500 shadow-sm text-sm py-2"
                            />
                            <input
                              type="number"
                              name="maxPrice"
                              value={filters.maxPrice}
                              onChange={handleChange}
                              placeholder="Max ₹"
                              className="w-full rounded-md border-gray-300 focus:border-primary-500 
                                       focus:ring-primary-500 shadow-sm text-sm py-2"
                            />
                          </div>
                        </div>

                        <FilterInput
                          label="Furnished Status"
                          name="furnished"
                          type="select"
                          options={[
                            { value: 'ALL', label: 'All' },
                            { value: 'true', label: 'Furnished' },
                            { value: 'false', label: 'Unfurnished' },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex-shrink-0 px-4 py-4 flex justify-between">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        Reset all
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent 
                                 shadow-sm text-sm font-medium rounded-md text-white bg-primary-500 
                                 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                 focus:ring-primary-500"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}