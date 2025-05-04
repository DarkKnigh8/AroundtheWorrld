import { render, screen, fireEvent } from '@testing-library/react';
// import SearchFilters from '../SearchFilters';
import { CountriesProvider } from '../../../contexts/CountriesContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock react-select
jest.mock('react-select', () => ({ options, value, onChange, placeholder }) => {
  return (
    <select
      data-testid="select"
      value={value ? value.value : ''}
      onChange={(e) => {
        const option = options.find(opt => opt.value === e.target.value);
        onChange(option);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

// Mock the context values
jest.mock('../../../contexts/CountriesContext', () => ({
  ...jest.requireActual('../../../contexts/CountriesContext'),
  useCountries: () => ({
    regions: [
      { value: '', label: 'All Regions' },
      { value: 'Africa', label: 'Africa' },
      { value: 'Americas', label: 'Americas' },
    ],
    languageOptions: [
      { value: 'English', label: 'English' },
      { value: 'Spanish', label: 'Spanish' },
    ],
    searchQuery: '',
    setSearchQuery: jest.fn(),
    regionFilter: '',
    setRegionFilter: jest.fn(),
    languageFilter: '',
    setLanguageFilter: jest.fn(),
  }),
}));

jest.mock('../../../contexts/ThemeContext', () => ({
  ...jest.requireActual('../../../contexts/ThemeContext'),
  useTheme: () => ({
    darkMode: false,
  }),
}));

describe('SearchFilters', () => {
  test('renders search input and filter selects', () => {
    render(
      <ThemeProvider>
        <CountriesProvider>
          <SearchFilters />
        </CountriesProvider>
      </ThemeProvider>
    );
    
    // Check if search input is rendered
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument();
    
    // Check if region filter is rendered
    const selects = screen.getAllByTestId('select');
    expect(selects.length).toBe(2);
  });
  
  test('handles search input change', () => {
    const setSearchQueryMock = jest.fn();
    jest.spyOn(require('../../../contexts/CountriesContext'), 'useCountries').mockImplementation(() => ({
      regions: [
        { value: '', label: 'All Regions' },
        { value: 'Africa', label: 'Africa' },
      ],
      languageOptions: [
        { value: 'English', label: 'English' },
      ],
      searchQuery: '',
      setSearchQuery: setSearchQueryMock,
      regionFilter: '',
      setRegionFilter: jest.fn(),
      languageFilter: '',
      setLanguageFilter: jest.fn(),
    }));
    
    render(
      <ThemeProvider>
        <CountriesProvider>
          <SearchFilters />
        </CountriesProvider>
      </ThemeProvider>
    );
    
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'United' } });
    
    expect(setSearchQueryMock).toHaveBeenCalledWith('United');
  });
});