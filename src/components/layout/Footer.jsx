import { Link } from 'react-router-dom';
import { RiGithubFill, RiHeartFill } from 'react-icons/ri';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link 
              to="/" 
              className="text-xl font-bold flex items-center text-neutral-900 dark:text-white no-underline"
            >
              <span className="text-primary-500 mr-1">🌎</span>
              Around the World<span className="text-primary-500">Explorer</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Explore the world, get informed, one country at a time.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Data provided by <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">REST Countries API</a>
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              &copy; {currentYear}AroundtheWorldExplorer. All rights reserved.
            </p>
            <div className="mt-3 flex items-center">
              {/* <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 mr-4"
              >
                <RiGithubFill className="text-xl" />
              </a> */}
              {/* <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Made with <RiHeartFill className="inline text-accent-500" /> in 2025
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;