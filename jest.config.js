export default {
  testEnvironment: 'jsdom', // Set the environment to jsdom (used for React testing)
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use babel-jest to transpile .js and .jsx files
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy', // Mock CSS imports with identity-obj-proxy
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
};
