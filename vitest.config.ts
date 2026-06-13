import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "src/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "text-summary", "json", "json-summary", "lcov", "html"],
      include: [
        "src/features/**",
        "src/lib/schemas.ts",
        "src/lib/rate-limit.ts",
        "src/lib/sanitize.ts",
        "src/lib/utils.ts",
        "src/lib/constants.ts",
        "src/lib/encryption.ts",
        "src/lib/storage/cloud-sync.ts",
        "src/lib/storage/device-id.ts",
        "src/lib/storage/CloudSyncAdapter.ts",
        "src/lib/storage/StateRepository.ts",
        "src/lib/di/services.ts",
        "src/lib/supabase/schemas.ts",
        "src/lib/supabase/admin.ts",
        "src/hooks/**",
        "src/components/journal/**",
        "src/components/crisis/**",
        "src/components/chat/ChatInterface.tsx",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "src/test/**"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
