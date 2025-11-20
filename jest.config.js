module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1"
    }
  };
  