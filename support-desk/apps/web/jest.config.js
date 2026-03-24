const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Next.js projesinin kökü
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
