import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    // Restrict to modules with tests during migration; expand as we add tests
    'src/lib/math.ts',
    'src/lib/resolver.ts',
    'src/lib/query.ts',
    'src/lib/mutation.ts',
    'src/lib/type.ts',
    'src/lib/input.ts',
    'src/lib/helpers/typeFields.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

export default config;
