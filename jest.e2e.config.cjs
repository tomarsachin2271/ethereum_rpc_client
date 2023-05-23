module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resetModules: true,
  roots: [
    'test/e2e'
  ],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }
  },
  testMatch: ['**/test/e2e/**/*.test.ts'],
  testTimeout: 30000 // 30 seconds
}
