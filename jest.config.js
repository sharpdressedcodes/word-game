module.exports = {
    "verbose": true,
    //"collectCoverage": true,
    "collectCoverageFrom": [
        "./src/**/*.{js,jsx}",
        "!./src/scss/**",
        "!./**/node_modules/**"
    ],
    "coverageDirectory": "./tests/unit/coverage",
    "testURL": "http://localhost:3001/",
    "moduleNameMapper": {
        "\\.(css|scss)$": "<rootDir>/tests/unit/__mocks__/styleMock.js"
    },
    "setupFilesAfterEnv": ["<rootDir>tests/unit/helpers/bootstrap.js"]
};
