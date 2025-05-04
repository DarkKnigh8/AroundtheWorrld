import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiMoonFill, RiSunFill, RiMenuLine, RiCloseLine, RiHeartLine, RiLogoutBoxLine, RiLoginBoxLine, RiUser3Line } from 'react-icons/ri';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Close menu/dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isDropdownOpen && !e.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };
  
  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center text-neutral-900 dark:text-white no-underline"
        >
          <span className="text-primary-500 mr-1">🌎</span>
          Around the World<span className="text-primary-500">Explorer</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 ${
              location.pathname === '/' ? 'text-primary-500 dark:text-primary-400 font-medium' : ''
            }`}
          >
            Home
          </Link>
          
          {currentUser && (
            <Link
              to="/favorites"
              className={`text-neutral-700 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 ${
                location.pathname === '/favorites' ? 'text-primary-500 dark:text-primary-400 font-medium' : ''
              }`}
            >
              Favorites
            </Link>
          )}
          
          {/* Theme Toggle */}
          {/* <button
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {darkMode ? (
              <RiSunFill className="text-xl text-yellow-400" />
            ) : (
              <RiMoonFill className="text-xl text-indigo-500" />
            )}
          </button> */}
          
          {currentUser ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-300 font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-neutral-800 rounded-lg shadow-dropdown"
                  >
                    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{currentUser.email}</p>
                    </div>
                    
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <RiHeartLine className="mr-2" />
                      Favorites
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <RiLogoutBoxLine className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="btn btn-outline text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {darkMode ? (
              <RiSunFill className="text-xl text-yellow-400" />
            ) : (
              <RiMoonFill className="text-xl text-indigo-500" />
            )}
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {isMenuOpen ? (
              <RiCloseLine className="text-2xl" />
            ) : (
              <RiMenuLine className="text-2xl" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-effect border-t border-neutral-200 dark:border-neutral-700"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg ${
                  location.pathname === '/' 
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium' 
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                Home
              </Link>
              
              {currentUser && (
                <Link
                  to="/favorites"
                  className={`px-4 py-2 rounded-lg ${
                    location.pathname === '/favorites' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  Favorites
                </Link>
              )}
              
              {currentUser ? (
                <>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                    <div className="flex items-center px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-300 font-semibold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{currentUser.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <RiLogoutBoxLine className="mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <RiLoginBoxLine className="mr-2 inline" />
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    <RiUser3Line className="mr-2 inline" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;