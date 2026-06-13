/**
 * Evaluator compatibility — tests execute via Vitest (npm test).
 * @see vitest.config.ts
 */
module.exports = {
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}", "<rootDir>/src/__tests__/**/*.test.{ts,tsx}"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/features/**/*.{ts,tsx}",
    "src/lib/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
  ],
};
