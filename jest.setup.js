// jest.setup.js
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// Mock matchMedia to prevent errors in Jest testing environment
global.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  
  // Mock window.matchMedia for testing
  Object.defineProperty(window, 'matchMedia', {
    value: global.matchMedia,
  });
  
  // Make sure React is globally available in the test environment
  import React from 'react';
  