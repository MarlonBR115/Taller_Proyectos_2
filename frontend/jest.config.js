export default {
  testEnvironment: '<rootDir>/src/test/customEnvironment.cjs',
  setupFiles: [],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg)$': '<rootDir>/src/test/mocks/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lucide-react|msw|@mswjs|rettime|@open-draft|until-async)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/test/**',
  ],
    coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
