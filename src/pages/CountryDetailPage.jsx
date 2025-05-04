import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiHeartLine, RiHeartFill, RiExternalLinkLine } from 'react-icons/ri';
import { useCountries } from '../contexts/CountriesContext';
import { useAuth } from '../contexts/AuthContext';

function CountryDetailPage() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const { getCountryByCode, isFavorite, addToFavorites, removeFromFavorite } = useCountries();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countryData = await getCountryByCode(countryCode);
        setCountry(countryData);
        
        // Fetch border countries if they exist
        if (countryData.borders && countryData.borders.length > 0) {
          const borderPromises = countryData.borders.map(border => 
            getCountryByCode(border)
          );
          
          const borderResults = await Promise.all(borderPromises);
          
          // Extract only the data we need to reduce state size
          const simplifiedBorders = borderResults.map(country => ({
            cca3: country.cca3,
            name: country.name.common,
            flag: country.flags.svg
          }));
          
          setBorderCountries(simplifiedBorders);
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        console.error('Error fetching country details:', err);
        setError('Failed to load country details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountryData();
  }, [countryCode, getCountryByCode]);
  
  const handleFavoriteToggle = () => {
    if (!currentUser) return;
    
    if (isFavorite(country.cca3)) {
      removeFromFavorite(country.cca3);
    } else {
      addToFavorites(country);
    }
  };
  
  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };
  
  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol || ''})`)
      .join(', ');
  };
  
  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };
  
  const getNativeName = (names) => {
    if (!names) return 'N/A';
    
    // Try to get native name in first available language
    const firstNativeLang = Object.keys(names)[0];
    return names[firstNativeLang]?.common || 'N/A';
  };
  
  if (loading) {
    return (
      <div className="container-custom py-10 min-h-screen">
        <div className="flex justify-center items-center h-80">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error || !country) {
    return (
      <div className="container-custom py-10 min-h-screen">
        <div className="text-center py-20">
          <div className="mb-6">
            <span className="inline-block p-4 rounded-full bg-error-100 dark:bg-error-900/30 text-error-500 dark:text-error-400 text-3xl">
              😕
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Country Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {error || "We couldn't find details for this country."}
          </p>
          <Link to="/" className="btn btn-primary">
            <RiArrowLeftLine className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-10 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          <RiArrowLeftLine className="mr-2" />
          Back
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {/* Flag */}
        <div className="overflow-hidden rounded-xl shadow-md">
          <img
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-auto"
          />
        </div>
        
        {/* Country Information */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
              {country.name.common}
            </h1>
            
            {currentUser && (
              <button
                onClick={handleFavoriteToggle}
                aria-label={isFavorite(country.cca3) ? "Remove from favorites" : "Add to favorites"}
                className={`p-3 rounded-full ${
                  isFavorite(country.cca3)
                    ? 'bg-accent-500/10 text-accent-500'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-accent-500 dark:hover:text-accent-500'
                }`}
              >
                {isFavorite(country.cca3) ? <RiHeartFill className="text-xl" /> : <RiHeartLine className="text-xl" />}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Official Name:</span>{' '}
                {country.name.official}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Native Name:</span>{' '}
                {getNativeName(country.name.nativeName)}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Population:</span>{' '}
                {formatPopulation(country.population)}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Region:</span>{' '}
                {country.region}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Sub Region:</span>{' '}
                {country.subregion || 'N/A'}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Capital:</span>{' '}
                {country.capital?.join(', ') || 'N/A'}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Top Level Domain:</span>{' '}
                {country.tld?.join(', ') || 'N/A'}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Currencies:</span>{' '}
                {formatCurrencies(country.currencies)}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">Languages:</span>{' '}
                {formatLanguages(country.languages)}
              </p>
              
              <p className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">UN Member:</span>{' '}
                {country.unMember ? 'Yes' : 'No'}
              </p>
              
              {country.maps?.googleMaps && (
                <p className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">Maps:</span>{' '}
                  <a 
                    href={country.maps.googleMaps} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600"
                  >
                    View on Google Maps
                    <RiExternalLinkLine className="ml-1 text-sm" />
                  </a>
                </p>
              )}
              
              {country.car?.side && (
                <p className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">Driving Side:</span>{' '}
                  {country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)}
                </p>
              )}
            </div>
          </div>
          
          {/* Border Countries */}
          {borderCountries.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                Border Countries:
              </h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((border) => (
                  <Link
                    key={border.cca3}
                    to={`/country/${border.cca3}`}
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <img 
                      src={border.flag} 
                      alt={`Flag of ${border.name}`} 
                      className="w-5 h-auto mr-2 rounded-sm"
                    />
                    <span className="text-sm">{border.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default CountryDetailPage;