import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  // Base Next.js rules
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,

  // Ignore generated & build files
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);