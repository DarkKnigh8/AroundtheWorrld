import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountryGrid from '../components/countries/CountryGrid';
import SearchFilters from '../components/countries/SearchFilters';
import { useCountries } from '../contexts/CountriesContext';

function HomePage() {
  const { filteredCountries, loading, error } = useCountries();
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="container-custom py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Explore Countries Around the World
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
           Discover countries. Update your knowledge wuth the latetst information and statistics.
          </p>
        </div>
        
        <SearchFilters />
        
        <div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          {!loading && !error && (
            <p>
              Showing {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
            </p>
          )}
        </div>
        
        <CountryGrid 
          countries={filteredCountries} 
          loading={loading} 
          error={error} 
        />
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showScrollButton ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={`${
            showScrollButton ? 'flex' : 'hidden'
          } fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary-500 text-white shadow-lg items-center justify-center hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-30`}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default HomePage;