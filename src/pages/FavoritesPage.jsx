import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDeleteBin6Line, RiEmotionSadLine } from 'react-icons/ri';
import { useCountries } from '../contexts/CountriesContext';
import { useAuth } from '../contexts/AuthContext';

function FavoritesPage() {
  const { favorites, removeFromFavorite } = useCountries();
  const { currentUser } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  // Sort favorites alphabetically by name
  const sortedFavorites = [...favorites].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const handleRemove = (e, countryCode) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedCountry(countryCode);
    
    // Remove after animation completes
    setTimeout(() => {
      removeFromFavorite(countryCode);
      setSelectedCountry(null);
    }, 300);
  };
  
  if (!currentUser) {
    return (
      <div className="container-custom py-10 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-block p-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 text-3xl">
              🔒
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Login Required
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Please log in to access your favorite countries.
          </p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-10 min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Your Favorite Countries
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Here you can find all the countries you've saved as favorites.
        </p>
      </div>
      
      {sortedFavorites.length === 0 ? (
        <div className="py-10 text-center">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-full inline-block mb-4">
            <RiEmotionSadLine className="text-3xl text-neutral-500 dark:text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
            You haven't added any countries to your favorites list.
            Explore countries and click the heart icon to add them here.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Countries
          </Link>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedFavorites.map(country => (
              <motion.div
                key={country.cca3}
                initial={{ opacity: 1 }}
                animate={{ 
                  opacity: selectedCountry === country.cca3 ? 0 : 1,
                  scale: selectedCountry === country.cca3 ? 0.8 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="country-card-hover overflow-hidden"
              >
                <Link 
                  to={`/country/${country.cca3}`} 
                  className="block h-full"
                >
                  <div className="card h-full flex flex-col no-underline">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <div className="flag-ratio w-full overflow-hidden">
                        <img
                          src={country.flag}
                          alt={`Flag of ${country.name}`}
                          className="flag-img w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                          {country.name}
                        </h3>
                        
                        <button
                          onClick={(e) => handleRemove(e, country.cca3)}
                          aria-label="Remove from favorites"
                          className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-error-500 dark:hover:text-error-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <RiDeleteBin6Line className="text-lg" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">Region:</span>{' '}
                        {country.region || 'N/A'}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default FavoritesPage;