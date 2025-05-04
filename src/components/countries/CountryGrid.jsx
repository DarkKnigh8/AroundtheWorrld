import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountryCard from './CountryCard';

function CountryGrid({ countries, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="rounded-lg bg-neutral-200 dark:bg-neutral-700 w-full h-48 mb-4" />
            <div className="bg-neutral-200 dark:bg-neutral-700 h-6 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="bg-neutral-200 dark:bg-neutral-700 h-4 rounded w-1/2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 h-4 rounded w-1/3" />
              <div className="bg-neutral-200 dark:bg-neutral-700 h-4 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 p-4 rounded-lg inline-block mb-4">
          <p className="text-xl">😕</p>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          {error}
        </p>
      </div>
    );
  }
  
  if (countries.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-4 rounded-lg inline-block mb-4">
          <p className="text-xl">🔍</p>
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          No countries found
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {countries.map(country => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default CountryGrid;