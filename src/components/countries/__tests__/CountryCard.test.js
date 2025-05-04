import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import { CountriesProvider } from '../../../contexts/CountriesContext';
// import CountryCard from '../CountryCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the contexts
jest.mock('../../../contexts/CountriesContext', () => ({
  ...jest.requireActual('../../../contexts/CountriesContext'),
  useCountries: () => ({
    isFavorite: jest.fn(() => false),
    addToFavorites: jest.fn(),
    removeFromFavorite: jest.fn(),
  }),
}));

jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: () => ({
    currentUser: { id: '123', name: 'Test User' },
  }),
}));

const mockCountry = {
  cca3: 'USA',
  name: {
    common: 'United States',
    official: 'United States of America',
  },
  flags: {
    svg: 'https://example.com/usa.svg',
    alt: 'Flag of United States',
  },
  capital: ['Washington, D.C.'],
  region: 'Americas',
  population: 331002651,
};

describe('CountryCard', () => {
  test('renders country information correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CountriesProvider>
            <CountryCard country={mockCountry} />
          </CountriesProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if country name is displayed
    expect(screen.getByText('United States')).toBeInTheDocument();
    
    // Check if capital is displayed
    expect(screen.getByText(/Washington, D.C./)).toBeInTheDocument();
    
    // Check if region is displayed
    expect(screen.getByText(/Americas/)).toBeInTheDocument();
    
    // Check if population is displayed with formatting
    expect(screen.getByText(/331,002,651/)).toBeInTheDocument();
    
    // Check if the flag image is rendered with correct attributes
    const flagImage = screen.getByAltText('Flag of United States');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', 'https://example.com/usa.svg');
  });
  
  test('links to the correct country detail page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CountriesProvider>
            <CountryCard country={mockCountry} />
          </CountriesProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/country/USA');
  });
});