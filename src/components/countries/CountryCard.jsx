import React from 'react';
import { Link } from 'react-router-dom';
import { RiHeartLine, RiHeartFill } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useCountries } from '../../contexts/CountriesContext';
import { useAuth } from '../../contexts/AuthContext';

function CountryCard({ country }) {
  const { isFavorite, addToFavorites, removeFromFavorite } = useCountries();
  const { currentUser } = useAuth();
  
  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };
  
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) return;
    
    if (isFavorite(country.cca3)) {
      removeFromFavorite(country.cca3);
    } else {
      addToFavorites(country);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="country-card-hover relative overflow-hidden"
    >
      <Link 
        to={`/country/${country.cca3}`} 
        className="block h-full"
      >
        <div className="card h-full flex flex-col no-underline">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <div className="flag-ratio w-full overflow-hidden">
              <img
                src={country.flags.svg}
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="flag-img w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1">
              {country.name.common}
            </h3>
            
            <div className="space-y-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Capital:</span>{' '}
                {country.capital?.[0] || 'N/A'}
              </p>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Region:</span>{' '}
                {country.region || 'N/A'}
              </p>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Population:</span>{' '}
                {formatPopulation(country.population)}
              </p>
            </div>
          </div>
          
          {currentUser && (
            <button
              onClick={handleFavoriteToggle}
              aria-label={isFavorite(country.cca3) ? "Remove from favorites" : "Add to favorites"}
              className={`absolute top-4 right-4 p-2 rounded-full shadow-md ${
                isFavorite(country.cca3)
                  ? 'bg-white dark:bg-neutral-800 text-accent-500'
                  : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 hover:text-accent-500 dark:hover:text-accent-500'
              }`}
            >
              {isFavorite(country.cca3) ? <RiHeartFill className="text-xl" /> : <RiHeartLine className="text-xl" />}
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default CountryCard;