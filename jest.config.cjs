/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  resolver: "jest-ts-webcompat-resolver",
  collectCoverageFrom: [
    "!src/index.ts",
    "!src/loadEnvironment.ts",
    "!src/database/databaseConnection.ts",
    "!src/server/serverStart.ts",
    "src/**/*.test.ts",
  ],
};
