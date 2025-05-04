import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CountriesContext = createContext();

export const useCountries = () => useContext(CountriesContext);

export const CountriesProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  
  // Language options derived from all countries data
  const [languageOptions, setLanguageOptions] = useState([]);
  
  // Fetch all countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        
        // Using the /all endpoint from REST Countries API
        const response = await axios.get('https://restcountries.com/v3.1/all');
        
        if (response.status === 200) {
          const sortedCountries = response.data.sort((a, b) => {
            return a.name.common.localeCompare(b.name.common);
          });
          
          setCountries(sortedCountries);
          setFilteredCountries(sortedCountries);
          
          // Extract all languages and create options
          const allLanguages = new Set();
          sortedCountries.forEach(country => {
            if (country.languages) {
              Object.values(country.languages).forEach(language => {
                allLanguages.add(language);
              });
            }
          });
          
          const languageOpts = Array.from(allLanguages).sort().map(language => ({
            value: language,
            label: language
          }));
          
          setLanguageOptions(languageOpts);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to fetch countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountries();
  }, []);
  
  // Apply filters when search query, region, or language changes
  useEffect(() => {
    if (countries.length > 0) {
      let results = [...countries];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(country => 
          country.name.common.toLowerCase().includes(query) ||
          country.name.official.toLowerCase().includes(query) ||
          (country.capital && country.capital.some(capital => 
            capital.toLowerCase().includes(query)
          ))
        );
      }
      
      // Apply region filter
      if (regionFilter) {
        results = results.filter(country => 
          country.region === regionFilter
        );
      }
      
      // Apply language filter
      if (languageFilter) {
        results = results.filter(country => {
          if (!country.languages) return false;
          return Object.values(country.languages).some(
            language => language === languageFilter
          );
        });
      }
      
      setFilteredCountries(results);
    }
  }, [countries, searchQuery, regionFilter, languageFilter]);
  
  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const storedFavorites = localStorage.getItem(`favorites_${currentUser.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [currentUser]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    if (currentUser && favorites.length > 0) {
      localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);
  
  // Get country by code (for detail page)
  const getCountryByCode = async (code) => {
    // Try to find in already loaded countries first
    const countryInState = countries.find(
      c => c.cca3 === code || c.cca2 === code
    );
    
    if (countryInState) {
      return countryInState;
    }
    
    // If not found, fetch from API
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
      if (response.status === 200) {
        return response.data[0];
      }
    } catch (err) {
      console.error('Error fetching country by code:', err);
      throw new Error('Country not found');
    }
  };
  
  // Add country to favorites
  const addToFavorites = (country) => {
    if (!currentUser) return;
    
    setFavorites(prev => {
      // Check if already in favorites
      if (prev.some(fav => fav.cca3 === country.cca3)) {
        return prev;
      }
      
      // Add simplified country object to avoid large localStorage
      return [...prev, {
        cca3: country.cca3,
        name: country.name.common,
        flag: country.flags.svg,
        region: country.region
      }];
    });
  };
  
  // Remove country from favorites
  const removeFromFavorite = (countryCode) => {
    if (!currentUser) return;
    
    setFavorites(prev => 
      prev.filter(country => country.cca3 !== countryCode)
    );
  };
  
  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    return favorites.some(country => country.cca3 === countryCode);
  };
  
  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Americas', label: 'Americas' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Oceania', label: 'Oceania' }
  ];
  
  const value = {
    countries,
    filteredCountries,
    loading,
    error,
    regions,
    languageOptions,
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    languageFilter,
    setLanguageFilter,
    getCountryByCode,
    favorites,
    addToFavorites,
    removeFromFavorite,
    isFavorite
  };
  
  return (
    <CountriesContext.Provider value={value}>
      {children}
    </CountriesContext.Provider>
  );
};