module.exports = {
  roots: [
    '<rootDir>/src',
    '<rootDir>/test',
  ],
  testEnvironment: 'node',
  transform: {
    '.*\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  },
  preset: '@shelf/jest-mongodb',
};
