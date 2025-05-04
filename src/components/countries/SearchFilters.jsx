import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { RiSearchLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useCountries } from '../../contexts/CountriesContext';
import { useTheme } from '../../contexts/ThemeContext';

function SearchFilters() {
  const { 
    regions, 
    languageOptions, 
    searchQuery, 
    setSearchQuery, 
    regionFilter, 
    setRegionFilter, 
    languageFilter, 
    setLanguageFilter 
  } = useCountries();
  
  const { darkMode } = useTheme();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filtersRef = useRef(null);
  
  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  
  // Define custom styles for react-select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#262626' : 'white',
      borderColor: darkMode ? '#404040' : '#d1d5db',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#0A84FF',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#262626' : 'white',
      border: darkMode ? '1px solid #404040' : '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? darkMode ? '#0A84FF' : '#0A84FF'
        : state.isFocused
        ? darkMode ? '#404040' : '#f3f4f6'
        : 'transparent',
      color: state.isSelected
        ? 'white'
        : darkMode ? '#d1d5db' : '#1f2937',
      '&:hover': {
        backgroundColor: state.isSelected
          ? darkMode ? '#0A84FF' : '#0A84FF'
          : darkMode ? '#404040' : '#f3f4f6',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: darkMode ? '#d1d5db' : '#1f2937',
    }),
    input: (base) => ({
      ...base,
      color: darkMode ? '#d1d5db' : '#1f2937',
    }),
    placeholder: (base) => ({
      ...base,
      color: darkMode ? '#9ca3af' : '#9ca3af',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: darkMode ? '#404040' : '#d1d5db',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: darkMode ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: darkMode ? '#d1d5db' : '#4b5563',
      },
    }),
  };
  
  const handleRegionChange = (selectedOption) => {
    setRegionFilter(selectedOption ? selectedOption.value : '');
  };
  
  const handleLanguageChange = (selectedOption) => {
    setLanguageFilter(selectedOption ? selectedOption.value : '');
  };
  
  const clearFilters = () => {
    setRegionFilter('');
    setLanguageFilter('');
    setSearchQuery('');
  };
  
  // Create options arrays for select components
  const regionOptions = regions.map(region => ({
    value: region.value,
    label: region.label
  }));
  
  const selectedRegion = regionOptions.find(option => option.value === regionFilter) || null;
  const selectedLanguage = languageOptions.find(option => option.value === languageFilter) || null;
  
  const hasActiveFilters = regionFilter || languageFilter || searchQuery;
  
  return (
    <div className="mb-8 relative">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search Input */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <RiSearchLine className="text-neutral-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a country..."
            className="block w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <RiCloseLine className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" />
            </button>
          )}
        </div>
        
        {/* Filter Button (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`btn btn-outline w-full flex items-center justify-center ${
              hasActiveFilters ? 'border-primary-500 text-primary-500' : ''
            }`}
          >
            <RiFilterLine className="mr-2" />
            {hasActiveFilters ? 'Filters Applied' : 'Filter'}
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-primary-500 text-white text-xs">
                {(!!regionFilter + !!languageFilter)}
              </span>
            )}
          </button>
        </div>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex md:space-x-4 items-center">
          <div className="w-48">
            <Select
              value={selectedRegion}
              onChange={handleRegionChange}
              options={regionOptions}
              placeholder="Filter by Region"
              isClearable
              styles={customSelectStyles}
              className="text-sm"
              classNamePrefix="select"
            />
          </div>
          
          <div className="w-48">
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              options={languageOptions}
              placeholder="Filter by Language"
              isClearable
              styles={customSelectStyles}
              className="text-sm"
              classNamePrefix="select"
            />
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Filters Dropdown */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            ref={filtersRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 mt-2 p-4 w-full bg-white dark:bg-neutral-800 rounded-lg shadow-dropdown border border-neutral-200 dark:border-neutral-700"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Region
                </label>
                <Select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  options={regionOptions}
                  placeholder="Filter by Region"
                  isClearable
                  styles={customSelectStyles}
                  className="text-sm"
                  classNamePrefix="select"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Language
                </label>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  options={languageOptions}
                  placeholder="Filter by Language"
                  isClearable
                  styles={customSelectStyles}
                  className="text-sm"
                  classNamePrefix="select"
                />
              </div>
              
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Clear All
                  </button>
                )}
                
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-sm bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Active Filters Tags (Mobile) */}
      {hasActiveFilters && (
        <div className="md:hidden flex flex-wrap gap-2 mt-3">
          {regionFilter && (
            <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 text-xs rounded-full py-1 pl-3 pr-2">
              Region: {regionFilter}
              <button
                onClick={() => setRegionFilter('')}
                className="ml-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-700 p-1"
              >
                <RiCloseLine className="text-xs" />
              </button>
            </div>
          )}
          
          {languageFilter && (
            <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 text-xs rounded-full py-1 pl-3 pr-2">
              Language: {languageFilter}
              <button
                onClick={() => setLanguageFilter('')}
                className="ml-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-700 p-1"
              >
                <RiCloseLine className="text-xs" />
              </button>
            </div>
          )}
          
          {searchQuery && (
            <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 text-xs rounded-full py-1 pl-3 pr-2">
              Search: {searchQuery.length > 10 ? `${searchQuery.substring(0, 10)}...` : searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 rounded-full hover:bg-primary-200 dark:hover:bg-primary-700 p-1"
              >
                <RiCloseLine className="text-xs" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchFilters;