require('dotenv').config({ path: '.env.test' });

process.env.NODE_ENV = 'test';

module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '..',
    testRegex: '.*\\.e2e-spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage/e2e',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    testTimeout: 60000, // Tiempo más largo para pruebas E2E
    verbose: true
}; 