module.exports = {
    preset: 'jest-preset-angular',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text-summary'],
    collectCoverageFrom: [
        'src/app/**/*.ts',
        '!src/main.ts',
        '!src/environments/**',
        '!src/app/**/index.ts',
        '!src/app/**/*.module.ts',
        '!src/app/**/app-routing.module.ts'
    ]
};